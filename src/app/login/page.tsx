'use client';

import React, { useState } from 'react';
import * as Form from '@radix-ui/react-form';
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { Button, IconButton, TextField } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';
import { Images } from '../image'; // make sure this path is correct

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Hardcoded credentials
  const validUser = {
    mobileNumber: '7550148148',
    password: '1234',
  };

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();

    // Simple front-end validation
    if (!mobileNumber || !password) {
      setError('Please enter both Mobile Number and Password.');
      return;
    }

    if (mobileNumber === validUser.mobileNumber && password === validUser.password) {
      setError('');
      router.push('/home'); // Navigate to Home page
    } else {
      setError('Login failed. Please check your credentials.');
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
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full h-[45px]"
              style={{ borderRadius: '18px' }}
            >
              <TextField.Slot />
            </TextField.Root>
          </Form.Control>
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
                onChange={(e) => setPassword(e.target.value)}
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
        </Form.Field>

        {error && <p className="text-red-500 mb-3 text-center">{error}</p>}

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
