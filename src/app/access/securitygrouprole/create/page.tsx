'use client';
import {
  getAccessGroup,
  getAccessRole,
  SecurityGrouproleCreate,
  SecurityGroupRoleForm,
} from '@/api';
import { Field } from '@/components';
import { ApiQueryKey } from '@/constants/QueryKey';
import { Navigation, PageTitle } from '@/constants';
import { FieldAttributes, FieldType } from '@/types';
import { Box } from '@radix-ui/themes';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { z, ZodError } from 'zod';
import { useAppHeader } from '@/app/hooks/appHeader/page';
import * as Toast from '@radix-ui/react-toast';

interface Roledata {
  oidPkFld: number;
  nameFld: string;
}

interface Groupdata {
  oidPkFld: number;
  nameFld: string;
}

const formJson: FieldAttributes[] = [
  {
    name: 'securityRole',
    label: 'Security Role',
    type: FieldType.SELECT,
    required: true,
    options: [],
    schema: z.number().int().positive({ message: 'Please select a valid Role' }),
  },
  {
    name: 'securityGroup',
    label: 'Security Group',
    type: FieldType.SELECT,
    required: true,
    options: [],
    schema: z.number().int().positive({ message: 'Please select a valid group' }),
  },
];

const SecurityGroupRoleCreate: React.FC = () => {
  const router = useRouter();
  const { updateTitle } = useAppHeader();

  useEffect(() => {
    updateTitle(PageTitle.RoleGroupCreate);
  }, [updateTitle, PageTitle]);
  const [errors, setErrors] = useState<Partial<SecurityGroupRoleForm>>({});
  const [roleOptions, setRoleOptions] = useState<{ label: string; value: string }[]>([]);
  const [groupOptions, setGroupOptions] = useState<{ label: string; value: string }[]>(
    [],
  );

  const [securityGroupRoleForm, setSecurityGroupRoleForm] =
    useState<SecurityGroupRoleForm>(
      formJson.reduce<SecurityGroupRoleForm>(
        (acc, field) => ({ ...acc, [field.name]: '' }),
        {} as SecurityGroupRoleForm,
      ),
    );

  const [toastMessage, setToastMessage] = useState<{
    text: string;
    isSuccess: boolean;
  } | null>(null);

  const createSecurityGroupRole = useMutation<void, Error, SecurityGroupRoleForm>({
    mutationKey: [ApiQueryKey.SecurityGroupRoleCreate],
    mutationFn: SecurityGrouproleCreate,
    onSuccess: () => {
      setToastMessage({
        text: 'SecurityGroupRole created successfully!',
        isSuccess: true,
      });
      router.push(Navigation.AccessSecurityGroupRole);
    },
    onError: (error) => {
      setToastMessage({ text: error.message, isSuccess: false });
      console.error('Error creating user:', error);
    },
  });

  const fetchRoleOptions = async () => {
    try {
      const result = await getAccessRole();
      const formattedOptions = result.data.map((role: Roledata) => ({
        label: role.nameFld,
        value: role.oidPkFld.toString(),
      }));
      setRoleOptions(formattedOptions);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchGroupOptions = async () => {
    try {
      const result = await getAccessGroup();
      const formattedOptions = result.data.map((group: Groupdata) => ({
        label: group.nameFld,
        value: group.oidPkFld.toString(),
      }));
      setGroupOptions(formattedOptions);
    } catch (error) {
      console.error('Error fetching privileges:', error);
    }
  };

  useEffect(() => {
    fetchRoleOptions();
    fetchGroupOptions();
  }, []);

  const validateForm = useCallback((formData: SecurityGroupRoleForm) => {
    const newErrors: Partial<SecurityGroupRoleForm> = {};
    formJson.forEach((field) => {
      try {
        field.schema.parse(formData[field.name as keyof SecurityGroupRoleForm]);
      } catch (error) {
        if (error instanceof ZodError) {
          newErrors[field.name as keyof SecurityGroupRoleForm] = error.issues
            .map((issue) => issue.message)
            .join(', ');
        } else {
          newErrors[field.name as keyof SecurityGroupRoleForm] = 'Invalid value';
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
    const updatedForm: SecurityGroupRoleForm = { ...securityGroupRoleForm };

    formJson.forEach((field) => {
      const value = formData.get(field.name);
      if (field.name === 'securityRole' || field.name === 'securityGroup') {
        const parsedValue = value ? parseInt(value as string, 10) : NaN;
      updatedForm[field.name as keyof SecurityGroupRoleForm] =
      isNaN(parsedValue) ? 0 : parsedValue;  
    } else {
      updatedForm[field.name as keyof SecurityGroupRoleForm] = value as string;
    }
  });

    setSecurityGroupRoleForm(updatedForm);

    if (!validateForm(updatedForm)) return;
    createSecurityGroupRole.mutate(updatedForm);
  };

  const handleCancel = () => {
    setSecurityGroupRoleForm(
      formJson.reduce(
        (acc, field) => ({ ...acc, [field.name]: field.required ? '' : undefined }),
        {} as SecurityGroupRoleForm,
      ),
    );
    router.push(Navigation.AccessSecurityGroupRole);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formJson.map((field) => {
        const fieldWithOptions = {
          ...field,
          options:
            field.name === 'securityRole'
              ? roleOptions
              : field.name === 'securityGroup'
                ? groupOptions
                : [],
        };

        return (
          <Box key={fieldWithOptions.name} className="flex flex-col space-y-2">
            <Field {...fieldWithOptions} />
            {errors[fieldWithOptions.name as keyof SecurityGroupRoleForm] && (
              <p className="text-red-500 text-sm">
                {errors[fieldWithOptions.name as keyof SecurityGroupRoleForm]}
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
          disabled={createSecurityGroupRole.status === 'pending'}
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

export default SecurityGroupRoleCreate;
