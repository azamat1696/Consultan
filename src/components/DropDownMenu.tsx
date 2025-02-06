"use client";
import { useState } from "react";

export default function DropDownMenu() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative hidden xl:block lg:block">
            <div className="w-full flex justify-center mt-5 gap-4">
                <button
                    className=" "
                    onClick={() => setIsOpen(!isOpen)}
                >
                    Kendim İçin
                </button>
                <button
                    className=" "
                    onClick={() => setIsOpen(!isOpen)}
                >
                    Çocuk ve Anne
                </button>
                <button
                    className=" "
                    onClick={() => setIsOpen(!isOpen)}
                >
                    İşim İçin
                </button>
                <button
                    className=" "
                    onClick={() => setIsOpen(!isOpen)}
                >
                    Blog
                </button>
                <button
                    className="px-4 py-2 font-bold"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    Nasıl Çalışır?
                </button>
            </div>
            {isOpen && (
                <div
                    className="absolute left-0 w-full bg-white shadow-md rounded-md mt-2 p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                        <h3 className="text-lg font-bold mb-2">Ruh Sağlığım İçin</h3>
                        <ul className="space-y-2">
                            <li>Psikoloji</li>
                            <li>Aile Danışmanlığı</li>
                            <li>Cinsel Terapi</li>
                            <li>Bütünsel Terapi</li>
                            <li>Yaşam Koçu</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-2">Bedenim İçin</h3>
                        <ul className="space-y-2">
                            <li>Diyetisyen</li>
                            <li>Spor</li>
                            <li>Stil</li>
                            <li>Fizyoterapi</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-2">Enerji Terapisi</h3>
                        <ul className="space-y-2">
                            <li>Astroloji</li>
                            <li>Numeroloji</li>
                            <li>NLP</li>
                            <li>Reiki</li>
                            <li>Aile Dizimi</li>
                            <li>Human Design</li>
                            <li>Kozmik Enerji</li>
                            <li>Theta Healing</li>
                            <li>Mindfulness</li>
                            <li>JAAS</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
