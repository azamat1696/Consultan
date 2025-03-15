"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {registerClient} from "@/app/(home)/kayit-ol/action";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast"
export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        passwordConfirm: "",
        acceptTerms: false
    })
    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
        passwordConfirm?: string;
    }>({})

    const validateForm = () => {
        const newErrors: typeof errors = {}

        if (!formData.email) {
            newErrors.email = "E-posta adresi gereklidir"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Geçerli bir e-posta adresi giriniz"
        }

        if (!formData.password) {
            newErrors.password = "Şifre gereklidir"
        } else if (formData.password.length < 6) {
            newErrors.password = "Şifre en az 6 karakter olmalıdır"
        }

        if (formData.password !== formData.passwordConfirm) {
            newErrors.passwordConfirm = "Şifreler eşleşmiyor"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return
       const data = await registerClient(formData)
       if (data) {
          toast.success("Kayıt başarılı bir şekilde gerçekleştirildi.")
          return router.push('/signin')
       }
    }

    return (
        <div className="min-h-screen flex items-start justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-6 sm:p-8 rounded-xl shadow-md">
                <div>
                    <h2 className="text-center text-3xl font-bold text-gray-900">
                        Kayıt Ol
                    </h2>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* E-posta */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                E-mail
                            </label>
                            <div className="mt-1">
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={`appearance-none relative block w-full px-3 py-2 border rounded-md ${
                                        errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                                )}
                            </div>
                        </div>

                        {/* Şifre */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Şifre
                            </label>
                            <div className="mt-1 relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className={`appearance-none relative block w-full px-3 py-2 border rounded-md ${
                                        errors.password ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                                )}
                            </div>
                        </div>

                        {/* Şifre Tekrar */}
                        <div>
                            <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700">
                                Şifre Tekrar
                            </label>
                            <div className="mt-1 relative">
                                <Input
                                    id="passwordConfirm"
                                    name="passwordConfirm"
                                    type={showPasswordConfirm ? "text" : "password"}
                                    required
                                    value={formData.passwordConfirm}
                                    onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                                    className={`appearance-none relative block w-full px-3 py-2 border rounded-md ${
                                        errors.passwordConfirm ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPasswordConfirm ? (
                                        <EyeOff className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                                {errors.passwordConfirm && (
                                    <p className="mt-1 text-sm text-red-500">{errors.passwordConfirm}</p>
                                )}
                            </div>
                        </div>

                        {/* Üyelik Sözleşmesi */}
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <Checkbox
                                    id="acceptTerms"
                                    checked={formData.acceptTerms}
                                    onCheckedChange={(checked:any) =>
                                        setFormData({ ...formData, acceptTerms: checked as boolean })
                                    }
                                    required
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="acceptTerms" className="font-medium text-gray-700">
                                    <Link href="/terms" className="text-blue-600 hover:text-blue-800">
                                        Üyelik sözleşmesini
                                    </Link>
                                    {" "}okudum, onaylıyorum
                                </label>
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Kayıt Ol
                    </Button>

                    <div className="text-center">
            <span className="text-sm text-gray-600">
              Zaten kayıtlı mısın?{" "}
                <Link
                    href="/signin"
                    className="font-medium text-blue-600 hover:text-blue-800"
                >
                Giriş Yap
              </Link>
            </span>
                    </div>
                </form>

                {/* Sosyal Medya ile Kayıt 
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Veya şununla devam et
              </span>
                        </div> 
                    </div>

                   <div className="mt-6 grid grid-cols-2 gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                        >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                                />
                            </svg>
                            Google
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                        >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.164 6.839 9.49.5.09.682-.218.682-.485 0-.236-.009-.866-.013-1.7-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.026 2.747-1.026.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.481C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"
                                />
                            </svg>
                            GitHub
                        </Button>
                    </div>
                </div>
                */}
            </div>
        </div>
    )
}
