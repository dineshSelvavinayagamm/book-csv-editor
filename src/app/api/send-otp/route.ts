import { NextResponse } from 'next/server';
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

interface SendOtpBody {
  phone: string;
}

export async function POST(req: Request) {
  try {
    const body: SendOtpBody = await req.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;

    await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verifications.create({
        to: formattedPhone,
        channel: 'sms',
      });

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (error: unknown) {
    console.error('Send OTP Error:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
  }
}
