import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
console.log(process.env.SENDGRID_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { emailList, subject, message } = body;

    if (!emailList || !subject || !message) {
      return NextResponse.json({ error: 'Email list, subject, and message are required' }, { status: 400 });
    }

    const toEmails = emailList.split(',').map((email: string) => email.trim());

    const msg = {
      to: toEmails,
      from: 'vaibhavgupta.v890@gmail.com', 
      subject: subject,
      text: message,
      html: `<p>${message}</p>`, 
    };

    await sgMail.sendMultiple(msg); 
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error sending emails:', error);
    return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 });
  }
}
