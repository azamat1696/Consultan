"use client";
import React, { useState } from 'react';
import { Card, CardBody, Input, Button } from '@heroui/react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useSession, signOut } from 'next-auth/react';
import { updatePassword } from '../actions';
import toast from "react-hot-toast";

type FormInputs = {
    currentPassword: string;
    password: string;
    passwordConfirm: string;
};

export default function PasswordReset() {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: '',
        password: '',
        passwordConfirm: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted with data:", formData);

        // Validation
        if (!formData.currentPassword) {
            toast.error('Mevcut şifre zorunludur');
            return;
        }
        if (!formData.password) {
            toast.error('Yeni şifre zorunludur');
            return;
        }
        if (formData.password.length < 8) {
            toast.error('Şifre en az 8 karakter olmalıdır');
            return;
        }
        if (formData.password !== formData.passwordConfirm) {
            toast.error('Şifreler eşleşmiyor');
            return;
        }
        if (!session?.user?.id) {
            toast.error('Oturum bilgisi bulunamadı');
            return;
        }

        try {
            setIsLoading(true);
            const result = await updatePassword(Number(session.user.id), {
                currentPassword: formData.currentPassword,
                password: formData.password
            });

            if (result.success) {
                toast.success('Şifreniz başarıyla güncellendi. Lütfen tekrar giriş yapın.');
                setFormData({
                    currentPassword: '',
                    password: '',
                    passwordConfirm: ''
                });
                // Sign out the user after successful password change
                setTimeout(() => {
                    signOut({ callbackUrl: '/signin' });
                }, 2000);
            } else {
                toast.error(result.error || 'Bir hata oluştu');
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            toast.error('Şifre güncellenirken bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (name: keyof FormInputs, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Card>
            <CardBody>
                <h2 className="text-xl font-semibold mb-6">Şifre Değiştir</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Input
                            type="password"
                            label="Mevcut Şifre"
                            value={formData.currentPassword}
                            onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                        />
                    </div>
                    <div>
                        <Input
                            type="password"
                            label="Yeni Şifre"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                        />
                    </div>
                    <div>
                        <Input
                            type="password"
                            label="Yeni Şifre (Tekrar)"
                            value={formData.passwordConfirm}
                            onChange={(e) => handleInputChange('passwordConfirm', e.target.value)}
                        />
                    </div>
                    <Button 
                        type="submit" 
                        color="danger" 
                        className="w-full"
                        isLoading={isLoading}
                    >
                        Şifreyi Güncelle
                    </Button>
                </form>
            </CardBody>
        </Card>
    );
} 