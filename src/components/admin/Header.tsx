"use client"
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { User, Bell, LogOut, ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';

const MAIN_MENU_ITEMS = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/users', label: 'Kullanıcılar' },
    { href: '/admin/rezervasyonlar', label: 'Rezervasyonlar' },
];

const CONTENT_MANAGEMENT_ITEMS = [
    { href: '/admin/menus', label: 'Menüler' },
    { href: '/admin/categories', label: 'Kategoriler' },
    { href: '/admin/sliders', label: 'Slider' },
    { href: '/admin/workspaces', label: 'Çalışma Alanları' },
    { href: '/admin/expertises', label: 'Uzmanlık Alanları' },
];

const OTHER_ITEMS = [
    { href: '/admin/logs', label: 'Loglar' },
];

export default function AdminHeader() {
    const pathname = usePathname();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const isActive = (path: string) => {
        if (path === '/admin') {
            return pathname === '/admin' ? "text-red-600 border-b-2 border-red-600" : "";
        }
        return pathname.startsWith(path) && pathname !== '/admin' ? "text-red-600 border-b-2 border-red-600" : "";
    };

    const isContentManagementActive = () => {
        return CONTENT_MANAGEMENT_ITEMS.some(item => pathname.startsWith(item.href));
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

                    {/* Navigation */}
                    <div className="flex items-center gap-4">
                        {/* Main Menu Items */}
                        {MAIN_MENU_ITEMS.map((item) => (
                            <Link 
                                key={item.href}
                                href={item.href} 
                                className={`text-gray-600 hover:text-red-600 pb-1 ${isActive(item.href)}`}
                            >
                                {item.label}
                            </Link>
                        ))}

                        {/* Content Management Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className={`flex items-center gap-1 text-gray-600 hover:text-red-600 pb-1 ${isContentManagementActive() ? 'text-red-600 border-b-2 border-red-600' : ''}`}
                            >
                                İçerik Yönetimi
                                <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                                    {CONTENT_MANAGEMENT_ITEMS.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`block px-4 py-2 text-sm ${
                                                isActive(item.href)
                                                    ? 'bg-gray-100 text-red-600'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-red-600'
                                            }`}
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Other Items */}
                        {OTHER_ITEMS.map((item) => (
                            <Link 
                                key={item.href}
                                href={item.href} 
                                className={`text-gray-600 hover:text-red-600 pb-1 ${isActive(item.href)}`}
                            >
                                {item.label}
                            </Link>
                        ))}
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