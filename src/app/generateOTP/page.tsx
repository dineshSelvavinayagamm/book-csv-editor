'use client';

import { useState } from 'react';

export default function GenerateOTP() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'send' | 'verify'>('send');

  const sendOTP = async () => {
    const res = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });

    const data = await res.json();

    if (res.ok) {
      alert('OTP Sent');
      setStep('verify');
    } else {
      alert(data.error);
    }
  };

  const verifyOTP = async () => {
    const res = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code: otp }),
    });

    const data = await res.json();

    if (res.ok) {
      alert('Phone Verified Successfully ✅');
    } else {
      alert(data.error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Phone Verification</h2>

      {step === 'send' && (
        <>
          <input
            type="text"
            placeholder="+917550148148"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button onClick={sendOTP}>Send OTP</button>
        </>
      )}

      {step === 'verify' && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOTP}>Verify OTP</button>
        </>
      )}
    </div>
  );
}
