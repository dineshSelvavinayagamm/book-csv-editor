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
import { Images } from '../image';

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
    <div
      className="flex flex-col items-center justify-center min-h-screen w-full bg-cover bg-center"
      style={{
        backgroundImage: `url(${Images.loginbgImage})`,
        backgroundBlendMode: 'overlay',
      }}
    >
      <Form.Root
        className="w-full max-w-md mx-auto  bg-opacity-90 p-8 rounded-xl shadow-xl"
        style={{
          perspective: "1000px",
          background: '#f2f0ef',
          transform: "rotateY(5deg) rotateX(5deg)",
          boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.2)",
          borderRadius: '40px'
        }}
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Nexycare Login</h1>

        <Form.Field className="mb-5" name="email">
          <div className="mb-2">
            <Form.Label className="block text-sm font-semibold text-gray-800">
              Mobile Number
            </Form.Label>
          </div>
          <Form.Control asChild>
            <TextField.Root
              required
              placeholder="Enter your Mobile Number"
              size="3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[45px] "
              style={{ borderRadius: '18px' }}>
              <TextField.Slot />
            </TextField.Root>
          </Form.Control>
          <Form.Message className="text-xs text-error" match="valueMissing">
            Please enter your mobile number
          </Form.Message>
          <Form.Message className="text-xs text-error" match="typeMismatch">
            Please provide a valid mobile number
          </Form.Message>
        </Form.Field>

        <Form.Field className="mb-5" name="password">
          <div className="mb-2">
            <Form.Label className="block text-sm font-semibold text-gray-800">
              Password
            </Form.Label>
          </div>
          <div className="relative">
            <Form.Control asChild>
              <TextField.Root
                required
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-[45px] "
                data-lpignore="true"
                style={{ borderRadius: '18px' }} >
                <TextField.Slot />
                <TextField.Slot pr="3">
                  <IconButton
                    onClick={togglePasswordVisibility}
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
          <Form.Message className="text-xs text-red-500 mt-1" match="valueMissing">
            Please enter a password
          </Form.Message>
        </Form.Field>

        <Button
          onClick={handleSubmit}
          style={{
            width: "100%",
            height: '45px',
            background: "black",
            color: "#fff",
            padding: "12px",
            borderRadius: "15px",
            fontWeight: "bold",
          }}
          disabled={mutation.isPending}
          className="text-center hover:bg-blue-700 transition-all"
        >
          {mutation.isPending ? <Spinner /> : "Login"}
        </Button>

        <div className="mt-4 text-center">
          <Dialog.Root>
            <Dialog.Trigger>
              <Button variant="ghost" className="text-blue-500 font-bold underline text-sm">
                Forgot password?
              </Button>
            </Dialog.Trigger>
            <Dialog.Content className="p-4">
              If you forgot your password, please contact your administrator.
            </Dialog.Content>
          </Dialog.Root>
        </div>
      </Form.Root>
    </div>

  );
};

export default LoginPage;
