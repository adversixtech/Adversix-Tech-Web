import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUp, ArrowUpRight } from "lucide-react";

// ScrollScrub is intentionally replaced here by a crisp, one-shot brand animation; the cinematic engine remains available for future chapters.
export const Route = createFileRoute("/")({ component: Index });

const capabilities = [
  { number: "01", title: "Digital strategy", detail: "We define the opportunity, find the real problem and give the work a clear direction.", tags: "Discovery / Product thinking / Roadmaps" },
  { number: "02", title: "Software engineering", detail: "Custom platforms, web applications and connected systems built around the way your business works.", tags: "Web applications / APIs / Cloud systems" },
  { number: "03", title: "Web experiences", detail: "Distinctive, useful digital experiences that make products easier to understand, trust and use.", tags: "Web design / Development / Digital identity" },
  { number: "04", title: "Automation and AI", detail: "Practical automation that connects tools, reduces repetitive work and gives teams room to focus.", tags: "Workflow automation / AI integration / Operations" },
];

const process = [
  { title: "Understand", detail: "We listen, ask better questions and map the real problem before choosing a solution.", output: "Clarity, priorities and a shared direction." },
  { title: "Shape", detail: "We turn the direction into a considered experience, technical plan and practical delivery path.", output: "A clear blueprint and a focused scope." },
  { title: "Build", detail: "Design and engineering move together through deliberate iterations, useful feedback and careful testing.", output: "A working product, not just a presentation." },
  { title: "Improve", detail: "We launch with care, learn from real use and keep making the system more useful over time.", output: "A stronger digital foundation for what comes next." },
];

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [projects, setProjects] = useState<Array<{ id: string; slug: string; title: string; category: string; description: string; services: string[]; technologies: string[]; coverImage: string; featured: boolean; status: string }>>([]);
  const [activeFilter, setActiveFilter] = useState("All work");
  const [previewSlug, setPreviewSlug] = useState("salon-braiding-barbering");
  const previewItems = [{slug:"salon-braiding-barbering",name:"House of Mane"},{slug:"professional-cleaning",name:"PureSpace"},{slug:"luxury-nail-studio",name:"Atelier N°8"},{slug:"beauty-grooming-studio",name:"Forme House"}];
  const filters = ["All work", ...Array.from(new Set(projects.map((project) => project.category)))];
  useEffect(() => { void fetch("/api/portfolio").then((response) => response.ok ? response.json() : Promise.reject()).then((data: { projects?: typeof projects }) => setProjects(data.projects ?? [])).catch(() => setProjects([])); }, []);
  const [activeStep, setActiveStep] = useState(0);
  const [sending, setSending] = useState(false);
  const [formState, setFormState] = useState<{ kind: "idle" | "success" | "error"; message: string }>({ kind: "idle", message: "" });
  const visibleProjects = activeFilter === "All work" ? projects : projects.filter((project) => project.category === activeFilter);

  async function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setSending(true);
    setFormState({ kind: "idle", message: "" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = (await response.json()) as { ok?: boolean; message?: string; emailSent?: boolean };
      if (!response.ok || !result.ok) throw new Error(result.message || "Your inquiry could not be sent. Please try again.");
      form.reset();
      setFormState({ kind: result.emailSent === false ? "error" : "success", message: result.message || "Your inquiry has been received. We will be in touch soon." });
    } catch (error) {
      setFormState({ kind: "error", message: error instanceof Error ? error.message : "Something went wrong. Please try again." });
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="site-shell">
      <header className="site-nav">
        <a className="brand-lockup" href="#top" aria-label="Adversix Tech home">
          <img src="/assets/brand/adversix-logo-light.png" alt="Adversix Tech" className="brand-logo" />
        </a>
        <button className="mobile-menu-toggle" type="button" aria-expanded={menuOpen} aria-label="Toggle navigation" onClick={() => setMenuOpen((value) => !value)}><span /><span /></button>
        <nav className={menuOpen ? "nav-links is-open" : "nav-links"} aria-label="Main navigation">
          <a href="#top" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="#work" onClick={() => setMenuOpen(false)}>Work</a>
          <a href="#approach" onClick={() => setMenuOpen(false)}>Approach</a>
          <a href="#studio" onClick={() => setMenuOpen(false)}>Studio</a>
          <a className="nav-contact" href="#contact" onClick={() => setMenuOpen(false)}>Start a project <span aria-hidden="true"><ArrowUpRight className="ui-icon" size={15} strokeWidth={1.7} aria-hidden="true" /></span></a>
        </nav>
      </header>

      <section id="top" className="hero-journey" aria-label="Adversix Tech introduction">
        <div className="hero-brand-stage">
          <div className="hero-logo-wrap" aria-label="Adversix Tech logo animation">
            <img className="hero-logo hero-logo-dark" src="/assets/brand/adversix-logo-light.png" alt="Adversix Tech" fetchPriority="high" />
            <img className="hero-logo hero-logo-light" src="/assets/brand/adversix-logo-dark.png" alt="" aria-hidden="true" fetchPriority="high" />
          </div>
          <h1>Ideas, made real.</h1>
          <p>Digital strategy, software engineering, web experiences and automation—brought together in one creative technology studio.</p>
          <a className="hero-brand-cta" href="#work">Explore our work <span aria-hidden="true"><ArrowUpRight className="ui-icon" size={15} strokeWidth={1.7} aria-hidden="true" /></span></a>
        </div>
        <span className="hero-side-note" aria-hidden="true">STRATEGY / DESIGN / ENGINEERING</span>
      </section>

      <section id="services" className="capabilities-section section-pad">
        <div className="section-intro">
          <p className="section-index">Capabilities</p>
          <h2>One studio.<br /><em>Many disciplines.</em></h2>
          <p className="section-lede">Strategy, design and engineering working together to turn ambitious ideas into useful digital products.</p>
        </div>
        <div className="capability-list">
          {capabilities.map((item) => (
            <article className="capability-row" key={item.number} tabIndex={0}>
              <span className="capability-number">{item.number}</span>
              <div className="capability-main"><h3>{item.title}</h3><p>{item.detail}</p><small>{item.tags}</small></div>
              <span className="capability-arrow" aria-hidden="true"><ArrowUpRight className="ui-icon" size={15} strokeWidth={1.7} aria-hidden="true" /></span>
            </article>
          ))}
          <a className="approach-text-link" href="#approach">See our approach <span aria-hidden="true"><ArrowUpRight className="ui-icon" size={15} strokeWidth={1.7} aria-hidden="true" /></span></a>
        </div>
      </section>

      <section id="work" className="work-section section-pad">
        <div className="work-heading">
          <h2>Made for the<br /><em>real world.</em></h2>
          <p className="work-intro">A selection of directions across digital experiences, software systems and identity.</p>
        </div>
        <div className="work-filters" role="group" aria-label="Filter selected work">
          {filters.map((filter) => <button type="button" key={filter} className={activeFilter === filter ? "filter-button active" : "filter-button"} aria-pressed={activeFilter === filter} onClick={() => setActiveFilter(filter)}>{filter}</button>)}
        </div>
        <div className="work-gallery" aria-live="polite">
          {visibleProjects.map((project) => (
            <a className={`project-tile project-${project.slug}`} key={project.id} href={`/work/${project.slug}`}>
              <div className="project-image-wrap"><img src={project.coverImage} alt={`${project.title} concept website preview`} loading="lazy" /></div>
              <div className="project-caption"><div><span>{String(projects.indexOf(project) + 1).padStart(2, "0")} / {project.category} · CONCEPT PROJECT</span><h3>{project.title}</h3><small>{project.description}</small></div><div className="project-card-meta"><small>{(project.services || []).slice(0, 3).join(" · ")}</small><small>{(project.technologies || []).slice(0, 2).join(" · ")}</small></div><span className="project-view">View project <ArrowUpRight className="ui-icon" size={15} strokeWidth={1.7} aria-hidden="true" /></span><span className="project-open" aria-hidden="true"><ArrowUpRight className="ui-icon" size={15} strokeWidth={1.7} aria-hidden="true" /></span></div>
            </a>
          ))}
        </div>
        <p className="work-disclaimer">Four independent concept projects. Each includes a dedicated project story and an interactive website demonstration.</p>
      </section>

      <section id="approach" className="approach-section section-pad">
        <div className="approach-heading"><h2>Make the complex<br />feel <em>clear.</em></h2><p>Good work comes from clear decisions, close collaboration and care in the details.</p></div>
        <div className="process-layout">
          <div className="process-steps" role="tablist" aria-label="Our process">
            {process.map((step, index) => <button type="button" role="tab" aria-selected={activeStep === index} aria-controls="process-panel" className={activeStep === index ? "process-step selected" : "process-step"} key={step.title} onClick={() => setActiveStep(index)}><span>0{index + 1}</span><strong>{step.title}</strong><i aria-hidden="true"><ArrowUpRight className="ui-icon" size={15} strokeWidth={1.7} aria-hidden="true" /></i></button>)}
          </div>
          <div className="process-detail" id="process-panel" role="tabpanel" aria-live="polite">
            <span className="process-detail-number">0{activeStep + 1}</span>
            <h3>{process[activeStep].title} with intent.</h3>
            <p>{process[activeStep].detail}</p>
            <div className="process-output"><span>THE OUTCOME</span><strong>{process[activeStep].output}</strong></div>
          </div>
        </div>
      </section>

      <section id="studio" className="studio-section section-pad">
        <div className="studio-showcase">
          <div className="showcase-browser"><div className="showcase-browser-bar"><span className="showcase-dots"><i/><i/><i/></span><span className="showcase-address">adversix.tech / concept-preview</span><a href={`/concepts/${previewSlug}`} target="_blank" rel="noreferrer">Open preview <ArrowUpRight className="ui-icon" size={15} strokeWidth={1.7} aria-hidden="true" /></a></div><iframe key={previewSlug} src={`/concepts/${previewSlug}`} title={`${previewItems.find(item=>item.slug===previewSlug)?.name ?? "Website"} interactive website preview`} loading="lazy" /></div>
          <div className="showcase-switcher" role="group" aria-label="Choose a website preview">{previewItems.map((item,index)=><button type="button" key={item.slug} className={previewSlug===item.slug?"active":""} aria-pressed={previewSlug===item.slug} onClick={()=>setPreviewSlug(item.slug)}><span>0{index+1}</span>{item.name}</button>)}</div>
        </div>
        <div className="studio-copy"><p className="section-index">A look inside the work</p><h2>Not just a picture.<br /><em>A working experience.</em></h2><p>Explore real, interactive website concepts built by Adversix Tech. Each one has its own visual identity, typography, layout and customer journey.</p><p>Choose a concept to preview it here, or open the full experience in a new tab.</p><a className="studio-link" href={`/concepts/${previewSlug}`} target="_blank" rel="noreferrer">Explore this website <span aria-hidden="true"><ArrowUpRight className="ui-icon" size={15} strokeWidth={1.7} aria-hidden="true" /></span></a></div>
      </section>

      <section id="contact" className="contact-section section-pad">
        <div className="contact-heading"><h2>Let's make<br /><em>it work.</em></h2><p>Tell us what you are working on. We will help you find the right next step.</p></div>
        <form className="inquiry-form" onSubmit={submitInquiry}>
          <div className="form-row"><label>Your name<input name="name" autoComplete="name" placeholder="Name" required minLength={2} maxLength={100} /></label><label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@company.com" required maxLength={180} /></label></div>
          <label>What do you need help with?<select name="service" defaultValue="Not sure yet"><option>Not sure yet</option><option>Digital strategy</option><option>Software engineering</option><option>Web design and development</option><option>Automation and AI</option><option>Something else</option></select></label>
          <label>Tell us a little about it<textarea name="message" rows={4} placeholder="A few details about your idea, challenge or project..." required minLength={10} maxLength={4000} /></label>
          <input className="website-trap" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <div className="form-submit-row"><button className="send-inquiry-button" type="submit" disabled={sending}>{sending ? "Sending..." : "Send inquiry"} <span aria-hidden="true"><ArrowUpRight className="ui-icon" size={15} strokeWidth={1.7} aria-hidden="true" /></span></button><p className={`form-feedback ${formState.kind}`} aria-live="polite">{formState.message}</p></div>
        </form>
      </section>

      <footer className="site-footer"><a className="footer-brand" href="#top" aria-label="Adversix Tech home"><img src="/assets/brand/adversix-logo-light.png" alt="Adversix Tech" className="footer-brand-logo" /></a><span>© 2026 Adversix Tech</span><a href="#top">Back to top <ArrowUp className="ui-icon" size={15} strokeWidth={1.7} aria-hidden="true" /></a></footer>
    </main>
  );
}
