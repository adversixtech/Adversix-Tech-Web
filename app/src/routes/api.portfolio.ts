import { createFileRoute } from "@tanstack/react-router";
import { isPortfolioAdmin, normalizeProject, portfolioDb, serializeProject, validProject, type PortfolioRow } from "@/lib/portfolio.server";

export const Route = createFileRoute("/api/portfolio")({
  server: { handlers: {
    GET: async ({ request }) => {
      try {
        const adminView = new URL(request.url).searchParams.get("admin") === "1";
        if (adminView && !(await isPortfolioAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });
        const statusClause = adminView ? "" : "WHERE status = 'published'";
        const result = await portfolioDb().prepare(`SELECT * FROM portfolio_projects ${statusClause} ORDER BY featured DESC, sort_order ASC, created_at DESC`).all<PortfolioRow>();
        return Response.json({ projects: (result.results ?? []).map(serializeProject) }, { headers: { "Cache-Control": adminView ? "no-store" : "public, max-age=60" } });
      } catch { return Response.json({ error: "Portfolio is temporarily unavailable" }, { status: 503 }); }
    },
    POST: async ({ request }) => {
      if (!(await isPortfolioAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });
      if (request.headers.get("origin") !== new URL(request.url).origin) return Response.json({ error: "Invalid origin" }, { status: 403 });
      let payload: Record<string, unknown>; try { payload = await request.json() as Record<string, unknown>; } catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }
      const project = normalizeProject(payload);
      if (!validProject(project)) return Response.json({ error: "Please complete the required project fields and use a valid slug and cover image path." }, { status: 400 });
      const id = crypto.randomUUID();
      try {
        await portfolioDb().prepare("INSERT INTO portfolio_projects (id,slug,title,category,description,services_json,features_json,technologies_json,cover_image,preview_url,featured,sort_order,status,gallery_json,desktop_preview,mobile_preview) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)")
          .bind(id, project.slug, project.title, project.category, project.description, JSON.stringify(project.services), JSON.stringify(project.features), JSON.stringify(project.technologies), project.coverImage, project.previewUrl || null, project.featured ? 1 : 0, project.sortOrder, project.status, JSON.stringify(project.gallery), project.desktopPreview || null, project.mobilePreview || null).run();
        return Response.json({ ok: true, id }, { status: 201 });
      } catch { return Response.json({ error: "Could not create project. Check that its slug is unique." }, { status: 409 }); }
    },
    PUT: async ({ request }) => {
      if (!(await isPortfolioAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });
      if (request.headers.get("origin") !== new URL(request.url).origin) return Response.json({ error: "Invalid origin" }, { status: 403 });
      let payload: Record<string, unknown>; try { payload = await request.json() as Record<string, unknown>; } catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }
      const id = typeof payload.id === "string" ? payload.id : "";
      const project = normalizeProject(payload);
      if (!id || !validProject(project)) return Response.json({ error: "Invalid project details" }, { status: 400 });
      try {
        const result = await portfolioDb().prepare("UPDATE portfolio_projects SET slug=?,title=?,category=?,description=?,services_json=?,features_json=?,technologies_json=?,cover_image=?,preview_url=?,featured=?,sort_order=?,status=?,gallery_json=?,desktop_preview=?,mobile_preview=?,updated_at=datetime('now') WHERE id=?")
          .bind(project.slug, project.title, project.category, project.description, JSON.stringify(project.services), JSON.stringify(project.features), JSON.stringify(project.technologies), project.coverImage, project.previewUrl || null, project.featured ? 1 : 0, project.sortOrder, project.status, JSON.stringify(project.gallery), project.desktopPreview || null, project.mobilePreview || null, id).run();
        if (!result.meta.changes) return Response.json({ error: "Project not found" }, { status: 404 });
        return Response.json({ ok: true });
      } catch { return Response.json({ error: "Could not save project. Check that its slug is unique." }, { status: 409 }); }
    },
    DELETE: async ({ request }) => {
      if (!(await isPortfolioAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });
      if (request.headers.get("origin") !== new URL(request.url).origin) return Response.json({ error: "Invalid origin" }, { status: 403 });
      let payload: { id?: string }; try { payload = await request.json() as { id?: string }; } catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }
      if (!payload.id || payload.id.length > 64) return Response.json({ error: "Invalid project id" }, { status: 400 });
      await portfolioDb().prepare("DELETE FROM portfolio_projects WHERE id=?").bind(payload.id).run();
      return Response.json({ ok: true });
    },
  } },
});
