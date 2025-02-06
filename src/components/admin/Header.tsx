"use client"
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { User, Bell, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function AdminHeader() {
    const pathname = usePathname();
    
    const isActive = (path: string) => {
        return pathname.startsWith(path) ? "text-red-600 border-b-2 border-red-600" : "";
    };

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
                    <div className="flex items-center gap-4">
                
                        <Link 
                            href="/admin/users" 
                            className={`text-gray-600 hover:text-red-600 pb-1 ${isActive('/admin/users')}`}
                        >
                            Kullanıcılar
                        </Link>
                        <Link 
                            href="/admin/sliders" 
                            className={`text-gray-600 hover:text-red-600 pb-1 ${isActive('/admin/sliders')}`}
                        >
                            Sliderler
                        </Link>
                        <Link 
                            href="/admin/categories" 
                            className={`text-gray-600 hover:text-red-600 pb-1 ${isActive('/admin/categories')}`}
                        >
                            Kategoriler
                        </Link>
                        <Link 
                            href="/admin/menus" 
                            className={`text-gray-600 hover:text-red-600 pb-1 ${isActive('/admin/menus')}`}
                        >
                            Menüler
                        </Link>
                        <Link 
                            href="/admin/logs" 
                            className={`text-gray-600 hover:text-red-600 pb-1 ${isActive('/admin/logs')}`}
                        >
                            Loglar
                        </Link>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-4">
                                    <button className={`text-gray-600 hover:text-red-600 pb-1 ${isActive('/admin/notifications')}`}>
                            <Bell className="h-5 w-5" />
                        </button>
                        <button className={`text-gray-600 hover:text-red-600 pb-1 ${isActive('/admin/users')}`}>
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