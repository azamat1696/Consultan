"use client"
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { User, Bell, LogOut } from 'lucide-react';

export default function AdminHeader() {
    return (
        <header className="bg-white border-b">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/admin" className="text-xl font-bold text-gray-800">
                            Advicemy Admin
                        </Link>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-4">
                        <button className="text-gray-500 hover:text-gray-700">
                            <Bell className="h-5 w-5" />
                        </button>
                        <button className="text-gray-500 hover:text-gray-700">
                            <User className="h-5 w-5" />
                        </button>
                        <button 
                            onClick={() => signOut({ callbackUrl: '/signin' })}
                            className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
                        >
                            <LogOut className="h-5 w-5" />
                            <span className="hidden sm:inline">Çıkış Yap</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
} 