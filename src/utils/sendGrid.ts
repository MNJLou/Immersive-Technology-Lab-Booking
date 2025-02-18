import sendGrid from '@sendgrid/mail';
import { ICalCalendarMethod } from "ical-generator";
export const sendGridCreateEmail = async (email: string, subject: string, textHtml: string, ids: string[], contentList: string[]) => {
  sendGrid.setApiKey(process.env.SENDGRID_APIKEY as string);
  
  try {
    await sendGrid.send({
      to: email,
      from: {
        email: process.env.EMAIL_SENDER as string,
      },
      subject: subject,
      html: textHtml,
      attachments: contentList.map((content: string) => {
        return {
          filename: 'invite.ics',
          content: Buffer.from(content).toString('base64'),
          type: `text/calendar; method=${ICalCalendarMethod.REQUEST}`,
          disposition: 'attachment',
        }
      }),
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const sendGridCancelEmail = async (email: string, subject: string, textHtml: string, icsUid: string, content: string) => {
  sendGrid.setApiKey(process.env.SENDGRID_APIKEY as string);
  
  try {
    await sendGrid.send({
      to: email,
      from: {
        email: process.env.EMAIL_SENDER as string,
      },
      subject: subject,
      html: textHtml,
      attachments: [
        {
          filename: 'invite.ics',
          content: Buffer.from(content).toString('base64'),
          type: `text/calendar; method=${ICalCalendarMethod.CANCEL}`,
          disposition: 'attachment',
        }
      ],
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
}