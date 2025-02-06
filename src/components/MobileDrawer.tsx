"use client"
import {useDisclosure} from "@heroui/use-disclosure";
import {Drawer, DrawerBody, DrawerContent, DrawerHeader} from "@heroui/drawer";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBars,
    faHeart, faPersonCirclePlus,
    faPersonPregnant,
    faSuitcase,
    faX
} from "@fortawesome/free-solid-svg-icons";
import {Accordion, AccordionItem} from "@heroui/accordion";

export default function MobileDrawer() {
    const {isOpen, onOpen, onOpenChange,onClose} = useDisclosure();
    const onChange = () => {
        if (isOpen) {
            onClose();
        }else{
            onOpen();
        }
    }
    return (
        <>
            <div className="flex lg:hidden xl:hidden">
                {
                    isOpen ? <FontAwesomeIcon icon={faX} color={'gray'} height={35} className="mr-4 cursor-pointer" onClick={onChange}/>
                        :  <FontAwesomeIcon icon={faBars} color={'gray'} height={35} className="mr-4 cursor-pointer" onClick={onChange}/>
                }
            </div>
            <Drawer backdrop="blur" placement="left" size="sm" isOpen={isOpen} onOpenChange={onOpenChange} className="w-full" hideCloseButton={false}>
                <DrawerContent className="z-[999] rounded-none shadow-none w-full">
                    {() => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1 items-center text-red-500 underline-offset-4 underline">Ana Sayfa</DrawerHeader>
                            <DrawerBody>

                                <Accordion variant="light">
                                    <AccordionItem
                                        key="1"
                                        aria-label="Ruh Sağlığım İçin"
                                        title="Ruh Sağlığım İçin"
                                        startContent={<FontAwesomeIcon icon={faHeart} color={'red'} height={25}/>}
                                    >
                                        <ul className="space-y-2 ml-3">
                                            <li>Psikoloji</li>
                                            <li>Aile Danışmanlığı</li>
                                            <li>Cinsel Terapi</li>
                                            <li>Bütünsel Terapi</li>
                                            <li>Yaşam Koçu</li>
                                        </ul>
                                    </AccordionItem>
                                    <AccordionItem
                                        key="2"
                                        aria-label="Accordion 2"
                                        title="Bedenim İçin"
                                        startContent={<FontAwesomeIcon icon={faPersonPregnant} color={'red'} height={25}/>}
                                    >
                                        <ul className="space-y-2 ml-3">
                                            <li>Diyetisyen</li>
                                            <li>Spor</li>
                                            <li>Stil</li>
                                            <li>Fizyoterapi</li>
                                        </ul>
                                    </AccordionItem>
                                    <AccordionItem
                                        key="3"
                                        aria-label="Accordion 3"
                                        title="İşim İçin"
                                        startContent={<FontAwesomeIcon icon={faSuitcase} color={'red'} height={25}/>}
                                    >
                                        <ul className="space-y-2 ml-3">
                                            <li>Kariyer Koçu</li>
                                            <li>İş Koçu</li>
                                            <li>Yönetim Koçu</li>
                                            <li>İş Geliştirme</li>
                                        </ul>
                                    </AccordionItem>
                                </Accordion>
                                <div className="cursor-pointer flex justify-start items-center ml-2">
                                    <FontAwesomeIcon icon={faPersonCirclePlus} color={'red'} height={25} className="mr-2"/>
                                    <div>Danışman Ol</div>
                                </div>

                            </DrawerBody>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </>
    );
}
