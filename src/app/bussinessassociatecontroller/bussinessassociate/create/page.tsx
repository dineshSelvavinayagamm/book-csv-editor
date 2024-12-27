'use client';
import { Field } from '@/components';
import { ApiQueryKey } from '@/constants/QueryKey';
import { Navigation, PageTitle } from '@/constants';
import { FieldAttributes, FieldType } from '@/types';
import { Box } from '@radix-ui/themes';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { z, ZodError } from 'zod';
import { useAppHeader } from '@/app/hooks/appHeader';
import * as Toast from '@radix-ui/react-toast';
import { BussinessAssociateUserCreate, BusinessAssociateform } from '@/api/businessassociatecontrol';
import { getUserList } from '@/api';

interface BussinessAssociateUserData {
    oidPkFld: number;
    firstNameFld: string;
}
const formJson: FieldAttributes[] = [
    {
        name: 'businessAssociateNameFld',
        label: 'BusinessAssociate Name',
        type: FieldType.TEXT,
        required: true,
        schema: z.string().nonempty('BusinessAssociate Name is required'),
    },

    {
        name: 'businessAssociateAddressFld',
        label: 'BusinessAssociate Address',
        type: FieldType.TEXT,
        required: true,
        schema: z.string().nonempty('BusinessAssociate Address is required'),
    },
    {
        name: 'businessAssociatePhoneFld',
        label: 'BusinessAssociate Phone_No',
        type: FieldType.TEXT,
        required: true,
        schema: z.string().nonempty('BusinessAssociate Phone_No is required'),
    },
    {
        name: 'businessAssociateMobileFld',
        label: 'BusinessAssociate Mobile_No',
        type: FieldType.TEXT,
        required: true,
        schema: z.string().nonempty('BusinessAssociate Mobile_No is required'),
    },
    {
        name: 'businessAssociateEmailFld',
        label: 'BusinessAssociate Email',
        type: FieldType.TEXT,
        required: true,
        schema: z.string().nonempty('BusinessAssociate Email is required'),
    },

    {
        name: 'businessAssociateIsActiveFld',
        label: 'BusinessAssociate Active',
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
        schema: z.string().nonempty('BusinessAssociate Active is required'),
    },

    {
        name: 'userIdFkFld',
        label: 'User Name',
        type: FieldType.SELECT,
        required: false,
        options: [],
        schema: z.number().int().positive({ message: 'Please select a valid user' }),
    },
];

const BussinessAssociateCreate: React.FC = () => {
    const router = useRouter();
    const { updateTitle } = useAppHeader();
    const [testOptions, setTestOptions] = useState<{ label: string; value: string }[]>([]);


    const [createBusinessAssociate, setCreateBusinessAssociate] = useState<BusinessAssociateform>(
        formJson.reduce<BusinessAssociateform>(
            (acc, field) => ({ ...acc, [field.name]: '' }),
            {} as BusinessAssociateform,
        ),
    );


    useEffect(() => {
        updateTitle(PageTitle.BussinessAssociateCreate);
    }, [updateTitle, PageTitle]);

    const [BusinessAssociateform, setBusinessAssociateform] = useState<BusinessAssociateform>(
        formJson.reduce<BusinessAssociateform>(
            (acc, field) => ({ ...acc, [field.name]: '' }),
            {} as BusinessAssociateform,
        ),
    );

    const [errors, setErrors] = useState<Partial<BusinessAssociateform>>({});
    const [toastMessage, setToastMessage] = useState<{
        text: string;
        isSuccess: boolean;
    } | null>(null);

    const createBussinessAssociate = useMutation<void, Error, BusinessAssociateform>({
        mutationKey: [ApiQueryKey.BussinessAssociateUserCreate],
        mutationFn: BussinessAssociateUserCreate,
        onSuccess: () => {
            setToastMessage({ text: 'BussinessAssociateuser created successfully!', isSuccess: true });
            router.push(Navigation.BusinessAssociate);
        },
        onError: (error) => {
            setToastMessage({ text: error.message, isSuccess: false });
            console.error('Error creating user:', error);
        },
    });

    const validateForm = useCallback(
        (BusinessAssociateform: BusinessAssociateform) => {
            const newErrors: Partial<BusinessAssociateform> = {};
            formJson.forEach((field) => {
                try {
                    field.schema.parse(BusinessAssociateform[field.name as keyof BusinessAssociateform]);
                } catch (error) {
                    if (error instanceof ZodError) {
                        const zodError: ZodError = error;
                        newErrors[field.name as keyof BusinessAssociateform] = zodError.issues
                            .map((issue) => issue.message)
                            .join(', ');
                    } else {
                        newErrors[field.name as keyof BusinessAssociateform] = 'Invalid value';
                    }
                }
            });
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        },
        [BusinessAssociateform],
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
        const updatedBusinessAssociateform = { ...BusinessAssociateform };
        formJson.forEach((field) => {
            updatedBusinessAssociateform[field.name as keyof BusinessAssociateform] = formData.get(
                field.name,
            ) as string;
        });
        setBusinessAssociateform({ ...updatedBusinessAssociateform });
        if (!validateForm(updatedBusinessAssociateform)) return;
        createBussinessAssociate.mutate(updatedBusinessAssociateform);
    };

    const handleCancel = () => {
        setBusinessAssociateform(
            formJson.reduce(
                (acc, field) => ({ ...acc, [field.name]: field.required ? '' : undefined }),
                {} as BusinessAssociateform,
            ),
        );
        router.push(Navigation.BusinessAssociate);
    };

    const fetchUserOptions = async () => {
        try {
            const { data } = await getUserList();
            const options = data.map((user: BussinessAssociateUserData) => ({
                label: user.firstNameFld,
                value: user.oidPkFld.toString(),
            }));
            setTestOptions(options);
            setCreateBusinessAssociate((prev) => ({
                ...prev,
                userIdFkFld: options.length > 0 ? options[0].value : '',
            }));
        } catch (error) {
            console.error('Error fetching user list:', error);
        }
    };


    useEffect(() => {
        fetchUserOptions();
    }, []);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {formJson.map((field) => {
                const fieldWithOptions =
                    field.name === 'userIdFkFld' ? { ...field, options: testOptions }
                        : field;
                return (
                    <Box key={fieldWithOptions.name} className="flex flex-col space-y-2">
                        <Field {...fieldWithOptions} />
                        {errors[fieldWithOptions.name as keyof BusinessAssociateform] && (
                            <p className="text-red-500 text-sm">
                                {errors[fieldWithOptions.name as keyof BusinessAssociateform]}
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
                    disabled={createBussinessAssociate.status === 'pending'}
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

export default BussinessAssociateCreate;
