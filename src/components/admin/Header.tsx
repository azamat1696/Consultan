"use client"
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { User, Bell, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
const MENU_ITEMS = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/users', label: 'Kullanıcılar' },
    { href: '/admin/menus', label: 'Menüler' },
    { href: '/admin/categories', label: 'Kategoriler' },
    { href: '/admin/sliders', label: 'Slider' },
    { href: '/admin/workspaces', label: 'Çalışma Alanları' },
    { href: '/admin/expertises', label: 'Uzmanlık Alanları' },
    { href: '/admin/logs', label: 'Loglar' },
];

export default function AdminHeader() {
    const pathname = usePathname();
    
    const isActive = (path: string) => {
        if (path === '/admin') {
            return pathname === '/admin' ? "text-red-600 border-b-2 border-red-600" : "";
        }
        return pathname.startsWith(path) && pathname !== '/admin' ? "text-red-600 border-b-2 border-red-600" : "";
    };

    return (
        <header className="bg-white border-b">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/admin" className="text-xl font-bold text-gray-800">
                            <Image src="/assets/icons/logo.png" alt="logo" width={150} height={150} className="" />
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                       {
                        MENU_ITEMS.map((item) => (
                            <Link 
                                key={item.href}
                                href={item.href} 
                                className={`text-gray-600 hover:text-red-600 pb-1 ${isActive(item.href)}`}
                            >
                                {item.label}
                            </Link>
                        ))
                       }
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