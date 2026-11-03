import { createFileRoute } from "@tanstack/react-router";
import { bindings } from "@/lib/bindings.server";

export const Route = createFileRoute("/media/$key")({
  server: { handlers: {
    GET: async ({ params }) => {
      if (!/^(?:brand-(?:logo_dark|logo_light|symbol|favicon|social_image)-)?[0-9a-f-]{36}\.(?:jpg|png|webp)$/.test(params.key)) return new Response("Not found", { status: 404 });
      const object = await bindings().STORAGE?.get(params.key);
      if (!object) return new Response("Not found", { status: 404 });
      const headers = new Headers() as unknown as Parameters<typeof object.writeHttpMetadata>[0];
      object.writeHttpMetadata(headers);
      headers.set("etag", object.httpEtag);
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
      headers.set("X-Content-Type-Options", "nosniff");
      return new Response(object.body as unknown as BodyInit, { headers: headers as unknown as Headers });
    },
  } },
});
