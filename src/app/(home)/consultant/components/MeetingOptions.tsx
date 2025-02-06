"use client"
import { useState, useEffect } from 'react';
import {
    Card,
    CardBody,
    Checkbox,
    Button,
    Input,
} from "@heroui/react";
import { Info } from 'lucide-react';
import toast from "react-hot-toast";
import { saveMeetingOptions, getMeetingOptions } from '../action';

const MEETING_PLATFORMS = [
    { id: 'whatsapp', name: 'Whatsapp' },
    { id: 'zoom', name: 'Zoom' },
    { id: 'google_meet', name: 'Google Meet' },
    { id: 'other', name: 'Diğer' },
];

const LANGUAGES = [
    { id: 'turkish', name: 'Türkçe' },
    { id: 'english', name: 'İngilizce' },
    { id: 'french', name: 'Fransızca' },
    { id: 'german', name: 'Almanca' },
    { id: 'russian', name: 'Rusça' },
    { id: 'arabic', name: 'Arapça' },
    { id: 'other', name: 'Diğer' },
];

export default function MeetingOptions() {
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [otherPlatform, setOtherPlatform] = useState('');
    const [otherLanguage, setOtherLanguage] = useState('');

    useEffect(() => {
        getMeetingOptions().then(data => {
            if (!data) return;

            // Set platforms
            if (data.meetingOptions?.length > 0) {
                const platforms = data.meetingOptions.map(opt => {
                    const standardPlatform = MEETING_PLATFORMS.find(p => 
                        p.name.toLowerCase() === opt.name?.toLowerCase()
                    );
                    if (standardPlatform) {
                        return standardPlatform.id;
                    } else {
                        setOtherPlatform(opt.name ?? '');
                        return 'other';
                    }
                });
                setSelectedPlatforms(platforms);
            }

            // Set languages
            if (data.languages?.length > 0) {
                const languages = data.languages.map(lang => {
                    const standardLanguage = LANGUAGES.find(l => 
                        l.name.toLowerCase() === lang.name?.toLowerCase()
                    );
                    if (standardLanguage) {
                        return standardLanguage.id;
                    } else {
                        setOtherLanguage(lang.name ?? '');
                        return 'other';
                    }
                });
                setSelectedLanguages(languages);
            }
        }).catch(console.error);
    }, []);

    const handleSave = async () => {
        try {
            const platforms = selectedPlatforms.includes('other') 
                ? [...selectedPlatforms.filter(p => p !== 'other'), otherPlatform]
                : selectedPlatforms;

            const languages = selectedLanguages.includes('other')
                ? [...selectedLanguages.filter(l => l !== 'other'), otherLanguage]
                : selectedLanguages;

            await saveMeetingOptions({ 
                platforms: platforms.map(p => {
                    const platform = MEETING_PLATFORMS.find(mp => mp.id === p);
                    return platform ? platform.name : p;
                }),
                languages: languages.map(l => {
                    const language = LANGUAGES.find(lang => lang.id === l);
                    return language ? language.name : l;
                })
            });
            
            toast.success('Görüşme seçenekleri başarıyla kaydedildi');
        } catch (error) {
            toast.error('Görüşme seçenekleri kaydedilirken bir hata oluştu');
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-500" />
                    <p className="text-sm text-gray-600">
                        Görüşme hizmetinizi hangi platformdan vereceğinizi lütfen seçin. Ek hizmet dili seçeneğiniz Türkçe 
                        dışında hizmet vereceğiniz danışanlarınız içindir.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Meeting Platforms */}
                <Card>
                    <CardBody>
                        <h4 className="font-medium mb-4">Görüşme Platformu</h4>
                        <div className="space-y-3">
                            {MEETING_PLATFORMS.map(platform => (
                                <div key={platform.id}>
                                    <Checkbox
                                        isSelected={selectedPlatforms.includes(platform.id)}
                                        onValueChange={(isChecked) => {
                                            setSelectedPlatforms(prev => 
                                                isChecked
                                                    ? [...prev, platform.id]
                                                    : prev.filter(p => p !== platform.id)
                                            );
                                        }}
                                    >
                                        {platform.name}
                                    </Checkbox>
                                    {platform.id === 'other' && selectedPlatforms.includes('other') && (
                                        <Input
                                            className="mt-2"
                                            placeholder="Platform adını girin"
                                            value={otherPlatform}
                                            onChange={(e) => setOtherPlatform(e.target.value)}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>

                {/* Languages */}
                <Card>
                    <CardBody>
                        <h4 className="font-medium mb-4">Ek Hizmet Dili</h4>
                        <div className="space-y-3">
                            {LANGUAGES.map(language => (
                                <div key={language.id}>
                                    <Checkbox
                                        isSelected={selectedLanguages.includes(language.id)}
                                        onValueChange={(isChecked) => {
                                            setSelectedLanguages(prev =>
                                                isChecked
                                                    ? [...prev, language.id]
                                                    : prev.filter(l => l !== language.id)
                                            );
                                        }}
                                    >
                                        {language.name}
                                    </Checkbox>
                                    {language.id === 'other' && selectedLanguages.includes('other') && (
                                        <Input
                                            className="mt-2"
                                            placeholder="Dil adını girin"
                                            value={otherLanguage}
                                            onChange={(e) => setOtherLanguage(e.target.value)}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>
            </div>

            <div className="flex justify-end">
                <Button color="primary" onClick={handleSave}>
                    Kaydet
                </Button>
            </div>
        </div>
    );
} 