"use client"
import {useState} from "react";
import {Controller} from "react-hook-form";
import {
     Card,
    CardBody,
    Accordion, 
    AccordionItem,
    Divider,
    Button,
} from "@heroui/react";
import { Link as LinkIcon, Menu, Home, Calendar, Users, Package, User, Clock, MessageSquare, ShoppingCart, Bell, Settings, HelpCircle } from "lucide-react";
import Link from "next/link";

import Certificates from "./components/Certificates";
import Education from "./components/Education";
import ExpertiseComponent from "./components/Expertise";
import ContactInfo from "./components/ContactInfo";
import CalendarSettings from "./components/CalendarSettings";
import MeetingOptions from "./components/MeetingOptions";
import PriceDetails from "./components/PriceDetails";
import AboutYou from './components/AboutYou';
import BillingInfo from './components/BillingInfo';
export default function Page() {
    const [activeSection, setActiveSection] = useState("1");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <div className="flex flex-col md:flex-row gap-4 p-4 h-screen container mx-auto">
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
                            <Link href="/consultant/support" className="flex items-center gap-2 p-2 hover:bg-gray-100 hover:text-red-600 rounded-lg transition-colors">
                                <HelpCircle className="w-5 h-5" />
                                <span>Destek Hattım</span>
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
                    <Accordion 
                        selectedKeys={[activeSection]}
                        onSelectionChange={(keys) => {
                            const key = Array.from(keys)[0];
                            if (key) {
                                setActiveSection(key.toString());
                            }
                        }}
                    >
                        <AccordionItem key="1" title="İletişim Bilgileri">
                            <ContactInfo />
                        </AccordionItem>
                        
                        <AccordionItem key="2" title="Eğitim Bilgileri">
                            <div className="space-y-4">
                             { /* Education Component */}
                            <Education /> 
                            {/* Certificates Component */}
                            <Certificates />
                            </div>
                        </AccordionItem>

                        <AccordionItem key="3" title="Uzmanlık Bilgileri">
                            <div className="space-y-4">
                             <ExpertiseComponent />
                            </div>
                        </AccordionItem>

                        <AccordionItem key="4" title="Takvim Ayarları">
                            <CalendarSettings />
                        </AccordionItem>

                        <AccordionItem key="5" title="Görüşme Seçenekleri">
                            <MeetingOptions />
                        </AccordionItem>

                        <AccordionItem key="6" title="Ücret Detayları">
                            <PriceDetails />
                        </AccordionItem>

                        <AccordionItem key="7" title="Kendinizi Anlatın">
                            <AboutYou />
                        </AccordionItem>

                        <AccordionItem key="8" title="Hesap Bilgileri">
                            {/* Account Information Form */}
                            <BillingInfo /> 
                        </AccordionItem>
                    </Accordion>

                    <div className="flex justify-end mt-4">
                        
                                                 </div>
                </CardBody>
            </Card>
        </div>
    );
}
