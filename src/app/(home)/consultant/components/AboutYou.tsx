"use client"
import { useState, useEffect } from 'react';
import { Button } from "@heroui/react";
import remarkGfm from 'remark-gfm';
import toast from "react-hot-toast";
import { getContactInfo, updateDescription, uploadImages } from '../action';
import ReactMde from "react-mde";
import ReactMarkdown from "react-markdown";
import "react-mde/lib/styles/css/react-mde-all.css";

export default function AboutYou() {
    const [value, setValue] = useState("");
    const [selectedTab, setSelectedTab] = useState("write" as any);

    useEffect(() => {
        getContactInfo().then(user => {
            if (user?.description) {
                setValue(user.description);
            }
        });
    }, []);

    const save = async function* (data: any) {
        try {
            // Check if data is already a string (base64)
            if (typeof data === 'string') {
                const result = await uploadImages(data);
                if (result.success) {
                    yield result.url;
                    return true;
                }
                return false;
            }

            // If data is a Blob or File
            const blob = new Blob([data], { type: 'image/png' });
            const reader = new FileReader();
            
            const base64 = await new Promise((resolve) => {
                reader.onloadend = () => {
                    const result = reader.result as string;
                    resolve(result);
                };
                reader.readAsDataURL(blob);
            });

            if (typeof base64 !== 'string') {
                throw new Error('Failed to convert image to base64');
            }

            const result = await uploadImages(base64);
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

    const handleSave = async () => {
        try {
            await updateDescription(value);
            toast.success('Bilgileriniz başarıyla kaydedildi');
        } catch (error) {
            toast.error('Bilgileriniz kaydedilirken bir hata oluştu');
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