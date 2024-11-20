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
import * as Toast from '@radix-ui/react-toast';
import { testPriceCreate, TestPriceForm, getTestMaster } from '@/api/Test';

interface TestMasterData {
  oidPkFld: number;
  testNameFld: string;
}

const initialFormJson: FieldAttributes[] = [
  {
    name: 'priceFld',
    label: 'Price',
    type: FieldType.TEXT,
    required: false,
    schema: z.number(),
  },
  {
    name: 'testNameFKFld',
    label: 'Test Name',
    type: FieldType.SELECT,
    required: true,
    options: [],
    schema: z.string(),
  },
  {
    name: 'discountFld',
    label: 'Discount',
    type: FieldType.TEXT,
    required: false,
    schema: z.number(),
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

const TestPriceCreate: React.FC = () => {
  const router = useRouter();
  const [testPriceForm, setTestPriceForm] = useState<TestPriceForm>(
    initialFormJson.reduce<TestPriceForm>(
      (acc, field) => ({ ...acc, [field.name]: '' }),
      {} as TestPriceForm,
    ),
  );

  const [errors, setErrors] = useState<Partial<TestPriceForm>>({});
  const [testOptions, setTestOptions] = useState<{ label: string; value: string }[]>([]);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    isSuccess: boolean;
  } | null>(null);

  const createUser = useMutation<void, Error, TestPriceForm>({
    mutationKey: [ApiQueryKey.testPriceCreate],
    mutationFn: testPriceCreate,
    onSuccess: () => {
      setToastMessage({ text: 'Test Price created successfully!', isSuccess: true });
      router.push(Navigation.TestPrice);
    },
    onError: (error) => {
      setToastMessage({ text: error.message, isSuccess: false });
      console.error('Error creating user:', error);
    },
  });

  const validateForm = useCallback((testPriceForm: TestPriceForm) => {
    const newErrors: Partial<TestPriceForm> = {};
    initialFormJson.forEach((field) => {
      try {
        field.schema.parse(testPriceForm[field.name as keyof TestPriceForm]);
      } catch (error) {
        if (error instanceof ZodError) {
          const zodError: ZodError = error;
          newErrors[field.name as keyof TestPriceForm] = zodError.issues
            .map((issue) => issue.message)
            .join(', ');
        } else {
          newErrors[field.name as keyof TestPriceForm] = 'Invalid value';
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  useEffect(() => {
    const fetchTestMaster = async () => {
      try {
        const { data } = await getTestMaster();
        const options = data.map((test: TestMasterData) => ({
          label: test.testNameFld,
          value: test.oidPkFld.toString(),
        }));
        setTestOptions(options);
        setTestPriceForm((prev) => ({
          ...prev,
          testNameFKFld: options.length > 0 ? options[0].value : '',
        }));
      } catch (error) {
        console.error('Error fetching test master data:', error);
      }
    };

    fetchTestMaster();
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
    const updatedTestPriceForm = { ...testPriceForm };

    initialFormJson.forEach((field) => {
      const fieldValue = formData.get(field.name);

      if (field.name === 'priceFld' || field.name === 'discountFld') {
        updatedTestPriceForm[field.name as keyof TestPriceForm] = fieldValue
          ? parseFloat(fieldValue as string)
          : undefined;
      } else {
        updatedTestPriceForm[field.name as keyof TestPriceForm] = fieldValue as string;
      }
    });

    setTestPriceForm(updatedTestPriceForm);

    if (!validateForm(updatedTestPriceForm)) return;

    createUser.mutate(updatedTestPriceForm);
  };

  const handleCancel = () => {
    setTestPriceForm(
      initialFormJson.reduce(
        (acc, field) => ({ ...acc, [field.name]: field.required ? '' : undefined }),
        {} as TestPriceForm,
      ),
    );
    router.push(Navigation.TestPrice);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold">Create New Test Price</h2>

      {initialFormJson.map((field) => {
        const fieldWithOptions =
          field.name === 'testNameFKFld' ? { ...field, options: testOptions } : field;

        return (
          <Box key={fieldWithOptions.name} className="flex flex-col space-y-2">
            <Field {...fieldWithOptions} />
            {errors[fieldWithOptions.name as keyof TestPriceForm] && (
              <p className="text-red-500 text-sm">
                {errors[fieldWithOptions.name as keyof TestPriceForm]}
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

export default TestPriceCreate;
