 "use client"
import { useState, useEffect } from 'react';
import { Input, Button } from "@heroui/react";
import toast from "react-hot-toast";
import { getBillingInfo, saveBillingInfo } from '../action';
import { useParams } from 'next/navigation';

interface BillingInfoType {
    name: string;
    surname: string;
    iban: string;
    tckn: string;
    address: string;
    city: string;
    district: string;
}

const INITIAL_STATE: BillingInfoType = {
    name: '',
    surname: '',
    iban: '',
    tckn: '',
    address: '',
    city: '',
    district: ''
};

export default function BillingInfo() {
    const {id} = useParams();
    const idNumber = parseInt(id as string);
    const [billingInfo, setBillingInfo] = useState<BillingInfoType>(INITIAL_STATE);

    useEffect(() => {
        getBillingInfo(idNumber).then(data => {
            if (data) {
                setBillingInfo({
                    name: data.name || '',
                    surname: data.surname || '',
                    iban: data.iban || '',
                    tckn: data.tckn || '',
                    address: data.address || '',
                    city: data.city || '',
                    district: data.district || ''
                });
            }
        });
    }, []);

    const handleSave = async () => {
        try {
            await saveBillingInfo(billingInfo, idNumber);
            toast.success('Hesap bilgileri başarıyla kaydedildi');
        } catch (error) {
            toast.error('Hesap bilgileri kaydedilirken bir hata oluştu');
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                    Ücretsiz randevularınızın ödemelerini alabilmek için hesap bilgilerinizi doldurmalısınız. Bu bilgiler ile fatura kesilecektir.
                </p>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-medium">Hesap Bilgileri</h3>
                
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Hesap Sahibi İsim"
                        value={billingInfo.name}
                        onChange={(e) => setBillingInfo(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <Input
                        label="Soy İsim"
                        value={billingInfo.surname}
                        onChange={(e) => setBillingInfo(prev => ({ ...prev, surname: e.target.value }))}
                    />
                </div>

                <Input
                    label="IBAN"
                    value={billingInfo.iban}
                    onChange={(e) => setBillingInfo(prev => ({ ...prev, iban: e.target.value }))}
                />

                <Input
                    label="TCKN (Fatura için)"
                    value={billingInfo.tckn}
                    onChange={(e) => setBillingInfo(prev => ({ ...prev, tckn: e.target.value }))}
                />

                <Input
                    label="Adres (Fatura için)"
                    value={billingInfo.address}
                    onChange={(e) => setBillingInfo(prev => ({ ...prev, address: e.target.value }))}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="İlçe"
                        value={billingInfo.district}
                        onChange={(e) => setBillingInfo(prev => ({ ...prev, district: e.target.value }))}
                    />
                    <Input
                        label="İl"
                        value={billingInfo.city}
                        onChange={(e) => setBillingInfo(prev => ({ ...prev, city: e.target.value }))}
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <Button color="primary" onPress={handleSave}>
                    Kaydet
                </Button>
            </div>
        </div>
    );
}