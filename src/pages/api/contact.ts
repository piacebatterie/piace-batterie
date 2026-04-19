import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {

  const resend = new Resend(import.meta.env.RESEND_API_KEY);

  let name = '';
  let phone = '';
  let city = '';

  try {

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      name = formData.get('name') as string;
      phone = formData.get('phone') as string;
      city = formData.get('city') as string;

    } else {
      const body = await request.text();
      const params = new URLSearchParams(body);
      name = params.get('name') || '';
      phone = params.get('phone') || '';
      city = params.get('city') || '';
    }

    await resend.emails.send({
      from: 'Piace Batterie <info@piacebatterie.it>',
      to: ['info@piacebatterie.it'],
      subject: `Nuovo controllo batteria – ${city}`,
      html: `
        <h2>🔋 Nuovo contatto</h2>
    
        <p><strong>Nome:</strong> ${name}</p>
    
     <p>
  <a href="tel:${phone.replace(/\s/g, '')}" 
     style="display:inline-block;padding:10px 16px;background:#ff6a00;color:#fff;text-decoration:none;border-radius:6px;">
     📞 Chiama ora
  </a>
</p>
    
        <p><strong>Città:</strong> ${city}</p>
      `
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err) {
    console.error('🔥 RESEND ERROR:', err);
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
};