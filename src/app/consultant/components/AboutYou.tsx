"use client"
import { useState, useEffect } from 'react';
import { Button, Textarea } from "@heroui/react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import toast from "react-hot-toast";
import { getContactInfo, updateDescription } from '../action';

const MARKDOWN_BUTTONS = [
    { label: 'B', style: '**', tooltip: 'Kalın' },
    { label: 'I', style: '_', tooltip: 'İtalik' },
    { label: 'H1', style: '# ', tooltip: 'Başlık 1' },
    { label: 'H2', style: '## ', tooltip: 'Başlık 2' },
    { label: 'List', style: '- ', tooltip: 'Liste' }
];

export default function AboutYou() {
    const [description, setDescription] = useState('');
    const [preview, setPreview] = useState(false);

    useEffect(() => {
        getContactInfo().then(user => {
            if (user?.description) {
                setDescription(user.description);
            }
        });
    }, []);

    const insertMarkdown = (style: string) => {
        const textarea = document.getElementById('about-description') as HTMLTextAreaElement;
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

        setDescription(newText);
    };

    const handleSave = async () => {
        try {
            await updateDescription(description);
            toast.success('Bilgileriniz başarıyla kaydedildi');
        } catch (error) {
            toast.error('Bilgileriniz kaydedilirken bir hata oluştu');
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
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
                            {description}
                        </ReactMarkdown>
                    </div>
                ) : (
                    <Textarea
                        id="about-description"
                        placeholder="Kendinizi tanıtın..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        minRows={8}
                    />
                )}
            </div>
            <div className="flex justify-end">
                <Button color="primary" onPress={handleSave}>
                    Kaydet
                </Button>
            </div>
        </div>
    );
} 