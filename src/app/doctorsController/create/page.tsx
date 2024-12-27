'use client';
import React, { use, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { ApiQueryKey } from '@/constants/QueryKey';
import { Navigation, PageTitle } from '@/constants';
import { Field } from '@/components';
import { Box } from '@radix-ui/themes';
import { FieldAttributes, FieldType } from '@/types';
import { z, ZodError } from 'zod';
import { useAppHeader } from '@/app/hooks/appHeader';
import * as Toast from '@radix-ui/react-toast';
import { doctorCreate, CreateDoctor, getDoctorsList } from '@/api/doctor';
import { getUserList } from '@/api';


interface DoctorUserData {
    oidPkFld: number;
    firstNameFld: string;
}

const formJson: FieldAttributes[] = [
    {
        name: 'doctorNameFld',
        label: 'Doctor Name',
        type: FieldType.TEXT,
        required: true,
        schema: z.string().min(1, 'Doctor Name is required'),
    },
    {
        name: 'doctorEmailFld',
        label: 'Email',
        type: FieldType.TEXT,
        required: true,
        schema: z.string().email({ message: 'Invalid email address' }),
    },
    {
        name: 'doctorPhoneFld',
        label: 'Phone',
        type: FieldType.TEXT,
        required: true,
        schema: z
            .string()
            .max(10, {
                message: 'Phone number must be 10 characters',
            })
            .min(10, {
                message: 'Phone number must be 10 characters',
            }),
    },
    {
        name: 'doctorMobileFld',
        label: 'Mobile',
        type: FieldType.TEXT,
        required: true,
        schema: z
            .string()
            .max(10, {
                message: 'Phone number must be 10 characters',
            })
            .min(10, {
                message: 'Phone number must be 10 characters',
            }),
    },
    {
        name: 'doctorSpecialityFld',
        label: 'Specialty',
        type: FieldType.TEXT,
        required: true,
        schema: z.string().min(1, 'Specialty is required'),
    },
    {
        name: 'doctorExperienceFld',
        label: 'Experience',
        type: FieldType.TEXT,
        required: true,
        schema: z.string().min(1, 'Experience is required'),
    },
    {
        name: 'doctorQualificationFld',
        label: 'Qualification',
        type: FieldType.TEXT,
        required: true,
        schema: z.string().min(1, 'Qualification is required'),
    },
    {
        name: 'doctorIsActiveFld',
        label: 'Active',
        type: FieldType.SELECT,
        required: true,
        options: [
            {
                label: 'Active',
                value: 'Y',
            },
            {
                label: 'Inactive',
                value: 'N',
            },
        ],
        schema: z.string().min(1, 'Select Active Status'),
    },
    {
        name: 'userIdFkFld',
        label: 'User ID',
        type: FieldType.SELECT,
        required: false,
        options: [],
        schema: z.string().min(1, 'Select User '),
    },
    {
        name: 'doctorRemarksFld',
        label: 'Remarks',
        type: FieldType.TEXT,
        required: false,
        schema: z.string(),
    }
]

const DoctorCreate: React.FC = () => {
    const router = useRouter();
    const { updateTitle } = useAppHeader();
    const [testOptions, setTestOptions] = useState<{ label: string; value: string }[]>([]);


    useEffect(() => {
        updateTitle(PageTitle.DoctorsCreate);
    }, [updateTitle, PageTitle]);


    const [createDoctor, setCreateDoctor] = useState<CreateDoctor>(
        formJson.reduce<CreateDoctor>(
            (acc, field) => ({ ...acc, [field.name]: '' }),
            {} as CreateDoctor,
        ),
    );

    const [errors, setErrors] = useState<Partial<CreateDoctor>>({});
    const [toastMessage, setToastMessage] = useState<{
        text: string;
        isSuccess: boolean;
    } | null>(null);


    const createUser = useMutation<void, Error, CreateDoctor>({
        mutationKey: [ApiQueryKey.doctorsCreate],
        mutationFn: doctorCreate,
        onSuccess: () => {
            setToastMessage({ text: 'Doctor Profile created successfully!', isSuccess: true });
            router.push(Navigation.doctorsList);
        },
        onError: (error) => {
            setToastMessage({ text: error.message, isSuccess: false });
            console.error('Error creating user:', error);
        },
    });

    const validateForm = useCallback(
        (createDoctor: CreateDoctor) => {
            const newErrors: Partial<CreateDoctor> = {};
            formJson.forEach((field) => {
                try {
                    field.schema.parse(createDoctor[field.name as keyof CreateDoctor]);
                } catch (error) {
                    if (error instanceof ZodError) {
                        const zodError: ZodError = error;
                        newErrors[field.name as keyof CreateDoctor] = zodError.issues
                            .map((issue) => issue.message)
                            .join(', ');
                    } else {
                        newErrors[field.name as keyof CreateDoctor] = 'Invalid value';
                    }
                }
            });
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        },
        [createDoctor],
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
        const updateDoctorForm: CreateDoctor = { ...createDoctor };
        formJson.forEach((field) => {
            updateDoctorForm[field.name as keyof CreateDoctor] = formData.get(
                field.name,
            ) as string;
        });
        setCreateDoctor({ ...updateDoctorForm });
        if (!validateForm(updateDoctorForm)) return;
        createUser.mutate(updateDoctorForm);
    };

    const handleCancel = () => {
        setCreateDoctor(
            formJson.reduce(
                (acc, field) => ({ ...acc, [field.name]: field.required ? '' : undefined }),
                {} as CreateDoctor,
            ),
        );
        router.push(Navigation.doctorsList);
    };

    const fetchUserOptions = async () => {
        try {
            const { data } = await getUserList();
            const options = data.map((user: DoctorUserData) => ({
                label: user.firstNameFld,
                value: user.oidPkFld.toString(),
            }));
            setTestOptions(options);
            setCreateDoctor((prev) => ({
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
                        {errors[fieldWithOptions.name as keyof CreateDoctor] && (
                            <p className="text-red-500 text-sm">
                                {errors[fieldWithOptions.name as keyof CreateDoctor]}
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
                    disabled={createUser.status === 'pending'}
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

export default DoctorCreate;
