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
import { testPackageCreate, TestPackageForm } from '@/api';
import * as Toast from '@radix-ui/react-toast';
import { useAppHeader } from '@/app/hooks/appHeader/page';

const formJson: FieldAttributes[] = [
  {
    name: 'testPackageNameFld',
    label: 'Test Package Name',
    type: FieldType.TEXT,
    required: true,
    schema: z.string().min(1, 'Test Package Name is required'),
  },
  {
    name: 'testPackageIDFld',
    label: 'Test Package ID',
    type: FieldType.TEXT,
    required: true,
    schema: z.string().min(1, 'Test Package ID is required'),
  },
  {
    name: 'parameterAliaseFld',
    label: 'Aliase',
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
    label: 'Is Active',
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
    schema: z.enum(['Y', 'N'], {
      errorMap: () => ({ message: 'Active status must be selected' }),
    }),
  },
  {
    name: 'custom1Fld',
    label: 'Remarks',
    type: FieldType.TEXT,
    required: false,
    schema: z.string(),
  },
];

const TestPackageCreate: React.FC = () => {
  const router = useRouter();
  const { updateTitle } = useAppHeader();

  useEffect(() => {
    updateTitle(PageTitle.TestPackageCreate);
  }, [updateTitle]);

  const [testPackageForm, setTestPackageForm] = useState<TestPackageForm>(
    formJson.reduce<TestPackageForm>(
      (acc, field) => ({ ...acc, [field.name]: '' }),
      {} as TestPackageForm,
    ),
  );

  const [errors, setErrors] = useState<Partial<TestPackageForm>>({});
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    isSuccess: boolean;
  } | null>(null);

  const createUser = useMutation<void, Error, TestPackageForm>({
    mutationKey: [ApiQueryKey.testPackageCreate],
    mutationFn: testPackageCreate,
    onSuccess: () => {
      setToastMessage({ text: 'Test Package created successfully!', isSuccess: true });
      router.push(Navigation.TestPackage);
    },
    onError: (error) => {
      setToastMessage({ text: error.message, isSuccess: false });
      console.error('Error creating user:', error);
    },
  });

  const validateForm = useCallback((testPackageForm: TestPackageForm) => {
    const newErrors: Partial<TestPackageForm> = {};
    formJson.forEach((field) => {
      try {
        field.schema.parse(testPackageForm[field.name as keyof TestPackageForm]);
      } catch (error) {
        if (error instanceof ZodError) {
          const zodError: ZodError = error;
          newErrors[field.name as keyof TestPackageForm] = zodError.issues
            .map((issue) => issue.message)
            .join(', ');
        } else {
          newErrors[field.name as keyof TestPackageForm] = 'Invalid value';
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
    const updatedTestPackageForm = { ...testPackageForm };
    formJson.forEach((field) => {
      updatedTestPackageForm[field.name as keyof TestPackageForm] = formData.get(
        field.name,
      ) as string;
    });
    setTestPackageForm(updatedTestPackageForm);
    if (!validateForm(updatedTestPackageForm)) return;
    createUser.mutate(updatedTestPackageForm);
  };

  const handleCancel = () => {
    setTestPackageForm(
      formJson.reduce(
        (acc, field) => ({ ...acc, [field.name]: '' }),
        {} as TestPackageForm,
      ),
    );
    router.push(Navigation.TestPackage);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formJson.map((field) => (
        <Box key={field.name} className="flex flex-col space-y-2">
          <Field
            {...field}
            value={testPackageForm[field.name as keyof TestPackageForm]}
          />
          {errors[field.name as keyof TestPackageForm] && (
            <p className="text-red-500 text-sm">
              {errors[field.name as keyof TestPackageForm]}
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

export default TestPackageCreate;
