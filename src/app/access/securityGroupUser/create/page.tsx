'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { ApiQueryKey } from '@/constants/QueryKey';
import { Navigation, PageTitle } from '@/constants';
import { Field } from '@/components';
import { Box } from '@radix-ui/themes';
import { z, ZodError } from 'zod';
import { FieldAttributes, FieldType } from '@/types';
import { accessSecurityGroupUserCreate, getAccessGroup, getUserList, SecurityGroupUserForm } from '@/api';
import { useAppHeader } from '@/app/hooks/appHeader';
import * as Toast from '@radix-ui/react-toast';

interface GroupData {
  oidPkFld: number;
  nameFld: string;
}

interface Userdata {
  oidPkFld: number;
  userTypeFld: string;
}

const formJson: FieldAttributes[] = [
  {
    name: 'securityGroup',
    label: 'Security Group',
    type: FieldType.SELECT,
    required: false,
    options: [],
    schema: z.number().int().positive({ message: 'Please select a valid group' }),
  },

  {
    name: 'user',
    label: 'User',
    type: FieldType.SELECT,
    required: false,
    options: [],
    schema: z.number().int().positive({ message: 'Please select a valid user' }),
  },
];

const SecurityGroupUserCreatePage: React.FC = () => {
  const router = useRouter();
  const { updateTitle } = useAppHeader();


  useEffect(() => {
    updateTitle(PageTitle.SecurityGroupUserCreate);
  }, [updateTitle, PageTitle]);
  const [errors, setErrors] = useState<Partial<SecurityGroupUserForm>>({});
  const [groupOptions, setGroupOptions] = useState<{ label: string; value: string }[]>([]);
  const [userOptions, setUserOptions] = useState<{ label: string; value: string }[]>([]);

  const [securityGroupUserForm, setSecurityGroupUserForm] = useState(
    formJson.reduce(
      (acc, field) => ({ ...acc, [field.name]: '' }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {} as Record<string, any>,
    ),
  );

  const [toastMessage, setToastMessage] = useState<{
    text: string;
    isSuccess: boolean;
  } | null>(null);

  const createSecurityGroupUser = useMutation<void, Error, SecurityGroupUserForm>({
    mutationKey: [ApiQueryKey.SecurityGroupUserCreate],
    mutationFn: accessSecurityGroupUserCreate,
    onSuccess: () => {
      setToastMessage({ text: 'SecurityGroupUser created successfully!', isSuccess: true });
      router.push(Navigation.SecurityGroupUser);
    },
    onError: (error) => {
      setToastMessage({ text: error.message, isSuccess: false });
      console.error('Error creating user:', error);
    },
  });

  const fetchGroupOptions = async () => {
    try {
      const result = await getAccessGroup();
      const options = result.data.map((group: GroupData) => ({
        label: group.nameFld,
        value: group.oidPkFld.toString(),
      }));

      setGroupOptions(options);
    } catch (error) {
      console.error('Error fetching  group:', error);
    }
  };

  const fetchUserOptions = async () => {
    try {
      const result = await getUserList();
      const options = result.data.map((user: Userdata) => ({
        label: user.userTypeFld,
        value: user.oidPkFld.toString(),
      }));
      setUserOptions(options);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    fetchGroupOptions();
    fetchUserOptions();
  }, []);

  const validateForm = useCallback(
    (profileForm: SecurityGroupUserForm) => {
      const newErrors: Record<string, string> = {};
      formJson.forEach((field) => {
        try {
          field.schema.parse(profileForm[field.name as keyof SecurityGroupUserForm]);
        } catch (error) {
          if (error instanceof ZodError) {
            const zodError: ZodError = error;
            newErrors[field.name as keyof SecurityGroupUserForm] = zodError.issues
              .map((issue) => issue.message)
              .join(', ');
          } else {
            newErrors[field.name as keyof SecurityGroupUserForm] = 'Invalid value';
          }
        }
      });
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [securityGroupUserForm],
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
    const updatedSecurityGroupUserForm = { ...securityGroupUserForm };

    formJson.forEach((field) => {
      const value = formData.get(field.name);
      if (field.name === 'securityGroup' || field.name === 'user') {
        const parsedValue = value ? parseInt(value as string, 10) : NaN;
        updatedSecurityGroupUserForm[field.name as keyof SecurityGroupUserForm] =
          isNaN(parsedValue) ? 0 : parsedValue;
      } else {
        updatedSecurityGroupUserForm[field.name as keyof SecurityGroupUserForm] = value as string;
      }
    });
    setSecurityGroupUserForm({ ...updatedSecurityGroupUserForm });

    if (!validateForm(updatedSecurityGroupUserForm)) return;
    createSecurityGroupUser.mutate(updatedSecurityGroupUserForm);
  };

  const handleCancel = () => {
    setSecurityGroupUserForm(
      formJson.reduce(
        (acc, field) => ({ ...acc, [field.name]: field.required ? '' : undefined }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {} as Record<string, any>,
      ),
    );
    router.push(Navigation.SecurityGroupUser);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formJson.map((field) => {
        const fieldWithoptions = {
          ...field,
          options: field.name === 'securityGroup' ? groupOptions : field.name == 'user' ? userOptions : []
        };

        return (
          <Box key={field.name} className="flex flex-col space-y-2">
            <Field
              {...fieldWithoptions}

            />
            {errors[fieldWithoptions.name as keyof SecurityGroupUserForm] && (
              <p className="text-red-500 text-sm">
                {errors[field.name as keyof SecurityGroupUserForm]}
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
        >
          Submit
        </button>
      </div>
      <Toast.Provider swipeDirection="right">
        {toastMessage && (
          <Toast.Root
            className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg ${toastMessage.isSuccess ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
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

export default SecurityGroupUserCreatePage;
