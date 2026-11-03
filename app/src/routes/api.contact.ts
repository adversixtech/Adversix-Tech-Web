import { createFileRoute } from "@tanstack/react-router";
import { bindings } from "@/lib/bindings.server";

const INQUIRY_RECIPIENT = "adversixtech@gmail.com";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] || character);
}

async function sendInquiryEmail(input: { name: string; email: string; service: string; message: string }) {
  const { RESEND_API_KEY, RESEND_FROM_EMAIL } = bindings();
  if (!RESEND_API_KEY || !RESEND_FROM_EMAIL) return false;

  const safeName = escapeHtml(input.name);
  const safeEmail = escapeHtml(input.email);
  const safeService = escapeHtml(input.service);
  const safeMessage = escapeHtml(input.message).replace(/\r?\n/g, "<br>");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: RESEND_FROM_EMAIL,
      to: [INQUIRY_RECIPIENT],
      reply_to: input.email,
      subject: `New Adversix Tech inquiry — ${input.name}`,
      text: `New website inquiry\n\nName: ${input.name}\nEmail: ${input.email}\nService: ${input.service}\n\nMessage:\n${input.message}`,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6"><h2>New Adversix Tech inquiry</h2><p><strong>Name:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><p><strong>Service:</strong> ${safeService}</p><hr><p>${safeMessage}</p></div>`,
    }),
  });
  return response.ok;
}

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const contentLength = Number(request.headers.get("content-length") || 0);
        if (contentLength > 12_000) return Response.json({ ok: false, message: "Your message is too long." }, { status: 413 });
        let payload: Record<string, unknown>;
        try { payload = await request.json() as Record<string, unknown>; }
        catch { return Response.json({ ok: false, message: "Please check the form and try again." }, { status: 400 }); }
        const name = typeof payload.name === "string" ? payload.name.trim() : "";
        const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
        const service = typeof payload.service === "string" ? payload.service.trim().slice(0, 120) : "Not sure yet";
        const message = typeof payload.message === "string" ? payload.message.trim() : "";
        const honeypot = typeof payload.website === "string" ? payload.website.trim() : "";
        if (honeypot) return Response.json({ ok: true });
        if (name.length < 2 || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 180 || message.length < 10 || message.length > 4000) {
          return Response.json({ ok: false, message: "Please enter a valid name, email and message." }, { status: 400 });
        }
        const db = bindings().DB;
        if (!db) return Response.json({ ok: false, message: "The inquiry service is temporarily unavailable. Please try again later." }, { status: 503 });
        try {
          await db.prepare("INSERT INTO inquiries (name, email, service, message) VALUES (?, ?, ?, ?)").bind(name, email, service, message).run();
        } catch {
          return Response.json({ ok: false, message: "We could not save your inquiry. Please try again." }, { status: 500 });
        }

        let emailSent = false;
        try { emailSent = await sendInquiryEmail({ name, email, service, message }); } catch { emailSent = false; }
        if (emailSent) {
          return Response.json({ ok: true, emailSent: true, message: "Your inquiry has been sent to the Adversix Tech team. We will be in touch soon." }, { status: 201 });
        }
        return Response.json({ ok: true, emailSent: false, message: "Your inquiry was saved, but email notifications are not configured yet. Please contact adversixtech@gmail.com directly for now." }, { status: 201 });
      },
    },
  },
});
