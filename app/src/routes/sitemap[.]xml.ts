import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const today = new Date().toISOString().split("T")[0];
        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          "  <url>",
          `    <loc>${origin}/</loc>`,
          `    <lastmod>${today}</lastmod>`,
          "    <changefreq>weekly</changefreq>",
          "    <priority>1.0</priority>",
          "  </url>",
          ...["salon-braiding-barbering", "professional-cleaning", "luxury-nail-studio", "beauty-grooming-studio"].flatMap((slug) => [
            "  <url>", `    <loc>${origin}/work/${slug}</loc>`, `    <lastmod>${today}</lastmod>`, "    <changefreq>monthly</changefreq>", "    <priority>0.7</priority>", "  </url>",
            "  <url>", `    <loc>${origin}/concepts/${slug}</loc>`, `    <lastmod>${today}</lastmod>`, "    <changefreq>monthly</changefreq>", "    <priority>0.6</priority>", "  </url>",
          ]),
          "</urlset>",
        ].join("\n");
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
