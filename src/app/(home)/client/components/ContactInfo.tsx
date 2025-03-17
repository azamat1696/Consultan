"use client"
import {useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {contactInfoRegister, getContactInfo} from "@/app/(home)/consultant/action";
import { Input,Button, Select, SelectItem } from "@heroui/react";
import toast from "react-hot-toast";


interface User {
    name: string;
    surname: string;
    gender: string;
    title: string;
    phone: string;
    profile_image?: string;
}
// Validation Schema
const formSchema = z.object({
    name: z.string().min(2, { message: "İsim en az 2 karakter olmalıdır" }),
    surname: z.string().min(2, { message: "Soyisim en az 2 karakter olmalıdır" }),
    gender: z.enum(["male", "female"], { message: "Cinsiyet seçimi zorunludur" }),
    title: z
        .string()
        .min(5, { message: "Ünvan en az 5 karakter olmalıdır" })
        .max(50, { message: "Ünvan 50 karakterden fazla olamaz" }),
    phone: z.string().regex(/^90\d{10}$/, {
        message: "Telefon numarası formatı geçersiz (905XXXXXXXXX)",
    }),
    image: z.any().optional()
});
const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23ccc' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

export default function ContactInfo() {
    const [user, setUser] = useState<User>();
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            surname: '',
            gender: '',
            title: '',
            phone: '',
            image: undefined
        }
    });

    const onSubmit = (data:any) => {
        console.log(data);
        contactInfoRegister(data).then((res:any) => {
            if (res) {
                setUser(res);
                toast.success("İletişim bilgileri başarıyla güncellendi");
            }
        }).catch((err) => {
            toast.error("İletişim bilgileri güncellenirken bir hata oluştu");
            console.error(err);
        });
    };
    useEffect(() => {
        getContactInfo().then((res:any) => {
            if (res) {
                setUser(res);
                reset({
                    name: res.name || '',
                    surname: res.surname || '',
                    gender: res.gender || '',
                    title: res.title || '',
                    phone: res.phone || ''
                });
            }
        });
    }, [reset]);
    return (
        <>
             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                {/* Profile Image */}
                                <div className="flex flex-col items-center gap-4 mb-6">
                                    <div className="relative">
                                        <img
                                            src={user?.profile_image ? 
                                                (typeof user.profile_image === 'string' ? user.profile_image : placeholderImage)
                                                : placeholderImage
                                            }
                                            alt="Profile"
                                            className="w-32 h-32 rounded-full object-cover bg-gray-100"
                                        />
                                        <Controller
                                            name="image"
                                            control={control}
                                            render={({ field }) => (
                                                <div className="absolute bottom-0 right-0">
                                                    <label htmlFor="profileImage">
                                                        <Button 
                                                            as="span"
                                                            isIconOnly 
                                                            color="primary" 
                                                            className="rounded-full cursor-pointer"
                                                            size="sm"
                                                        >
                                                            ✏️
                                                        </Button>
                                                    </label>
                                                    <Input
                                                        id="profileImage"
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const reader = new FileReader();
                                                                reader.onloadend = () => {
                                                                    const base64String = reader.result as string;
                                                                    setUser(prev => ({
                                                                        ...prev!,
                                                                        profile_image: base64String
                                                                    }));
                                                                    field.onChange(file);
                                                                };
                                                                reader.readAsDataURL(file);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        />
                                    </div>
                                    <p className="text-sm text-gray-500">Profil fotoğrafınızı değiştirmek için tıklayın</p>
                                </div>

                                {/* First Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        İsim
                                    </label>
                                    <Controller
                                        name="name"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                placeholder="İsminizi girin"
                                                className={`mt-1 w-full ${
                                                    errors.name ? "border-red-500" : "border-gray-300"
                                                }`}
                                            />
                                        )}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500 mt-1">
                                            {errors.name.message as string}
                                        </p>
                                    )}
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Soyisim
                                    </label>
                                    <Controller
                                        name="surname"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                placeholder="Soyisminizi girin"
                                                className={`mt-1 w-full ${
                                                    errors.surname ? "border-red-500" : "border-gray-300"
                                                }`}
                                            />
                                        )}
                                    />
                                    {errors.surname && (
                                        <p className="text-sm text-red-500 mt-1">
                                            {errors.surname.message as string}
                                        </p>
                                    )}
                                </div>

                                {/* Gender */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Cinsiyet 
                                    </label>
                                    <Controller
                                        name="gender"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <Select 
                                                label="Cinsiyet"
                                                selectedKeys={value ? [value] : []}
                                                onSelectionChange={(keys) => {
                                                    const selectedValue = Array.from(keys)[0];
                                                    onChange(selectedValue);
                                                }}
                                            >
                                                <SelectItem key="male" value="male">Erkek</SelectItem>
                                                <SelectItem key="female" value="female">Kadın</SelectItem>
                                            </Select>
                                        )}
                                    />
                                    {errors.gender && (
                                        <p className="text-sm text-red-500 mt-1">{errors.gender.message as string}</p>
                                    )}
                                </div>
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Ünvan
                                    </label>
                                    <Controller
                                        name="title"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                placeholder="Ünvanınızı girin"
                                                className={`mt-1 w-full ${
                                                    errors.title ? "border-red-500" : "border-gray-300"
                                                }`}
                                            />
                                        )}
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-red-500 mt-1">
                                            {errors.title.message as string}
                                        </p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Telefon
                                    </label>
                                    <Controller
                                        name="phone"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                placeholder="905XXXXXXXXX"
                                                className={`mt-1 w-full ${
                                                    errors.phone ? "border-red-500" : "border-gray-300"
                                                }`}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, "");
                                                    field.onChange(value);
                                                }}
                                            />
                                        )}
                                    />
                                    {errors.phone && (
                                        <p className="text-sm text-red-500 mt-1">
                                            {errors.phone.message as string}
                                        </p>
                                    )}
                                </div>

                                <Button type="submit" className="w-full bg-red-500 text-white">
                                    Kaydet
                                </Button>
                            </form>
        </>
    )
}