import { createFileRoute } from "@tanstack/react-router";
import { bindings } from "@/lib/bindings.server";
import { isPortfolioAdmin } from "@/lib/portfolio.server";

export const Route = createFileRoute("/api/portfolio-upload")({
  server: { handlers: {
    POST: async ({ request }) => {
      if (!(await isPortfolioAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });
      if (request.headers.get("origin") !== new URL(request.url).origin) return Response.json({ error: "Invalid origin" }, { status: 403 });
      const length = Number(request.headers.get("content-length") || 0);
      if (length > 8_500_000) return Response.json({ error: "Images must be smaller than 8 MB." }, { status: 413 });
      const bucket = bindings().STORAGE;
      if (!bucket) return Response.json({ error: "Image storage is not configured." }, { status: 503 });
      const form = await request.formData();
      const file = form.get("file");
      if (!(file instanceof File) || file.size < 1 || file.size > 8_000_000) return Response.json({ error: "Choose an image smaller than 8 MB." }, { status: 400 });
      const allowed = new Map([["image/jpeg", "jpg"], ["image/png", "png"], ["image/webp", "webp"]]);
      const extension = allowed.get(file.type);
      if (!extension) return Response.json({ error: "Only JPG, PNG and WebP images are accepted." }, { status: 415 });
      const bytes = new Uint8Array(await file.arrayBuffer());
      const signatureOk = extension === "jpg" ? bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff : extension === "png" ? bytes.slice(0, 8).join(",") === "137,80,78,71,13,10,26,10" : bytes.slice(0, 4).toString() === "82,73,70,70" && bytes.slice(8, 12).toString() === "87,69,66,80";
      if (!signatureOk) return Response.json({ error: "The file contents do not match its image type." }, { status: 415 });
      const assetKey = form.get("assetKey");
      const safeBrandKey = typeof assetKey === "string" && ["logo_dark", "logo_light", "symbol", "favicon", "social_image"].includes(assetKey) ? assetKey : "";
      const key = `${safeBrandKey ? `brand-${safeBrandKey}-` : ""}${crypto.randomUUID()}.${extension}`;
      await bucket.put(key, bytes, { httpMetadata: { contentType: file.type, cacheControl: "public, max-age=31536000, immutable" } });
      return Response.json({ ok: true, url: `/media/${key}` }, { status: 201 });
    },
  } },
});
