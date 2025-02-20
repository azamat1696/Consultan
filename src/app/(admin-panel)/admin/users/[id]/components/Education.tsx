"use client"
import { useEffect, useState } from 'react';
import { Button, Form, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader,Card,CardBody,Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from 'react-hook-form';
import { getEducations, updateEducation, createEducation, deleteEducation } from '../action';
import toast from "react-hot-toast";
import { Controller } from 'react-hook-form';
import { Select, SelectItem } from '@heroui/react';
import { useParams } from "next/navigation";

interface Education {
    education_id: number;
    university_name: string | null;
    educational_degree: string | null;
    department: string | null;
    start_date: Date | null;
    end_date: Date | null;
    status: boolean;
    consultant_id: number;
    createdAt: Date;
    updatedAt: Date;
}
// Add this mapping near the top of the file
const educationDegreeMap: { [key: string]: string } = {
    'associate': 'Ön Lisans',
    'bachelor': 'Lisans',
    'master': 'Yüksek Lisans',
    'phd': 'Doktora'
};
const schoolFormSchema = z.object({
    degree_type: z.string().min(1, { message: "Derece seçimi zorunludur" }),
    schoolName: z.string().min(2, { message: "Okul adı en az 2 karakter olmalıdır" }),
    degree: z.string().min(2, { message: "Bölüm adı en az 2 karakter olmalıdır" }),
    startDate: z.string().min(1, { message: "Başlangıç tarihi zorunludur" }),
    endDate: z.string().min(1, { message: "Bitiş tarihi zorunludur" })
});
export default function Education() {
    const { id } = useParams();
    const idNumber = parseInt(id as string);
    const [educations, setEducations] = useState<Education[]>([]);
    const [editingEducation, setEditingEducation] = useState<Education | null>(null);
    const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);
    const schoolForm = useForm({
        resolver: zodResolver(schoolFormSchema)
    });

    useEffect(() => {
        getEducations(idNumber).then(setEducations).catch(console.error);
    }, []);

    const handleEditEducation = async (education: any) => {
        try {
            setEditingEducation(education);
            schoolForm.reset({
                degree_type: education.educational_degree || '',
                schoolName: education.university_name || '',
                degree: education.department || '',
                startDate: education.start_date ? 
                    new Date(education.start_date).toISOString().split('T')[0] : '',
                endDate: education.end_date ? 
                    new Date(education.end_date).toISOString().split('T')[0] : ''
            });
            setIsSchoolModalOpen(true);
        } catch (error) {
            toast.error("Eğitim bilgisi düzenlenirken bir hata oluştu");
            console.error('Error editing education:', error);
        }
    };

    const handleDeleteEducation = async (id: number) => {
        try {
            await deleteEducation(id, idNumber);
            setEducations(prev => prev.filter(edu => edu.education_id !== id));
            toast.success("Eğitim bilgisi başarıyla silindi");
        } catch (error) {
            toast.error("Eğitim bilgisi silinirken bir hata oluştu");
            console.error('Error deleting education:', error);
        }
    };
    // Add this useEffect to handle form reset when editing education
    useEffect(() => {
        if (editingEducation) {
            schoolForm.reset({
                degree_type: editingEducation.educational_degree || '',
                schoolName: editingEducation.university_name || '',
                degree: editingEducation.department || '',
                startDate: editingEducation.start_date ? 
                    new Date(editingEducation.start_date).toISOString().split('T')[0] : '',
                endDate: editingEducation.end_date ? 
                    new Date(editingEducation.end_date).toISOString().split('T')[0] : ''
            });
        } else {
            schoolForm.reset({
                degree_type: '',
                schoolName: '',
                degree: '',
                startDate: '',
                endDate: ''
            });
        }
    }, [editingEducation, schoolForm]);

    useEffect(() => {
        getEducations(idNumber).then(setEducations).catch(console.error);
    }, []);

    return (
              <>                         
                        <div className="flex justify-between items-center">
                            <h3></h3>
                            <Button 
                                color="primary" 
                                variant="ghost"
                                onPress={() => setIsSchoolModalOpen(true)}
                            >
                                Okul Bilgisi Ekle
                            </Button>
                        </div>
                        
                        {educations.map((education) => (
                            <Card key={education.education_id}>
                                <CardBody>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4>{education.university_name}</h4>
                                            <p className="text-sm text-gray-500">
                                                {educationDegreeMap[education.educational_degree || ''] || education.educational_degree}, {education.department}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {education.start_date ? new Date(education.start_date).toLocaleDateString('tr-TR') : ''} - 
                                                {education.end_date ? new Date(education.end_date).toLocaleDateString('tr-TR') : ''}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button 
                                                size="sm" 
                                                color="primary" 
                                                variant="ghost"
                                                onPress={() => handleEditEducation(education)}
                                            >
                                                ✏️
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                color="danger" 
                                                variant="ghost"
                                                onPress={() => handleDeleteEducation(education.education_id)}
                                            >
                                                ✕
                                            </Button>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                                 {/* Add this Modal component */}
            <Modal 
                isOpen={isSchoolModalOpen} 
                onClose={() => {
                    setIsSchoolModalOpen(false);
                    setEditingEducation(null);
                    schoolForm.reset();
                }}
            >
                <ModalContent>
                    <Form onSubmit={schoolForm.handleSubmit(async (data) => {
                        try {
                            let result: Education;
                            if (editingEducation) {
                                result = await updateEducation(editingEducation.education_id, data, idNumber);
                                setEducations(prev => prev.map(edu => 
                                    edu.education_id === editingEducation.education_id ? result : edu
                                ));
                                toast.success("Eğitim bilgisi başarıyla güncellendi");
                            } else {
                                result = await createEducation(data, idNumber);
                                setEducations(prev => [...prev, result]);
                                toast.success("Eğitim bilgisi başarıyla eklendi");
                            }
                            setIsSchoolModalOpen(false);
                            setEditingEducation(null);
                            schoolForm.reset();
                        } catch (error) {
                            toast.error(editingEducation ? 
                                "Eğitim bilgisi güncellenirken bir hata oluştu" : 
                                "Eğitim bilgisi eklenirken bir hata oluştu"
                            );
                            console.error('Error saving education:', error);
                        }
                    })}>
                        <ModalHeader>
                            {editingEducation ? 'Eğitim Bilgisi Düzenle' : 'Eğitim Bilgisi Ekle'}
                        </ModalHeader>
                        <ModalBody>
                            <div className="space-y-6 w-full min-w-[400px]">
                                <Controller
                                    name="degree_type"
                                    control={schoolForm.control}
                                    defaultValue={editingEducation?.educational_degree || ''}
                                    render={({ field: { value, onChange } }) => (
                                        <Select 
                                            label="Derece"
                                            placeholder="Derece seçiniz"
                                            selectedKeys={value ? new Set([value]) : new Set()}
                                            onSelectionChange={(keys) => {
                                                const selectedValue = Array.from(keys).join('');
                                                onChange(selectedValue);
                                            }}
                                            className="w-full"
                                            size="lg"
                                        >
                                            <SelectItem value="associate" key="associate">Ön Lisans</SelectItem>
                                            <SelectItem value="bachelor" key="bachelor">Lisans</SelectItem>
                                            <SelectItem value="master" key="master">Yüksek Lisans</SelectItem>
                                            <SelectItem value="phd" key="phd">Doktora</SelectItem>
                                        </Select>
                                    )}
                                />

                                <Input
                                    label="Okul Adı"
                                    {...schoolForm.register("schoolName")}
                                    defaultValue={editingEducation?.university_name || ''}
                                    placeholder="Üniversite adını girin"
                                    className="w-full"
                                    size="lg"
                                />
                                <Input
                                    label="Bölüm/Program"
                                    {...schoolForm.register("degree")}
                                    defaultValue={editingEducation?.department || ''}
                                    placeholder="Bölüm adını girin"
                                    className="w-full"
                                    size="lg"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Başlangıç Tarihi"
                                        type="date"
                                        {...schoolForm.register("startDate")}
                                        defaultValue={editingEducation?.start_date ? 
                                            new Date(editingEducation.start_date).toISOString().split('T')[0] : ''}
                                        className="w-full"
                                        size="lg"
                                    />
                                    <Input
                                        label="Bitiş Tarihi"
                                        type="date"
                                        {...schoolForm.register("endDate")}
                                        defaultValue={editingEducation?.end_date ? 
                                            new Date(editingEducation.end_date).toISOString().split('T')[0] : ''}
                                        className="w-full"
                                        size="lg"
                                    />
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button 
                                color="danger" 
                                variant="ghost" 
                                onPress={() => {
                                    setIsSchoolModalOpen(false);
                                    setEditingEducation(null);
                                    schoolForm.reset();
                                }}
                            >
                                İptal
                            </Button>
                            <Button 
                                color="primary"
                                type="submit"
                            >
                                {editingEducation ? 'Güncelle' : 'Kaydet'}
                            </Button>       
                        </ModalFooter>
                    </Form>
                </ModalContent>
            </Modal>


        </>
    )
}