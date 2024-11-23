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
import { getUserList, userPreferenceCreate, UserPreferenceForm } from '@/api';
import * as Toast from '@radix-ui/react-toast';
import { useAppHeader } from '@/app/hooks/appHeader/page';

interface UserFormData {
  oidPkFld: number;
  firstNameFld: string;
}

const formJson: FieldAttributes[] = [
  {
    name: 'userIdFKFld',
    label: 'User Name',
    type: FieldType.SELECT,
    required: false,
    options: [],
    schema: z.number().int().min(1, { message: 'Lab Name is required' }),
  },
  {
    name: 'preferenceTypeFld',
    label: 'Preference Type',
    type: FieldType.TEXT,
    required: false,
    schema: z.number().min(1, { message: 'Preference Type is required' }),
  },
  {
    name: 'preferenceValueFld',
    label: 'Preference Value',
    type: FieldType.TEXT,
    required: false,
    schema: z.number().min(1, { message: 'Preference Value is required' }),
  },
];

const UserPreferenceCreate: React.FC = () => {
  const router = useRouter();
  const { updateTitle } = useAppHeader();

  useEffect(() => {
    updateTitle(PageTitle.UserPreferenceCreate);
  }, [updateTitle, PageTitle]);
 
  const [userPreferenceForm, setUserPreferenceForm] = useState(
    formJson.reduce(
      (acc, field) => ({ ...acc, [field.name]: '' }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {} as Record<string, any>,
    ),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [userOptions, setUserOptions] = useState<{ label: string; value: string }[]>([]);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    isSuccess: boolean;
  } | null>(null);

  const createUser = useMutation({
    mutationKey: [ApiQueryKey.userPreferenceCreate],
    mutationFn: userPreferenceCreate,
    onSuccess: () => {
      setToastMessage({ text: 'User preference created successfully!', isSuccess: true });
      router.push(Navigation.UserPreference);
    },
    onError: (error: Error) => {
      setToastMessage({ text: error.message, isSuccess: false });
      console.error('Error creating user:', error);
    },
  });

  const validateForm = useCallback(
    (profileForm: UserPreferenceForm) => {
      const newErrors: Record<string, string> = {};
      formJson.forEach((field) => {
        try {
          field.schema.parse(profileForm[field.name as keyof UserPreferenceForm]);
        } catch (error) {
          if (error instanceof ZodError) {
            const zodError: ZodError = error;
            newErrors[field.name as keyof UserPreferenceForm] = zodError.issues
              .map((issue) => issue.message)
              .join(', ');
          } else {
            newErrors[field.name as keyof UserPreferenceForm] = 'Invalid value';
          }
        }
      });
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [userPreferenceForm],
  );

  const fetchUserOptions = async () => {
    try {
      const { data } = await getUserList();
      setUserOptions(
        data.map((user: UserFormData) => ({
          label: user.firstNameFld,
          value: user.oidPkFld.toString(),
        })),
      );
    } catch (error) {
      console.error('Error fetching user list:', error);
    }
  };

  useEffect(() => {
    fetchUserOptions();
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedUserPreferenceForm: Record<string, any> = {};

    formJson.forEach((field) => {
      const value = formData.get(field.name);
      if (field.name === 'userIdFKFld' || field.name === 'preferenceTypeFld' || field.name === 'preferenceValueFld') {
        const parsedValue = value ? parseInt(value as string, 10) : NaN;
        updatedUserPreferenceForm[field.name as keyof UserPreferenceForm] = 
        isNaN(parsedValue) ? 0 : parsedValue;  
    } else {
      updatedUserPreferenceForm[field.name as keyof UserPreferenceForm] = value as string;
    }
    });

    const preferenceTypeFld = formData.get('preferenceTypeFld');
    const preferenceValueFld = formData.get('preferenceValueFld');
    const userIdFKFld = formData.get('userIdFKFld');

    updatedUserPreferenceForm.preferenceTypeFld = preferenceTypeFld
      ? Number(preferenceTypeFld)
      : null;
    updatedUserPreferenceForm.preferenceValueFld = preferenceValueFld
      ? Number(preferenceValueFld)
      : null;
    updatedUserPreferenceForm.userIdFKFld = userIdFKFld ? Number(userIdFKFld) : null;
    setUserPreferenceForm({ ...updatedUserPreferenceForm });
    if (!validateForm(updatedUserPreferenceForm)) return;
    createUser.mutate(updatedUserPreferenceForm);
  };

  const handleCancel = () => {
    setUserPreferenceForm(
      formJson.reduce(
        (acc, field) => ({ ...acc, [field.name]: field.required ? '' : undefined }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {} as Record<string, any>,
      ),
    );
    router.push(Navigation.UserPreference);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formJson.map((field) => {
        const fieldWithOptions = {
          ...field,
          options: field.name === 'userIdFKFld' ? userOptions : [],
        };
        return (
          <Box key={fieldWithOptions.name} className="flex flex-col space-y-2">
            <Field {...fieldWithOptions} />
            {errors[fieldWithOptions.name] && (
              <p className="text-red-500 text-sm">{errors[fieldWithOptions.name]}</p>
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

export default UserPreferenceCreate;
