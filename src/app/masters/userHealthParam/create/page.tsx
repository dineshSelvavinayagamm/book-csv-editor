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
import * as Toast from '@radix-ui/react-toast';
import {
  getUserHealthParamCreate,
  UserHealthParamForm,
  getUserList,
  getBloodGroup,
} from '@/api';
import { useAppHeader } from '@/app/hooks/appHeader';

interface BloodGroupData {
  oidPkFld: number;
  longName_Fld: string;
}

interface UserFormData {
  oidPkFld: number;
  firstNameFld: string;
}

const formJson: FieldAttributes[] = [
  {
    name: 'userIdFKFld',
    label: 'User Name',
    type: FieldType.SELECT,
    required: true,
    options: [],
    schema: z.number().int().min(1, { message: 'Lab Name is required' }),
  },
  {
    name: 'heightFld',
    label: 'Height',
    type: FieldType.TEXT,
    required: true,
    schema: z.number().min(1, { message: 'Height is required' }).optional(),
  },
  {
    name: 'weightFld',
    label: 'Weight',
    type: FieldType.TEXT,
    required: true,
    schema: z.string().min(1, { message: 'Weight is required' }),
  },
  {
    name: 'bloodgroupFld',
    label: 'Blood Group',
    type: FieldType.SELECT,
    required: true,
    options: [],
    schema: z.number().int().min(1, { message: 'Blood Group is required' }),
  },
  {
    name: 'custom1Fld',
    label: 'Remarks',
    type: FieldType.TEXT,
    required: true,
    schema: z.string().min(1, { message: 'Remarks is required' }),
  },
];

const UserHealthParamCreate: React.FC = () => {
  const router = useRouter();
  const { updateTitle } = useAppHeader();

  useEffect(() => {
    updateTitle(PageTitle.UserHealthParamCreate);
  }, [updateTitle]);
  const [userHealthParamForm, setUserHealthParamForm] = useState<UserHealthParamForm>(
    formJson.reduce<UserHealthParamForm>(
      (acc, field) => ({ ...acc, [field.name]: '' }),
      {} as UserHealthParamForm,
    ),
  );

  const [errors, setErrors] = useState<Partial<UserHealthParamForm>>({});
  const [userOptions, setUserOptions] = useState<{ label: string; value: string }[]>([]);
  const [bloodGroupOptions, setBloodGroupOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    isSuccess: boolean;
  } | null>(null);

  const createUser = useMutation<void, Error, UserHealthParamForm>({
    mutationKey: [ApiQueryKey.userHealthParamCreate],
    mutationFn: getUserHealthParamCreate,
    onSuccess: () => {
      setToastMessage({
        text: 'User HealthParam created successfully!',
        isSuccess: true,
      });
      router.push(Navigation.UserHealthParam);
    },
    onError: (error) => {
      setToastMessage({ text: error.message, isSuccess: false });
      console.error('Error creating user:', error);
    },
  });

  const validateForm = useCallback(
    (profileForm: UserHealthParamForm) => {
      const newErrors: Partial<UserHealthParamForm> = {};
      formJson.forEach((field) => {
        try {
          field.schema.parse(profileForm[field.name as keyof UserHealthParamForm]);
        } catch (error) {
          if (error instanceof ZodError) {
            const zodError: ZodError = error;
            newErrors[field.name as keyof UserHealthParamForm] = zodError.issues
              .map((issue) => issue.message)
              .join(', ');
          } else {
            newErrors[field.name as keyof UserHealthParamForm] = 'Invalid value';
          }
        }
      });
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [],
  );

  const fetchUserOptions = async () => {
    try {
      const { data } = await getUserList();
      const options = data.map((user: UserFormData) => ({
        label: user.firstNameFld,
        value: user.oidPkFld.toString(),
      }));
      console.log('User Options:', options);
      setUserOptions(options);
    } catch (error) {
      console.error('Error fetching user list:', error);
    }
  };

  const fetchBloodGroupOptions = async () => {
    try {
      const { data } = await getBloodGroup();
      const options = data.map((group: BloodGroupData) => ({
        label: group.longName_Fld,
        value: group.oidPkFld.toString(),
      }));
      console.log('Blood Group Options:', options);
      setBloodGroupOptions(options);
    } catch (error) {
      console.error('Error fetching blood groups:', error);
    }
  };

  useEffect(() => {
    fetchUserOptions();
    fetchBloodGroupOptions();
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
    const updatedUserHealthParamForm = { ...userHealthParamForm };

    formJson.forEach((field) => {
      const value = formData.get(field.name);
      if (field.name === 'userIdFKFld' || field.name === 'heightFld' || field.name === 'bloodgroupFld') {
        const parsedValue = value ? parseInt(value as string, 10) : NaN;
        updatedUserHealthParamForm[field.name as keyof UserHealthParamForm] = 
        isNaN(parsedValue) ? 0 : parsedValue;  
    } else {
      updatedUserHealthParamForm[field.name as keyof UserHealthParamForm] = value as string;
    }
    });

    setUserHealthParamForm({ ...updatedUserHealthParamForm });

    if (!validateForm(updatedUserHealthParamForm)) return;
    createUser.mutate(updatedUserHealthParamForm);
  };

  const handleCancel = () => {
    setUserHealthParamForm(
      formJson.reduce(
        (acc, field) => ({ ...acc, [field.name]: field.required ? '' : undefined }),
        {} as UserHealthParamForm,
      ),
    );
    router.push(Navigation.UserHealthParam);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formJson.map((field) => {
        const fieldWithOptions = {
          ...field,
          options:
            field.name === 'userIdFKFld'
              ? userOptions
              : field.name === 'bloodgroupFld'
                ? bloodGroupOptions
                : undefined,
        };

        return (
          <Box key={fieldWithOptions.name} className="flex flex-col space-y-2">
            <Field
              {...{ ...fieldWithOptions, options: fieldWithOptions.options ?? [] }}
            />
            {errors[fieldWithOptions.name as keyof UserHealthParamForm] && (
              <p className="text-red-500 text-sm">
                {errors[fieldWithOptions.name as keyof UserHealthParamForm]}
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

export default UserHealthParamCreate;
