'use client';

import React, { useState } from 'react';
import * as Form from '@radix-ui/react-form';
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { Button, IconButton, TextField } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';
import { Images } from '../image';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();

  const validateMobileNumber = (value: string): string => {
    if (!value) return 'Mobile Number is required.';
    if (!/^\d{10}$/.test(value)) return 'Mobile Number must be exactly 10 digits.';
    return '';
  };

  const validatePassword = (value: string): string => {
    if (!value) return 'Password is required.';
    if (value.length < 6) return 'Password must be at least 6 characters.';
    if (/\s/.test(value)) return 'Password cannot contain whitespace.';
    return '';
  };

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();

    const mobileErr = validateMobileNumber(mobileNumber);
    const passwordErr = validatePassword(password);

    setMobileError(mobileErr);
    setPasswordError(passwordErr);

    if (!mobileErr && !passwordErr) {
      router.push('/home');
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen w-full bg-cover bg-center"
      style={{
        backgroundImage: `url(${Images.loginbgImage})`,
        backgroundBlendMode: 'overlay',
      }}
    >
      <Form.Root
        className="w-full max-w-md p-8 bg-white bg-opacity-90 rounded-xl shadow-xl"
        style={{ borderRadius: '30px' }}
      >
        <h1 className="text-3xl font-extrabold mb-6 text-start bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
          Notion Press Media <br /> Member Login!!
        </h1>

        <Form.Field className="mb-5" name="mobileNumber">
          <Form.Label className="block text-sm font-semibold text-gray-800 mb-2">
            Mobile Number
          </Form.Label>
          <Form.Control asChild>
            <TextField.Root
              required
              placeholder="Enter your Mobile Number"
              value={mobileNumber}
              onChange={(e) => {
                setMobileNumber(e.target.value);
                setMobileError(validateMobileNumber(e.target.value));
              }}
              className="w-full h-[45px]"
              style={{ borderRadius: '18px' }}
            >
              <TextField.Slot />
            </TextField.Root>
          </Form.Control>
          {mobileError && <p className="text-red-500 text-xs mt-1">{mobileError}</p>}
        </Form.Field>

        <Form.Field className="mb-5" name="password">
          <Form.Label className="block text-sm font-semibold text-gray-800 mb-2">
            Password
          </Form.Label>
          <div className="relative">
            <Form.Control asChild>
              <TextField.Root
                required
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(validatePassword(e.target.value));
                }}
                className="w-full h-[45px]"
                style={{ borderRadius: '18px' }}
              >
                <TextField.Slot />
                <TextField.Slot pr="3">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    size="2"
                    variant="ghost"
                    className="absolute top-2 right-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeClosedIcon className="h-[25px] w-[20px]" />
                    ) : (
                      <EyeOpenIcon className="h-[25px] w-[20px]" />
                    )}
                  </IconButton>
                </TextField.Slot>
              </TextField.Root>
            </Form.Control>
          </div>
          {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
        </Form.Field>

        <Button
          onClick={handleLogin}
          style={{
            width: '100%',
            height: '45px',
            background: 'black',
            color: '#fff',
            borderRadius: '15px',
            fontWeight: 'bold',
          }}
          className="hover:bg-blue-700 transition-all"
        >
          Login
        </Button>
      </Form.Root>
    </div>
  );
};

export default LoginPage;
