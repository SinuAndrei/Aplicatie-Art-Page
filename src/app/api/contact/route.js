import nodemailer from 'nodemailer';

export async function POST(req, res) {
  try {
    const { firstname, lastname, email, phone, message } = await req.json();

    // Configurarea transportului pentru Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Adresa de e-mail de la care se trimite
        pass: process.env.EMAIL_PASS, // Parola pentru adresa de e-mail
      },
    });

    // Configurarea mesajului de e-mail
    const mailOptions = {
      from: email,
      to: 'andreisinu2001@yahoo.com', // Adresa de e-mail la care se trimite mesajul
      subject: `Contact Form Submission from ${firstname} ${lastname}`,
      text: `
    You have received a new message from the contact form on your website.

    Here are the details:

    First Name: ${firstname}
    Last Name: ${lastname}
    Email: ${email}
    Phone: ${phone}

    Message:
    ${message}

    Best regards,
    Your Website Team
  `,
    };

    // Trimiterea e-mailului
    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 500,
    });
  }
}
