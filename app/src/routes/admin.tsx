import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/admin")({ component: PortfolioAdmin });
type Project = { id: string; slug: string; title: string; category: string; description: string; services: string[]; features: string[]; technologies: string[]; gallery: string[]; coverImage: string; desktopPreview: string | null; mobilePreview: string | null; previewUrl: string | null; featured: boolean; sortOrder: number; status: "draft" | "published" | "archived" };
const emptyProject = (): Omit<Project, "id"> => ({ slug: "", title: "", category: "", description: "", services: [], features: [], technologies: [], gallery: [], coverImage: "", desktopPreview: null, mobilePreview: null, previewUrl: null, featured: false, sortOrder: 0, status: "draft" });

function PortfolioAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(emptyProject());
  const [authorized, setAuthorized] = useState<"loading" | "yes" | "no">("loading");
  const [tab, setTab] = useState<"projects" | "brand">("projects");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState("");
  const [brandAssets, setBrandAssets] = useState<Record<string, string>>({});

  async function load() {
    const response = await fetch("/api/portfolio?admin=1", { credentials: "include", cache: "no-store" });
    if (response.status === 401) { setAuthorized("no"); return; }
    if (!response.ok) throw new Error("Could not load portfolio projects.");
    const data = await response.json() as { projects: Project[] };
    setProjects(data.projects);
    const brandResponse = await fetch("/api/brand-assets", { credentials: "include", cache: "no-store" });
    if (brandResponse.ok) { const brandData = await brandResponse.json() as { assets?: Record<string, string> }; setBrandAssets(brandData.assets ?? {}); }
    setAuthorized("yes");
  }
  useEffect(() => { void Promise.resolve().then(load).catch((error) => { setAuthorized("no"); setMessage(error instanceof Error ? error.message : "Unable to load admin."); }); }, []);

  function startNew() { setEditing(null); setForm(emptyProject()); setMessage(""); }
  function startEdit(project: Project) { setEditing(project); setForm({ ...project }); setMessage(""); }
  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) { setForm((current) => ({ ...current, [key]: value })); }
  async function upload(field: "coverImage" | "desktopPreview" | "mobilePreview" | "gallery", file?: File) {
    if (!file) return;
    setUploading(field); setMessage("");
    try {
      const data = new FormData(); data.set("file", file);
      const response = await fetch("/api/portfolio-upload", { method: "POST", body: data, credentials: "include" });
      const result = await response.json() as { url?: string; error?: string };
      if (!response.ok || !result.url) throw new Error(result.error || "Upload failed.");
      if (field === "gallery") update("gallery", [...form.gallery, result.url]); else update(field, result.url);
      setMessage("Image uploaded and saved to media storage. Save the project to apply it.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Image upload failed."); }
    finally { setUploading(""); }
  }

  async function uploadBrand(key: string, file?: File) {
    if (!file) return;
    const labels: Record<string, string> = { logo_dark: "dark logo", logo_light: "light logo", symbol: "emblem", favicon: "favicon", social_image: "social sharing image" };
    if (!window.confirm(`Replace the approved ${labels[key]} asset? This is an intentional brand identity change.`)) return;
    setUploading(key); setMessage("");
    try {
      const data = new FormData(); data.set("file", file); data.set("assetKey", key);
      const uploadResponse = await fetch("/api/portfolio-upload", { method: "POST", body: data, credentials: "include" });
      const uploaded = await uploadResponse.json() as { url?: string; error?: string };
      if (!uploadResponse.ok || !uploaded.url) throw new Error(uploaded.error || "Upload failed.");
      const saveResponse = await fetch("/api/brand-assets", { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ assetKey: key, url: uploaded.url }) });
      const saved = await saveResponse.json() as { error?: string };
      if (!saveResponse.ok) throw new Error(saved.error || "Could not save brand asset.");
      setBrandAssets((current) => ({ ...current, [key]: uploaded.url! }));
      setMessage("Brand asset updated. Refresh the website to see the new asset.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Brand asset update failed."); }
    finally { setUploading(""); }
  }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const payload = { ...form, services: form.services.filter(Boolean), features: form.features.filter(Boolean), technologies: form.technologies.filter(Boolean), ...(editing ? { id: editing.id } : {}) };
    try {
      const response = await fetch("/api/portfolio", { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(payload) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "Could not save project.");
      await load(); setEditing(null); setForm(emptyProject()); setMessage("Project saved successfully.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Save failed."); }
    finally { setBusy(false); }
  }
  async function remove(project: Project) {
    if (!window.confirm(`Permanently delete “${project.title}”? This cannot be undone.`)) return;
    const response = await fetch("/api/portfolio", { method: "DELETE", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ id: project.id }) });
    if (!response.ok) { setMessage("Could not delete this project."); return; }
    setProjects((current) => current.filter((item) => item.id !== project.id)); setMessage("Project deleted.");
    if (editing?.id === project.id) startNew();
  }
  async function quickStatus(project: Project, status: Project["status"]) {
    const response = await fetch("/api/portfolio", { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ ...project, status }) });
    if (response.ok) await load(); else setMessage("Could not update project status.");
  }

  if (authorized === "loading") return <main className="admin-loading"><span>ADVERSIX TECH / PORTFOLIO CMS</span><h1>Opening the studio.</h1><p>Checking administrator access…</p></main>;
  if (authorized === "no") return <main className="admin-login"><Link to="/" className="admin-back"><ArrowLeft className="ui-icon" size={15} strokeWidth={1.7} aria-hidden="true" /> Adversix Tech</Link><span>PRIVATE STUDIO AREA</span><h1>Portfolio management.</h1><p>Sign in with the authorized Adversix Tech Higgsfield account to manage projects and brand assets.</p><button onClick={() => { window.location.href = `/__auth/login?return=${encodeURIComponent("/admin")}`; }}>Sign in to continue <ArrowUpRight className="ui-icon" size={15} strokeWidth={1.7} aria-hidden="true" /></button></main>;

  return <main className="admin-shell"><header className="admin-header"><Link to="/" className="admin-logo"><img src="/assets/brand/adversix-logo-dark.png" alt="Adversix Tech" /></Link><div><span>STUDIO / CONTENT MANAGEMENT</span><h1>Portfolio admin</h1></div><Link to="/" className="admin-view-site">View website <ArrowUpRight className="ui-icon" size={15} strokeWidth={1.7} aria-hidden="true" /></Link></header><nav className="admin-tabs"><button className={tab === "projects" ? "active" : ""} onClick={() => setTab("projects")}>Portfolio projects <span>{projects.length}</span></button><button className={tab === "brand" ? "active" : ""} onClick={() => setTab("brand")}>Brand assets</button></nav>
    {message && <p className="admin-message" role="status">{message}</p>}
    {tab === "projects" ? <div className="admin-layout"><section className="admin-project-list"><div className="admin-section-title"><div><span>CONTENT LIBRARY</span><h2>Projects</h2></div><button onClick={startNew}>+ New project</button></div>{projects.map((project) => <article className={`admin-project-row ${editing?.id === project.id ? "selected" : ""}`} key={project.id}><img src={project.coverImage} alt="" /><div className="admin-project-meta"><strong>{project.title}</strong><span>{project.category} · {project.status}</span><small>{project.featured ? "Featured · " : ""}Order {project.sortOrder}</small></div><button className="admin-edit" onClick={() => startEdit(project)}>Edit</button><button className="admin-delete" aria-label={`Delete ${project.title}`} onClick={() => void remove(project)}>×</button></article>)}</section>
      <section className="admin-editor"><div className="admin-section-title"><div><span>{editing ? "EDIT PROJECT" : "NEW PROJECT"}</span><h2>{editing ? editing.title : "Project details"}</h2></div>{editing && <button className="admin-new" onClick={startNew}>New</button>}</div><form onSubmit={save} className="admin-form"><div className="admin-field-grid"><label>Project title<input required value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Project name" /></label><label>URL slug<input required value={form.slug} onChange={(e) => update("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} placeholder="project-name" /></label><label>Industry category<input required value={form.category} onChange={(e) => update("category", e.target.value)} placeholder="Beauty & Grooming" /></label><label>Display order<input type="number" min="0" max="999" value={form.sortOrder} onChange={(e) => update("sortOrder", Number(e.target.value))} /></label></div><label>Project description<textarea required rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} /></label><label>Services provided <small>Separate each item with a comma</small><input value={form.services.join(", ")} onChange={(e) => update("services", e.target.value.split(",").map((v) => v.trim()).filter(Boolean))} /></label><label>Key features <small>Separate each item with a comma</small><textarea rows={2} value={form.features.join(", ")} onChange={(e) => update("features", e.target.value.split(",").map((v) => v.trim()).filter(Boolean))} /></label><label>Technologies / capabilities <small>Separate each item with a comma</small><input value={form.technologies.join(", ")} onChange={(e) => update("technologies", e.target.value.split(",").map((v) => v.trim()).filter(Boolean))} /></label>
      <div className="admin-upload-block"><div><strong>Cover image</strong><small>JPG, PNG or WebP · up to 8 MB</small></div><input value={form.coverImage} onChange={(e) => update("coverImage", e.target.value)} placeholder="/assets/... or /media/..." /><label className="admin-file-button">{uploading === "coverImage" ? "Uploading…" : "Upload cover image"}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={!!uploading} onChange={(e) => void upload("coverImage", e.target.files?.[0])} /></label></div>
      <div className="admin-field-grid"><label>Desktop preview image<input value={form.desktopPreview || ""} onChange={(e) => update("desktopPreview", e.target.value || null)} placeholder="/media/..." /><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => void upload("desktopPreview", e.target.files?.[0])} /></label><label>Mobile preview image<input value={form.mobilePreview || ""} onChange={(e) => update("mobilePreview", e.target.value || null)} placeholder="/media/..." /><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => void upload("mobilePreview", e.target.files?.[0])} /></label></div>
      <div className="admin-upload-block"><div><strong>Gallery screenshots</strong><small>{form.gallery.length} image(s) added</small></div><label className="admin-file-button">{uploading === "gallery" ? "Uploading…" : "Add gallery image"}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={!!uploading} onChange={(e) => void upload("gallery", e.target.files?.[0])} /></label></div>{form.gallery.map((url, index) => <div className="admin-gallery-row" key={`${url}-${index}`}><img src={url} alt="" /><span>{url}</span><button type="button" onClick={() => update("gallery", form.gallery.filter((_, i) => i !== index))}>Remove</button></div>)}
      <label>Live website URL <small>Only shown as a live preview when a real HTTPS URL is provided</small><input type="url" value={form.previewUrl || ""} onChange={(e) => update("previewUrl", e.target.value || null)} placeholder="https://example.com" /></label><div className="admin-field-grid"><label>Publication status<select value={form.status} onChange={(e) => update("status", e.target.value as Project["status"])}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label><label className="admin-feature-toggle"><input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} /> Feature this project</label></div><div className="admin-form-actions"><button type="submit" disabled={busy || !!uploading}>{busy ? "Saving…" : editing ? "Save changes" : "Create project"}</button>{editing && <button type="button" className="admin-secondary" onClick={() => void quickStatus(editing, editing.status === "published" ? "draft" : "published")}>{editing.status === "published" ? "Unpublish" : "Publish"}</button>}</div></form></section></div> : <section className="admin-brand-assets"><span>IDENTITY / APPROVED SOURCE FILES</span><h2>Adversix Tech brand assets</h2><p>These are the official identity assets. Replacement is a separate, explicit action and never happens when portfolio projects are edited.</p><div className="admin-brand-manage">{[{key:"logo_dark",label:"Dark logo lockup",detail:"For cream and light surfaces"},{key:"logo_light",label:"Light logo lockup",detail:"For charcoal and dark surfaces"},{key:"symbol",label:"Emblem / app icon",detail:"Standalone brand symbol"},{key:"favicon",label:"Favicon",detail:"Browser and shortcut icon"},{key:"social_image",label:"Social sharing image",detail:"Open Graph / social preview"}].map((asset) => <div className="admin-brand-asset-row" key={asset.key}><div className="admin-brand-asset-preview">{brandAssets[asset.key] && <img src={brandAssets[asset.key]} alt={asset.label} />}</div><div><strong>{asset.label}</strong><small>{asset.detail}</small><span>{brandAssets[asset.key] || "No asset configured"}</span></div><label className="admin-file-button">{uploading === asset.key ? "Uploading…" : "Replace asset"}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={!!uploading} onChange={(e) => void uploadBrand(asset.key, e.target.files?.[0])} /></label></div>)}</div><p className="admin-protection-note">Each replacement requires confirmation and is saved separately from project content. Keep the original aspect ratio and use the approved artwork; do not substitute a generated emblem.</p></section>}
    <footer className="admin-footer"><span>ADVERSIX TECH · PRIVATE ADMIN</span><Link to="/">Return to website <ArrowUpRight className="ui-icon" size={15} strokeWidth={1.7} aria-hidden="true" /></Link></footer></main>;
}
