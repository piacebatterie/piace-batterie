import { Resend } from 'resend';

const prerender = false;
const escapeHtml = (value) => {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
};
const cleanText = (value) => {
  return String(value || "").trim().slice(0, 120);
};
const cleanPhone = (value) => {
  return value.replace(/[^\d+]/g, "").slice(0, 20);
};
const POST = async ({ request }) => {
  try {
    const apiKey = "re_8JvHNXKt_CEwUtAnu4c9AgXXui7En6ZkE";
    if (!apiKey) ;
    const resend = new Resend(apiKey);
    let name = "";
    let phone = "";
    let city = "";
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      name = cleanText(formData.get("name"));
      phone = cleanPhone(cleanText(formData.get("phone")));
      city = cleanText(formData.get("city"));
    } else {
      const body = await request.text();
      const params = new URLSearchParams(body);
      name = cleanText(params.get("name"));
      phone = cleanPhone(cleanText(params.get("phone")));
      city = cleanText(params.get("city"));
    }
    if (!name || !phone) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "missing_required_fields"
        }),
        { status: 400 }
      );
    }
    const safeName = escapeHtml(name);
    const safePhone = escapeHtml(phone);
    const safeCity = escapeHtml(city || "Non indicata");
    const telHref = phone.replace(/[^\d+]/g, "");
    const subjectCity = city ? ` – ${city}` : "";
    await resend.emails.send({
      from: "Piace Batterie <info@piacebatterie.it>",
      to: ["info@piacebatterie.it"],
      subject: `Nuovo controllo batteria${subjectCity}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
          <h2 style="margin: 0 0 18px;">🔋 Nuovo contatto da piacebatterie.it</h2>

          <p><strong>Nome:</strong> ${safeName}</p>
          <p><strong>Telefono:</strong> ${safePhone}</p>
          <p><strong>Città:</strong> ${safeCity}</p>

          <p style="margin-top: 22px;">
            <a 
              href="tel:${telHref}"
              style="display:inline-block;padding:12px 18px;background:#ff6b00;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;"
            >
              📞 Chiama ora
            </a>
          </p>

          <hr style="margin: 24px 0; border: 0; border-top: 1px solid #ddd;" />

          <p style="font-size: 12px; color: #666;">
            Richiesta ricevuta dal modulo contatti di piacebatterie.it.
          </p>
        </div>
      `
    });
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (err) {
    console.error("RESEND ERROR:", err);
    return new Response(
      JSON.stringify({
        success: false,
        error: "send_failed"
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
