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
import { testPackagePriceCreate, TestPackagePriceForm, getTestPackage } from '@/api';
import { useAppHeader } from '@/app/hooks/appHeader';
import * as Toast from '@radix-ui/react-toast';

const formJson: FieldAttributes[] = [
  {
    name: 'testPackageFKFld',
    label: 'Test Package',
    type: FieldType.SELECT,
    required: true,
    options: [],
    schema: z.number().min(1, 'Test Package is required'),
  },
  {
    name: 'priceFld',
    label: 'Price',
    type: FieldType.TEXT,
    required: false,
    schema: z.number().min(0, 'Price must be a positive number'),
  },
  {
    name: 'discountFld',
    label: 'Discount',
    type: FieldType.TEXT,
    required: false,
    schema: z.number().min(0, 'Discount must be a positive number'),
  },
  {
    name: 'isActiveFld',
    label: 'Active',
    type: FieldType.SELECT,
    required: true,
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
    schema: z.string().nonempty('Status must be selected'),
  },
  {
    name: 'custom1Fld',
    label: 'Remarks',
    type: FieldType.TEXT,
    required: false,
    schema: z.string().optional(),
  },
];

const TestPackagePriceCreate: React.FC = () => {
  const router = useRouter();
  const { updateTitle } = useAppHeader();

  useEffect(() => {
    updateTitle(PageTitle.TestPackagePriceCreate);
  }, [updateTitle, PageTitle]);

  const [testPackagePriceForm, setTestPackagePriceForm] = useState<TestPackagePriceForm>(
    formJson.reduce<TestPackagePriceForm>(
      (acc, field) => ({ ...acc, [field.name]: '' }),
      {} as TestPackagePriceForm,
    ),
  );

  const [errors, setErrors] = useState<Partial<TestPackagePriceForm>>({});
  const [testPackageOptions, setTestPackageOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    isSuccess: boolean;
  } | null>(null);

  const createUser = useMutation<void, Error, TestPackagePriceForm>({
    mutationKey: [ApiQueryKey.testPackagePriceCreate],
    mutationFn: testPackagePriceCreate,
    onSuccess: () => {
      setToastMessage({
        text: 'Test Package Price created successfully!',
        isSuccess: true,
      });
      router.push(Navigation.TestPackagePrice);
    },
    onError: (error) => {
      setToastMessage({ text: error.message, isSuccess: false });
      console.error('Error creating user:', error);
    },
  });

  const validateForm = useCallback(
    (testPackagePriceForm: TestPackagePriceForm) => {
      const newErrors: Partial<TestPackagePriceForm> = {};
      formJson.forEach((field) => {
        try {
          field.schema.parse(
            testPackagePriceForm[field.name as keyof TestPackagePriceForm],
          );
        } catch (error) {
          if (error instanceof ZodError) {
            const zodError: ZodError = error;
            newErrors[field.name as keyof TestPackagePriceForm] = zodError.issues
              .map((issue) => issue.message)
              .join(', ');
          } else {
            newErrors[field.name as keyof TestPackagePriceForm] = 'Invalid value';
          }
        }
      });
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [testPackagePriceForm],
  );

  const fetchTestPackages = async () => {
    try {
      const { data } = await getTestPackage();
      const options = data.map(
        (pkg: { oidPkFld: number; testPackageNameFld: string }) => ({
          label: pkg.testPackageNameFld,
          value: pkg.oidPkFld.toString(),
        }),
      );
      setTestPackageOptions(options);
    } catch (error) {
      console.error('Error fetching test package data:', error);
    }
  };

  useEffect(() => {
    fetchTestPackages();
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
    const updatedTestPackagePriceForm = { ...testPackagePriceForm };

    formJson.forEach((field) => {
      const value = formData.get(field.name) as string | number;

      if (field.name === 'priceFld' || field.name === 'discountFld') {
        updatedTestPackagePriceForm[field.name as keyof TestPackagePriceForm] =
          parseFloat(value as string);
      } else if (field.name === 'testPackageFKFld') {
        updatedTestPackagePriceForm[field.name as keyof TestPackagePriceForm] = parseInt(
          value as string,
          10,
        );
      } else {
        updatedTestPackagePriceForm[field.name as keyof TestPackagePriceForm] = value;
      }
    });

    setTestPackagePriceForm({ ...updatedTestPackagePriceForm });

    if (!validateForm(updatedTestPackagePriceForm)) return;
    createUser.mutate(updatedTestPackagePriceForm);
  };

  const handleCancel = () => {
    setTestPackagePriceForm(
      formJson.reduce(
        (acc, field) => ({ ...acc, [field.name]: field.required ? '' : undefined }),
        {} as TestPackagePriceForm,
      ),
    );
    router.push(Navigation.TestPackagePrice);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formJson.map((field) => {
        const fieldWithOptions =
          field.name === 'testPackageFKFld'
            ? { ...field, options: testPackageOptions }
            : field;

        return (
          <Box key={fieldWithOptions.name} className="flex flex-col space-y-2">
            <Field {...fieldWithOptions} />
            {errors[fieldWithOptions.name as keyof TestPackagePriceForm] && (
              <p className="text-red-500 text-sm">
                {errors[fieldWithOptions.name as keyof TestPackagePriceForm]}
              </p>
            )}
          </Box>
        );
      })}

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

export default TestPackagePriceCreate;
