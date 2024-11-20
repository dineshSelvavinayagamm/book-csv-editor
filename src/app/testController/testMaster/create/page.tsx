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
import { getTestParameterMaster, testMasterCreate, TestMasterForm } from '@/api/Test';
import * as Toast from '@radix-ui/react-toast';

interface TestMasterData {
  oidPkFld: number;
  testParameterNameFld: string;
}

const formJson: FieldAttributes[] = [
  {
    name: 'testNameFld',
    label: 'Test Name',
    type: FieldType.TEXT,
    required: false,
    schema: z.string(),
  },
  {
    name: 'testIDFld',
    label: 'Test ID',
    type: FieldType.TEXT,
    required: false,
    schema: z.string(),
  },
  {
    name: 'testAliaseFld',
    label: 'Test Aliase',
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
    name: 'testParameterMasterFKFld',
    label: 'Test  Parameter Name',
    type: FieldType.SELECT,
    required: true,
    options: [],
    schema: z.any(),
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
    name: 'testCategoryFld',
    label: 'Test Category',
    type: FieldType.TEXT,
    required: false,
    schema: z.any(),
  },
];

const TestMasterCreate: React.FC = () => {
  const router = useRouter();

  const [testMasterForm, setTestMasterForm] = useState<TestMasterForm>(
    formJson.reduce<TestMasterForm>(
      (acc, field) => ({ ...acc, [field.name]: '' }),
      {} as TestMasterForm,
    ),
  );

  const [errors, setErrors] = useState<Partial<TestMasterForm>>({});
  const [testOptions, setTestOptions] = useState<{ label: string; value: string }[]>([]);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    isSuccess: boolean;
  } | null>(null);

  const createUser = useMutation<void, Error, TestMasterForm>({
    mutationKey: [ApiQueryKey.testMasterCreate],
    mutationFn: testMasterCreate,
    onSuccess: () => {
      setToastMessage({ text: 'Test Master created successfully!', isSuccess: true });
      router.push(Navigation.TestMaster);
    },
    onError: (error) => {
      setToastMessage({ text: error.message, isSuccess: false });
      console.error('Error creating user:', error);
    },
  });

  const validateForm = useCallback((testMasterForm: TestMasterForm) => {
    const newErrors: Partial<TestMasterForm> = {};
    formJson.forEach((field) => {
      try {
        field.schema.parse(testMasterForm[field.name as keyof TestMasterForm]);
      } catch (error) {
        if (error instanceof ZodError) {
          const zodError: ZodError = error;
          newErrors[field.name as keyof TestMasterForm] = zodError.issues
            .map((issue) => issue.message)
            .join(', ');
        } else {
          newErrors[field.name as keyof TestMasterForm] = 'Invalid value';
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  useEffect(() => {
    const fetchTestParameterMaster = async () => {
      try {
        const { data } = await getTestParameterMaster();
        const options = data.map((test: TestMasterData) => ({
          label: test.testParameterNameFld,
          value: test.oidPkFld.toString(),
        }));
        setTestOptions(options);
        setTestMasterForm((prev) => ({
          ...prev,
          testNameFKFld: options.length > 0 ? options[0].value : '',
        }));
      } catch (error) {
        console.error('Error fetching test master data:', error);
      }
    };

    fetchTestParameterMaster();
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
    const updatedTestMasterForm = { ...testMasterForm };

    formJson.forEach((field) => {
      const fieldValue = formData.get(field.name);

      if (field.name === 'testCategoryFld') {
        updatedTestMasterForm[field.name as keyof TestMasterForm] = fieldValue
          ? parseInt(fieldValue as string)
          : undefined;
      } else {
        updatedTestMasterForm[field.name as keyof TestMasterForm] = fieldValue as string;
      }
    });

    setTestMasterForm({ ...updatedTestMasterForm });

    if (!validateForm(updatedTestMasterForm)) return;

    createUser.mutate(updatedTestMasterForm);
  };

  const handleCancel = () => {
    setTestMasterForm(
      formJson.reduce(
        (acc, field) => ({ ...acc, [field.name]: field.required ? '' : undefined }),
        {} as TestMasterForm,
      ),
    );
    router.push(Navigation.TestMaster);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold">Create New Test Master</h2>

      {formJson.map((field) => {
        const fieldWithOptions =
          field.name === 'testParameterMasterFKFld'
            ? { ...field, options: testOptions }
            : field;

        return (
          <Box key={fieldWithOptions.name} className="flex flex-col space-y-2">
            <Field {...fieldWithOptions} />
            {errors[fieldWithOptions.name as keyof TestMasterForm] && (
              <p className="text-red-500 text-sm">
                {errors[fieldWithOptions.name as keyof TestMasterForm]}
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

export default TestMasterCreate;
