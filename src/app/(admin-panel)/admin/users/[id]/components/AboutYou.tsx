"use client"
import { useState, useEffect } from 'react';
import { Button, Textarea } from "@heroui/react";
import remarkGfm from 'remark-gfm';
import toast from "react-hot-toast";
import { getContactInfo, updateDescription, uploadImage } from '../action';
import { useParams } from 'next/navigation';
import ReactMde from "react-mde";
import ReactMarkdown from "react-markdown";
import "react-mde/lib/styles/css/react-mde-all.css";
/*
interface Suggestion {
    preview: string;
    value: string;
}

async function loadSuggestions(text: string): Promise<Suggestion[]> {
    // Gerçek kullanıcı listesini veritabanından alabiliriz
    const suggestions: Suggestion[] = [
        { preview: "Danışman", value: "@consultant" },
        { preview: "Müşteri", value: "@client" },
        { preview: "Yönetici", value: "@admin" },
        { preview: "Destek", value: "@support" }
    ];

    // Aranan metne göre filtreleme
    return suggestions.filter(suggestion => 
        suggestion.preview.toLowerCase().includes(text.toLowerCase())
    );
}
*/
export default function AboutYou() {
    const [preview, setPreview] = useState(false);
    const {id} = useParams();
    const idNumber = parseInt(id as string);
    const [value, setValue] = useState("");
    const [selectedTab, setSelectedTab] = useState("write" as any);

    useEffect(() => {
        getContactInfo(idNumber).then(user => {
            if (user?.description) {
                setValue(user.description);
            }
        });
    }, []);

    const handleSave = async () => {
        try {
            await updateDescription(value, idNumber);
            toast.success('Bilgileriniz başarıyla kaydedildi');
        } catch (error) {
            toast.error('Bilgileriniz kaydedilirken bir hata oluştu');
        }
    };
    const save = async function* (data: any) {
        try {
            // Create blob with proper type
            const blob = new Blob([data], { type: 'image/png' });
            const reader = new FileReader();
            const base64 = await new Promise((resolve) => {
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            });
            
            // Upload image
            const result = await uploadImage(base64 as string);
            if (result.success) {
                yield result.url;
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error saving image:', error);
            return false;
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
        
                    <ReactMde
                        value={value}
                        onChange={setValue}
                        selectedTab={selectedTab}
                        onTabChange={setSelectedTab}
                        l18n={{ 
                            write: "Yaz",
                            preview: "Önizleme",
                            uploadingImage: "Resim yükleniyor...",
                            pasteDropSelect: "Resim eklemek için yapıştırın veya sürükleyin"
                        }}
                        generateMarkdownPreview={(markdown:any) =>
                            Promise.resolve(<ReactMarkdown children={markdown} />)
                        }
                        childProps={{
                            writeButton: {
                                tabIndex: -1,
                            }
                        }}
                        paste={{
                            saveImage: save as any
                        }}
                    />
             
            </div>
            <div className="flex justify-end">
                <Button color="primary" onPress={handleSave}>
                    Kaydet
                </Button>
            </div>
        </div>
    );
} 