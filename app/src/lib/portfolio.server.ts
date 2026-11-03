import { bindings } from "@/lib/bindings.server";

export const ADMIN_USER_ID = "user_3LQV0iOWSo6beGIMcdtHZoAlair";

export async function isPortfolioAdmin() {
  try {
    const response = await fetch("https://fnf.internal/user");
    if (!response.ok) return false;
    const user = await response.json() as { id?: string };
    return user.id === ADMIN_USER_ID;
  } catch {
    return false;
  }
}

export type PortfolioRow = {
  id: string; slug: string; title: string; category: string; description: string;
  services_json: string; features_json: string; technologies_json: string;
  cover_image: string; preview_url: string | null; desktop_preview: string | null; mobile_preview: string | null; gallery_json: string; featured: number;
  sort_order: number; status: "draft" | "published" | "archived";
  created_at: string; updated_at: string;
};

export function serializeProject(row: PortfolioRow) {
  return {
    id: row.id, slug: row.slug, title: row.title, category: row.category,
    description: row.description,
    services: safeArray(row.services_json), features: safeArray(row.features_json),
    technologies: safeArray(row.technologies_json), gallery: safeArray(row.gallery_json), coverImage: row.cover_image,
    desktopPreview: row.desktop_preview, mobilePreview: row.mobile_preview, previewUrl: row.preview_url, featured: Boolean(row.featured),
    sortOrder: row.sort_order, status: row.status,
    createdAt: row.created_at, updatedAt: row.updated_at,
  };
}

function safeArray(value: string): string[] {
  try { const parsed = JSON.parse(value); return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : []; }
  catch { return []; }
}

export function normalizeProject(input: Record<string, unknown>) {
  const string = (key: string, max: number) => typeof input[key] === "string" ? (input[key] as string).trim().slice(0, max) : "";
  const array = (key: string) => Array.isArray(input[key]) ? (input[key] as unknown[]).filter((v): v is string => typeof v === "string").slice(0, 30).map((v) => v.trim().slice(0, 160)).filter(Boolean) : [];
  const slug = string("slug", 80).toLowerCase();
  const previewUrl = string("previewUrl", 500);
  return {
    slug, title: string("title", 140), category: string("category", 100),
    description: string("description", 1200), services: array("services"),
    features: array("features"), technologies: array("technologies"),
    coverImage: string("coverImage", 500), gallery: array("gallery"),
    desktopPreview: string("desktopPreview", 500), mobilePreview: string("mobilePreview", 500),
    previewUrl: previewUrl && /^https:\/\//i.test(previewUrl) ? previewUrl : "",
    featured: input.featured === true,
    sortOrder: Number.isFinite(Number(input.sortOrder)) ? Math.max(0, Math.min(999, Number(input.sortOrder))) : 0,
    status: input.status === "draft" || input.status === "archived" ? input.status : "published" as const,
  };
}

function validAssetPath(value: string) {
  return !value || (/^\/(?:assets|media)\/[a-zA-Z0-9_./-]+$/.test(value) && !value.includes(".."));
}

export function validProject(project: ReturnType<typeof normalizeProject>) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug)
    && project.title.length >= 2 && project.category.length >= 2
    && project.description.length >= 10
    && validAssetPath(project.coverImage) && Boolean(project.coverImage)
    && validAssetPath(project.desktopPreview) && validAssetPath(project.mobilePreview)
    && project.gallery.every(validAssetPath)
    && project.services.length > 0;
}

export function portfolioDb() {
  const db = bindings().DB;
  if (!db) throw new Error("Portfolio database is unavailable");
  return db;
}
