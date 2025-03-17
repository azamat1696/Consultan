import React from 'react';
import { Card, CardBody, Input } from '@heroui/react';

type UserProfileProps = {
    userInfo: {
        name: string;
        email: string;
    };
};

export default function UserProfile({ userInfo }: UserProfileProps) {
    return (
        <Card>
            <CardBody>
                <h2 className="text-xl font-semibold mb-6">Kullanıcı Bilgileri</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Ad Soyad</p>
                        <div className="p-3 bg-gray-50 rounded-lg">
                            {userInfo.name}
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">E-posta</p>
                        <div className="p-3 bg-gray-50 rounded-lg">
                            {userInfo.email}
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
} 