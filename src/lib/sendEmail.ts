import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

interface EmailData {
  to: string[]; 
  subject: string; 
  text: string; 
  html?: string; 
}

/**
 * 
 * @param {EmailData} emailData - The email data containing recipient addresses, subject, text, and optional HTML.
 * @returns {Promise<void>} - A promise that resolves when emails are sent successfully.
 * @throws {Error} - Throws an error if sending fails.
 */
export const sendBulkEmail = async ({ to, subject, text, html }: EmailData): Promise<void> => {
  const msg = {
    to, 
    from: 'vaibhavgupta.v890@gmail.com', 
    subject,
    text,
    html,
  };

  try {
    await sgMail.sendMultiple(msg);
    console.log('Emails sent successfully');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error sending emails:', error.message);
      throw new Error('Failed to send emails: ' + error.message);
    } else {
      console.error('Unknown error sending emails:', error);
      throw new Error('Failed to send emails: Unknown error occurred'); 
    }
  }
};
