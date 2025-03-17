"use client";
import React from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  TableColumn,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  ModalHeader,
  ModalBody,
  Chip,
  Tooltip,
  useDisclosure,
  ModalContent,
  Form,
  Select,
  SelectItem,
} from "@heroui/react";
import { User } from "@prisma/client";
import toast from "react-hot-toast";
import { getUsers, addUser, updateUser, deleteUser, resetPassword } from "./actions";
import { generateSlug } from "@/lib/slug";
import { PaginationMeta } from "@/types/index";
import { SearchIcon, PlusIcon, EditIcon, DeleteIcon, KeyIcon, UserIcon } from "@/components/icons";
import { useRouter } from "next/navigation";
import Image from "next/image";

const roleTranslations = {
  admin: "Yönetici",
  user: "Kullanıcı",
  consultant: "Danışman",
} as const;

type RoleType = keyof typeof roleTranslations;

type Gender = 'male' | 'female' | 'other' | null;

export default function UsersTable() {
  const [filterValue, setFilterValue] = React.useState("");
  const [users, setUsers] = React.useState<User[]>([]);
  const [meta, setMeta] = React.useState<PaginationMeta>({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1,
  });
  const [filterRole, setFilterRole] = React.useState<string | null>(null);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [formData, setFormData] = React.useState<Partial<User>>({
    name: "",
    surname: "",
    email: "",
    role: "user",
    status: true,
    profile_image: "",
    gender: null,
    phone: "",
    slug: "",
  });
  const [editingUser, setEditingUser] = React.useState<User | null>(null);

  const [resetPasswordModal, setResetPasswordModal] = React.useState({
    isOpen: false,
    userId: null as number | null,
  });
  const [newPassword, setNewPassword] = React.useState("");

  const [uploadingImage, setUploadingImage] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);

  const router = useRouter();

  const fetchUsers = async (page = 1) => {
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    
    const response = await getUsers({
      search: filterValue,
      role: filterRole,
      skip,
      take: pageSize,
    });

    if (response) {
      setUsers(response.data);
      setMeta({
        ...meta,
        page,
        total: response.count,
        totalPages: Math.ceil(response.count / pageSize),
      });
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, [filterRole, filterValue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        
        await updateUser(editingUser.id, formData as User);

        toast.success("Kullanıcı başarıyla güncellendi");
      } else {
        const userData = {
          ...formData,
          status: formData.status ?? true,
          role: formData.role ?? 'user',
        };
        await addUser(userData as User);
        toast.success("Kullanıcı başarıyla eklendi");
      }
      fetchUsers(meta.page);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error("Bir hata oluştu");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      surname: "",
      email: "",
      role: "user",
      status: true,
      profile_image: "",
      gender: null,
      phone: "",
      slug: "",
    });
    setEditingUser(null);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      surname: user.surname,
      email: user.email,
      role: user.role,
      status: user.status,
      profile_image: user.profile_image,
      gender: user.gender,
      phone: user.phone,
      slug: user.slug,
    });
    onOpen();
  };

  const handleDelete = async (id: number) => {
    try {
        await deleteUser(id);
        toast.success("Kullanıcı başarıyla silindi");
        fetchUsers(meta.page);
    } catch (error) {
        toast.error("Silme işlemi başarısız");
    }
  };

  const handleResetPassword = async (id: number) => {
    setResetPasswordModal({ isOpen: true, userId: id });
  };

  const handleResetPasswordSubmit = async () => {
    try {
      if (resetPasswordModal.userId && newPassword) {
        const result = await resetPassword(resetPasswordModal.userId, newPassword);
        toast.success(
          result.emailSent 
            ? "Şifre sıfırlandı ve email gönderildi" 
            : "Şifre sıfırlandı fakat email gönderilemedi"
        );
        setResetPasswordModal({ isOpen: false, userId: null });
        setNewPassword("");
      }
    } catch (error) {
      toast.error("Şifre sıfırlanırken bir hata oluştu");
    }
  };

  const handleOpenChange = () => {
    if (isOpen) {
      resetForm();
    }
    onOpenChange();
  };

  const generateUserSlug = (name: string, surname: string) => {
    if (!name && !surname) return "";
    return generateSlug(`${name} ${surname}`);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setFormData(prev => ({
      ...prev,
      name: newName,
      slug: generateUserSlug(newName, formData.surname || "")
    }));
  };

  const handleSurnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSurname = e.target.value;
    setFormData(prev => ({
      ...prev,
      surname: newSurname,
      slug: generateUserSlug(formData.name || "", newSurname)
    }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Kullanıcı Listesi</h1>
        <div className="flex gap-3">
          <Input
            isClearable
            placeholder="Arama..."
            startContent={<SearchIcon />}
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />
          <Select
            placeholder="Rol Seçin"
            selectedKeys={filterRole ? [filterRole] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              setFilterRole(selected === "all" ? null : selected);
            }}
          >
            <SelectItem key="all">Tümü</SelectItem>
            <SelectItem key="user" value="user">Kullanıcı</SelectItem>
            <SelectItem key="consultant" value="consultant">Danışman</SelectItem>
            <SelectItem key="admin" value="admin">Admin</SelectItem>
          </Select>
          <Button color="primary" startContent={<PlusIcon />} onPress={onOpen}>
            Yeni Ekle
          </Button>
        </div>
      </div>

      <Table aria-label="Kullanıcı listesi">
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Ad Soyad</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Rol</TableColumn>
          <TableColumn>Durum</TableColumn>
          <TableColumn>İşlemler</TableColumn>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={user.id}>
              <TableCell>{(meta.page - 1) * meta.pageSize + index + 1}</TableCell>
              <TableCell>{`${user.name || ''} ${user.surname || ''}`}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Chip color={user.role === 'admin' ? 'danger' : user.role === 'consultant' ? 'warning' : 'primary'}>
                  {roleTranslations[user.role as RoleType] || user.role}
                </Chip>
              </TableCell>
              <TableCell>
                <Chip color={user.status ? 'success' : 'danger'} variant="flat">
                  {user.status ? 'Aktif' : 'Pasif'}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Tooltip content="Profil">
                    <Button 
                      isIconOnly 
                      variant="light" 
                      onPress={() => router.push(`/admin/users/${user.id}`)}
                    >
                      <UserIcon />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Düzenle">
                    <Button isIconOnly variant="light" onPress={() => handleEdit(user)}>
                      <EditIcon />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Şifre Yenile">
                    <Button 
                      isIconOnly 
                      variant="light" 
                      color="warning"
                      onPress={() => handleResetPassword(user.id)}
                    >
                      <KeyIcon />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Sil" color="danger">
                    <Button isIconOnly variant="light" color="danger" onPress={() => handleDelete(user.id)}>
                      <DeleteIcon />
                    </Button>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal isOpen={isOpen} onOpenChange={handleOpenChange} size="xl">
        <ModalContent>
          <ModalHeader>
            {editingUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı'}
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Ad"
                  value={formData.name || ''}
                  onChange={handleNameChange}
                  required
                />
                <Input
                  label="Soyad"
                  value={formData.surname || ''}
                  onChange={handleSurnameChange}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
                <Input
                  label="Telefon"
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
                <Select
                  label="Cinsiyet"
                  selectedKeys={[formData.gender || ""]}
                  onChange={(e) => setFormData({...formData, gender: e.target.value as Gender})}
                >
                  <SelectItem key="male" value="male">Erkek</SelectItem>
                  <SelectItem key="female" value="female">Kadın</SelectItem>
                  <SelectItem key="other" value="other">Diğer</SelectItem>
                </Select>
                <Select
                  label="Rol"
                  value={formData.role || ""}
                  selectedKeys={[formData.role || ""]}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <SelectItem key="user" value="user">Kullanıcı</SelectItem>
                  <SelectItem key="consultant" value="consultant">Danışman</SelectItem>
                  <SelectItem key="admin" value="admin">Admin</SelectItem>
                </Select>
                <div className="space-y-2 col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Profil Resmi
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 relative">
                        <Image
                          src={formData.profile_image || "default-profile.png"} 
                          alt="Profile"
                          fill
                          className="w-24 h-24 rounded-full object-cover bg-gray-100"
                        />
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setFormData({
                                  ...formData,
                                  profile_image: reader.result as string
                                });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>
            
                    </div>
                    {formData.profile_image && (
                      <div className="relative w-24 h-24 flex-shrink-0">
                        <Image
                          src={formData.profile_image}
                          alt="Profile Preview"
                          fill
                          className="object-cover rounded-full"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <Select
                  label="Durum"
                  selectedKeys={[formData.status ? 'active' : 'passive']}
                  onChange={(e) => setFormData({...formData, status: e.target.value === 'active'})}
                >
                  <SelectItem key="active" value="active">Aktif</SelectItem>
                  <SelectItem key="passive" value="passive">Pasif</SelectItem>
                </Select>
                <Input
                  label="Slug"
                  value={formData.slug || ''}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="col-span-2"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button 
                  color="danger" 
                  variant="flat" 
                  onPress={onClose}
                  isDisabled={uploadingImage}
                >
                  İptal
                </Button>
                <Button 
                  color="primary" 
                  type="submit"
                  isDisabled={uploadingImage}
                >
                  {uploadingImage ? "Yükleniyor..." : "Kaydet"}
                </Button>
              </div>
            </Form>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Password Reset Modal */}
      <Modal 
        isOpen={resetPasswordModal.isOpen} 
        onOpenChange={(open) => {
          if (!open) {
            setResetPasswordModal({ isOpen: false, userId: null });
            setNewPassword("");
          }
        }}
        size="sm"
      >
        <ModalContent>
          <ModalHeader>Şifre Sıfırla</ModalHeader>
          <ModalBody>
            <Input
              label="Yeni Şifre"
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                color="danger" 
                variant="flat" 
                onPress={() => setResetPasswordModal({ isOpen: false, userId: null })}
              >
                İptal
              </Button>
              <Button 
                color="primary"
                onPress={handleResetPasswordSubmit}
                isDisabled={!newPassword}
              >
                Kaydet
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
} 