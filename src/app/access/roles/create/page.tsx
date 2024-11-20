'use client';
import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { ApiQueryKey } from '@/constants/QueryKey';
import { roleCreate, RoleForm as OriginalRoleForm, RoleForm } from '@/api/User';
import { Navigation } from '@/constants';
import { Field } from '@/components';
import { Box } from '@radix-ui/themes';
import { z, ZodError } from 'zod';
import { FieldAttributes, FieldType } from '@/types';

const formJson: FieldAttributes[] = [
  {
    name: 'nameFld',
    label: 'Name',
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
    name: 'isSystemDefinedFld',
    label: 'System Defined',
    type: FieldType.SELECT,
    required: false,
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
    schema: z.string(),
  },
];
const RoleCreate: React.FC = () => {
  const router = useRouter();

  const [roleForm, setRoleForm] = useState<RoleForm>(
    formJson.reduce<RoleForm>(
      (acc, field) => ({ ...acc, [field.name]: '' }),
      {} as RoleForm,
    ),
  );

  const [errors, setErrors] = useState<Partial<RoleForm>>({});

  const createRole = useMutation<void, Error, RoleForm>({
    mutationKey: [ApiQueryKey.roleCreate],
    mutationFn: roleCreate,
    onSuccess: () => {
      router.push(Navigation.AccessRoles);
    },
    onError: (error) => {
      console.error('Error creating user:', error);
    },
  });

  const validateForm = useCallback(
    (roleForm: RoleForm) => {
      const newErrors: Partial<RoleForm> = {};
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedRoleForm = { ...roleForm };
    formJson.forEach((field) => {
      updatedRoleForm[field.name as keyof RoleForm] = formData.get(field.name) as string;
    });
    setRoleForm({ ...updatedRoleForm });
    if (!validateForm(updatedRoleForm)) return;
    createRole.mutate(updatedRoleForm);
  };

  const handleCancel = () => {
    setRoleForm(
      formJson.reduce(
        (acc, field) => ({ ...acc, [field.name]: field.required ? '' : undefined }),
        {} as RoleForm,
      ),
    );
    router.push(Navigation.AccessRoles);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold">Create New Roles</h2>

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
    </form>
  );
};
export default RoleCreate;
