import * as postmark from 'postmark';
import { ICalCalendarMethod } from 'ical-generator';

export const postmarkCreateEmail = async (email: string, subject: string, textHtml: string, ids: string[], contentList: string[]) => {
  const client = new postmark.ServerClient(process.env.POSTMARK_APIKEY as string);
  
  try {
    await client.sendEmail({
      From: process.env.EMAIL_SENDER as string,
      To: email,
      Subject: subject,
      HtmlBody: textHtml,
      Attachments: contentList.map((content: string, index: number) => ({
        Name: 'invite.ics',
        Content: Buffer.from(content).toString('base64'),
        ContentType: `text/calendar; method=${ICalCalendarMethod.REQUEST}`,
        ContentID: `invite-${index}`,
      })),
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const postmarkCancelEmail = async (email: string, subject: string, textHtml: string, icsUid: string, content: string) => {
  const client = new postmark.ServerClient(process.env.POSTMARK_APIKEY as string);
  
  try {
    await client.sendEmail({
      From: process.env.EMAIL_SENDER as string,
      To: email,
      Subject: subject,
      HtmlBody: textHtml,
      Attachments: [{
        Name: 'invite.ics',
        Content: Buffer.from(content).toString('base64'),
        ContentType: `text/calendar; method=${ICalCalendarMethod.CANCEL}`,
        ContentID: `invite-${icsUid}`,
      }],
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};