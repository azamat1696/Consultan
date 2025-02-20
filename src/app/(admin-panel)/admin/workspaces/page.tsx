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
import { getWorkspaces, createWorkspace, updateWorkspace, deleteWorkspace } from "./actions";

interface Workspace {
  workspace_id: number;
  name: string;
  status: boolean;
  deletedAt: Date | null;
}

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null);
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceStatus, setWorkspaceStatus] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    try {
      const data = await getWorkspaces();
      setWorkspaces(data as Workspace[]);
    } catch (error) {
      toast.error("Çalışma alanları yüklenirken bir hata oluştu");
    }
  };

  const handleSubmit = async () => {
    try {
      if (!workspaceName.trim()) {
        toast.error("Çalışma alanı adı boş olamaz");
        return;
      }

      if (editingWorkspace) {
        await updateWorkspace(editingWorkspace.workspace_id, workspaceName, workspaceStatus);
        toast.success("Çalışma alanı güncellendi");
      } else {
        await createWorkspace(workspaceName, workspaceStatus);
        toast.success("Çalışma alanı eklendi");
      }

      onClose();
      setWorkspaceName("");
      setWorkspaceStatus(true);
      setEditingWorkspace(null);
      loadWorkspaces();
    } catch (error) {
      toast.error(editingWorkspace ? "Güncelleme başarısız" : "Ekleme başarısız");
    }
  };

  const handleEdit = (workspace: Workspace) => {
    setEditingWorkspace(workspace);
    setWorkspaceName(workspace.name);
    setWorkspaceStatus(workspace.status);
    onOpen();
  };

  const handleNewWorkspace = () => {
    setEditingWorkspace(null);
    setWorkspaceName("");
    setWorkspaceStatus(true);
    onOpen();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu çalışma alanını silmek istediğinize emin misiniz?")) return;

    try {
      await deleteWorkspace(id);
      toast.success("Çalışma alanı silindi");
      loadWorkspaces();
    } catch (error) {
      toast.error("Silme işlemi başarısız");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Çalışma Alanları</h1>
        <Button 
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
          onPress={handleNewWorkspace}
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
          {workspaces.map((workspace) => (
            <TableRow key={workspace.workspace_id}>
              <TableCell>{workspace.workspace_id}</TableCell>
              <TableCell>{workspace.name}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  workspace.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {workspace.status ? 'Aktif' : 'Pasif'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    isIconOnly
                    variant="light"
                    onPress={() => handleEdit(workspace)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    isIconOnly
                    variant="light"
                    color="danger"
                    onPress={() => handleDelete(workspace.workspace_id)}
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
            {editingWorkspace ? 'Çalışma Alanı Düzenle' : 'Yeni Çalışma Alanı'}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Çalışma Alanı Adı"
                placeholder="Örn: Yazılım Geliştirme"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
              />
              <div className="flex items-center gap-2">
                <Switch
                  isSelected={workspaceStatus}
                  onValueChange={setWorkspaceStatus}
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
              {editingWorkspace ? 'Güncelle' : 'Ekle'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
} 