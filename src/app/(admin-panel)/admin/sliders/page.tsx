"use client"
import React from "react";
import {
  Table, TableHeader, TableBody, TableColumn, TableRow, TableCell,
  Button, Input, Modal, ModalContent, ModalHeader, ModalBody, useDisclosure, Textarea,
  Switch, Chip
} from "@heroui/react";
import { PlusIcon, EditIcon, DeleteIcon, SearchIcon } from "@/components/icons";
import { getSliders, addSlider, updateSlider, deleteSlider } from "./actions";
import toast from "react-hot-toast";
import Image from "next/image";

interface Slider {
  id: number;
  title: string | null;
  description: string | null;
  image: string | null;
  mobileImage: string | null;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function SlidersPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sliders, setSliders] = React.useState<Slider[]>([]);
  const [filterValue, setFilterValue] = React.useState("");
  const [filteredSliders, setFilteredSliders] = React.useState<Slider[]>([]);
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    image: "",
    mobileImage: "",
    status: true,
  });
  const [editingId, setEditingId] = React.useState<number | null>(null);

  const fetchSliders = async () => {
    try {
      const data = await getSliders();
      setSliders(data);
      setFilteredSliders(data);
    } catch (error) {
      toast.error("Sliderlar yüklenirken bir hata oluştu");
    }
  };

  React.useEffect(() => {
    fetchSliders();
  }, []);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image: "",
      mobileImage: "",
      status: true,
    });
    setEditingId(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateSlider(editingId, formData);
        toast.success("Slider güncellendi");
      } else {
        await addSlider(formData);
        toast.success("Slider eklendi");
      }
      handleClose();
      fetchSliders();
    } catch (error) {
      toast.error("Bir hata oluştu");
    }
  };

  const onSearchChange = React.useCallback((value: string) => {
    setFilterValue(value);
    const filtered = sliders.filter((slider) =>
      slider.title?.toLowerCase().includes(value.toLowerCase()) ||
      slider.description?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSliders(filtered);
  }, [sliders]);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setFilteredSliders(sliders);
  }, [sliders]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'image' | 'mobileImage') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        toast.error('Dosya boyutu 8MB\'dan büyük olamaz');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Lütfen geçerli bir görsel dosyası seçin');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          [fieldName]: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sliderlar</h1>
        <div className="flex gap-3">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Slider ara..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={onClear}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <Button color="primary" onPress={onOpen} startContent={<PlusIcon />}>
            Yeni Slider
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableColumn>Görsel</TableColumn>
          <TableColumn>Mobil Görsel</TableColumn>
          <TableColumn>Başlık</TableColumn>
          <TableColumn>Açıklama</TableColumn>
          <TableColumn>Durum</TableColumn>
          <TableColumn>İşlemler</TableColumn>
        </TableHeader>
        <TableBody>
          {filteredSliders.map((slider) => (
            <TableRow key={slider.id}>
              <TableCell>
                {slider.image && (
                  <div className="relative w-20 h-20">
                    <img
                      src={slider.image}
                      alt={slider.title?.toString() || ""}
                      className="object-cover rounded w-full h-full"
                    />
                  </div>
                )}
              </TableCell>
              <TableCell>
                {slider.mobileImage && (
                  <div className="relative w-20 h-20">
                    <Image
                      src={slider.mobileImage}
                      alt={`${slider.title?.toString() || ""} mobile`}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                )}
              </TableCell>
              <TableCell>{slider.title}</TableCell>
              <TableCell>{slider.description}</TableCell>
              <TableCell>
                <Chip
                  color={slider.status ? "success" : "danger"}
                  variant="flat"
                >
                  {slider.status ? "Aktif" : "Pasif"}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    isIconOnly
                    variant="light"
                    onPress={() => {
                      setFormData({
                        title: slider.title || "",
                        description: slider.description || "",
                        image: slider.image || "",
                        mobileImage: slider.mobileImage || "",
                        status: slider.status
                      });
                      setEditingId(slider.id);
                      onOpen();
                    }}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    isIconOnly
                    variant="light"
                    color="danger"
                    onPress={() => {
                      if(confirm("Slideri silmek istediğinize emin misiniz?")) {
                        deleteSlider(slider.id);
                        fetchSliders();
                      }
                    }}
                  >
                    <DeleteIcon />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal 
        isOpen={isOpen} 
        onClose={handleClose}
        onOpenChange={(open) => {
          if (!open) handleClose();
        }}
      >
        <ModalContent>
          <ModalHeader>
            {editingId ? "Slider Düzenle" : "Yeni Slider"}
          </ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Başlık"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <Textarea
                label="Açıklama"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <Input
                type="file"
                label="Görsel"
                accept="image/*"
                onChange={(e) => handleImageChange(e, 'image')}
              />
              {formData.image && (
                <div className="relative w-full h-40">
                  <Image
                    src={formData.image.startsWith('data:') ? formData.image : formData.image}
                    alt="Preview"
                    fill
                    className="object-contain"
                    unoptimized={formData.image.startsWith('data:')}
                  />
                </div>
              )}
              <Input
                type="file"
                label="Mobil Görsel"
                accept="image/*"
                onChange={(e) => handleImageChange(e, 'mobileImage')}
              />
              {formData.mobileImage && (
                <div className="relative w-full h-40">
                  <Image
                    src={formData.mobileImage}
                    alt="Mobile Preview"
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <Switch
                isSelected={formData.status}
                onValueChange={(checked) => setFormData({ ...formData, status: checked })}
              >
                {formData.status ? "Aktif" : "Pasif"}
              </Switch>
              <div className="flex justify-end gap-2">
                <Button variant="flat" color="danger" onPress={handleClose}>
                  İptal
                </Button>
                <Button color="primary" type="submit">
                  {editingId ? "Güncelle" : "Ekle"}
                </Button>
              </div>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
} 