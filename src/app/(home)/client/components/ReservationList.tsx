import React, { useState } from 'react';
import { Card, CardBody, Select, SelectItem, Button } from "@heroui/react";

type Reservation = {
    id: string;
    consultantName: string;
    date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    price: number;
};

export default function ReservationList() {
    const [filter, setFilter] = useState<string>('all');
    const [reservations, setReservations] = useState<Reservation[]>([]);

    const statusOptions = [
        { value: 'all', label: 'Tüm Rezervasyonlar' },
        { value: 'pending', label: 'Bekleyen' },
        { value: 'confirmed', label: 'Onaylanmış' },
        { value: 'completed', label: 'Tamamlanmış' },
        { value: 'cancelled', label: 'İptal Edilmiş' }
    ];

    const filteredReservations = filter === 'all' 
        ? reservations 
        : reservations.filter(res => res.status === filter);

    const handleFilterChange = (value: string) => {
        setFilter(value);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'text-yellow-600';
            case 'confirmed': return 'text-blue-600';
            case 'completed': return 'text-green-600';
            case 'cancelled': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return 'Bekleyen';
            case 'confirmed': return 'Onaylanmış';
            case 'completed': return 'Tamamlanmış';
            case 'cancelled': return 'İptal Edilmiş';
            default: return status;
        }
    };

    return (
        <Card>
            <CardBody>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Rezervasyonlarım</h2>
                    <Select
                        value={filter}
                        onSelectionChange={(value) => handleFilterChange(value as string)}
                        className="w-48"
                    >
                        {statusOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </Select>
                </div>

                <div className="space-y-4">
                    {filteredReservations.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">
                            Rezervasyon bulunamadı
                        </p>
                    ) : (
                        filteredReservations.map(reservation => (
                            <div 
                                key={reservation.id}
                                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium">{reservation.consultantName}</h3>
                                        <p className="text-sm text-gray-600">
                                            {reservation.date} - {reservation.time}
                                        </p>
                                        <p className={`text-sm ${getStatusColor(reservation.status)}`}>
                                            {getStatusText(reservation.status)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">{reservation.price} TL</p>
                                        {reservation.status === 'pending' && (
                                            <Button
                                                color="danger"
                                                size="sm"
                                                className="mt-2"
                                                onClick={() => {
                                                    // Cancel reservation logic will be implemented here
                                                }}
                                            >
                                                İptal Et
                                            </Button>
                                        )}
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