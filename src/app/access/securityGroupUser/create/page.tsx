'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { ApiQueryKey } from '@/constants/QueryKey';
import { Navigation } from '@/constants';
import { Field } from '@/components';
import { Box } from '@radix-ui/themes';
import { z, ZodError } from 'zod';
import { FieldAttributes, FieldType } from '@/types';
import { accessSecurityGroupUserCreate, getAccessGroup, getUserList, SecurityGroupUserForm } from '@/api';

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
    schema: z.number().int().positive({ message: 'Please select a valid group' }),  },

  {
    name: 'user', 
    label: 'User',
    type: FieldType.SELECT,
    required: false,
    options: [], 
    schema: z.number().int().positive({ message: 'Please select a valid user' }),  },
];

const SecurityGroupUserCreatePage: React.FC = () => {
  const router = useRouter();
  const [errors,setErrors] = useState<Partial<SecurityGroupUserForm>>({});
  const [groupOptions,setGroupOptions] = useState<{label: string; value: string }[]>([]);
  const [userOptions,setUserOptions] = useState<{label: string; value: string }[]>([]);

  const [securityGroupUserForm, setSecurityGroupUserForm] = useState<SecurityGroupUserForm>(
    formJson.reduce<SecurityGroupUserForm>(
      (acc, field) => ({ ...acc, [field.name]: '' }),
      {} as SecurityGroupUserForm,
    ),
  );

  

  const createSecurityGroupUser = useMutation<void, Error, SecurityGroupUserForm>({
    mutationKey: [ApiQueryKey.SecurityGroupUserCreate],
    mutationFn: accessSecurityGroupUserCreate,
    onSuccess: () => {
      router.push(Navigation.SecurityGroupUser);
    },
    onError: (error) => {
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
  },[]);

  const validateForm = useCallback(
    (profileForm: SecurityGroupUserForm) => {
      const newErrors: Partial<SecurityGroupUserForm> = {};
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

 

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedSecurityGroupUserForm = { ...securityGroupUserForm };

    formJson.forEach((field) => {
      const value = formData.get(field.name);
      updatedSecurityGroupUserForm[field.name as keyof SecurityGroupUserForm] = [
        'securityGroup',
        'user',
      ].includes(field.name)? parseInt( value as string, 10):( value as string);
    }); 

    setSecurityGroupUserForm({...updatedSecurityGroupUserForm});

    if (!validateForm(updatedSecurityGroupUserForm)) return;
    createSecurityGroupUser.mutate(updatedSecurityGroupUserForm);
  };

  const handleCancel = () => {
    setSecurityGroupUserForm(
      formJson.reduce(
        (acc, field) => ({ ...acc, [field.name]: field.required ? '' : undefined }),
        {} as SecurityGroupUserForm,
      ),
    );
    router.push(Navigation.SecurityGroupUser);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold">Create New SecurityGroupUser</h2>

      {formJson.map((field) => {
        const fieldWithoptions ={
          ...field,
          options: field.name === 'securityGroup' ? groupOptions : field.name == 'user' ? userOptions : []
        };

        return(
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
    </form>
  );
};

export default SecurityGroupUserCreatePage;
