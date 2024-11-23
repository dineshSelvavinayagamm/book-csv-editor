'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { ApiQueryKey } from '@/constants/QueryKey';
import { roleCreate, RoleForm  } from '@/api/User';
import { Navigation, PageTitle } from '@/constants';
import { Field } from '@/components';
import { Box } from '@radix-ui/themes';
import { z, ZodError } from 'zod';
import { FieldAttributes, FieldType } from '@/types';
import { useAppHeader } from '@/app/hooks/appHeader/page';
import * as Toast from '@radix-ui/react-toast';

const formJson: FieldAttributes[] = [
  {
    name: 'nameFld',
    label: 'Name',
    type: FieldType.TEXT,
    required: true,
    schema: z.string().nonempty('Name is required'),
  },
  {
    name: 'descriptionFld',
    label: 'Description',
    type: FieldType.TEXT,
    required: true,
    schema: z.string().nonempty('Description is required'),
  },
  {
    name: 'isSystemDefinedFld',
    label: 'System Defined',
    type: FieldType.SELECT,
    required: true,
    options: [
      {
        label: 'Yes',
        value: 'Y',
      },
      {
        label: 'No',
        value: 'N',
      },
    ],
    schema: z.string().nonempty('System Defined is required'),
  },
];
const RoleCreate: React.FC = () => {
  const router = useRouter();
  const { updateTitle } = useAppHeader();

  useEffect(() => {
    updateTitle(PageTitle.CreateSecurityRole);
  }, [updateTitle, PageTitle]);
  const [roleForm, setRoleForm] = useState<RoleForm>(
    formJson.reduce<RoleForm>(
      (acc, field) => ({ ...acc, [field.name]: '' }),
      {} as RoleForm,
    ),
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    isSuccess: boolean;
  } | null>(null);
  const createRole = useMutation<void, Error, RoleForm>({
    mutationKey: [ApiQueryKey.roleCreate],
    mutationFn: roleCreate,
    onSuccess: () => {
      setToastMessage({ text: 'Role created successfully!', isSuccess: true });
      router.push(Navigation.AccessRoles);
    },
    onError: (error) => {
      setToastMessage({ text: error.message, isSuccess: false });
      console.error('Error creating user:', error);
    },
  });

  const validateForm = useCallback(
    (roleForm: RoleForm) => {
      const newErrors: Record<string, string> = {};
      formJson.forEach((field) => {
        try {
          field.schema.parse(roleForm[field.name as keyof RoleForm]);
        } catch (error) {
          if (error instanceof ZodError) {
            const zodError: ZodError = error;
            newErrors[field.name as keyof RoleForm] = zodError.issues
              .map((issue) => issue.message)
              .join(', ');
          } else {
            newErrors[field.name as keyof RoleForm] = 'Invalid value';
          }
        }
      });
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [roleForm],
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
    const updatedRoleForm: RoleForm = {} as RoleForm;
    formJson.forEach((field) => {
      updatedRoleForm[field.name as keyof RoleForm] = formData.get(field.name) as string;
    });
    setRoleForm({ ...updatedRoleForm });
    if (!validateForm(updatedRoleForm)) return;
    createRole.mutate(updatedRoleForm);
  };

  const handleCancel = () => {
    setRoleForm(
      formJson.reduce<RoleForm>(
        (acc, field) => ({ ...acc, [field.name]: field.required ? '' : '' }),
        {} as RoleForm,
      ),
    );
    router.push(Navigation.AccessRoles);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formJson.map((field) => (
        <Box key={field.name} className="flex flex-col space-y-2">
          <Field {...field} />
          {errors[field.name as keyof RoleForm] && (
            <p className="text-red-500 text-sm">{errors[field.name as keyof RoleForm]}</p>
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
          //   disabled={createUser.status === 'pending'}
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
export default RoleCreate;
