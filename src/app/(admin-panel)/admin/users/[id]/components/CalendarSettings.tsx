"use client"
import { useState, useEffect } from 'react';
import {
    Card,
    CardBody,
    Button,
    Select,
    SelectItem,
} from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { Info } from 'lucide-react';
import { saveWeeklyCalendar, getWeeklyCalendar } from '../actions';
import { useParams } from 'next/navigation';

const formSchema = z.object({
    appointmentBuffer: z.string().min(1, { message: "Randevu aralığı seçimi zorunludur" }),
});

const DAYS = [
    { id: 1, name: 'Pazartesi' },
    { id: 2, name: 'Salı' },
    { id: 3, name: 'Çarşamba' },
    { id: 4, name: 'Perşembe' },
    { id: 5, name: 'Cuma' },
    { id: 6, name: 'Cumartesi' },
    { id: 7, name: 'Pazar' },
];

// Generate time slots from 00:00 to 23:00 with 1-hour intervals
const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
    return `${i.toString().padStart(2, '0')}:00`;
});

export default function CalendarSettings() {
    const [selectedDays, setSelectedDays] = useState<number[]>([]);
    const [timeSlots, setTimeSlots] = useState<{ [key: number]: Set<string> }>({});
    const {id} = useParams();
    const idNumber = parseInt(id as string);

    const { control, handleSubmit, setValue } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            appointmentBuffer: '1'
        }
    });

    const handleDayClick = (dayId: number) => {
        if (selectedDays.includes(dayId)) {
            setSelectedDays(prev => prev.filter(id => id !== dayId));
            const newTimeSlots = { ...timeSlots };
            delete newTimeSlots[dayId];
            setTimeSlots(newTimeSlots);
        } else {
            setSelectedDays(prev => [...prev, dayId]);
            setTimeSlots(prev => ({
                ...prev,
                [dayId]: new Set()
            }));
        }
    };

    const handleTimeSlotClick = (dayId: number, time: string) => {
        setTimeSlots(prev => {
            const daySlots = prev[dayId] || new Set();
            const newDaySlots = new Set(daySlots);
            
            if (newDaySlots.has(time)) {
                newDaySlots.delete(time);
            } else {
                newDaySlots.add(time);
            }

            return {
                ...prev,
                [dayId]: newDaySlots
            };
        });
    };

    const onSubmit = async (data: any) => {
        try {
            const formattedData = {
                appointmentBuffer: data.appointmentBuffer,
                schedule: selectedDays.map(dayId => ({
                    dayId,
                    hours: Array.from(timeSlots[dayId] || []).sort()
                }))
            };
            
            await saveWeeklyCalendar(formattedData, idNumber);
            toast.success("Takvim ayarları başarıyla kaydedildi");
        } catch (error) {
            toast.error("Takvim ayarları kaydedilirken bir hata oluştu");
            console.error(error);
        }
    };

    useEffect(() => {
        getWeeklyCalendar(idNumber).then((data) => {
            if (data?.day_and_hours) {
                const dayAndHours = typeof data.day_and_hours === 'string' 
                    ? JSON.parse(data.day_and_hours)
                    : data.day_and_hours;

                const { schedule, appointmentBuffer } = dayAndHours;
                
                if (appointmentBuffer) {
                    setValue('appointmentBuffer', appointmentBuffer);
                }
                
                if (schedule) {
                    const days = schedule.map((s: any) => s.dayId);
                    setSelectedDays(days);
                    
                    const slots = schedule.reduce((acc: any, s: any) => {
                        acc[s.dayId] = new Set(s.hours);
                        return acc;
                    }, {});
                    setTimeSlots(slots);
                }
            }
        }).catch(console.error);
    }, [setValue]);

    return (
        <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-500" />
                    <p className="text-sm text-gray-600">
                        Haftalık hizmet vereceğiniz saatleri seçiniz. Gelen randevu saatlerinde danışanlarla randevu 
                        yapacağınızı unutmamanız gerekmektedir.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div>
                    <h4 className="font-medium mb-4">Çalışma Günleri ve Saatleri</h4>
                    <div className="space-y-6">
                        {DAYS.map(day => (
                            <Card key={day.id} className={selectedDays.includes(day.id) ? 'border-primary' : ''}>
                                <CardBody>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h5 className="font-medium">{day.name}</h5>
                                            <Button
                                                color={selectedDays.includes(day.id) ? "primary" : "default"}
                                                variant={selectedDays.includes(day.id) ? "solid" : "ghost"}
                                                onPress={() => handleDayClick(day.id)}
                                                size="sm"
                                            >
                                                {selectedDays.includes(day.id) ? 'Seçildi' : 'Seç'}
                                            </Button>
                                        </div>
                                        
                                        {selectedDays.includes(day.id) && (
                                            <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
                                                {TIME_SLOTS.map(time => (
                                                    <button
                                                        key={time}
                                                        type="button"
                                                        onClick={() => handleTimeSlotClick(day.id, time)}
                                                        className={`
                                                            p-2 text-xs rounded border transition-colors
                                                            ${timeSlots[day.id]?.has(time) 
                                                                ? 'bg-green-500 text-white border-green-600' 
                                                                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                                                            }
                                                        `}
                                                    >
                                                        {time}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="font-medium">Randevu Ayarları</h4>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Controller
                            name="appointmentBuffer"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <Select 
                                    label="Randevuya en geç"
                                    selectedKeys={value ? [value] : []}
                                    onSelectionChange={(keys) => onChange(Array.from(keys)[0])}
                                >
                                    <SelectItem key="1" value="1">1 Saat</SelectItem>
                                    <SelectItem key="2" value="2">2 Saat</SelectItem>
                                    <SelectItem key="3" value="3">3 Saat</SelectItem>
                                    <SelectItem key="4" value="4">4 Saat</SelectItem>
                                    <SelectItem key="5" value="5">5 Saat</SelectItem>
                                    <SelectItem key="6" value="6">6 Saat</SelectItem>
                                    <SelectItem key="7" value="7">7 Saat</SelectItem>
                                    <SelectItem key="8" value="8">8 Saat</SelectItem>
                                    <SelectItem key="9" value="9">9 Saat</SelectItem>
                                    <SelectItem key="10" value="10">10 Saat</SelectItem>
                                    <SelectItem key="11" value="11">11 Saat</SelectItem>
                                    <SelectItem key="12" value="12">12 Saat</SelectItem>
                                    <SelectItem key="24" value="24">24 Saat</SelectItem>
                                </Select>
                            )}
                        />
                        <div className="flex items-end">
                            <span className="text-gray-600">kala randevu alınabilsin</span>
                        </div>
                    </div>

                    <div className="flex justify-end mt-6">
                        <Button color="primary" type="submit">
                            Kaydet
                        </Button>
                    </div>
                </form>
            </div>

            <div className="flex gap-2 items-center mt-4">
                <div className="w-4 h-4 bg-white border rounded"></div>
                <span className="text-sm text-gray-600">Boş Saatler</span>
                <div className="w-4 h-4 bg-green-500 rounded ml-4"></div>
                <span className="text-sm text-gray-600">Uygun Saatler</span>
            </div>
        </div>
    );
} 