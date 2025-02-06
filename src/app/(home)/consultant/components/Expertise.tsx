"use client"
import { useState } from 'react';
import toast from "react-hot-toast";
import {deleteConsultantExpertise, getConsultantExpertises, createConsultantExpertise, updateConsultantExpertise, getExpertises, getWorkspaces} from "@/app/(home)/consultant/action";
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
    SelectItem,
    Select,
} from "@heroui/react";
import { Controller, useForm } from 'react-hook-form';
import { ConsultantExpertise, Workspace,Expertise } from '../types';
const expertiseFormSchema = z.object({
    expertise: z.string().min(1, { message: "Uzmanlık alanı seçimi zorunludur" }),
    workspaces: z.array(z.string()).optional()
});
export default function ExpertiseComponent() {   
    const [expertises, setExpertises] = useState<Expertise[]>([]);
    const [consultantExpertises, setConsultantExpertises] = useState<ConsultantExpertise[]>([]);
    const [isExpertiseModalOpen, setIsExpertiseModalOpen] = useState(false);
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [editingExpertise, setEditingExpertise] = useState<ConsultantExpertise | null>(null);

    const expertiseForm = useForm({
        resolver: zodResolver(expertiseFormSchema)
    });
    //Expertise 
    useEffect(() => {
        getExpertises().then(setExpertises).catch(console.error);
        getConsultantExpertises()
            .then((data) => setConsultantExpertises(data as ConsultantExpertise[]))
            .catch(console.error);
    }, []);

    useEffect(() => {
        getWorkspaces().then(setWorkspaces).catch(console.error);
    }, []);

    //Expertise 
    const handleDeleteExpertise = async (id: number) => {
        try {
            await deleteConsultantExpertise(id);
            setConsultantExpertises(prev => prev.filter(expertise => expertise.id !== id));
            toast.success("Uzmanlık başarıyla silindi");
        } catch (error) {
            toast.error("Uzmanlık silinirken bir hata oluştu");
            console.error('Error deleting expertise:', error);
        }
    };

    const handleEditExpertise = (expertise: ConsultantExpertise) => {
        try {
            setEditingExpertise(expertise);
            expertiseForm.reset({
                expertise: expertise.expertise_id.toString(),
                workspaces: expertise.workspaces.map(w => w.workspace_id.toString())
            });
            setIsExpertiseModalOpen(true);
        } catch (error) {
            toast.error("Uzmanlık düzenlenirken bir hata oluştu");
            console.error('Error editing expertise:', error);
        }
    };

    // Add this useEffect to handle form reset when editing expertise
    useEffect(() => {
        if (editingExpertise) {
            expertiseForm.reset({
                expertise: editingExpertise.expertise_id.toString(),
                workspaces: editingExpertise.workspaces.map(w => w.workspace_id.toString())
            });
        } else {
            expertiseForm.reset({
                expertise: '',
                workspaces: []
            });
        }
    }, [editingExpertise, expertiseForm]);
    return (
            <>
                    <div className="flex justify-between items-center">
                                    <h3></h3>
                                    <Button 
                                        color="primary" 
                                        variant="ghost"
                                        onPress={() => setIsExpertiseModalOpen(true)}
                                    >
                                        Uzmanlık Ekle
                                    </Button>
                                </div>
                                
                                {consultantExpertises.map((consultantExpertise) => (
                                    <Card key={consultantExpertise.id}>
                                        <CardBody>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4>{consultantExpertise.expertise.name}</h4>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {consultantExpertise.workspaces.map((workspace) => (
                                                            <span 
                                                                key={workspace.workspace_id}
                                                                className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                                                            >
                                                                {workspace.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button 
                                                        size="sm" 
                                                        color="primary" 
                                                        variant="ghost"
                                                        onPress={() => handleEditExpertise(consultantExpertise)}
                                                    >
                                                        ✏️
                                                    </Button>
                                                    <Button 
                                                        size="sm" 
                                                        color="danger" 
                                                        variant="ghost"
                                                        onPress={() => handleDeleteExpertise(consultantExpertise.id)}
                                                    >
                                                        ✕
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                ))}
                                  {/* Update the Expertise Modal */}
            <Modal 
                isOpen={isExpertiseModalOpen} 
                onClose={() => {
                    setIsExpertiseModalOpen(false);
                    setEditingExpertise(null);
                    expertiseForm.reset();
                }}
            >
                <ModalContent>
                    <Form onSubmit={expertiseForm.handleSubmit(async (data) => {
                        try {
                            let result: ConsultantExpertise;
                            if (editingExpertise) {
                                result = await updateConsultantExpertise(editingExpertise.id, data);
                                setConsultantExpertises(prev => prev.map(exp => 
                                    exp.id === editingExpertise.id ? result : exp
                                ));
                                toast.success("Uzmanlık bilgisi başarıyla güncellendi");
                            } else {
                                result = await createConsultantExpertise(data);
                                setConsultantExpertises(prev => [...prev, result]);
                                toast.success("Uzmanlık bilgisi başarıyla eklendi");
                            }
                            setIsExpertiseModalOpen(false);
                            setEditingExpertise(null);
                            expertiseForm.reset();
                        } catch (error) {
                            toast.error(editingExpertise ? 
                                "Uzmanlık güncellenirken bir hata oluştu" : 
                                "Uzmanlık eklenirken bir hata oluştu"
                            );
                            console.error('Error saving expertise:', error);
                        }
                    })}>
                        <ModalHeader>
                            {editingExpertise ? 'Uzmanlık Düzenle' : 'Uzmanlık Bilgisi Ekle'}
                        </ModalHeader>
                        <ModalBody>
                            <div className="space-y-6 w-full min-w-[400px]">
                                <Controller
                                    name="expertise"
                                    control={expertiseForm.control}
                                    defaultValue={editingExpertise?.expertise_id.toString()}
                                    render={({ field: { value, onChange } }) => (
                                        <Select 
                                            label="Uzmanlık Alanı"
                                            placeholder="Uzmanlık alanı seçiniz"
                                            selectedKeys={value ? new Set([value]) : new Set()}
                                            onSelectionChange={(keys) => {
                                                const selectedValue = Array.from(keys).join('');
                                                onChange(selectedValue);
                                            }}
                                            className="w-full"
                                            size="lg"
                                        >
                                            {expertises.map((expertise) => (
                                                <SelectItem 
                                                    key={expertise.expertise_id.toString()} 
                                                    value={expertise.expertise_id.toString()}
                                                >
                                                    {expertise.name}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    )}
                                />

                                <Controller
                                    name="workspaces"
                                    control={expertiseForm.control}
                                    defaultValue={editingExpertise?.workspaces.map(w => w.workspace_id.toString())}
                                    render={({ field: { value, onChange } }) => (
                                        <Select 
                                            label="Çalışma Alanları (Opsiyonel)"
                                            placeholder="Çalışma alanlarını seçiniz"
                                            selectionMode="multiple"
                                            selectedKeys={new Set(value || [])}
                                            onSelectionChange={(keys) => {
                                                const selectedValues = Array.from(keys);
                                                onChange(selectedValues.length > 0 ? selectedValues : undefined);
                                            }}
                                            className="w-full"
                                            size="lg"
                                        >
                                            {workspaces.map((workspace) => (
                                                <SelectItem 
                                                    key={workspace.workspace_id.toString()} 
                                                    value={workspace.workspace_id.toString()}
                                                >
                                                    {workspace.name}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button 
                                color="danger" 
                                variant="ghost" 
                                onPress={() => {
                                    setIsExpertiseModalOpen(false);
                                    setEditingExpertise(null);
                                    expertiseForm.reset();
                                }}
                            >
                                İptal
                            </Button>
                            <Button 
                                color="primary"
                                type="submit"
                            >
                                {editingExpertise ? 'Güncelle' : 'Kaydet'}
                            </Button>
                        </ModalFooter>
                    </Form>
                </ModalContent>
            </Modal>
            </>
    )
}