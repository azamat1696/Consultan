"use client"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import HowItWorksSection from "@/components/HowItWorksSection";
import {registerConsultant} from "@/app/(home)/danisman/kayit-ol/action";
import { useRouter } from 'next/navigation'
import toast from "react-hot-toast";
export default function ConsultantRegistrationSection() {
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        passwordConfirm: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            // Check if passwords match
            if (formData.password !== formData.passwordConfirm) {
                toast.error("Şifreler uyuşmuyor");
                return;
            }

            // API call to register consultant
            const data = await registerConsultant(formData);

            
            if (data.success) {
                toast.success(data.message);
                return router.push("/signin");
            } else {
                toast.error(data.message);
            }
        } catch (error: any) {
            // Hata mesajını göster
            toast.error(error.message || "Kayıt sırasında bir hata oluştu");
        }
    }

    return (
        <>
            <section
                className="min-h-[600px] flex items-center justify-center bg-[url('/images/consultant-bg.jpg')] bg-cover bg-center bg-no-repeat">
                <div className="w-full max-w-md mx-auto p-6">
                    <div className="text-center mb-8">
                        <h1 className="text-[#35303E] text-2xl font-bold mb-2">Danışman Ol</h1>
                      {/*
                      
                        <p className="text-gray-800 font-medium mb-2">
                            33 ayrı kategoride online danışmanlık hizmetini
                            veren Türkiye'nin en büyük danışmanlık platformudur.
                        </p>
                        <p className="text-gray-800 font-medium">
                            Siz de istediğiniz kategoride danışman profilinizi oluşturabilirsiniz.
                        </p>
                      
                      */}
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    E-posta
                                </label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    required
                                    className="w-full"
                                    placeholder="E-posta adresiniz"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Şifre
                                </label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        required
                                        className="w-full pr-10"
                                        placeholder="Şifreniz"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400"/>
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400"/>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Şifre Tekrar
                                </label>
                                <div className="relative">
                                    <Input
                                        type={showPasswordConfirm ? "text" : "password"}
                                        value={formData.passwordConfirm}
                                        onChange={(e) => setFormData({...formData, passwordConfirm: e.target.value})}
                                        required
                                        className="w-full pr-10"
                                        placeholder="Şifrenizi tekrar girin"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPasswordConfirm ? (
                                            <EyeOff className="h-5 w-5 text-gray-400"/>
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400"/>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-[#35303E] hover:bg-[#6b607e] text-white py-2 rounded-md"
                            >
                                Danışman ol
                            </Button>
                        </form>
                    </div>
                </div>
            </section>
           {/* <HowItWorksSection /> */}
        </>
    )
}
