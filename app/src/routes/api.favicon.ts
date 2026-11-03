import { createFileRoute } from "@tanstack/react-router";
import { bindings } from "@/lib/bindings.server";
export const Route = createFileRoute("/api/favicon")({ server: { handlers: { GET: async ({ request }) => {
  const row = await bindings().DB?.prepare("SELECT asset_url FROM brand_assets WHERE asset_key='favicon'").first<{ asset_url: string }>();
  const target = row?.asset_url || "/assets/brand/adversix-symbol.png";
  return Response.redirect(new URL(target, request.url), 302);
} } } });
