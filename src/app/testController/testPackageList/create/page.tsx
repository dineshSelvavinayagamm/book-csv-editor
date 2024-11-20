'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { ApiQueryKey } from '@/constants/QueryKey';
import { Navigation } from '@/constants';
import { Field } from '@/components';
import { Box } from '@radix-ui/themes';
import { FieldAttributes, FieldType } from '@/types';
import { z, ZodError } from 'zod';
import * as Toast from '@radix-ui/react-toast';
import {
  testPackageListCreate,
  TestPackageListForm,
  getTestPackage,
  getTestMaster,
} from '@/api';

interface packageNameFormData {
  oidPkFld: number;
  testPackageNameFld: string;
}

interface testNameData {
  oidPkFld: number;
  testParameterNameFld: string; 
}

const formJson: FieldAttributes[] = [
  {
    name: 'testPackageFKFld',
    label: 'Test Package Name',
    type: FieldType.SELECT,
    required: false,
    schema: z.number(),
    options: [],
  },
  {
    name: 'labTestFKFld',
    label: 'Test Name',
    type: FieldType.SELECT,
    required: false,
    schema: z.number(),
    options: [],
  },
  {
    name: 'isActiveFld',
    label: 'Active',
    type: FieldType.SELECT,
    required: false,
    options: [
      { label: 'Active', value: 'Y' },
      { label: 'Inactive', value: 'N' },
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

const TestPackageListCreate: React.FC = () => {
  const router = useRouter();
  const [packageNameOptions, setPackageNameOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [testNameOptions, setTestNameOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const [testPackageListForm, setTestPackageListForm] = useState<TestPackageListForm>(
    formJson.reduce<TestPackageListForm>(
      (acc, field) => ({ ...acc, [field.name]: '' }),
      {} as TestPackageListForm,
    ),
  );

  const [errors, setErrors] = useState<Partial<TestPackageListForm>>({});
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    isSuccess: boolean;
  } | null>(null);

  const createUser = useMutation<void, Error, TestPackageListForm>({
    mutationKey: [ApiQueryKey.testPackageListCreate],
    mutationFn: testPackageListCreate,
    onSuccess: () => {
      setToastMessage({
        text: 'Test Package List created successfully!',
        isSuccess: true,
      });
      router.push(Navigation.TestPackageList);
    },
    onError: (error) => {
      setToastMessage({ text: error.message, isSuccess: false });
      console.error('Error creating user:', error);
    },
  });

  const validateForm = (testPackageListForm: TestPackageListForm) => {
    const newErrors: Partial<TestPackageListForm> = {};
    formJson.forEach((field) => {
      try {
        field.schema.parse(testPackageListForm[field.name as keyof TestPackageListForm]);
      } catch (error) {
        if (error instanceof ZodError) {
          const zodError: ZodError = error;
          newErrors[field.name as keyof TestPackageListForm] = zodError.issues
            .map((issue) => issue.message)
            .join(', ');
        } else {
          newErrors[field.name as keyof TestPackageListForm] = 'Invalid value';
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchPackageNameOptions = async () => {
    try {
      const { data } = await getTestPackage();
      const options = data.map((user: packageNameFormData) => ({
        label: user.testPackageNameFld,
        value: user.oidPkFld.toString(),
      }));
      console.log('User Options:', options);
      setPackageNameOptions(options);
    } catch (error) {
      console.error('Error fetching user list:', error);
    }
  };

  const fetchTestNameOptions = async () => {
    try {
      const { data } = await getTestMaster();
      const options = data.map((group: testNameData) => ({
        label: group.testParameterNameFld,
        value: group.oidPkFld.toString(),
      }));
      console.log('Blood Group Options:', options);
      setTestNameOptions(options);
    } catch (error) {
      console.error('Error fetching blood groups:', error);
    }
  };

  useEffect(() => {
    fetchPackageNameOptions();
    fetchTestNameOptions();
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
    const updatedTestPackageListForm = { ...testPackageListForm };

    formJson.forEach((field) => {
      const fieldValue = formData.get(field.name);

      if (field.name === 'testPackageFKFld' || field.name === 'labTestFKFld') {
        updatedTestPackageListForm[field.name as keyof TestPackageListForm] = fieldValue
          ? parseInt(fieldValue as string, 10)
          : undefined;
      } else {
        updatedTestPackageListForm[field.name as keyof TestPackageListForm] =
          fieldValue as string;
      }
    });

    setTestPackageListForm(updatedTestPackageListForm);

    if (!validateForm(updatedTestPackageListForm)) return;

    createUser.mutate(updatedTestPackageListForm);
  };

  const handleCancel = () => {
    setTestPackageListForm(
      formJson.reduce(
        (acc, field) => ({ ...acc, [field.name]: field.required ? '' : undefined }),
        {} as TestPackageListForm,
      ),
    );
    router.push(Navigation.TestPackageList);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold">Create New Test Package List</h2>

      {formJson.map((field) => {
        const fieldWithOptions = {
          ...field,
          options:
            field.name === 'testPackageFKFld'
              ? packageNameOptions
              : field.name === 'labTestFKFld'
                ? testNameOptions
                : field.options,
        };

        return (
          <Box key={fieldWithOptions.name} className="flex flex-col space-y-2">
            <Field
              {...{ ...fieldWithOptions, options: fieldWithOptions.options ?? [] }}
            />
            {errors[fieldWithOptions.name as keyof TestPackageListForm] && (
              <p className="text-red-500 text-sm">
                {errors[fieldWithOptions.name as keyof TestPackageListForm]}
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

export default TestPackageListCreate;
