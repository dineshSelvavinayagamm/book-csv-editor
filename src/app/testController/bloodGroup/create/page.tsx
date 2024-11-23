'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { ApiQueryKey } from '@/constants/QueryKey';
import { Navigation, PageTitle } from '@/constants';
import { Field } from '@/components';
import { Box } from '@radix-ui/themes';
import { FieldAttributes, FieldType } from '@/types';
import { z, ZodError } from 'zod';
import { bloodGroupCreate, BloodGroupForm } from '@/api/Test';
import * as Toast from '@radix-ui/react-toast';
import { useAppHeader } from '@/app/hooks/appHeader/page';

const formJson: FieldAttributes[] = [
  {
    name: 'shortNameFld',
    label: 'Short Name',
    type: FieldType.TEXT,
    required: true,
    schema: z.string().min(1, 'Short Name is required.'),
  },
  {
    name: 'longName_Fld',
    label: 'Long Name',
    type: FieldType.TEXT,
    required: true,
    schema: z.string().min(1, 'Long Name is required.'),
  },
  {
    name: 'aliasFld',
    label: 'Alias',
    type: FieldType.TEXT,
    required: false,
    schema: z.string().optional(),
  },
];

const BloodGroupCreate: React.FC = () => {
  const router = useRouter();
  const { updateTitle } = useAppHeader();

  useEffect(() => {
    updateTitle(PageTitle.CreateBloodGroup);
  }, [updateTitle, PageTitle]);

  const [bloodGroupForm, setBloodGroupForm] = useState<BloodGroupForm>(
    formJson.reduce<BloodGroupForm>(
      (acc, field) => ({ ...acc, [field.name]: '' }),
      {} as BloodGroupForm,
    ),
  );

  const [errors, setErrors] = useState<Partial<BloodGroupForm>>({});
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    isSuccess: boolean;
  } | null>(null);

  const createUser = useMutation<void, Error, BloodGroupForm>({
    mutationKey: [ApiQueryKey.bloodGroupCreate],
    mutationFn: bloodGroupCreate,
    onSuccess: () => {
      setToastMessage({ text: 'Blood Group created successfully!', isSuccess: true });
      router.push(Navigation.BloodGroup);
    },
    onError: (error) => {
      setToastMessage({ text: error.message, isSuccess: false });
      console.error('Error creating user:', error);
    },
  });

  const validateForm = useCallback((formData: BloodGroupForm) => {
    const newErrors: Partial<BloodGroupForm> = {};
    formJson.forEach((field) => {
      try {
        field.schema.parse(formData[field.name as keyof BloodGroupForm]);
      } catch (error) {
        if (error instanceof ZodError) {
          const zodError: ZodError = error;
          newErrors[field.name as keyof BloodGroupForm] = zodError.issues
            .map((issue) => issue.message)
            .join(', ');
        } else {
          newErrors[field.name as keyof BloodGroupForm] = 'Invalid value';
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 60000);

      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedBloodGroupForm = { ...bloodGroupForm };
    formJson.forEach((field) => {
      updatedBloodGroupForm[field.name as keyof BloodGroupForm] = formData.get(
        field.name,
      ) as string;
    });

    setBloodGroupForm({ ...updatedBloodGroupForm });

    if (!validateForm(updatedBloodGroupForm)) return;

    createUser.mutate(updatedBloodGroupForm);
  };

  const handleCancel = () => {
    setBloodGroupForm(
      formJson.reduce(
        (acc, field) => ({ ...acc, [field.name]: field.required ? '' : undefined }),
        {} as BloodGroupForm,
      ),
    );
    router.push(Navigation.BloodGroup);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formJson.map((field) => (
        <Box key={field.name} className="flex flex-col space-y-2">
          <Field {...field} value={bloodGroupForm[field.name as keyof BloodGroupForm]} />
          {errors[field.name as keyof BloodGroupForm] && (
            <p className="text-red-500 text-sm">
              {errors[field.name as keyof BloodGroupForm]}
            </p>
          )}
        </Box>
      ))}

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={handleCancel}
          className="bg-gray-300 text-black px-4 py-2 rounded-md"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          disabled={createUser.status === 'pending'}
        >
          Submit
        </button>
      </div>
      <Toast.Provider swipeDirection="right">
        {toastMessage && (
          <Toast.Root
            className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg ${
              toastMessage.isSuccess ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
            onOpenChange={() => setToastMessage(null)}
          >
            <Toast.Title>{toastMessage.text}</Toast.Title>
          </Toast.Root>
        )}
        <Toast.Viewport />
      </Toast.Provider>
    </form>
  );
};

export default BloodGroupCreate;
