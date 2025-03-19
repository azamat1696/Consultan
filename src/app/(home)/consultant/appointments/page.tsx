"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { getConsultantAppointments, updateAppointmentStatus, updateAppointmentNotes } from "./actions"
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
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Select,
    SelectItem,
    Card,
    CardBody,
    Divider
} from "@heroui/react"
import { Link as LinkIcon, Menu, Home, Calendar, Users, Package, User, Clock, MessageSquare, ShoppingCart, Bell, Settings, HelpCircle, Phone, Tag } from "lucide-react"
import Link from "next/link"

interface Appointment {
  appointment_id: number
  date_time: Date
  appointment_time: string | null
  notes: string | null
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

export default function ConsultantAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">("all")
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalAction, setModalAction] = useState<"complete" | "cancel" | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedNotes, setSelectedNotes] = useState<string | null>(null)
  const [showNotesModal, setShowNotesModal] = useState(false)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const result = await getConsultantAppointments()
      if (result.success && result.data) {
        setAppointments(result.data as unknown as Appointment[])
      } else {
        toast.error("Randevular yüklenirken bir hata oluştu")
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

  const handleNoteUpdate = async (appointmentId: number, notes: string) => {
    try {
      const result = await updateAppointmentNotes(appointmentId, notes)
      if (result.success) {
        toast.success("Notlar güncellendi")
        fetchAppointments()
      } else {
        toast.error(result.error || "Notlar güncellenirken bir hata oluştu")
      }
    } catch (error) {
      toast.error("Bir hata oluştu")
    }
  }

  const openModal = (appointment: Appointment, action: "complete" | "cancel") => {
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
    <div className="flex flex-col md:flex-row gap-4 h-screen container mx-auto p-4 ">
      {/* Mobile Menu Button */}
      <Button 
        className="md:hidden mb-4" 
        variant="ghost"
        onPress={() => setIsDrawerOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Sidebar - Drawer for mobile, regular card for desktop */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out
        md:relative md:transform-none md:transition-none
        ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Card className="h-full">
          <CardBody>
            <div className="flex justify-between items-center md:hidden mb-4">
              <h2 className="font-semibold">Menu</h2>
              <Button 
                variant="ghost" 
                onPress={() => setIsDrawerOpen(false)}
              >
                ✕
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              <Link href="/consultant" className="flex items-center gap-2 p-2 hover:bg-gray-100 hover:text-red-600 rounded-lg transition-colors">
                <Home className="w-5 h-5" />
                <span>Anasayfa</span>
              </Link>
              <Link href="/consultant/appointments" className="flex items-center gap-2 p-2 hover:bg-gray-100 hover:text-red-600 rounded-lg transition-colors">
                <Clock className="w-5 h-5" />
                <span>Randevularım</span>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Overlay for mobile */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Main Content */}
      <Card className="flex-1">
        <CardBody>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Randevularım</h1>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAppointments.map((appointment, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardBody>
                  <div className="flex flex-col gap-4">
                    {/* Client Info */}
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        {appointment.client.name} {appointment.client.surname}
                      </h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{appointment.client.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{appointment.client.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Package Info */}
                    <div>
                      <h4 className="font-medium mb-1">Paket Bilgileri</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          <span>{appointment.packet.packet_title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          <span>{appointment.packet.price} TL</span>
                        </div>
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div>
                      <h4 className="font-medium mb-1">Randevu Bilgileri</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {appointment.date_time ? format(new Date(appointment.date_time), "dd MMMM yyyy") : "Belirtilmemiş"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{appointment.appointment_time || "Belirtilmemiş"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <h4 className="font-medium mb-1">Notlar</h4>
                      <div 
                        className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg min-h-[96px] cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => {
                          setSelectedNotes(appointment.notes)
                          setShowNotesModal(true)
                        }}
                      >
                        {appointment.notes ? (
                          <p className="whitespace-pre-wrap line-clamp-3">{appointment.notes}</p>
                        ) : (
                          <p className="text-gray-400 italic">Not bulunmuyor</p>
                        )}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status as AppointmentStatus)}`}>
                        {appointment.status === "pending" && "Beklemede"}
                        {appointment.status === "approved" && "Onaylandı"}
                        {appointment.status === "cancelled" && "İptal Edildi"}
                        {appointment.status === "completed" && "Tamamlandı"}
                      </span>
                      
                      {/* Actions */}
                      {appointment.status === "approved" && (
                        <div className="flex gap-2">
                          <Button
                            onPress={() => openModal(appointment, "complete")}
                            color="success"
                            variant="ghost"
                            size="sm"
                          >
                            Tamamla
                          </Button>
                          <Button
                            onPress={() => openModal(appointment, "cancel")}
                            color="danger"
                            variant="ghost"
                            size="sm"
                          >
                            İptal
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <ModalContent key={modalAction}>
              <ModalHeader>
                {modalAction === "complete" && "Randevuyu Tamamla"}
                {modalAction === "cancel" && "Randevuyu İptal Et"}
              </ModalHeader>
              <ModalBody>
                <p>Bu işlemi gerçekleştirmek istediğinizden emin misiniz?</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  onPress={() => {
                    if (modalAction === "complete") {
                      handleStatusUpdate(selectedAppointment!.appointment_id, "completed" as AppointmentStatus)
                    } else if (modalAction === "cancel") {
                      handleStatusUpdate(selectedAppointment!.appointment_id, "cancelled" as AppointmentStatus)
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
        </CardBody>
      </Card>
    </div>
  )
}