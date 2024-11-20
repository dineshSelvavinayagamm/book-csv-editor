'use client';
import { GroupUserCreate, GroupForm } from '@/api/User';
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
    label: 'Group Name',
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

const GroupCreate: React.FC = () => {
  const router = useRouter();

  const [GroupForm, setGroupForm] = useState<GroupForm>(
    formJson.reduce<GroupForm>(
      (acc, field) => ({ ...acc, [field.name]: '' }),
      {} as GroupForm,
    ),
  );

  const [errors, setErrors] = useState<Partial<GroupForm>>({});

  const createGroup = useMutation<void, Error, GroupForm>({
    mutationKey: [ApiQueryKey.GroupUserCreate],
    mutationFn: GroupUserCreate,
    onSuccess: () => {
      router.push(Navigation.AccessGroup);
    },
    onError: (error) => {
      console.error('Error creating user:', error);
    },
  });

  const validateForm = useCallback(
    (GroupForm: GroupForm) => {
      const newErrors: Partial<GroupForm> = {};
      formJson.forEach((field) => {
        try {
          field.schema.parse(GroupForm[field.name as keyof GroupForm]);
        } catch (error) {
          if (error instanceof ZodError) {
            const zodError: ZodError = error;
            newErrors[field.name as keyof GroupForm] = zodError.issues
              .map((issue) => issue.message)
              .join(', ');
          } else {
            newErrors[field.name as keyof GroupForm] = 'Invalid value';
          }
        }
      });
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [GroupForm],
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedGroupForm = { ...GroupForm };
    formJson.forEach((field) => {
      updatedGroupForm[field.name as keyof GroupForm] = formData.get(
        field.name,
      ) as string;
    });
    setGroupForm({ ...updatedGroupForm });
    if (!validateForm(updatedGroupForm)) return;
    createGroup.mutate(updatedGroupForm);
  };

  const handleCancel = () => {
    setGroupForm(
      formJson.reduce(
        (acc, field) => ({ ...acc, [field.name]: field.required ? '' : undefined }),
        {} as GroupForm,
      ),
    );
    router.push(Navigation.AccessGroup);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold">Create New Group</h2>

      {formJson.map((field) => (
        <Box key={field.name} className="flex flex-col space-y-2">
          <Field {...field} />
          {errors[field.name as keyof GroupForm] && (
            <p className="text-red-500 text-sm">
              {errors[field.name as keyof GroupForm]}
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
          disabled={createGroup.status === 'pending'}
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default GroupCreate;
