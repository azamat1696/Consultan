"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { sendPasswordResetEmail } from "./action"
import toast from "react-hot-toast"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setIsLoading(true)
            await sendPasswordResetEmail(email)
            toast.success("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi")
            setEmail("")
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
                    <h1 className="text-red-500 text-2xl font-bold mb-2">Şifremi Unuttum</h1>
                    <p className="text-gray-800 font-medium">
                        E-posta adresinizi girin, şifre sıfırlama bağlantısını gönderelim.
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                E-posta
                            </label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full"
                                placeholder="E-posta adresiniz"
                                disabled={isLoading}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md"
                            disabled={isLoading}
                        >
                            {isLoading ? "Gönderiliyor..." : "Şifre Sıfırlama Bağlantısı Gönder"}
                        </Button>
                    </form>
                </div>
            </div>
        </section>
    )
} 