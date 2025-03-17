"use client"
import React, { useState } from "react";
import {
  Table, TableHeader, TableBody, TableColumn, TableRow, TableCell,
  Button, Input, Modal, ModalContent, ModalHeader, ModalBody, useDisclosure, Select, SelectItem, Image as ImageComponent, Chip
} from "@heroui/react";
import { PlusIcon, EditIcon, DeleteIcon, SearchIcon } from "@/components/icons";
import { getCategories, addCategory, updateCategory, deleteCategory, getExpertises, getWorkspaces } from "./actions";
import { getMenus } from "../menus/actions";
import toast from "react-hot-toast";
import Image from "next/image";
import { generateSlug } from "@/lib/slug";
import Loading from "@/components/Loading";

interface Category {
  id: bigint;
  title: string;
  page_path: string | null;
  image: string | null;
  menu: {
    id: number;
    title: string;
  };
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  slug: string | null;
  expertiseLinks?: Array<{
    expertiseId: number;
  }>;
  categoryLinks?: Array<{
    workspaceId: number;
  }>;
}

interface Expertise {
  expertise_id: number;
  name: string;
}

interface Workspace {
  workspace_id: number;
  name: string;
}

interface SelectedItem {
  id: number;
  name: string;
}

interface Menu {
  id: number;
  title: string;
}

