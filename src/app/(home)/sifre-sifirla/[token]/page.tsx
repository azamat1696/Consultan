"use client"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { resetPassword } from "./action"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { useParams } from "next/navigation"
export default function ResetPasswordPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const [formData, setFormData] = useState({
        password: "",
        passwordConfirm: ""
    })
    const params = useParams()
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setIsLoading(true)
            
            if (formData.password !== formData.passwordConfirm) {
                toast.error("Şifreler uyuşmuyor")
                return
            }

            await resetPassword(params.token as string, formData.password)
            toast.success("Şifreniz başarıyla değiştirildi")
            router.push("/signin")
        } catch (error: any) {
            toast.error(error.message || "Bir hata oluştu")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className="min-h-[600px] flex items-center justify-center bg-[url('/images/consultant-bg.jpg')] bg-cover bg-center bg-no-repeat">
            <div className="w-full max-w-md mx-auto p-6">
                <div className="text-center mb-8">
                    <h1 className="text-red-500 text-2xl font-bold mb-2">Yeni Şifre Belirleme</h1>
                    <p className="text-gray-800 font-medium">
                        Lütfen yeni şifrenizi belirleyin.
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Yeni Şifre
                            </label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    required
                                    className="w-full pr-10"
                                    placeholder="Yeni şifreniz"
                                    disabled={isLoading}
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
                                Yeni Şifre Tekrar
                            </label>
                            <div className="relative">
                                <Input
                                    type={showPasswordConfirm ? "text" : "password"}
                                    value={formData.passwordConfirm}
                                    onChange={(e) => setFormData({...formData, passwordConfirm: e.target.value})}
                                    required
                                    className="w-full pr-10"
                                    placeholder="Yeni şifrenizi tekrar girin"
                                    disabled={isLoading}
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
                            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md"
                            disabled={isLoading}
                        >
                            {isLoading ? "İşleniyor..." : "Şifremi Değiştir"}
                        </Button>
                    </form>
                </div>
            </div>
        </section>
    )
} 