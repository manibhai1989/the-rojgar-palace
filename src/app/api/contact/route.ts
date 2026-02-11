import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import validator from 'validator';

// HTML escape function to prevent injection
function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export async function POST(req: Request) {
    try {
        const { name, email, subject, message } = await req.json();

        // 1. Basic validation
        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 2. SECURITY: Validate email format
        if (!validator.isEmail(email)) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        // 3. SECURITY: Sanitize inputs to prevent header injection
        const sanitizedName = name.replace(/[\r\n]/g, '').substring(0, 100);
        const sanitizedSubject = (subject || 'New Message').replace(/[\r\n]/g, '').substring(0, 200);
        const sanitizedMessage = message.substring(0, 5000); // Limit message length

        // 4. Transporter configuration (SMTP)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // 5. Email content with sanitized inputs
        const mailOptions = {
            from: process.env.EMAIL_USER, // SECURITY: Use fixed sender
            to: process.env.EMAIL_USER,
            replyTo: email, // Safe to use validated email in replyTo
            subject: `Contact Form: ${sanitizedSubject}`,
            text: `
Name: ${sanitizedName}
Email: ${email}
Subject: ${sanitizedSubject}

Message:
${sanitizedMessage}
            `,
            html: `
<h3>New Contact Form Submission</h3>
<p><strong>Name:</strong> ${escapeHtml(sanitizedName)}</p>
<p><strong>Email:</strong> ${escapeHtml(email)}</p>
<p><strong>Subject:</strong> ${escapeHtml(sanitizedSubject)}</p>
<hr/>
<p><strong>Message:</strong></p>
<pre style="font-family: inherit; white-space: pre-wrap;">${escapeHtml(sanitizedMessage)}</pre>
            `,
        };

        // 6. Send email
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: 'Email sent successfully' }, { status: 200 });

    } catch (error) {
        console.error('Email send error:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
