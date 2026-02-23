import { NextResponse } from 'next/server';
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function POST(req: Request) {
  try {
    const { phone, code } = await req.json();

    const formattedPhone = phone.startsWith('+')
      ? phone
      : `+${phone}`;

    const check = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verificationChecks.create({
        to: formattedPhone,
        code,
      });

    if (check.status === 'approved') {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Invalid OTP' },
      { status: 400 }
    );

  } catch (error: unknown) {
    console.error('Verify OTP Error:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Unexpected error occurred' },
      { status: 500 }
    );
  }
}