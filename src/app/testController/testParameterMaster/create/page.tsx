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
import { testParameterMasterCreate, TestParameterMasterForm } from '@/api';
import { useAppHeader } from '@/app/hooks/appHeader/page';
import * as Toast from '@radix-ui/react-toast';

const testParameterSchema = z.object({
  testParameterNameFld: z.string().nonempty('Test Parameter Name is required'),
  testParameterIDFld: z.string().nonempty('Test Parameter ID is required'),
  parameterAliaseFld: z.string().nonempty('Parameter Aliase is required'),
  descriptionFld: z.string().nonempty('Description is required'),
  isActiveFld: z.enum(['Y', 'N'], {
    errorMap: () => ({ message: 'Active status must be selected' }),
  }),
  custom1Fld: z.string().optional(),
});

const formJson: FieldAttributes[] = [
  {
    name: 'testParameterNameFld',
    label: 'Test Parameter Name',
    type: FieldType.TEXT,
    schema: z.string().nonempty('Test Parameter Name is required'),
  },
  {
    name: 'testParameterIDFld',
    label: 'Test Parameter ID',
    type: FieldType.TEXT,
    schema: z.string().nonempty('Test Parameter ID is required'),
  },
  {
    name: 'parameterAliaseFld',
    label: 'Parameter Aliase',
    type: FieldType.TEXT,
    schema: z.string().nonempty('Parameter Aliase is required'),
  },
  {
    name: 'descriptionFld',
    label: 'Description',
    type: FieldType.TEXT,
    schema: z.string().nonempty('Description is required'),
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
    schema: z.string().optional(),
  },
];

const TestParameterMasterCreate: React.FC = () => {
  const router = useRouter();
  const { updateTitle } = useAppHeader();

  useEffect(() => {
    updateTitle(PageTitle.TestParameterMasterCreate);
  }, [updateTitle]);

  const [testParameterMasterForm, setTestParameterMasterForm] =
    useState<TestParameterMasterForm>({
      testParameterNameFld: '',
      testParameterIDFld: '',
      parameterAliaseFld: '',
      descriptionFld: '',
      isActiveFld: '',
      custom1Fld: '',
    });

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
        text: 'Test Parameter Master created successfully!',
        isSuccess: true,
      });
      router.push(Navigation.TestParameterMaster);
    },
    onError: (error) => {
      setToastMessage({ text: error.message, isSuccess: false });
      console.error('Error creating user:', error);
    },
  });

  const validateForm = useCallback((formData: TestParameterMasterForm) => {
    try {
      testParameterSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Partial<TestParameterMasterForm> = {};
        error.errors.forEach((issue) => {
          newErrors[issue.path[0] as keyof TestParameterMasterForm] = issue.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, []);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedForm = Object.fromEntries(
      formJson.map((field) => [field.name, formData.get(field.name)]),
    ) as TestParameterMasterForm;

    setTestParameterMasterForm(updatedForm);

    if (!validateForm(updatedForm)) return;

    createUser.mutate(updatedForm);
  };

  const handleCancel = () => {
    setTestParameterMasterForm({
      testParameterNameFld: '',
      testParameterIDFld: '',
      parameterAliaseFld: '',
      descriptionFld: '',
      isActiveFld: '',
      custom1Fld: '',
    });
    router.push(Navigation.TestParameterMaster);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
