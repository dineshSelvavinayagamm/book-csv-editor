'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { ApiQueryKey } from '@/constants/QueryKey';
import { Navigation } from '@/constants';
import { Field } from '@/components';
import { Box } from '@radix-ui/themes';
import { FieldAttributes, FieldType } from '@/types';
import { z, ZodError } from 'zod';
import {
  testPackageCreate,
  TestPackageForm,
  testParameterMasterCreate,
  TestParameterMasterForm,
} from '@/api';
import * as Toast from '@radix-ui/react-toast';

const formJson: FieldAttributes[] = [
  {
    name: 'testParameterNameFld',
    label: 'Test Parameter Name',
    type: FieldType.TEXT,
    required: false,
    schema: z.string(),
  },
  {
    name: 'testParameterIDFld',
    label: 'Test Parameter ID',
    type: FieldType.TEXT,
    required: false,
    schema: z.string(),
  },
  {
    name: 'parameterAliaseFld',
    label: 'Parameter Aliase',
    type: FieldType.TEXT,
    required: false,
    schema: z.string(),
  },
  {
    name: 'descriptionFld',
    label: 'Description',
    type: FieldType.TEXT,
    required: false,
    schema: z.string(),
  },
  {
    name: 'isActiveFld',
    label: 'Active',
    type: FieldType.SELECT,
    required: false,
    options: [
      {
        label: 'Active',
        value: 'Y',
      },
      {
        label: 'Inactive',
        value: 'N',
      },
    ],
    schema: z.string(),
  },
  {
    name: 'custom1Fld',
    label: 'Remarks',
    type: FieldType.TEXT,
    required: false,
    schema: z.string(),
  },
];

const TestParameterMasterCreate: React.FC = () => {
  const router = useRouter();

  const [testParameterMasterForm, setTestParameterMasterForm] =
    useState<TestParameterMasterForm>(
      formJson.reduce<TestParameterMasterForm>(
        (acc, field) => ({ ...acc, [field.name]: '' }),
        {} as TestParameterMasterForm,
      ),
    );

  const [errors, setErrors] = useState<Partial<TestParameterMasterForm>>({});
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    isSuccess: boolean;
  } | null>(null);

  const createUser = useMutation<void, Error, TestParameterMasterForm>({
    mutationKey: [ApiQueryKey.testParametermaster],
    mutationFn: testParameterMasterCreate,
    onSuccess: () => {
      setToastMessage({
        text: 'test Parameter Master created successfully!',
        isSuccess: true,
      });
      router.push(Navigation.TestParameterMaster);
    },
    onError: (error) => {
      setToastMessage({ text: error.message, isSuccess: false });
      console.error('Error creating user:', error);
    },
  });

  const validateForm = useCallback(
    (testParameterMasterForm: TestParameterMasterForm) => {
      const newErrors: Partial<TestParameterMasterForm> = {};
      formJson.forEach((field) => {
        try {
          field.schema.parse(
            testParameterMasterForm[field.name as keyof TestParameterMasterForm],
          );
        } catch (error) {
          if (error instanceof ZodError) {
            const zodError: ZodError = error;
            newErrors[field.name as keyof TestParameterMasterForm] = zodError.issues
              .map((issue) => issue.message)
              .join(', ');
          } else {
            newErrors[field.name as keyof TestParameterMasterForm] = 'Invalid value';
          }
        }
      });
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [testParameterMasterForm],
  );

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
    const updatedTestPackageForm = { ...testParameterMasterForm };
    formJson.forEach((field) => {
      updatedTestPackageForm[field.name as keyof TestParameterMasterForm] = formData.get(
        field.name,
      ) as string;
    });
    setTestParameterMasterForm({ ...updatedTestPackageForm });
    if (!validateForm(updatedTestPackageForm)) return;
    createUser.mutate(updatedTestPackageForm);
  };

  const handleCancel = () => {
    setTestParameterMasterForm(
      formJson.reduce(
        (acc, field) => ({ ...acc, [field.name]: field.required ? '' : undefined }),
        {} as TestParameterMasterForm,
      ),
    );
    router.push(Navigation.TestParameterMaster);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold">Create New Test Parameter Master</h2>

      {formJson.map((field) => (
        <Box key={field.name} className="flex flex-col space-y-2">
          <Field {...field} />
          {errors[field.name as keyof TestParameterMasterForm] && (
            <p className="text-red-500 text-sm">
              {errors[field.name as keyof TestParameterMasterForm]}
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

export default TestParameterMasterCreate;
