"use client"

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export default function SignInErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const provider = searchParams.get('provider')

  const getErrorMessage = () => {
    switch (error) {
      case 'CredentialsSignin':
        return 'E-posta adresi veya şifre hatalı.'
      case 'OAuthAccountNotLinked':
        return 'Bu e-posta adresi başka bir hesap ile ilişkilendirilmiş.'
      case 'EmailSignin':
        return 'E-posta gönderilirken bir hata oluştu.'
      case 'CallbackRouteError':
        return 'Oturum açma işlemi sırasında bir hata oluştu.'
      case 'Default':
      default:
        return 'Oturum açma işlemi sırasında bir hata oluştu.'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Oturum Açma Hatası
          </h2>
        </div>
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {getErrorMessage()}
              </h3>
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <Link
            href="/signin"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Tekrar Dene
          </Link>
          <Link
            href="/sifremi-unuttum"
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Şifremi Unuttum
          </Link>
          <Link
            href="/"
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  )
} 