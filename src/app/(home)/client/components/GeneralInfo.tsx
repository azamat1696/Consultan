"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardBody, Input, Button } from '@heroui/react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { updateGeneralInfo } from '../actions';
import toast from "react-hot-toast";
import { getUserInfo } from '../actions';

type FormInputs = {
    name: string;
    surname: string;
    phone: string;
    email: string;
};

export default function GeneralInfo() {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormInputs>();

    const watchFields = watch(['name', 'surname', 'phone']);

    useEffect(() => {
        // Get user info
        if (session?.user?.id) {
            getUserInfo(Number(session.user.id)).then((response) => {
                if (response.success && response.data) {
                    setValue('name', response.data.name || '');
                    setValue('surname', response.data.surname || '');
                    setValue('phone', response.data.phone || '');
                    setValue('email', response.data.email || '');
                }
            });
        }
    }, [session?.user?.id, setValue]);

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        if (!session?.user?.id) {
            toast.error('Oturum bilgisi bulunamadı');
            return;
        }

        try {
            setIsLoading(true);
            const result = await updateGeneralInfo(Number(session.user.id), {
                name: data.name,
                surname: data.surname,
                phone: data.phone || null,
            });
            
            if(result.success){
                toast.success('Bilgileriniz başarıyla güncellendi');
                setIsLoading(false);
            } else {
                toast.error(result.error || 'Bir hata oluştu');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error updating info:', error);
            toast.error('Bilgiler güncellenirken bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardBody>
                <h2 className="text-xl font-semibold mb-6">Genel Bilgiler</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Input
                            label="Ad"
                            value={watch('name')}
                            {...register('name', { required: 'Ad zorunludur' })}
                            errorMessage={errors?.name?.message}
                        />
                    </div>
                    <div>
                        <Input
                            label="Soyad"
                            value={watch('surname')}
                            {...register('surname', { required: 'Soyad zorunludur' })}
                            errorMessage={errors.surname?.message}
                        />
                    </div>
                    <div>
                        <Input
                            label="E-posta"
                            type="email"
                            disabled
                            value={session?.user?.email || ''}
                        />
                        <p className="text-sm text-gray-500 mt-1">E-posta adresi değiştirilemez</p>
                    </div>
                    <div>
                        <Input
                            label="Telefon"
                            value={watch('phone')}
                            {...register('phone', {
                                pattern: {
                                    value: /^[0-9]{10}$/,
                                    message: 'Geçerli bir telefon numarası giriniz'
                                }
                            })}
                            placeholder="5XX XXX XX XX"
                            errorMessage={errors.phone?.message}
                        />
                    </div>
                    <Button 
                        type="submit" 
                        color="primary" 
                        className="w-full"
                        isLoading={isLoading}
                    >
                        Bilgileri Güncelle
                    </Button>
                </form>
            </CardBody>
        </Card>
    );
} 