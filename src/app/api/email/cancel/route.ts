import {ICalCalendarMethod} from "ical-generator";
import {NextResponse} from "next/server";
import * as postmark from 'postmark';

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const data: {
      email: string,
      subject: string,
      textHtml: string,
      icsUids: string[],
      contentList: string[]
    } = await request.json();

    if (!data.email || !data.subject || !data.textHtml || !data.icsUids || !data.contentList) {
      return NextResponse.json({message: "Missing required fields"}, {status: 400});
    }

    const client = new postmark.ServerClient(process.env.POSTMARK_APIKEY as string);

    const result = await client.sendEmail({
      From: process.env.EMAIL_SENDER as string,
      To: data.email,
      Subject: data.subject,
      HtmlBody: data.textHtml,
      Attachments: data.contentList.map((content: string, index: number) => ({
        Name: 'invite.ics',
        Content: Buffer.from(content).toString('base64'),
        ContentType: `text/calendar; method=${ICalCalendarMethod.CANCEL}`,
        ContentID: `cancel-invite-${index}`,
      })),
    });

    console.log("Cancel email sent successfully:", result.MessageID);
    return NextResponse.json({
      message: "Cancel email sent successfully", 
      messageId: result.MessageID
    }, {status: 200});

  } catch (error) {
    console.error("Error sending cancel email:", error);
    return NextResponse.json({message: "Error sending email"}, {status: 500});
  }
}