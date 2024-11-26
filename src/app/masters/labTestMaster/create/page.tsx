'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { ApiQueryKey } from '@/constants/QueryKey';
import { Navigation, PageTitle } from '@/constants';
import { Box } from '@radix-ui/themes';
import { FieldAttributes, FieldType } from '@/types';
import { z, ZodError } from 'zod';
import { useAppHeader } from '@/app/hooks/appHeader';
import * as Toast from '@radix-ui/react-toast';
import {
  createLabTestMaster,
  getBusinessEntityType,
  getTestMaster,
  LabTestMasterForm,
  TestPriceForm,
} from '@/api';
import { Field } from '@/components';

interface LabTestMasterData {
  oidPkFld: number;
  testNameFld: string;
}
interface BusinessTypeData {
  oidPkFld: number;
  valueFld: string;
}

const formJson: FieldAttributes[] = [
  {
    name: 'labTestFKFld',
    label: 'Test Name',
    type: FieldType.SELECT,
    required: false,
    schema: z.string().min(1, { message: 'Test Name is required' }),
    options: [],
  },
  {
    name: 'businessTypeFKFld',
    label: 'Lab Name',
    type: FieldType.SELECT,
    required: false,
    schema: z.string().min(1, { message: 'Lab Name is required' }),
    options: [],
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
    schema: z.string().min(1, { message: 'Active must be Select' }),
  },
];

const LabTestMasterCreate: React.FC = () => {
  const router = useRouter();
  const { updateTitle } = useAppHeader();

  useEffect(() => {
    updateTitle(PageTitle.LabTestMasterCreate);
  }, [updateTitle]);
  const [testPriceForm, setTestPriceForm] = useState<TestPriceForm>(
    formJson.reduce<TestPriceForm>(
      (acc, field) => ({ ...acc, [field.name]: '' }),
      {} as TestPriceForm,
    ),
  );
  const [labTestMasterForm, setLabTestMasterForm] = useState<LabTestMasterForm>(
    formJson.reduce<LabTestMasterForm>(
      (acc, field) => ({ ...acc, [field.name]: '' }),
      {} as LabTestMasterForm,
    ),
  );
  const [testOptions, setTestOptions] = useState<{ label: string; value: string }[]>([]);
  const [businessTypeOptions, setBusinessTypeOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    isSuccess: boolean;
  } | null>(null);
  const [errors, setErrors] = useState<Partial<LabTestMasterForm>>({});

  const createUser = useMutation<void, Error, LabTestMasterForm>({
    mutationKey: [ApiQueryKey.labTestMasterCreate],
    mutationFn: createLabTestMaster,
    onSuccess: () => {
      setToastMessage({
        text: 'Lab Test Master created successfully!',
        isSuccess: true,
      });
      router.push(Navigation.LabTestMaster);
    },
    onError: (error) => {
      setToastMessage({ text: error.message, isSuccess: false });
      console.error('Error creating user:', error);
    },
  });

  const fetchTestMaster = async () => {
    try {
      const { data } = await getTestMaster();
      const options = data.map((test: LabTestMasterData) => ({
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

  const fetchBusinessType = async () => {
    try {
      const { data } = await getBusinessEntityType();
      const options = data.map((business: BusinessTypeData) => ({
        label: business.valueFld,
        value: business.oidPkFld.toString(),
      }));
      setBusinessTypeOptions(options);
      setLabTestMasterForm((prev) => ({
        ...prev,
        valueFld: options.length > 0 ? options[0].value : '',
      }));
    } catch (error) {
      console.error('Error fetching business type data:', error);
    }
  };

  useEffect(() => {
    fetchTestMaster();
    fetchBusinessType();
  }, []);

  const validateForm = useCallback(
    (profileForm: LabTestMasterForm) => {
      const newErrors: Partial<LabTestMasterForm> = {};
      formJson.forEach((field) => {
        try {
          field.schema.parse(profileForm[field.name as keyof LabTestMasterForm]);
        } catch (error) {
          if (error instanceof ZodError) {
            const zodError: ZodError = error;
            newErrors[field.name as keyof LabTestMasterForm] = zodError.issues
              .map((issue) => issue.message)
              .join(', ');
          } else {
            newErrors[field.name as keyof LabTestMasterForm] = 'Invalid value';
          }
        }
      });
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [labTestMasterForm, testPriceForm],
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
    const updatedLabTestMasterForm = { ...labTestMasterForm };
    formJson.forEach((field) => {
      const fieldValue = formData.get(field.name);

      if (field.name === 'testNameFKFld' || field.name === 'valueFld') {
        updatedLabTestMasterForm[field.name as keyof LabTestMasterForm] = fieldValue
          ? parseInt(fieldValue as string, 10)
          : undefined;
      } else {
        updatedLabTestMasterForm[field.name as keyof LabTestMasterForm] =
          fieldValue as string;
      }
    });
    setLabTestMasterForm({ ...updatedLabTestMasterForm });
    if (!validateForm(updatedLabTestMasterForm)) return;
    createUser.mutate(updatedLabTestMasterForm);
  };

  const handleCancel = () => {
    setLabTestMasterForm(
      formJson.reduce(
        (acc, field) => ({ ...acc, [field.name]: field.required ? '' : undefined }),
        {} as LabTestMasterForm,
      ),
    );
    router.push(Navigation.LabTestMaster);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formJson.map((field) => {
        const fieldWithOptions = {
          ...field,
          options:
            field.name === 'labTestFKFld'
              ? testOptions
              : field.name === 'businessTypeFKFld'
                ? businessTypeOptions
                : field.options,
        };

        return (
          <Box key={fieldWithOptions.name} className="flex flex-col space-y-2">
            <Field
              {...{ ...fieldWithOptions, options: fieldWithOptions.options ?? [] }}
            />
            {errors[fieldWithOptions.name as keyof LabTestMasterForm] && (
              <p className="text-red-500 text-sm">
                {errors[fieldWithOptions.name as keyof LabTestMasterForm]}
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

export default LabTestMasterCreate;
