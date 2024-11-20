'use client';
import { PrivilegeUserCreate, PrivilegeForm } from '@/api/User';
import { Field } from '@/components';
import { ApiQueryKey } from '@/constants/QueryKey';
import { Navigation } from '@/constants';
import { FieldAttributes, FieldType } from '@/types';
import { Box } from '@radix-ui/themes';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useCallback, useState } from 'react';
import { z, ZodError } from 'zod';

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

const PrivilegeCreate: React.FC = () => {
  const router = useRouter();

  const [privilegeForm, setPrivilegeForm] = useState<PrivilegeForm>(
    formJson.reduce<PrivilegeForm>(
      (acc, field) => ({ ...acc, [field.name]: '' }),
      {} as PrivilegeForm,
    ),
  );

  const [errors, setErrors] = useState<Partial<PrivilegeForm>>({});

  const createPrivilege = useMutation<void, Error, PrivilegeForm>({
    mutationKey: [ApiQueryKey.PrivilegeUserCreate],
    mutationFn: PrivilegeUserCreate,
    onSuccess: () => {
      router.push(Navigation.AccessPrivilege);
    },
    onError: (error) => {
      console.error('Error creating user:', error);
    },
  });

  const validateForm = useCallback(
    (privilegeForm: PrivilegeForm) => {
      const newErrors: Partial<PrivilegeForm> = {};
      formJson.forEach((field) => {
        try {
          field.schema.parse(privilegeForm[field.name as keyof PrivilegeForm]);
        } catch (error) {
          if (error instanceof ZodError) {
            const zodError: ZodError = error;
            newErrors[field.name as keyof PrivilegeForm] = zodError.issues
              .map((issue) => issue.message)
              .join(', ');
          } else {
            newErrors[field.name as keyof PrivilegeForm] = 'Invalid value';
          }
        }
      });
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [privilegeForm],
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedPrivelegeForm = { ...privilegeForm };
    formJson.forEach((field) => {
      updatedPrivelegeForm[field.name as keyof PrivilegeForm] = formData.get(
        field.name,
      ) as string;
    });
    setPrivilegeForm({ ...updatedPrivelegeForm });
    if (!validateForm(updatedPrivelegeForm)) return;
    createPrivilege.mutate(updatedPrivelegeForm);
  };

  const handleCancel = () => {
    setPrivilegeForm(
      formJson.reduce(
        (acc, field) => ({ ...acc, [field.name]: field.required ? '' : undefined }),
        {} as PrivilegeForm,
      ),
    );
    router.push(Navigation.AccessPrivilege);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold">Create New Privilege</h2>

      {formJson.map((field) => (
        <Box key={field.name} className="flex flex-col space-y-2">
          <Field {...field} />
          {errors[field.name as keyof PrivilegeForm] && (
            <p className="text-red-500 text-sm">
              {errors[field.name as keyof PrivilegeForm]}
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
          disabled={createPrivilege.status === 'pending'}
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default PrivilegeCreate;
