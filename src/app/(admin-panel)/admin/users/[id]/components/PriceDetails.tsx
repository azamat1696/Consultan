"use client"
import { useState, useEffect } from 'react';
import {
    Card,
    CardBody,
    Button,
    Input,
    Select,
    SelectItem,
    Textarea,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@heroui/react";
import { Info, Plus, Trash2, Edit } from 'lucide-react';
import toast from "react-hot-toast";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { savePackets, getPackets } from '../actions';
import { useParams } from 'next/navigation';

interface PacketType {
    id: string;
    title: string;
    type: string;
    minutes: string;
    meetingCount: string;
    price: string;
    discountedPrice: string;
    description: string;
    preQuestions?: string;
}

const INITIAL_PACKET: PacketType = {
    id: Date.now().toString(),
    title: '',
    type: 'online',
    minutes: '55',
    meetingCount: '1',
    price: '',
    discountedPrice: '',
    description: '',
    preQuestions: ''
};

const PACKET_TYPES = [
    { id: 'free', name: 'Ücretsiz Ön Görüşme' },
    { id: 'startup', name: 'Girişim Danışmanlığı' },
    { id: 'package', name: 'Paket' }
];

// Add markdown toolbar buttons
const MARKDOWN_BUTTONS = [
    { label: 'B', style: '**', tooltip: 'Kalın' },
    { label: 'I', style: '_', tooltip: 'İtalik' },
    { label: 'H1', style: '# ', tooltip: 'Başlık 1' },
    { label: 'H2', style: '## ', tooltip: 'Başlık 2' },
    { label: 'List', style: '- ', tooltip: 'Liste' },
    { label: 'Image', style: '![', tooltip: 'Resim' },
    { label: 'Code', style: '```', tooltip: 'Kod' },
    { label: 'Quote', style: '> ', tooltip: 'Alıntı' },
    { label: 'Table', style: '|', tooltip: 'Tablo' },
    { label: 'Hr', style: '---', tooltip: 'Yatay Çizgi' }
];

export default function PriceDetails() {
    const {id} = useParams();
    const idNumber = parseInt(id as string);
    const [isOpen, setIsOpen] = useState(false);
    const [currentPacket, setCurrentPacket] = useState<PacketType>(INITIAL_PACKET);
    const [packets, setPackets] = useState<PacketType[]>([]);
    const [preview, setPreview] = useState(false);

    useEffect(() => {
        getPackets(idNumber ).then(data => {
            if (!data?.length) return;
            const formattedPackets = data.map(packet => ({
                id: packet.packet_id.toString(),
                title: packet.packet_title || '',
                type: packet.packet_type?.toLowerCase() || '',
                minutes: packet.packet_minutes?.toString() || '',
                meetingCount: packet.meeting_times?.toString() || '',
                price: packet.price.toString(),
                discountedPrice: packet.discounted_price.toString(),
                description: packet.meeting_description || '',
                preQuestions: packet.pre_questions || ''
            }));
            setPackets(formattedPackets);
        }).catch(console.error);
    }, []);

    const handleSave = async () => {
        try {
            if (!currentPacket.title || !currentPacket.minutes || !currentPacket.meetingCount) {
                toast.error('Lütfen tüm alanları doldurun');
                return;
            }

            const updatedPackets = [...packets];
            const existingIndex = packets.findIndex(p => p.id === currentPacket.id);
            
            if (existingIndex >= 0) {
                updatedPackets[existingIndex] = currentPacket;
            } else {
                if (packets.length >= 5) {
                    toast.error('En fazla 5 paket ekleyebilirsiniz');
                    return;
                }
                updatedPackets.push(currentPacket);
            }

            await savePackets(updatedPackets, idNumber);
            setPackets(updatedPackets);
            setIsOpen(false);
            setCurrentPacket(INITIAL_PACKET);
            toast.success('Paket başarıyla kaydedildi');
        } catch (error: any) {
            toast.error(error.message || 'Paket kaydedilirken bir hata oluştu');
            console.error(error);
        }
    };

    const handleDelete = async (packetId: string) => {
        try {
            const updatedPackets = packets.filter(p => p.id !== packetId);
            await savePackets(updatedPackets, idNumber);
            setPackets(updatedPackets);
            toast.success('Paket başarıyla silindi');
        } catch (error) {
            toast.error('Paket silinirken bir hata oluştu');
            console.error(error);
        }
    };

    const insertMarkdown = (style: string) => {
        const textarea = document.getElementById('description') as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const before = text.substring(0, start);
        const selection = text.substring(start, end);
        const after = text.substring(end);

        const newText = style === '- ' 
            ? `${before}${style}${selection}${after}`
            : `${before}${style}${selection}${style}${after}`;

        setCurrentPacket(prev => ({ ...prev, description: newText }));
    };

    return (
        <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-500" />
                    <p className="text-sm text-gray-600">
                        Ücret detaylarınızı belirlerken danışanlarınıza sunacağınız paket seçeneklerini ekleyebilirsiniz.
                        En fazla 5 farklı paket ekleyebilirsiniz.
                    </p>
                </div>
            </div>

            <div className="flex justify-end">
                <Button
                    color="primary"
                    startContent={<Plus className="w-4 h-4" />}
                    onPress={() => {
                        setCurrentPacket(INITIAL_PACKET);
                        setIsOpen(true);
                    }}
                >
                    Yeni Paket Ekle
                </Button>
            </div>

            <Modal 
                isOpen={isOpen} 
                onClose={() => setIsOpen(false)}
                size="2xl"
                placement='center'
            
            >
                <ModalContent>
                    <ModalHeader className="flex-shrink-0">Yeni Paket Ekle</ModalHeader>
                    <ModalBody className="flex-grow">
                        <div className="space-y-4">
                            <Select 
                                label="Paket"
                                selectedKeys={[currentPacket.type]}
                                onChange={(e) => setCurrentPacket(prev => ({ 
                                    ...prev, 
                                    type: e.target.value,
                                    title: PACKET_TYPES.find(t => t.id === e.target.value)?.name || ''
                                }))}
                            >
                                {PACKET_TYPES.map(type => (
                                    <SelectItem key={type.id} value={type.id}>
                                        {type.name}
                                    </SelectItem>
                                ))}
                            </Select>

                            <Input
                                label="Görüşme Başlığı"
                                placeholder="Örn: Girişim Danışmanlığı"
                                value={currentPacket.title}
                                onChange={(e) => setCurrentPacket(prev => ({ ...prev, title: e.target.value }))}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Görüşme Süresi"
                                    type="number"
                                    value={currentPacket.minutes}
                                    endContent="dakika"
                                    onChange={(e) => setCurrentPacket(prev => ({ ...prev, minutes: e.target.value }))}
                                />
                                <Input
                                    label="Görüşme Adedi"
                                    type="number"
                                    value={currentPacket.meetingCount}
                                    endContent="adet"
                                    onChange={(e) => setCurrentPacket(prev => ({ ...prev, meetingCount: e.target.value }))}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Normal Ücret"
                                    type="number"
                                    startContent="₺"
                                    value={currentPacket.price}
                                    onChange={(e) => setCurrentPacket(prev => ({ ...prev, price: e.target.value }))}
                                />
                                <Input
                                    label="İndirimli Ücret"
                                    type="number"
                                    startContent="₺"
                                    value={currentPacket.discountedPrice}
                                    onChange={(e) => setCurrentPacket(prev => ({ ...prev, discountedPrice: e.target.value }))}
                                />
                            </div>

                            <div className="text-xs text-gray-500">
                                * Bu tutar üzerinden %20 aidiyet komisyonu kesilecektir.
                                <br />
                                * Aidiyet kampanya kapsamında 30 ile %20 arasında indirim kampanyası yapabilir,
                                kampanya indirimleri danışman üzerine yansıtılmaktadır.
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Görüşme Detayı</label>
                                <div className="flex gap-2 mb-2 items-center overflow-auto">
                                    {MARKDOWN_BUTTONS.map((btn) => (
                                        <Button
                                            key={btn.label}
                                            size="sm"
                                            variant="ghost"
                                            onPress={() => insertMarkdown(btn.style)}
                                            title={btn.tooltip}
                                        >
                                            {btn.label}
                                        </Button>
                                    ))}
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onPress={() => setPreview(!preview)}
                                    >
                                        {preview ? 'Düzenle' : 'Önizle'}
                                    </Button>
                                </div>
                                {preview ? (
                                    <div className="border rounded-lg p-3 min-h-[200px] prose prose-sm max-w-none">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {currentPacket.description}
                                        </ReactMarkdown>
                                    </div>
                                ) : (
                                    <Textarea
                                        id="description"
                                        placeholder="Bu görüşmede girişiminiz ile ilgili görüşeceğiz. Girişiminizin hızlıca başlaması veya başlamış olan projenizin hızlanması için 50 dakika görüşeceğiz"
                                        value={currentPacket.description}
                                        onChange={(e) => setCurrentPacket(prev => ({ ...prev, description: e.target.value }))}
                                        minRows={4}
                                    />
                                )}
                            </div>

                            <Textarea
                                label="Görüşme Öncesi Sorulması (Zorunlu değil)"
                                placeholder="Görüşme öncesi danışana sorulacak sorular"
                                value={currentPacket.preQuestions}
                                onChange={(e) => setCurrentPacket(prev => ({ ...prev, preQuestions: e.target.value }))}
                                minRows={2}
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="ghost" onPress={() => setIsOpen(false)}>
                            İptal
                        </Button>
                        <Button color="primary" onPress={handleSave}>
                            Kaydet
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <div className="space-y-4">
                {packets.map((packet) => (
                    <Card key={packet.id} className="hover:border-primary">
                        <CardBody>
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="font-medium">{packet.title}</h4>
                                    <p className="text-sm text-gray-600">
                                        {packet.meetingCount} Görüşme × {packet.minutes} Dakika
                                    </p>
                                    {packet.description && (
                                        <div className="mt-4 prose prose-sm max-w-none">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {packet.description}
                                            </ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        {packet.type === 'free' ? (
                                            <p className="text-sm font-medium text-green-600 text-center border border-green-600 rounded-lg px-2 py-0.5">Ücretsiz</p>
                                        ) : (
                                            <>
                                                <p className="text-sm line-through text-gray-400">₺{packet.price}</p>
                                                <p className="font-medium text-primary">₺{packet.discountedPrice}</p>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button 
                                            isIconOnly
                                            variant="light" 
                                            onPress={() => {
                                                setCurrentPacket(packet);
                                                setIsOpen(true);
                                            }}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button 
                                            isIconOnly
                                            variant="light" 
                                            color="danger"
                                            onPress={() => handleDelete(packet.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
} 