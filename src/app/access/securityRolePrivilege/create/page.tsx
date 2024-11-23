'use client';
import {
  getAccessRole,
  getAccessPrivilege,
  SecurityRolePrivilegeForm,
  SecurityRolePrivilegeUserCreate,
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

interface RoleData {
  oidPkFld: number;
  nameFld: string;
}

interface PrivilegeData {
  oidPkFld: number;
  nameFld: string;
}

const formJson: FieldAttributes[] = [
  {
    name: 'securityRoleIdFKFld',
    label: 'Security Role Id',
    type: FieldType.SELECT,
    required: true,
    options: [],
    schema: z.string().nonempty('Please select a valid Role'),
  },
  {
    name: 'securityPrivilegeIdFKFld',
    label: 'Security Privilege Id',
    type: FieldType.SELECT,
    required: true,
    options: [],
    schema: z.string().nonempty('Please select a valid Privilege'),
  },
];

const SecurityRolePrivilegeCreate: React.FC = () => {
  const router = useRouter();
  const { updateTitle } = useAppHeader();

  useEffect(() => {
    updateTitle(PageTitle.RolePrivilegeCreate);
  }, [updateTitle, PageTitle]);
  const [errors, setErrors] = useState<Partial<SecurityRolePrivilegeForm>>({});
  const [roleOptions, setRoleOptions] = useState<{ label: string; value: string }[]>([]);
  const [privilegeOptions, setPrivilegeOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const [securityRolePrivilegeForm, setSecurityRolePrivilegeForm] = useState(
    formJson.reduce(
      (acc, field) => ({ ...acc, [field.name]: '' }),
      {} as Record<string, any>,
    ),
  );

  const [toastMessage, setToastMessage] = useState<{
    text: string;
    isSuccess: boolean;
  } | null>(null);

  const createSecurityRolePrivilege = useMutation<void, Error, SecurityRolePrivilegeForm>(
    {
      mutationKey: [ApiQueryKey.SecurityRolePrivilegeUserCreate],
      mutationFn: SecurityRolePrivilegeUserCreate,
      onSuccess: () => {
        setToastMessage({
          text: 'SecurityRolePrivilege created successfully!',
          isSuccess: true,
        });
        router.push(Navigation.SecurityRolePrivilege);
      },
      onError: (error) => {
        setToastMessage({ text: error.message, isSuccess: false });
        console.error('Error creating user:', error);
      },
    },
  );

  const fetchRoleOptions = async () => {
    try {
      const result = await getAccessRole();
      const formattedOptions = result.data.map((role: RoleData) => ({
        label: role.nameFld,
        value: role.oidPkFld.toString(),
      }));
      setRoleOptions(formattedOptions);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchPrivilegeOptions = async () => {
    try {
      const result = await getAccessPrivilege();
      const formattedOptions = result.data.map((privilege: PrivilegeData) => ({
        label: privilege.nameFld,
        value: privilege.oidPkFld.toString(),
      }));
      setPrivilegeOptions(formattedOptions);
    } catch (error) {
      console.error('Error fetching privileges:', error);
    }
  };

  useEffect(() => {
    fetchRoleOptions();
    fetchPrivilegeOptions();
  }, []);

  const validateForm = useCallback((formData: SecurityRolePrivilegeForm) => {
    const newErrors: Record<string, string> = {};
    formJson.forEach((field) => {
      try {
        field.schema.parse(formData[field.name as keyof SecurityRolePrivilegeForm]);
      } catch (error) {
        if (error instanceof ZodError) {
          newErrors[field.name as keyof SecurityRolePrivilegeForm] = error.issues
            .map((issue) => issue.message)
            .join(', ');
        } else {
          newErrors[field.name as keyof SecurityRolePrivilegeForm] = 'Invalid value';
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
    const updatedForm = { ...securityRolePrivilegeForm };

    formJson.forEach((field) => {
      const value = formData.get(field.name);
      if (field.name === 'securityRoleIdFKFld' || field.name === 'securityPrivilegeIdFKFld') {
      
        const parsedValue = value ? parseInt(value as string, 10) : NaN;
        updatedForm[field.name as keyof SecurityRolePrivilegeForm] =
          isNaN(parsedValue) ? '' : parsedValue.toString();  
      } else {
        updatedForm[field.name as keyof SecurityRolePrivilegeForm] = value as string;
      }
    });
  
    setSecurityRolePrivilegeForm(updatedForm);
  
    if (!validateForm(updatedForm)) return;
    createSecurityRolePrivilege.mutate(updatedForm);
  };
  const handleCancel = () => {
    setSecurityRolePrivilegeForm(
      formJson.reduce(
        (acc, field) => ({ ...acc, [field.name]: field.required ? '' : undefined }),
        {} as Record<string, any>,
      ),
    );
    router.push(Navigation.SecurityRolePrivilege);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formJson.map((field) => {
        const fieldWithOptions = {
          ...field,
          options:
            field.name === 'securityRoleIdFKFld'
              ? roleOptions
              : field.name === 'securityPrivilegeIdFKFld'
                ? privilegeOptions
                : [],
        };

        return (
          <Box key={fieldWithOptions.name} className="flex flex-col space-y-2">
            <Field {...fieldWithOptions} />
            {errors[fieldWithOptions.name as keyof SecurityRolePrivilegeForm] && (
              <p className="text-red-500 text-sm">
                {errors[fieldWithOptions.name as keyof SecurityRolePrivilegeForm]}
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
          disabled={createSecurityRolePrivilege.status === 'pending'}
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

export default SecurityRolePrivilegeCreate;
