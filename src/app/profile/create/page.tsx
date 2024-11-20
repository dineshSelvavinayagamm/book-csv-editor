'use client';
import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { ApiQueryKey } from '@/constants/QueryKey';
import { userCreate, ProfileForm } from '@/api/User';
import { Navigation } from '@/constants';
import { Field } from '@/components';
import { Box } from '@radix-ui/themes';
import { FieldAttributes, FieldType } from '@/types';
import { z, ZodError } from 'zod';

const formJson: FieldAttributes[] = [
  {
    name: 'userTypeFld',
    label: 'User Type',
    type: FieldType.TEXT,
    required: false,
    schema: z.string(),
  },
  {
    name: 'userNameFld',
    label: 'User Name',
    type: FieldType.TEXT,
    required: false,
    schema: z.string(),
  },
  {
    name: 'titleFld',
    label: 'Title',
    type: FieldType.SELECT,
    required: false,
    options: [
      {
        label: 'Mr',
        value: 'Mr',
      },
      {
        label: 'Mrs',
        value: 'Mrs',
      },
    ],
    schema: z.string(),
  },
  {
    name: 'firstNameFld',
    label: 'First Name',
    type: FieldType.TEXT,
    required: true,
    schema: z.string(),
  },
  {
    name: 'middleNameFld',
    label: 'Middle Name',
    type: FieldType.TEXT,
    required: false,
    schema: z.string(),
  },
  {
    name: 'lastNameFld',
    label: 'Last Name',
    type: FieldType.TEXT,
    required: false,
    schema: z.string(),
  },
  {
    name: 'employeeIdFKFld',
    label: 'Employee ID',
    type: FieldType.TEXT,
    required: false,
    schema: z.string(),
  },
  {
    name: 'emailFld',
    label: 'Email',
    type: FieldType.TEXT,
    required: false,
    schema: z.string().email({ message: 'Invalid email address' }),
  },
  {
    name: 'phoneFld',
    label: 'Phone Number',
    type: FieldType.TEXT,
    required: true,
    schema: z
      .string()
      .max(10, {
        message: 'Phone number must be 10 characters',
      })
      .min(10, {
        message: 'Phone number must be 10 characters',
      }),
  },
  {
    name: 'mobileFld',
    label: 'Mobile Number',
    type: FieldType.TEXT,
    schema: z
      .string()
      .max(10, {
        message: 'Mobile number must be 10 characters',
      })
      .min(10, {
        message: 'Mobile number must be 10 characters',
      }),
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
    name: 'remarksFld',
    label: 'Remarks',
    type: FieldType.TEXT,
    required: false,
    schema: z.string(),
  },
  {
    name: 'passwordFld',
    label: 'Password',
    type: FieldType.TEXT,
    required: false,
    schema: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  },
];

const ProfileCreate: React.FC = () => {
  const router = useRouter();

  const [profileForm, setProfileForm] = useState<ProfileForm>(
    formJson.reduce<ProfileForm>(
      (acc, field) => ({ ...acc, [field.name]: '' }),
      {} as ProfileForm,
    ),
  );

  const [errors, setErrors] = useState<Partial<ProfileForm>>({});

  const createUser = useMutation<void, Error, ProfileForm>({
    mutationKey: [ApiQueryKey.userCreate],
    mutationFn: userCreate,
    onSuccess: () => {
      router.push(Navigation.Profile);
    },
    onError: (error) => {
      console.error('Error creating user:', error);
    },
  });

  const validateForm = useCallback(
    (profileForm: ProfileForm) => {
      const newErrors: Partial<ProfileForm> = {};
      formJson.forEach((field) => {
        try {
          field.schema.parse(profileForm[field.name as keyof ProfileForm]);
        } catch (error) {
          if (error instanceof ZodError) {
            const zodError: ZodError = error;
            newErrors[field.name as keyof ProfileForm] = zodError.issues
              .map((issue) => issue.message)
              .join(', ');
          } else {
            newErrors[field.name as keyof ProfileForm] = 'Invalid value';
          }
        }
      });
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [profileForm],
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedProfileForm = { ...profileForm };
    formJson.forEach((field) => {
      updatedProfileForm[field.name as keyof ProfileForm] = formData.get(
        field.name,
      ) as string;
    });
    setProfileForm({ ...updatedProfileForm });
    if (!validateForm(updatedProfileForm)) return;
    createUser.mutate(updatedProfileForm);
  };

  const handleCancel = () => {
    setProfileForm(
      formJson.reduce(
        (acc, field) => ({ ...acc, [field.name]: field.required ? '' : undefined }),
        {} as ProfileForm,
      ),
    );
    router.push(Navigation.Profile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold">Create New Profile</h2>

      {formJson.map((field) => (
        <Box key={field.name} className="flex flex-col space-y-2">
          <Field {...field} />
          {errors[field.name as keyof ProfileForm] && (
            <p className="text-red-500 text-sm">
              {errors[field.name as keyof ProfileForm]}
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
    </form>
  );
};

export default ProfileCreate;
