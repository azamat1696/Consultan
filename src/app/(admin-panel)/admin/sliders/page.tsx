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
import { UploadButton } from "@/lib/uploadthing";

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
  const [uploadingStates, setUploadingStates] = React.useState({
    image: false, 
    mobileImage: false
  });
  const [uploadProgress, setUploadProgress] = React.useState({
    image: 0,
    mobileImage: 0
  });

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
    
    if (uploadingStates.image || uploadingStates.mobileImage) {
      toast.error("Lütfen görsel yüklenmesinin tamamlanmasını bekleyin");
      return;
    }

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

  const handleImageUpload = (fieldName: 'image' | 'mobileImage') => async (res: any) => {
    try {
      if (res?.[0]?.url) {
        setFormData(prev => ({
          ...prev,
          [fieldName]: res[0].url
        }));
        toast.success('Görsel başarıyla yüklendi');
      }
    } catch (error) {
      toast.error('Görsel yükleme hatası');
    } finally {
      setUploadingStates(prev => ({
        ...prev,
        [fieldName]: false
      }));
      setUploadProgress(prev => ({
        ...prev,
        [fieldName]: 0
      }));
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
                    <Image
                      src={slider.image}
                      fill
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
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Görsel
                </label>
                <div className="relative">
                  <UploadButton
                    endpoint="imageUploader"
                    onUploadProgress={(progress: number) => {
                      setUploadProgress(prev => ({
                        ...prev,
                        image: progress
                      }));
                    }}
                    onClientUploadComplete={handleImageUpload('image')}
                    onUploadError={(error: Error) => {
                      setUploadingStates(prev => ({
                        ...prev,
                        image: false
                      }));
                      toast.error(`Görsel yükleme hatası: ${error.message}`);
                    }}
                    onUploadBegin={() => {
                      setUploadingStates(prev => ({
                        ...prev,
                        image: true
                      }));
                      setUploadProgress(prev => ({
                        ...prev,
                        image: 0
                      }));
                    }}
                    disabled={uploadingStates.image || uploadingStates.mobileImage}
                  />
                  {uploadingStates.image && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress.image}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Yükleniyor... {uploadProgress.image}%
                      </p>
                    </div>
                  )}
                </div>
                {formData.image && !uploadingStates.image && (
                  <div className="relative w-full h-40">
                    <Image
                      src={formData.image}
                      alt="Preview"
                      fill
                      className="object-contain w-full h-full"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Mobil Görsel
                </label>
                <div className="relative">
                  <UploadButton
                    endpoint="imageUploader"
                    onUploadProgress={(progress: number) => {
                      setUploadProgress(prev => ({
                        ...prev,
                        mobileImage: progress
                      }));
                    }}
                    onClientUploadComplete={handleImageUpload('mobileImage')}
                    onUploadError={(error: Error) => {
                      setUploadingStates(prev => ({
                        ...prev,
                        mobileImage: false
                      }));
                      toast.error(`Görsel yükleme hatası: ${error.message}`);
                    }}
                    onUploadBegin={() => {
                      setUploadingStates(prev => ({
                        ...prev,
                        mobileImage: true
                      }));
                      setUploadProgress(prev => ({
                        ...prev,
                        mobileImage: 0
                      }));
                    }}
                    disabled={uploadingStates.image || uploadingStates.mobileImage}
                  />
                  {uploadingStates.mobileImage && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress.mobileImage}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Yükleniyor... {uploadProgress.mobileImage}%
                      </p>
                    </div>
                  )}
                </div>
                {formData.mobileImage && !uploadingStates.mobileImage && (
                  <div className="relative w-full h-40">
                    <Image
                      src={formData.mobileImage}
                      alt="Mobile Preview"
                      fill
                      className="object-contain w-full h-full"
                    />
                  </div>
                )}
              </div>

              <Switch
                isSelected={formData.status}
                onValueChange={(checked) => setFormData({ ...formData, status: checked })}
              >
                {formData.status ? "Aktif" : "Pasif"}
              </Switch>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="flat" 
                  color="danger" 
                  onPress={handleClose}
                  isDisabled={uploadingStates.image || uploadingStates.mobileImage}
                >
                  İptal
                </Button>
                <Button 
                  color="primary" 
                  type="submit"
                  isDisabled={uploadingStates.image || uploadingStates.mobileImage}
                >
                  {uploadingStates.image || uploadingStates.mobileImage ? 
                    "Yükleniyor..." : 
                    (editingId ? "Güncelle" : "Ekle")}
                </Button>
              </div>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
} 