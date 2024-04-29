import { EmailTemplate } from '@/components/email-template';
import { Resend } from 'resend';
import { Kitchen } from '@prisma/client';
import * as React from 'react';

const resend = new Resend(process.env.EMAIL_API);

export async function POST(request: Request) {
    try {
        const kitchen: Kitchen[] = await request.json();
        console.log("Got to email api");
        console.log(kitchen);
        const subject = "Your Order: #" + kitchen[0].order_id + " is ready!";
        const { data, error } = await resend.emails.send({
            from: 'info@revs.utsawb.dev',
            to: kitchen[0].email as string,
            subject: subject,
            react: EmailTemplate({ kitchen : kitchen }) as React.ReactElement,
        });

        if (error) {
            return Response.json({ error });
        }

        return Response.json({ data });
    } catch (error) {
        return Response.json({ error });
    }
}