export default function CategoriesPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [filterValue, setFilterValue] = React.useState("");
  const [filteredCategories, setFilteredCategories] = React.useState<Category[]>([]);
  const [selectedExpertises, setSelectedExpertises] = React.useState<SelectedItem[]>([]);
  const [selectedWorkspaces, setSelectedWorkspaces] = React.useState<SelectedItem[]>([]);
  const [formData, setFormData] = React.useState({
    title: "",
    page_path: "",
    menuId: 0,
    image: "",
    slug: "",
  });
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [menus, setMenus] = React.useState<Menu[]>([]);
  const [expertises, setExpertises] = React.useState<Expertise[]>([]);
  const [workspaces, setWorkspaces] = React.useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await getCategories();
      setCategories(data as any);
      setFilteredCategories(data as any);
    } catch (error) {
      toast.error("Kategoriler yüklenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMenus = async () => {
    try {
      const data = await getMenus();
      setMenus(data.filter((menu) => menu.type === "Relation"));
    } catch (error) {
      toast.error("Menüler yüklenirken bir hata oluştu");
    }
  };

  const fetchExpertises = async () => {
    try {
      const data = await getExpertises();
      setExpertises(data as any);
    } catch (error) {
      toast.error("Uzmanlık alanları yüklenirken bir hata oluştu");
    }
  };

  const fetchWorkspaces = async () => {
    try {
      const data = await getWorkspaces();
      setWorkspaces(data as any);
    } catch (error) {
      toast.error("Çalışma alanları yüklenirken bir hata oluştu");
    }
  };

  React.useEffect(() => {
    fetchCategories();
    fetchMenus();
    fetchExpertises();
    fetchWorkspaces();
  }, []);

  const onSearchChange = React.useCallback((value: string) => {
    setFilterValue(value);
    const filtered = categories.filter((category) =>
      category.title.toLowerCase().includes(value.toLowerCase()) ||
      category.page_path?.toLowerCase().includes(value.toLowerCase()) ||
      category?.menu?.title?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const submitData = {
        ...formData,
        expertiseIds: selectedExpertises.map(item => Number(item.id)),
        workspaceIds: selectedWorkspaces.map(item => Number(item.id))
      };

      if (editingId) {
        await updateCategory(editingId, submitData);
        toast.success("Kategori güncellendi");
      } else {
        await addCategory(submitData);
        toast.success("Kategori eklendi");
      }
      onClose();
      fetchCategories();
      resetForm();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      page_path: "",
      menuId: 0,
      image: "",
      slug: "",
    });
    setSelectedExpertises([]);
    setSelectedWorkspaces([]);
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
      menuId: Number(category?.menu?.id),
      image: category.image || "",
      slug: category.slug || "",
    });
    const existingExpertises = category.expertiseLinks?.map(link => ({
      id: link.expertiseId,
      name: expertises.find(e => +e.expertise_id === +link.expertiseId)?.name || ''
    })) || [];
    setSelectedExpertises(existingExpertises);
    const existingWorkspaces = category.categoryLinks?.map(link => ({
      id: link.workspaceId,
      name: workspaces.find(w => +w.workspace_id === +link.workspaceId)?.name || ''
    })) || [];
    setSelectedWorkspaces(existingWorkspaces);
    setEditingId(Number(category.id));
    onOpen();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setFormData({ 
      ...formData, 
      title: newTitle,
      slug: generateSlug(newTitle)
    });
  };

  const handleExpertiseChange = (keys: Set<string>) => {
    // Filter out already selected expertises
    const newKeys = Array.from(keys).filter(id => 
      !selectedExpertises.some(item => item.id.toString() === id)
    );
    
    const selected = newKeys.map(id => {
      const expertise = expertises.find(e => e.expertise_id.toString() === id);
      return {
        id: Number(id),
        name: expertise?.name || 'Unknown'
      };
    });

    setSelectedExpertises(prev => [...prev, ...selected]);
  };

  const handleWorkspaceChange = (keys: Set<string>) => {
    // Filter out already selected workspaces
    const newKeys = Array.from(keys).filter(id => 
      !selectedWorkspaces.some(item => item.id.toString() === id)
    );

    const selected = newKeys.map(id => {
      const workspace = workspaces.find(w => w.workspace_id.toString() === id);
      return {
        id: Number(id),
        name: workspace?.name || 'Unknown'
      };
    });

    setSelectedWorkspaces(prev => [...prev, ...selected]);
  };

  return (
    <div className="p-6">
      {isLoading && <Loading />}
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

      <Table aria-label="Kategoriler Listesi">
        <TableHeader>
          <TableColumn>Başlık</TableColumn>
          <TableColumn>Görsel</TableColumn>
          <TableColumn>Sayfa Yolu</TableColumn>
          <TableColumn>Menü</TableColumn>
          <TableColumn>İşlemler</TableColumn>
        </TableHeader>
        <TableBody>
          {filteredCategories?.map((category) => (
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
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {category?.menu?.title}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button isIconOnly variant="light" onPress={() => handleEdit(category)}>
                    <EditIcon />
                  </Button>
                  <Button isIconOnly variant="light" color="danger" 
                    onPress={() => {
                      if(confirm("Kategoriyi silmek istediğinize emin misiniz?")) {
                        deleteCategory(Number(category.id));
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
        size="5xl"
      >
        <ModalContent>
          <ModalHeader>
            {editingId ? "Kategori Düzenle" : "Yeni Kategori"}
          </ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Başlık"
                  value={formData.title}
                  onChange={handleNameChange}
                  required
                />
                <Input
                  label="Sayfa Yolu"
                  value={formData.page_path || ""}
                  onChange={(e) => setFormData({ ...formData, page_path: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Uzmanlık Alanları"
                  selectionMode="multiple"
                  placeholder="Uzmanlık alanlarını seçin"
                  selectedKeys={new Set(selectedExpertises.map(item => item.id.toString()))}
                  onSelectionChange={(keys) => handleExpertiseChange(keys as Set<string>)}
                >
                  {expertises.map((expertise) => (
                    <SelectItem key={expertise.expertise_id.toString()} value={expertise.expertise_id.toString()}>
                      {expertise.name}
                    </SelectItem>
                  ))}
                </Select>

             { /*   <Select
                  label="Çalışma Alanları"
                  selectionMode="multiple"
                  placeholder="Çalışma alanlarını seçin"
                  selectedKeys={new Set(selectedWorkspaces.map(item => item.id.toString()))}
                  onSelectionChange={(keys) => handleWorkspaceChange(keys as Set<string>)}
                >
                  {workspaces.map((workspace) => (
                    <SelectItem key={workspace.workspace_id.toString()} value={workspace.workspace_id.toString()}>
                      {workspace.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Seçili Uzmanlık Alanları</p>
                  <div 
                    className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-lg"
                    aria-label="Seçili Uzmanlık Alanları Listesi"
                  >
                    {selectedExpertises.map((item) => (
                      <Chip 
                        key={item.id}
                        onClose={() => {
                          setSelectedExpertises(prev => prev.filter(i => i.id !== item.id));
                        }}
                        variant="flat"
                        color="primary"
                        className="text-sm"
                      >
                        {item.name}
                      </Chip>
                    ))}
                  </div>
                </div>
                {/* <div>
                  <p className="text-sm text-gray-500 mb-2">Seçili Çalışma Alanları</p>
                  <div 
                    className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-lg"
                    aria-label="Seçili Çalışma Alanları Listesi"
                  >
                    {selectedWorkspaces.map((item) => (
                      <Chip 
                        key={item.id}
                        onClose={() => {
                          setSelectedWorkspaces(prev => prev.filter(i => i.id !== item.id));
                        }}
                        variant="flat"
                        color="secondary"
                        className="text-sm"
                      >
                        {item.name}
                      </Chip>
                    ))}
                  </div>
                 
                  </div>
                   */}
                </div>
                
              </div>
              

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
              <Select
                label="Menü"
                selectionMode="single"
                selectedKeys={[formData?.menuId?.toString()]}
                onChange={(e) => setFormData({ ...formData, menuId: Number(e.target.value) })}
                required
              >
                {[
                  <SelectItem key="" value="">Menü Seçin</SelectItem>,
                  ...menus.map((menu) => (
                    <SelectItem key={menu.id.toString()} value={menu.id.toString()}>
                      {menu.title}
                    </SelectItem>
                  ))
                ]}
              </Select>
              <Input
                label="URL (Slug)"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
                placeholder="URL'de görünecek benzersiz tanımlayıcı"
                required
              />
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
