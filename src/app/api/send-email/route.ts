import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            parentName,
            email,
            phone,
            childName,
            childAge,
            program,
            package: pkg, // renaming 'package' because it's a reserved word
            message
        } = body;

        // 1. Configure the transporter using Gmail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // 2. Create the email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RECIPIENT_EMAIL,
            subject: `New Lead: ${parentName} - AboveCodes Inquiry`,
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #2563eb;">New Admission Inquiry</h2>
          <p>You have received a new message from the AboveCodes website contact form.</p>

          <hr style="border: 1px solid #eee; margin: 20px 0;">

          <h3>Parent Details</h3>
          <ul>
            <li><strong>Name:</strong> ${parentName}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Phone:</strong> ${phone}</li>
          </ul>

          <h3>Child Details</h3>
          <ul>
            <li><strong>Name:</strong> ${childName}</li>
            <li><strong>Age Group:</strong> ${childAge} years</li>
            <li><strong>Program Interest:</strong> ${program}</li>
            <li><strong>Preferred Package:</strong> ${pkg}</li>
          </ul>

          <h3>Message</h3>
          <p style="background-color: #f3f4f6; padding: 15px; border-radius: 5px;">
            ${message || "No additional message provided."}
          </p>

          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #888;">This email was sent automatically from your Next.js website.</p>
        </div>
      `,
        };

        // 3. Send the email
        await transporter.sendMail(mailOptions);

        return NextResponse.json(
            { message: 'Email sent successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Failed to send email:', error);
        return NextResponse.json(
            { error: 'Failed to send email' },
            { status: 500 }
        );
    }
}
