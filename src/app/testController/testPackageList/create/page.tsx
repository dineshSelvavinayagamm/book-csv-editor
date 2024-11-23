'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { ApiQueryKey } from '@/constants/QueryKey';
import { Navigation, PageTitle } from '@/constants';
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
import { useAppHeader } from '@/app/hooks/appHeader';

interface PackageNameFormData {
  oidPkFld: number;
  testPackageNameFld: string;
}

interface TestNameData {
  oidPkFld: number;
  testNameFld: string;
}

const formJson: FieldAttributes[] = [
  {
    name: 'testPackageFKFld',
    label: 'Test Package Name',
    type: FieldType.SELECT,
    required: false,
    schema: z.number().optional(),
    options: [],
  },
  {
    name: 'labTestFKFld',
    label: 'Test Name',
    type: FieldType.SELECT,
    required: false,
    schema: z.number().optional(),
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
    schema: z.string().optional(),
  },
];

const schema = z.object({
  testPackageFKFld: z.number().min(1, { message: 'Test Package Name is required' }),
  labTestFKFld: z.number().min(1, { message: 'Test Name is required' }),
  isActiveFld: z.string().min(1, { message: 'Active status is required' }),
  custom1Fld: z.string().optional(),
});

const TestPackageListCreate: React.FC = () => {
  const router = useRouter();
  const { updateTitle } = useAppHeader();

  useEffect(() => {
    updateTitle(PageTitle.TestPackageListCreate);
  }, [updateTitle, PageTitle]);

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
    try {
      schema.parse(testPackageListForm);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Partial<TestPackageListForm> = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0] as keyof TestPackageListForm] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const fetchPackageNameOptions = async () => {
    try {
      const { data } = await getTestPackage();
      const options = data.map((user: PackageNameFormData) => ({
        label: user.testPackageNameFld,
        value: user.oidPkFld.toString(),
      }));
      setPackageNameOptions(options);
    } catch (error) {
      console.error('Error fetching user list:', error);
    }
  };

  const fetchTestNameOptions = async () => {
    try {
      const { data } = await getTestMaster();
      const options = data.map((group: TestNameData) => ({
        label: group.testNameFld,
        value: group.oidPkFld.toString(),
      }));
      setTestNameOptions(options);
    } catch (error) {
      console.error('Error fetching test names:', error);
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
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      aria-labelledby="test-package-list-form"
    >
      <h1 id="test-package-list-form" className="sr-only">
        Create Test Package List
      </h1>
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
              aria-describedby={`${fieldWithOptions.name}-error`}
            />
            {errors[fieldWithOptions.name as keyof TestPackageListForm] && (
              <p id={`${fieldWithOptions.name}-error`} className="text-red-500 text-sm">
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
          aria-label="Cancel form"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          disabled={createUser.status === 'pending'}
          aria-label="Submit form"
        >
          Submit
        </button>
      </div>
      <Toast.Provider swipeDirection="right">
        {toastMessage && (
          <Toast.Root
            open={toastMessage !== null}
            onOpenChange={() => setToastMessage(null)}
            className={`${
              toastMessage.isSuccess ? 'bg-green-500' : 'bg-red-500'
            } p-4 rounded-lg text-white`}
            aria-live="assertive"
          >
            {toastMessage.text}
          </Toast.Root>
        )}
      </Toast.Provider>
    </form>
  );
};

export default TestPackageListCreate;
