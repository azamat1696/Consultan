"use client"
import {useDisclosure} from "@heroui/use-disclosure";
import {Drawer, DrawerBody, DrawerContent, DrawerHeader} from "@heroui/drawer";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBars,
    faHeart,
    faPersonCirclePlus,
    faChevronRight,
    faX
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getMenus } from "@/app/(home)/action";

interface Category {
    id: number;
    title: string;
    slug: string;
}

interface Menu {
    id: number;
    title: string;
    type: "BlankMenu" | "DropDown" | "Relation";
    page_path: string | null;
    parentId: number | null;
    categoryId: number | null;
    status: boolean;
    children?: any[];
    category?: Category;
}

export default function MobileDrawer() {
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const [menus, setMenus] = useState<Menu[]>([]);
    const [expandedMenuId, setExpandedMenuId] = useState<number | null>(null);

    useEffect(() => {
        getMenus().then(setMenus as any).catch(console.error);
    }, []);

    const onChange = () => {
        if (isOpen) {
            onClose();
            setExpandedMenuId(null);
        } else {
            onOpen();
        }
    }

    const handleMenuClick = (menuId: number) => {
        setExpandedMenuId(expandedMenuId === menuId ? null : menuId);
    };

    const renderMenuItem = (menu: Menu) => {
        // BlankPage type - direct link
        if (menu.type === "BlankMenu" && menu.page_path) {
            return (
                <Link 
                    href={menu.page_path} 
                    className="flex items-center justify-between p-4 text-gray-700 hover:text-[#857B9E] hover:bg-gray-50"
                    onClick={() => onClose()}
                >
                    <span>{menu.title}</span>
                    <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
                </Link>
            );
        }

        // DropDown or Relation type
        if (menu.type === "DropDown" && menu.children && menu.children.length > 0) {
            return (
                <div className="border-b border-gray-100">
                    <button
                        onClick={() => handleMenuClick(menu.id)}
                        className="w-full flex items-center justify-between p-4 text-gray-700 hover:text-[#857B9E] hover:bg-gray-50"
                    >
                        <span>{menu.title}</span>
                        <FontAwesomeIcon 
                            icon={faChevronRight} 
                            className={`h-4 w-4 transition-transform duration-200 ${expandedMenuId === menu.id ? 'rotate-90' : ''}`}
                        />
                    </button>
                    {expandedMenuId === menu.id && (
                        <div className="bg-gray-50 py-2">
                            {menu.children?.map((child) => (
                                <div key={child.id} className="px-6 py-2">
                                    <div className="font-semibold text-gray-800 mb-2">
                                        {child.title}
                                    </div>
                                    {child.type === "BlankPage" && child.page_path ? (
                                        <Link 
                                            href={child.page_path}
                                            className="block py-2 text-gray-600 hover:text-[#857B9E]"
                                            onClick={() => onClose()}
                                        >
                                            {child.title}
                                        </Link>
                                    ) : child.categories && (
                                        <div className="space-y-1">
                                            {child.categories.map((category: Category) => (
                                                <Link
                                                    key={category.id}
                                                    href={`/kategoriler/${category.slug}`}
                                                    className="block py-2 text-gray-600 hover:text-[#857B9E]"
                                                    onClick={() => onClose()}
                                                >
                                                    {category.title}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div className="p-4 text-gray-700">
                {menu.title}
            </div>
        );
    };

    return (
        <>
            <div className="flex lg:hidden xl:hidden">
                {isOpen ? 
                    <FontAwesomeIcon icon={faX} color={'gray'} height={35} className="mr-4 cursor-pointer" onClick={onChange}/> :
                    <FontAwesomeIcon icon={faBars} color={'gray'} height={35} className="mr-4 cursor-pointer" onClick={onChange}/>
                }
            </div>
            <Drawer 
                backdrop="blur" 
                placement="left" 
                size="sm" 
                isOpen={isOpen} 
                onOpenChange={onOpenChange} 
                className="w-full" 
                hideCloseButton={false}
            >
                <DrawerContent className="z-[999] rounded-none shadow-none w-full">
                    {() => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1 items-center text-[#35303E] underline-offset-4 underline">
                                Ana Sayfa
                            </DrawerHeader>
                            <DrawerBody className="p-0">
                                <div className="flex flex-col">
                                    {menus.map(menu => renderMenuItem(menu))}
                                </div>
                                <Link 
                                    href="/consultant-register"
                                    className="flex items-center p-4 text-[#35303E] hover:bg-gray-50 mt-4"
                                    onClick={() => onClose()}
                                >
                                    <FontAwesomeIcon icon={faPersonCirclePlus} className="h-5 w-5 mr-3"/>
                                    <span>Danışman Ol</span>
                                </Link>
                            </DrawerBody>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </>
    );
}
