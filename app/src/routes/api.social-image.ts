import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/api/social-image")({ server: { handlers: { GET: async ({ request }) => {
  const target = new URL("/assets/brand/adversix-social.jpg", request.url);
  return new Response(null, { status: 302, headers: { Location: target.toString(), "Cache-Control": "no-cache, no-store, must-revalidate", Pragma: "no-cache", Expires: "0" } });
} } } });
