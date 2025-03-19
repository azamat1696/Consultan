"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { getAppointments, updateAppointmentStatus } from "./actions"
import toast from "react-hot-toast"
import { AppointmentStatus } from "@prisma/client"
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
    ModalFooter
} from "@heroui/react";

interface Appointment {
  appointment_id: number
  date_time: Date
  appointment_time: string | null
  notes: string | null
  consultant: {
    name: string | null
    surname: string | null
  }
  client: {
    name: string | null
    surname: string | null
    email: string | null
    phone: string | null
  }
  packet: {
    packet_title: string | null
    price: number
  }
  status: AppointmentStatus | null
  createdAt: Date
  
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">("all")
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalAction, setModalAction] = useState<"approve" | "cancel" | "complete" | null>(null)
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [selectedNotes, setSelectedNotes] = useState<string | null>(null)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const result = await getAppointments()
      if (result.success && result.data) {
        setAppointments(result.data as unknown as Appointment[])
      } else {
        toast.error("Rezervasyonlar yüklenirken bir hata oluştu")
      }
    } catch (error) {
      toast.error("Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (appointmentId: number, newStatus: AppointmentStatus) => {
    try {
      const result = await updateAppointmentStatus(appointmentId, newStatus)
      if (result.success) {
        toast.success("Durum başarıyla güncellendi")
        fetchAppointments()
        setShowModal(false)
        setSelectedAppointment(null)
      } else {
        toast.error(result.error || "Durum güncellenirken bir hata oluştu")
      }
    } catch (error) {
      toast.error("Bir hata oluştu")
    }
  }

  const openModal = (appointment: Appointment, action: "approve" | "cancel" | "complete") => {
    setSelectedAppointment(appointment)
    setModalAction(action)
    setShowModal(true)
  }

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-purple-100 text-purple-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredAppointments = appointments.filter(appointment => 
    statusFilter === "all" ? true : appointment.status?.toLowerCase() === statusFilter.toLowerCase()
  )

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Yükleniyor...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Rezervasyonlar</h1>
        <Select
          label="Durum Filtresi"
          selectedKeys={statusFilter ? [statusFilter] : []}
          onSelectionChange={(keys) => {
            const selectedValue = Array.from(keys)[0] as AppointmentStatus | "all";
            setStatusFilter(selectedValue);
          }}
          className="w-48"
        >
          <SelectItem key="all" value="all">Tümü</SelectItem>
          <SelectItem key="pending" value="pending">Beklemede</SelectItem>
          <SelectItem key="approved" value="approved">Onaylandı</SelectItem>
          <SelectItem key="completed" value="completed">Tamamlandı</SelectItem>
          <SelectItem key="cancelled" value="cancelled">İptal Edildi</SelectItem>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableColumn>Danışman</TableColumn>
          <TableColumn>Danışan</TableColumn>
          <TableColumn>Paket</TableColumn>
          <TableColumn>Tarih & Saat</TableColumn>
          <TableColumn>Notlar</TableColumn>
          <TableColumn>Durum</TableColumn>
          <TableColumn>İşlemler</TableColumn>
        </TableHeader>
        <TableBody>
          {filteredAppointments.map((appointment, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="font-medium">
                  {appointment.consultant.name} {appointment.consultant.surname}
                </div>
              </TableCell>
              <TableCell>
                <div>{appointment.client.name} {appointment.client.surname}</div>
                <div className="text-sm text-gray-500">{appointment.client.email}</div>
                <div className="text-sm text-gray-500">{appointment.client.phone}</div>
              </TableCell>
              <TableCell>
                <div>{appointment.packet.packet_title}</div>
                <div className="text-sm text-gray-500">{appointment.packet.price} TL</div>
              </TableCell>
              <TableCell>
                <div>
                  {appointment.date_time ? format(new Date(appointment.date_time), "dd MMMM yyyy") : "Belirtilmemiş"}
                </div>
                <div className="text-sm text-gray-500">{appointment.appointment_time || "Belirtilmemiş"}</div>
              </TableCell>
              <TableCell>
                <div 
                  className="cursor-pointer hover:text-red-600 transition-colors"
                  onClick={() => {
                    setSelectedNotes(appointment.notes)
                    setShowNotesModal(true)
                  }}
                >
                  {appointment.notes ? (
                    <p className="line-clamp-2 max-w-[200px]">{appointment.notes}</p>
                  ) : (
                    <p className="text-gray-400 italic">Not bulunmuyor</p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status as AppointmentStatus)}`}>
                  {appointment.status === "pending" && "Beklemede"}
                  {appointment.status === "approved" && "Onaylandı"}
                  {appointment.status === "cancelled" && "İptal Edildi"}
                  {appointment.status === "completed" && "Tamamlandı"}
                </span>
              </TableCell>
              <TableCell>
                {appointment.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      onPress={() => openModal(appointment, "approve")}
                      color="primary"
                      variant="ghost"
                    >
                      Onayla
                    </Button>
                    <Button
                      onPress={() => openModal(appointment, "cancel")}
                      color="danger"
                      variant="ghost"
                    >
                      İptal Et
                    </Button>
                  </div>
                )}
                {appointment.status === "approved" && (
                  <div className="flex gap-2">
                    <Button
                      onPress={() => openModal(appointment, "complete")}
                      color="success"
                      variant="ghost"
                    >
                      Tamamla
                    </Button>
                    <Button
                      onPress={() => openModal(appointment, "cancel")}
                      color="danger"
                      variant="ghost"
                    >
                      İptal Et
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <ModalContent>
          <ModalHeader>
            {modalAction === "approve" && "Rezervasyonu Onayla"}
            {modalAction === "cancel" && "Rezervasyonu İptal Et"}
            {modalAction === "complete" && "Rezervasyonu Tamamla"}
          </ModalHeader>
          <ModalBody>
            <p>Bu işlemi gerçekleştirmek istediğinizden emin misiniz?</p>
          </ModalBody>
          <ModalFooter>
            <Button
              onPress={() => {
                if (modalAction === "approve") {
                  handleStatusUpdate(selectedAppointment!.appointment_id, "approved" as AppointmentStatus)
                } else if (modalAction === "cancel") {
                  handleStatusUpdate(selectedAppointment!.appointment_id, "cancelled" as AppointmentStatus)
                } else if (modalAction === "complete") {
                  handleStatusUpdate(selectedAppointment!.appointment_id, "completed" as AppointmentStatus)
                }
              }}
              color="primary"
            >
              Evet
            </Button>
            <Button
              onPress={() => {
                setShowModal(false)
                setSelectedAppointment(null)
              }}
              color="default"
              variant="ghost"
            >
              İptal
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Notes Modal */}
      <Modal isOpen={showNotesModal} onClose={() => setShowNotesModal(false)} size="lg">
        <ModalContent>
          <ModalHeader>Notlar</ModalHeader>
          <ModalBody>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="whitespace-pre-wrap text-gray-600">
                {selectedNotes || "Not bulunmuyor"}
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              onPress={() => setShowNotesModal(false)}
              color="default"
              variant="ghost"
            >
              Kapat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
} 