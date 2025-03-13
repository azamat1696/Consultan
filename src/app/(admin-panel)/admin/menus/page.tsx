"use client"
import React, { useState } from "react";
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
  useDisclosure,
  Select,
  SelectItem,
} from "@heroui/react";
import { PlusIcon, EditIcon, DeleteIcon } from "@/components/icons";
import { getMenus, addMenu, updateMenu, deleteMenu } from "./actions";
import toast from "react-hot-toast";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getCategories } from "../categories/actions";


interface Menu {
  id: number;
  title: string;
  type: string;
  page_path?: string;
  order_number: number | null;
  parentId?: number | null | undefined;
  categoryId?: number | null | undefined;
  parent?: { title: string };
  category?: { title: string };
  categories?: { title: string }[];
}

export default function MenusPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [menus, setMenus] = React.useState<Menu[]>([]);
  const [formData, setFormData] = React.useState<any>({
    title: "",
    type: "",
    page_path: "",
    order_number: 0,
    parentId: null,
    categoryId: null,
  });
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [expandedMenuId, setExpandedMenuId] = useState<number | null>(null);

  const fetchMenus = async () => {
    try {
      const data = await getMenus();
      setMenus(data as any);
    } catch (error) {
      toast.error("Menüler yüklenirken bir hata oluştu");
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      toast.error("Kategoriler yüklenirken bir hata oluştu");
    }
  };

  React.useEffect(() => {
    fetchMenus();
    fetchCategories();
  }, []);

  const resetForm = () => {
    setFormData({
      title: "",
      type: "",
      page_path: "",
      order_number: 0,
      parentId: null,
      categoryId: null,
    });
    setEditingId(null);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMenu(editingId, formData);
        toast.success("Menü güncellendi");
      } else {
        await addMenu(formData);
        toast.success("Menü eklendi");
      }
      onClose();
      fetchMenus();
      resetForm();
      setFormData({
        title: "",
        type: "",
        page_path: "",
        order_number: 0,
        parentId: null,
        categoryId: null,
      });
    } catch (error) {
      toast.error("Bir hata oluştu");
    }
  };

  const handleEdit = (menu: any) => {
    setFormData({
      title: menu.title,
      type: menu.type,
      page_path: menu.page_path || "",
      order_number: menu.order_number || 0,
      parentId: menu.parentId,
      categoryId: menu.categoryId,
    });
    setEditingId(menu.id);
    onOpen();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bu menüyü silmek istediğinize emin misiniz?")) {
      try {
        await deleteMenu(id);
        toast.success("Menü silindi");
        fetchMenus();
      } catch (error) {
        toast.error("Silme işlemi başarısız oldu");
      }
    }
  };

  const handleToggleCategories = (menuId: number) => {
    setExpandedMenuId(expandedMenuId === menuId ? null : menuId);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Menüler</h1>
        <Button color="primary" onPress={onOpen} startContent={<PlusIcon />}>
          Yeni Menü
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableColumn>Başlık</TableColumn>
          <TableColumn>Tür</TableColumn>
          <TableColumn>Sayfa Yolu</TableColumn>
          <TableColumn>Sıra No</TableColumn>
          <TableColumn>Üst Menü</TableColumn>
          <TableColumn>İlişkili Kategori</TableColumn>
          <TableColumn>İşlemler</TableColumn>
        </TableHeader>
        <TableBody>
          {menus.map((menu) => (
            <TableRow key={menu.id}>
              <TableCell>{menu.title}</TableCell>
              <TableCell>{menu.type}</TableCell>
              <TableCell>{menu.page_path || "-"}</TableCell>
              <TableCell>{menu.order_number || "-"}</TableCell>
              <TableCell>{menu.parent?.title || "-"}</TableCell>
              <TableCell>
                
                  <div>
                    <Button
                      variant="light"
                      size="sm"
                      endContent={expandedMenuId === menu.id ? <ChevronUp /> : <ChevronDown />}
                      onPress={() => handleToggleCategories(menu.id)}
                    >
                      {`${menu.categories?.length || 0} kategori`}
                    </Button>
                    {expandedMenuId === menu.id && menu.categories && menu.categories.length > 0 && (
                      <div className="mt-2 pl-4 space-y-1">
                        {menu.categories.map((category, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            {category.title}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    isIconOnly
                    variant="light"
                    onPress={() => handleEdit(menu)}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    isIconOnly
                    variant="light"
                    color="danger"
                    onPress={() => handleDelete(menu.id)}
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
        onClose={() => {
          onClose();
          resetForm();
        }}
      >
        <ModalContent>
          <ModalHeader>
            {editingId ? "Menü Düzenle" : "Yeni Menü"}
          </ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Başlık"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
              <Input
                type="number"
                label="Sıra No"
                value={formData.order_number}
                onChange={(e) => setFormData({ ...formData, order_number: parseInt(e.target.value) || 0 })}
              />
              <Select
                label="Tip"
                selectedKeys={formData.type ? [formData.type] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  setFormData({ 
                    ...formData, 
                    type: selected
                  })
                }}
                required
              >
                <SelectItem value="DropDown" key="DropDown">Açılır Menü</SelectItem>
                <SelectItem value="BlankMenu" key="BlankMenu">Boş Menü</SelectItem>
                <SelectItem value="Relation" key="Relation">İlişkili Menü</SelectItem>
              </Select>
              {formData.type !== "DropDown" && (
                <Input
                  label="Sayfa Yolu"
                  value={formData.page_path}
                  onChange={(e) =>
                    setFormData({ ...formData, page_path: e.target.value })
                  }
                />
              )}
              <Select
                label="Üst Menü"
                selectedKeys={formData.parentId ? [formData.parentId.toString()] : [""]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    parentId: e.target.value ? Number(e.target.value) : null,
                  })
                }
              >
                {[
                  { id: "", title: "Ana Menü" },
                  ...menus.filter((m) => m.id !== editingId)
                ].map((menu) => (
                  <SelectItem key={menu.id} value={menu.id}>
                    {menu.title}
                  </SelectItem>
                ))}
              </Select>
              {/* formData.type === "Relation" && (
                <Select
                  label="Kategori"
                  selectionMode="single"
                  selectedKeys={formData.categoryId ? [formData.categoryId.toString()] : []}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      categoryId: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  items={[
                    { id: "", title: "Kategori Seçin" },
                    ...categories
                  ]}
                >
                  {(category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.title}
                    </SelectItem>
                  )}
                </Select>
              ) */}
              <div className="flex justify-end gap-2">
                <Button variant="flat" color="danger" onPress={
                  () => {
                    onClose();
                    resetForm();
                  }
                }>
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