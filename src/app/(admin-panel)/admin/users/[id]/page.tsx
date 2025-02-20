"use client"
import {useState, useEffect} from "react";
import {
     Card,
    CardBody,
    Divider,
    Button,
} from "@heroui/react";
import { Menu, Calendar, Package, User as UserIcon, Clock, MessageSquare, ShoppingCart, Settings, ArrowLeftIcon } from "lucide-react";
import Certificates from "./components/Certificates";
import Education from "./components/Education";
import ExpertiseComponent from "./components/Expertise";
import ContactInfo from "./components/ContactInfo";
import CalendarSettings from "./components/CalendarSettings";
import MeetingOptions from "./components/MeetingOptions";
import PriceDetails from "./components/PriceDetails";
import AboutYou from './components/AboutYou';
import BillingInfo from './components/BillingInfo';
import { useParams, useRouter } from 'next/navigation';
import { getUser } from "../actions";
import { User } from "@prisma/client";

export default function Page() {
    const [activeSection, setActiveSection] = useState("1");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const {id} = useParams();
    const idNumber = parseInt(id as string);
    const [user, setUser] = useState < User | null>(null);
    const router = useRouter();
  //  get user
  useEffect(() => {
    getUser(idNumber).then(data => {
        setUser(data as any);
    });
  }, []);
   

    return (
        <div className="flex flex-col md:flex-row gap-4 p-4">
         {/* Mobile Menu Button */}
         <Button 
                className="md:hidden mb-4" 
                variant="ghost"
                onPress={() => setIsDrawerOpen(true)}
            >
                <Menu className="h-6 w-6" />
            </Button>

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out
                md:relative md:transform-none md:transition-none
                ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <Card className="h-full">
                    <CardBody>
                        {/* Back Button */}
                        <Button
                            className="w-full mb-4 justify-start"
                            variant="light"
                            color="default"
                            onPress={() => router.push('/admin/users')}
                            startContent={<ArrowLeftIcon className="w-5 h-5" />}
                        >
                            Geri Git
                        </Button>
                        
                        <Divider className="my-4" />

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
                            <Button
                                className={`justify-start ${activeSection === "1" ? "bg-red-50 text-red-600" : ""}`}
                                variant="light"
                                onPress={() => setActiveSection("1")}
                            >
                                <UserIcon className="w-5 h-5 mr-2" />
                                İletişim Bilgileri
                            </Button>
                            
                            {user && user.role === "consultant" && (
                                <>
                                    <Button
                                        className={`justify-start ${activeSection === "2" ? "bg-red-50 text-red-600" : ""}`}
                                        variant="light"
                                        onPress={() => setActiveSection("2")}
                                    >
                                        <Calendar className="w-5 h-5 mr-2" />
                                        Eğitim Bilgileri
                                    </Button>
                                    
                                    <Button
                                        className={`justify-start ${activeSection === "3" ? "bg-red-50 text-red-600" : ""}`}
                                        variant="light"
                                        onPress={() => setActiveSection("3")}
                                    >
                                        <Package className="w-5 h-5 mr-2" />
                                        Uzmanlık Bilgileri
                                    </Button>
                                    <Button
                                        className={`justify-start ${activeSection === "4" ? "bg-red-50 text-red-600" : ""}`}
                                        variant="light"
                                        onPress={() => setActiveSection("4")}
                                    >
                                        <Calendar className="w-5 h-5 mr-2" />
                                        Takvim Ayarları
                                    </Button>
                                    
                                    <Button
                                        className={`justify-start ${activeSection === "5" ? "bg-red-50 text-red-600" : ""}`}
                                        variant="light"
                                        onPress={() => setActiveSection("5")}
                                    >
                                        <Clock className="w-5 h-5 mr-2" />
                                        Görüşme Seçenekleri
                                    </Button>
                                    
                                    <Button
                                        className={`justify-start ${activeSection === "6" ? "bg-red-50 text-red-600" : ""}`}
                                        variant="light"
                                        onPress={() => setActiveSection("6")}
                                    >
                                        <ShoppingCart className="w-5 h-5 mr-2" />
                                        Ücret Detayları
                                    </Button>
                                    
                                    <Button
                                        className={`justify-start ${activeSection === "7" ? "bg-red-50 text-red-600" : ""}`}
                                        variant="light"
                                        onPress={() => setActiveSection("7")}
                                    >
                                        <MessageSquare className="w-5 h-5 mr-2" />
                                        Kendinizi Anlatın
                                    </Button>
                                    
                                    <Button
                                        className={`justify-start ${activeSection === "8" ? "bg-red-50 text-red-600" : ""}`}
                                        variant="light"
                                        onPress={() => setActiveSection("8")}
                                    >
                                        <Settings className="w-5 h-5 mr-2" />
                                        Hesap Bilgileri
                                    </Button>
                                </>
                            )}
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
                    {activeSection === "1" && (
                        <ContactInfo />
                    )}

                    {user && user.role === "consultant" && (
                        <>
                            {activeSection === "2" && (
                                <div className="space-y-4">
                                    <Education />
                                    <Certificates />
                                </div>
                            )}
                            
                            {activeSection === "3" && (
                                <div className="space-y-4">
                                    <ExpertiseComponent />
                                </div>
                            )}
                            {activeSection === "4" && (
                                <CalendarSettings />
                            )}
                            
                            {activeSection === "5" && (
                                <MeetingOptions />
                            )}
                            
                            {activeSection === "6" && (
                                <PriceDetails />
                            )}
                            
                            {activeSection === "7" && (
                                <AboutYou />
                            )}
                            
                            {activeSection === "8" && (
                                <BillingInfo />
                            )}
                        </>
                    )}

                    <div className="flex justify-end mt-4">
                        
                                                 </div>
                </CardBody>
            </Card>
        </div>
    );
}
