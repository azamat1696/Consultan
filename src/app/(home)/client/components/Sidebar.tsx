import React from 'react';
import Link from 'next/link';
import { Card, CardBody } from '@heroui/react';

type SidebarProps = {
    currentPoints: number;
    userInfo: {
        name: string;
        email: string;
        phone: string | null;
    };
};

export default function Sidebar({ currentPoints, userInfo }: SidebarProps) {
    return (
        <div className="space-y-4">
            <Card>
                <CardBody>
                    <h2 className="text-lg font-semibold mb-4">Müşteri Bilgileri</h2>
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-gray-500">Ad Soyad</p>
                            <p className="font-medium">{userInfo.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">E-posta</p>
                            <p className="font-medium">{userInfo.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Telefon</p>
                            <p className="font-medium">{userInfo.phone || 'Belirtilmemiş'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Mevcut Puanınız</p>
                            <p className="font-medium text-rose-500">{currentPoints} Puan</p>
                        </div>
                    </div>
                </CardBody>
            </Card>

            <Card>
                <CardBody>
                    <h2 className="text-lg font-semibold mb-4">Genel Bilgiler</h2>
                    <nav className="space-y-2">
                        <Link 
                            href="/client/appointments" 
                            className="block p-2 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            Siparişlerim
                        </Link>
                        <Link 
                            href="/client/cart" 
                            className="block p-2 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            Sepetim
                        </Link>
                        <Link 
                            href="/client/points" 
                            className="block p-2 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            Puanlarım
                        </Link>
                    </nav>
                </CardBody>
            </Card>
        </div>
    );
} 