"use client"
import React from "react";
import {
  Table, TableHeader, TableBody, TableColumn, TableRow, TableCell,
  Button, Input, Modal, ModalContent, ModalHeader, ModalBody, useDisclosure, Select, SelectItem, Image as ImageComponent
} from "@heroui/react";
import { PlusIcon, EditIcon, DeleteIcon, SearchIcon } from "@/components/icons";
import { getCategories, addCategory, updateCategory, deleteCategory } from "./actions";
import { getMenus } from "../menus/actions";
import toast from "react-hot-toast";
import Image from "next/image";

interface Category {
  id: bigint;
  menuId: bigint;
  title: string;
  page_path: string | null;
  image: string | null;
  menu?: { title: string };
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function CategoriesPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [filterValue, setFilterValue] = React.useState("");
  const [filteredCategories, setFilteredCategories] = React.useState<Category[]>([]);
  const [formData, setFormData] = React.useState({
    title: "",
    page_path: "",
    menuId: 0,
    image: "",
  });
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [menus, setMenus] = React.useState<any[]>([]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
      setFilteredCategories(data);
    } catch (error) {
      toast.error("Kategoriler yüklenirken bir hata oluştu");
    }
  };

  const fetchMenus = async () => {
    try {
      const data = await getMenus();
      setMenus(data);
    } catch (error) {
      toast.error("Menüler yüklenirken bir hata oluştu");
    }
  };

  React.useEffect(() => {
    fetchCategories();
    fetchMenus();
  }, []);

  const onSearchChange = React.useCallback((value: string) => {
    setFilterValue(value);
    const filtered = categories.filter((category) =>
      category.title.toLowerCase().includes(value.toLowerCase()) ||
      category.page_path?.toLowerCase().includes(value.toLowerCase()) ||
      category.menu?.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateCategory(editingId, formData);
        toast.success("Kategori güncellendi");
      } else {
        await addCategory(formData);
        toast.success("Kategori eklendi");
      }
      onClose();
      fetchCategories();
      resetForm();
    } catch (error) {
      toast.error("Bir hata oluştu");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      page_path: "",
      menuId: 0,
      image: "",
    });
    setEditingId(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleEdit = (category: Category) => {
    setFormData({
      title: category.title,
      page_path: category.page_path || "",
      menuId: Number(category.menuId),
      image: category.image || "",
    });
    setEditingId(Number(category.id));
    onOpen();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kategoriler</h1>
        <div className="flex gap-4 items-center">
          <Input
            isClearable
            className="w-64"
            placeholder="Kategori ara..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onSearchChange("")}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <Button color="primary" onPress={onOpen} startContent={<PlusIcon />}>
            Yeni Kategori
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableColumn>Başlık</TableColumn>
          <TableColumn>Görsel</TableColumn>
          <TableColumn>Sayfa Yolu</TableColumn>
          <TableColumn>Menü</TableColumn>
          <TableColumn>İşlemler</TableColumn>
        </TableHeader>
        <TableBody>
          {filteredCategories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.title}</TableCell>
              <TableCell>
                {category.image ? (
                  <div className="relative w-16 h-16">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>{category.page_path || "-"}</TableCell>
              <TableCell>{category.menu?.title || "-"}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button isIconOnly variant="light" onPress={() => handleEdit(category)}>
                    <EditIcon />
                  </Button>
                  <Button isIconOnly variant="light" color="danger" 
                    onPress={() => {
                      if(confirm("Kategoriyi silmek istediğinize emin misiniz?")) {
                        deleteCategory(category.id);
                        fetchCategories();
                      }
                    }}>
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
            {editingId ? "Kategori Düzenle" : "Yeni Kategori"}
          </ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Başlık"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <div>
                <label className="block text-sm mb-2">Görsel</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData({ ...formData, image: reader.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {formData.image && (
                  <div className="relative w-32 h-32 mt-2">
                    <Image
                      src={formData.image}
                      alt="Preview"
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                )}
              </div>
              <Input
                label="Sayfa Yolu"
                value={formData.page_path || ""}
                onChange={(e) => setFormData({ ...formData, page_path: e.target.value })}
              />
              <Select
                label="Menü"
                selectedKeys={[formData.menuId.toString()]}
                onChange={(e) => setFormData({ ...formData, menuId: Number(e.target.value) })}
                required
              >
                <SelectItem key="0" value="0">Menü Seçin</SelectItem>
                {menus.map((menu) => (
                  <SelectItem key={menu.id} value={menu.id}>
                    {menu.title}
                  </SelectItem>
                ))}
              </Select>
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
