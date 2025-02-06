"use client"
import { useState } from 'react';
import toast from "react-hot-toast";
import {deleteCertificate, getCertificates, updateCertificate,createCertificate} from '../action';
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Form, 
    Input, 
    ModalContent, 
    Modal, 
    ModalFooter, 
    ModalBody, 
    ModalHeader,
    Card,
    CardBody,
    Button,
} from "@heroui/react";
import { useForm } from 'react-hook-form';
import { useParams } from "next/navigation";


interface Certificate {
    certificate_id: number;
    certificate_name: string | null;
    issuing_organization: string | null;
    given_date: Date | null;
    status: boolean;
    consultant_id: number;
    createdAt: Date;
    updatedAt: Date;
}
const certificateFormSchema = z.object({
    certificateName: z.string().min(2, { message: "Sertifika adı en az 2 karakter olmalıdır" }),
    organization: z.string().min(2, { message: "Kurum adı en az 2 karakter olmalıdır" }),
    givenDate: z.string().min(1, { message: "Veriliş tarihi zorunludur" })
});

export default function Certificates() {
    const { id } = useParams();
    const idNumber = parseInt(id as string);
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
    const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
    const certificateForm = useForm({
        resolver: zodResolver(certificateFormSchema)
    });

        //Certificate 
        const handleDeleteCertificate = async (id: number) => {
            try {
                await deleteCertificate(id, idNumber);
                setCertificates(prev => prev.filter(cert => cert.certificate_id !== id));
                toast.success("Sertifika başarıyla silindi");
            } catch (error) {
                toast.error("Sertifika silinirken bir hata oluştu");
                console.error('Error deleting certificate:', error);
            }
        };
    
        const handleEditCertificate = (certificate: Certificate) => {
            try {
                setEditingCertificate(certificate);
                certificateForm.reset({
                    certificateName: certificate.certificate_name || '',
                    organization: certificate.issuing_organization || '',
                    givenDate: certificate.given_date ? 
                        new Date(certificate.given_date).toISOString().split('T')[0] : ''
                });
                setIsCertificateModalOpen(true);
            } catch (error) {
                toast.error("Sertifika düzenlenirken bir hata oluştu");
                console.error('Error editing certificate:', error);
            }
        };
            // Add this useEffect to handle form reset when editing certificate
    useEffect(() => {
        if (editingCertificate) {
            certificateForm.reset({
                certificateName: editingCertificate.certificate_name || '',
                organization: editingCertificate.issuing_organization || '',
                givenDate: editingCertificate.given_date ? 
                    new Date(editingCertificate.given_date).toISOString().split('T')[0] : ''
            });
        } else {
            certificateForm.reset({
                certificateName: '',
                organization: '',
                givenDate: ''
            });
        }
    }, [editingCertificate, certificateForm]);
    useEffect(() => {
        getCertificates(idNumber).then(setCertificates).catch(console.error);
    }, []);
    
    return (
        <>
            <div className="flex justify-between items-center">
                                    <h3>Sertifika Bilgileri</h3>
                                    <Button 
                                        color="primary" 
                                        variant="ghost"
                                        onPress={() => setIsCertificateModalOpen(true)}
                                    >
                                        Sertifika Bilgisi Ekle
                                    </Button>
                                </div>

                                {certificates.map((certificate) => (
                                    <Card key={certificate.certificate_id}>
                                        <CardBody>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4>{certificate.certificate_name}</h4>
                                                    <p className="text-sm text-gray-500">{certificate.issuing_organization}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {certificate.given_date ? 
                                                            new Date(certificate.given_date).toLocaleDateString('tr-TR') 
                                                            : ''}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button 
                                                        size="sm" 
                                                        color="primary" 
                                                        variant="ghost"
                                                        onPress={() => handleEditCertificate(certificate)}
                                                    >
                                                        ✏️
                                                    </Button>
                                                    <Button 
                                                        size="sm" 
                                                        color="danger" 
                                                        variant="ghost"
                                                        onPress={() => handleDeleteCertificate(certificate.certificate_id)}
                                                    >
                                                        ✕
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                ))}
                                            {/* Update the Certificate Modal */}
            <Modal 
                isOpen={isCertificateModalOpen} 
                onClose={() => {
                    setIsCertificateModalOpen(false);
                    setEditingCertificate(null);
                    certificateForm.reset();
                }}
                size="xl"
            >
                <ModalContent>
                    <Form onSubmit={certificateForm.handleSubmit(async (data) => {
                        try {
                            let result: Certificate;
                            if (editingCertificate) {
                                result = await updateCertificate(editingCertificate.certificate_id, data, idNumber);
                                setCertificates(prev => prev.map(cert => 
                                    cert.certificate_id === editingCertificate.certificate_id ? result : cert
                                ));
                                toast.success("Sertifika bilgisi başarıyla güncellendi");
                            } else {
                                result = await createCertificate(data, idNumber);
                                setCertificates(prev => [...prev, result]);
                                toast.success("Sertifika bilgisi başarıyla eklendi");
                            }
                            setIsCertificateModalOpen(false);
                            setEditingCertificate(null);
                            certificateForm.reset();
                        } catch (error) {
                            toast.error(editingCertificate ? 
                                "Sertifika güncellenirken bir hata oluştu" : 
                                "Sertifika eklenirken bir hata oluştu"
                            );
                            console.error('Error saving certificate:', error);
                        }
                    })}>
                        <ModalHeader>
                            {editingCertificate ? 'Sertifika Düzenle' : 'Sertifika Bilgisi Ekle'}
                        </ModalHeader>
                        <ModalBody>
                            <div className="space-y-6 w-full min-w-[400px]">
                                <Input
                                    label="Sertifika Adı"
                                    {...certificateForm.register("certificateName")}
                                    defaultValue={editingCertificate?.certificate_name || ''}
                                    placeholder="Sertifika adını girin"
                                    className="w-full"
                                    size="lg"
                                />
                                <Input
                                    label="Veren Kurum"
                                    {...certificateForm.register("organization")}
                                    defaultValue={editingCertificate?.issuing_organization || ''}
                                    placeholder="Kurumun adını girin"
                                    className="w-full"
                                    size="lg"
                                />
                                <Input
                                    label="Veriliş Tarihi"
                                    type="date"
                                    {...certificateForm.register("givenDate")}
                                    defaultValue={editingCertificate?.given_date ? 
                                        new Date(editingCertificate.given_date).toISOString().split('T')[0] : ''}
                                    className="w-full"
                                    size="lg"
                                />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button 
                                color="danger" 
                                variant="ghost" 
                                onPress={() => {
                                    setIsCertificateModalOpen(false);
                                    setEditingCertificate(null);
                                    certificateForm.reset();
                                }}
                            >
                                İptal
                            </Button>
                            <Button 
                                color="primary"
                                type="submit"
                            >
                                {editingCertificate ? 'Güncelle' : 'Kaydet'}
                            </Button>
                        </ModalFooter>
                    </Form>
                </ModalContent>
            </Modal>
        </>
    )
}
