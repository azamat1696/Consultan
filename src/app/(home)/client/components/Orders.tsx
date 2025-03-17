"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardBody } from '@heroui/react';
import { useSession } from 'next-auth/react';
import { getUserOrders } from '../actions';
import toast from 'react-hot-toast';

type Order = {
    id: number;
    date_time: string;
    status: string;
    consultant: {
        name: string;
        surname: string;
    };
    packet: {
        packet_id: number;
        name: string;
        price: number;
        description: string;
    };
};

export default function Orders() {
    const { data: session } = useSession();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (session?.user?.id) {
            loadOrders();
        }
    }, [session?.user?.id]);

    const loadOrders = async () => {
        try {
            setIsLoading(true);
            const result = await getUserOrders(Number(session?.user?.id));
            if (result.success && result.data) {
                console.log(result.data);
                setOrders(result.data);
            } else {
                toast.error(result.error || 'Siparişler yüklenirken bir hata oluştu');
            }
        } catch (error) {
            console.error('Error loading orders:', error);
            toast.error('Siparişler yüklenirken bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'text-yellow-600';
            case 'completed': return 'text-green-600';
            case 'cancelled': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return 'Beklemede';
            case 'completed': return 'Tamamlandı';
            case 'cancelled': return 'İptal Edildi';
            default: return status;
        }
    };

    if (isLoading) {
        return (
            <Card>
                <CardBody>
                    <h2 className="text-xl font-semibold mb-6">Siparişlerim</h2>
                    <div className="text-center py-4">
                        Yükleniyor...
                    </div>
                </CardBody>
            </Card>
        );
    }

    return (
        <Card>
            <CardBody>
                <h2 className="text-xl font-semibold mb-6">Siparişlerim</h2>
                <div className="space-y-4">
                    {orders.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">
                            Henüz siparişiniz bulunmamaktadır
                        </p>
                    ) : (
                        orders.map(order => (
                            <div 
                                key={order.id}
                                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium">
                                            {order.consultant.name} {order.consultant.surname}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {new Date(order.date_time).toLocaleDateString('tr-TR')}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Paket: {order.packet.name}
                                        </p>
                                        <p className={`text-sm ${getStatusColor(order.status)}`}>
                                            {getStatusText(order.status)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">{order.packet.price} TL</p>
                                        <p className="text-sm text-gray-500">{order.packet.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardBody>
        </Card>
    );
} 