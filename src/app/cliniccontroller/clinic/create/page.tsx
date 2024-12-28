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
import { ClinicUserCreate, ClinicForm } from '@/api/cliniccontrol';


const formJson: FieldAttributes[] = [
    {
        name: 'clinicNameFld',
        label: 'Clinic Name',
        type: FieldType.TEXT,
        required: true,
        schema: z.string().nonempty('Clinic Name is required'),
    },

    {
        name: 'clinicAddressFld',
        label: 'Clinic Address',
        type: FieldType.TEXT,
        required: true,
        schema: z.string().nonempty('Clinic Address is required'),
    },
    {
        name: 'clinicPhoneFld',
        label: 'Clinic Phone_No',
        type: FieldType.TEXT,
        required: true,
        schema: z.string().max(10, {
            message: 'Phone number must be 10 characters',
        })
            .min(10, {
                message: 'Phone number must be 10 characters',
            }),
    },
    {
        name: 'clinicMobileFld',
        label: 'Clinic Mobile_No',
        type: FieldType.TEXT,
        required: true,
        schema: z.string().max(10, {
            message: 'Phone number must be 10 characters',
        })
            .min(10, {
                message: 'Phone number must be 10 characters',
            }),
    },
    {
        name: 'clinicEmailFld',
        label: 'Clinic Email',
        type: FieldType.TEXT,
        required: true,
        schema: z.string().nonempty('Clinic Email is required'),
    },

    {
        name: 'clinicIsActiveFld',
        label: 'Clinic Active',
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
        schema: z.string().nonempty('Clinic Active is required'),
    },
    {
        name: 'clinicRemarksFld',
        label: 'Clinic Remarks',
        type: FieldType.TEXT,
        required: true,
        schema: z.string(),
    },
];

const ClinicCreate: React.FC = () => {
    const router = useRouter();
    const { updateTitle } = useAppHeader();

    useEffect(() => {
        updateTitle(PageTitle.clinicCreate);
    }, [updateTitle, PageTitle]);

    const [ClinicForm, setClinicForm] = useState<ClinicForm>(
        formJson.reduce<ClinicForm>(
            (acc, field) => ({ ...acc, [field.name]: '' }),
            {} as ClinicForm,
        ),
    );

    const [errors, setErrors] = useState<Partial<ClinicForm>>({});
    const [toastMessage, setToastMessage] = useState<{
        text: string;
        isSuccess: boolean;
    } | null>(null);

    const createClinic = useMutation<void, Error, ClinicForm>({
        mutationKey: [ApiQueryKey.clinicusercreate],
        mutationFn: ClinicUserCreate,
        onSuccess: () => {
            setToastMessage({ text: 'Clinicuser created successfully!', isSuccess: true });
            router.push(Navigation.Clinic);
        },
        onError: (error) => {
            setToastMessage({ text: error.message, isSuccess: false });
            console.error('Error creating user:', error);
        },
    });

    const validateForm = useCallback(
        (ClinicForm: ClinicForm) => {
            const newErrors: Partial<ClinicForm> = {};
            formJson.forEach((field) => {
                try {
                    field.schema.parse(ClinicForm[field.name as keyof ClinicForm]);
                } catch (error) {
                    if (error instanceof ZodError) {
                        const zodError: ZodError = error;
                        newErrors[field.name as keyof ClinicForm] = zodError.issues
                            .map((issue) => issue.message)
                            .join(', ');
                    } else {
                        newErrors[field.name as keyof ClinicForm] = 'Invalid value';
                    }
                }
            });
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        },
        [ClinicForm],
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
        const updatedClinicForm = { ...ClinicForm };
        formJson.forEach((field) => {
            updatedClinicForm[field.name as keyof ClinicForm] = formData.get(
                field.name,
            ) as string;
        });
        setClinicForm({ ...updatedClinicForm });
        if (!validateForm(updatedClinicForm)) return;
        createClinic.mutate(updatedClinicForm);
    };

    const handleCancel = () => {
        setClinicForm(
            formJson.reduce(
                (acc, field) => ({ ...acc, [field.name]: field.required ? '' : undefined }),
                {} as ClinicForm,
            ),
        );
        router.push(Navigation.Clinic);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {formJson.map((field) => (
                <Box key={field.name} className="flex flex-col space-y-2">
                    <Field {...field} />
                    {errors[field.name as keyof ClinicForm] && (
                        <p className="text-red-500 text-sm">
                            {errors[field.name as keyof ClinicForm]}
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
                    disabled={createClinic.status === 'pending'}
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

export default ClinicCreate;
