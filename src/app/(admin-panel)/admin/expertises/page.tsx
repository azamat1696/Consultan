"use client"
import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Switch
} from "@heroui/react";
import { Plus, Pencil, Trash } from 'lucide-react';
import toast from "react-hot-toast";
import { getExpertises, createExpertise, updateExpertise, deleteExpertise } from "./actions";
import { generateSlug } from "@/lib/slug";

interface Expertise {
  expertise_id: number;
  name: string;
  status: boolean;
  slug: string | null;
  deletedAt: Date | null;
}

export default function ExpertisesPage() {
  const [expertises, setExpertises] = useState<Expertise[]>([]);
  const [editingExpertise, setEditingExpertise] = useState<Expertise | null>(null);
  const [expertiseName, setExpertiseName] = useState("");
  const [expertiseSlug, setExpertiseSlug] = useState("");
  const [expertiseStatus, setExpertiseStatus] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    loadExpertises();
  }, []);

  const loadExpertises = async () => {
    try {
      const data = await getExpertises();
      setExpertises(data as Expertise[]);
    } catch (error) {
      toast.error("Uzmanlık alanları yüklenirken bir hata oluştu");
    }
  };

  const handleSubmit = async () => {
    try {
      if (!expertiseName.trim()) {
        toast.error("Uzmanlık alanı adı boş olamaz");
        return;
      }

      if (editingExpertise) {
        await updateExpertise(editingExpertise.expertise_id, expertiseName, expertiseStatus, expertiseSlug);
        toast.success("Uzmanlık alanı güncellendi");
      } else {
        await createExpertise(expertiseName, expertiseStatus, expertiseSlug);
        toast.success("Uzmanlık alanı eklendi");
      }

      onClose();
      setExpertiseName("");
      setExpertiseStatus(true);
      setExpertiseSlug("");
      setEditingExpertise(null);
      loadExpertises();
    } catch (error) {
      toast.error(editingExpertise ? "Güncelleme başarısız" : "Ekleme başarısız");
    }
  };

  const handleEdit = (expertise: Expertise) => {
    setEditingExpertise(expertise);
    setExpertiseName(expertise.name);
    setExpertiseStatus(expertise.status);
    setExpertiseSlug(expertise.slug || "");
    onOpen();
  };

  const handleNewExpertise = () => {
    setEditingExpertise(null);
    setExpertiseName("");
    setExpertiseStatus(true);
    setExpertiseSlug("");
    onOpen();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setExpertiseName(name);
    setExpertiseSlug(generateSlug(name));
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu uzmanlık alanını silmek istediğinize emin misiniz?")) return;

    try {
      await deleteExpertise(id);
      toast.success("Uzmanlık alanı silindi");
      loadExpertises();
    } catch (error) {
      toast.error("Silme işlemi başarısız");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Uzmanlık Alanları</h1>
        <Button 
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
          onPress={handleNewExpertise}
        >
          Yeni Ekle
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Ad</TableColumn>
          <TableColumn>Durum</TableColumn>
          <TableColumn>İşlemler</TableColumn>
        </TableHeader>
        <TableBody>
          {expertises.map((expertise) => (
            <TableRow key={expertise.expertise_id}>
              <TableCell>{expertise.expertise_id}</TableCell>
              <TableCell>{expertise.name}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  expertise.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {expertise.status ? 'Aktif' : 'Pasif'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    isIconOnly
                    variant="light"
                    onPress={() => handleEdit(expertise)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    isIconOnly
                    variant="light"
                    color="danger"
                    onPress={() => handleDelete(expertise.expertise_id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>
            {editingExpertise ? 'Uzmanlık Alanı Düzenle' : 'Yeni Uzmanlık Alanı'}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Uzmanlık Alanı Adı"
                placeholder="Örn: Mobil Uygulama Geliştirme"
                value={expertiseName}
                onChange={handleNameChange}
              />
              <Input
                label="Slug"
                placeholder="mobil-uygulama-gelistirme"
                value={expertiseSlug}
                onChange={(e) => setExpertiseSlug(e.target.value)}
                helperText="URL'de görünecek benzersiz tanımlayıcı"
              />
              <div className="flex items-center gap-2">
                <Switch
                  isSelected={expertiseStatus}
                  onValueChange={setExpertiseStatus}
                />
                <span className="text-sm">Aktif</span>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="ghost" onPress={onClose}>
              İptal
            </Button>
            <Button color="primary" onPress={handleSubmit}>
              {editingExpertise ? 'Güncelle' : 'Ekle'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
} 