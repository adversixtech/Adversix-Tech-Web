import { createFileRoute } from "@tanstack/react-router";
import { bindings } from "@/lib/bindings.server";
import { isPortfolioAdmin } from "@/lib/portfolio.server";
const keys = new Set(["logo_dark", "logo_light", "symbol", "favicon", "social_image"]);
export const Route = createFileRoute("/api/brand-assets")({ server: { handlers: {
  GET: async () => {
    const db = bindings().DB;
    if (!db) return Response.json({ assets: {} }, { status: 503 });
    const rows = await db.prepare("SELECT asset_key,asset_url FROM brand_assets").all<{ asset_key: string; asset_url: string }>();
    return Response.json({ assets: Object.fromEntries((rows.results ?? []).map((row) => [row.asset_key, row.asset_url])) }, { headers: { "Cache-Control": "public, max-age=60" } });
  },
  PUT: async ({ request }) => {
    if (!(await isPortfolioAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (request.headers.get("origin") !== new URL(request.url).origin) return Response.json({ error: "Invalid origin" }, { status: 403 });
    let data: { assetKey?: string; url?: string }; try { data = await request.json() as typeof data; } catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }
    if (!data.assetKey || !keys.has(data.assetKey) || typeof data.url !== "string" || !/^\/(?:assets|media)\/[a-zA-Z0-9_./-]+$/.test(data.url) || data.url.includes("..")) return Response.json({ error: "Invalid brand asset" }, { status: 400 });
    const db = bindings().DB; if (!db) return Response.json({ error: "Database unavailable" }, { status: 503 });
    await db.prepare("INSERT INTO brand_assets (asset_key,asset_url,updated_at) VALUES (?,?,datetime('now')) ON CONFLICT(asset_key) DO UPDATE SET asset_url=excluded.asset_url,updated_at=datetime('now')").bind(data.assetKey, data.url).run();
    return Response.json({ ok: true });
  },
} } });
