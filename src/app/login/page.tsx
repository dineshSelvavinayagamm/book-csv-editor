/* eslint-disable react/jsx-no-bind */
'use client';
import React, { useState } from 'react';
import * as Form from '@radix-ui/react-form';
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { Button, Dialog, IconButton, Spinner, TextField } from '@radix-ui/themes';
import { useMutation } from '@tanstack/react-query';
import { login } from '@/api';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/constants';
import { setUserSessionToken } from '@/services/AxiosClient';
import { StorageService } from '@/services/StorageService';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { replace } = useRouter();

  const mutation = useMutation({
    mutationFn: ({
      mobileNumber,
      password,
    }: {
      mobileNumber: string;
      password: string;
    }) => login(mobileNumber, password),
    onSuccess: (data) => {
      StorageService.authToken.setValue(data?.data?.token);
      setUserSessionToken(data?.data?.token ?? null);
      replace(Navigation.Home);
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    mutation.mutate({ mobileNumber: email, password });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-t from-gray-900 via-gray-700 to-gray-500">
      <Form.Root className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-xl font-bold text-text mb-8">Nexycare Login</h1>

        <Form.Field className="mb-4" name="email">
          <div className="flex justify-between">
            <Form.Label className="text-sm font-medium text-text">Email</Form.Label>
            <Form.Message className="text-xs text-error" match="valueMissing">
              Please enter your email
            </Form.Message>
            <Form.Message className="text-xs text-error" match="typeMismatch">
              Please provide a valid email
            </Form.Message>
          </div>
          <Form.Control asChild>
            <TextField.Root
              required
              // type={'email'}
              size="3"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            >
              <TextField.Slot />
            </TextField.Root>
          </Form.Control>
        </Form.Field>

        <Form.Field className="mb-4" name="password">
          <div className="flex justify-between">
            <Form.Label className="text-sm font-medium text-text">Password</Form.Label>
            <Form.Message className="text-xs text-error" match="valueMissing">
              Please enter a password
            </Form.Message>
          </div>
          <div className="relative">
            <Form.Control asChild>
              <TextField.Root
                required
                type={showPassword ? 'text' : 'password'}
                size="3"
                placeholder="Enter a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              >
                <TextField.Slot />
                <TextField.Slot pr="3">
                  <IconButton onClick={togglePasswordVisibility} size="2" variant="ghost">
                    {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                  </IconButton>
                </TextField.Slot>
              </TextField.Root>
            </Form.Control>
          </div>
        </Form.Field>
        <Button
          onClick={handleSubmit}
          style={{ width: '100%' }}
          variant="classic"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? <Spinner /> : 'Login'}
        </Button>

        <Dialog.Root>
          <Dialog.Trigger>
            <Button variant="ghost">Forgot password?</Button>
          </Dialog.Trigger>
          <Dialog.Content className="p-4">
            If you forgot your password, please contact your administrator
          </Dialog.Content>
        </Dialog.Root>
      </Form.Root>
    </div>
  );
};

export default LoginPage;
