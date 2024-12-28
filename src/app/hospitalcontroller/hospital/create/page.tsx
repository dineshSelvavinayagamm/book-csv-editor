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
import { HospitalUserCreate, Hospitalform } from '@/api/hospitalcontrol';


const formJson: FieldAttributes[] = [
    {
        name: 'hospitalNameFld',
        label: 'Hospital Name',
        type: FieldType.TEXT,
        required: true,
        schema: z.string().nonempty('HospitalName is required'),
    },

    {
        name: 'hospitalAddressFld',
        label: 'Hospital Address',
        type: FieldType.TEXT,
        required: true,
        schema: z.string().nonempty('HospitalAddress is required'),
    },
    {
        name: 'hospitalPhoneFld',
        label: 'Hospital Phone_No',
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
        name: 'hospitalMobileFld',
        label: 'Hospital Mobile_No',
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
        name: 'hospitalEmailFld',
        label: 'Hospital Email',
        type: FieldType.TEXT,
        required: true,
        schema: z.string().nonempty('HospitalEmail is required'),
    },

    {
        name: 'hospitalIsActiveFld',
        label: 'Hospital Active',
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
        schema: z.string().nonempty('Hospital Active is required'),
    },
    {
        name: 'hospitalRemarksFld',
        label: 'Hospital Remarks',
        type: FieldType.TEXT,
        required: true,
        schema: z.string(),
    },
];

const HospitalCreate: React.FC = () => {
    const router = useRouter();
    const { updateTitle } = useAppHeader();

    useEffect(() => {
        updateTitle(PageTitle.HospitalCreate);
    }, [updateTitle, PageTitle]);

    const [Hospitalform, setHospitalform] = useState<Hospitalform>(
        formJson.reduce<Hospitalform>(
            (acc, field) => ({ ...acc, [field.name]: '' }),
            {} as Hospitalform,
        ),
    );

    const [errors, setErrors] = useState<Partial<Hospitalform>>({});
    const [toastMessage, setToastMessage] = useState<{
        text: string;
        isSuccess: boolean;
    } | null>(null);

    const createHospital = useMutation<void, Error, Hospitalform>({
        mutationKey: [ApiQueryKey.Hospitalusercreate],
        mutationFn: HospitalUserCreate,
        onSuccess: () => {
            setToastMessage({ text: 'Hospitaluser created successfully!', isSuccess: true });
            router.push(Navigation.Hospitallist);
        },
        onError: (error) => {
            setToastMessage({ text: error.message, isSuccess: false });
            console.error('Error creating user:', error);
        },
    });

    const validateForm = useCallback(
        (Hospitalform: Hospitalform) => {
            const newErrors: Partial<Hospitalform> = {};
            formJson.forEach((field) => {
                try {
                    field.schema.parse(Hospitalform[field.name as keyof Hospitalform]);
                } catch (error) {
                    if (error instanceof ZodError) {
                        const zodError: ZodError = error;
                        newErrors[field.name as keyof Hospitalform] = zodError.issues
                            .map((issue) => issue.message)
                            .join(', ');
                    } else {
                        newErrors[field.name as keyof Hospitalform] = 'Invalid value';
                    }
                }
            });
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        },
        [Hospitalform],
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
        const updatedHospitalForm = { ...Hospitalform };
        formJson.forEach((field) => {
            updatedHospitalForm[field.name as keyof Hospitalform] = formData.get(
                field.name,
            ) as string;
        });
        setHospitalform({ ...updatedHospitalForm });
        if (!validateForm(updatedHospitalForm)) return;
        createHospital.mutate(updatedHospitalForm);
    };

    const handleCancel = () => {
        setHospitalform(
            formJson.reduce(
                (acc, field) => ({ ...acc, [field.name]: field.required ? '' : undefined }),
                {} as Hospitalform,
            ),
        );
        router.push(Navigation.Hospitallist);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {formJson.map((field) => (
                <Box key={field.name} className="flex flex-col space-y-2">
                    <Field {...field} />
                    {errors[field.name as keyof Hospitalform] && (
                        <p className="text-red-500 text-sm">
                            {errors[field.name as keyof Hospitalform]}
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
                    disabled={createHospital.status === 'pending'}
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

export default HospitalCreate;
