import {ICalCalendarMethod} from "ical-generator";
import {NextResponse} from "next/server";
import sendGrid from "@sendgrid/mail";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {

  await request.json().then(async (data: {
    email: string,
    subject: string,
    textHtml: string,
    ids: string[],
    contentList: string[]
  }) => {
    if (!data.email || !data.subject || !data.textHtml || !data.ids || !data.contentList) {
      return NextResponse.json({message: "Missing required fields"}, {status: 400});
    }

    sendGrid.setApiKey(process.env.SENDGRID_APIKEY as string);

    try {
      await sendGrid.send({
        to: data.email,
        from: {
          email: process.env.EMAIL_SENDER as string,
        },
        subject: data.subject,
        html: data.textHtml,
        attachments: data.contentList.map((content: string) => {
          return {
            filename: 'invite.ics',
            name: 'invite.ics',
            content: Buffer.from(content).toString('base64'),
            type: `text/calendar; method=${ICalCalendarMethod.REQUEST}`,
            disposition: 'attachment',
          }
        }),
      });
    } catch (error) {
      return NextResponse.json({message: "Error sending email"}, {status: 500});
    }
  });
  return NextResponse.json({message: "Email sent successfully"}, {status: 200});
}