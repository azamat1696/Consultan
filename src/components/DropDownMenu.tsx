"use client";
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

export default function DropDownMenu() {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    useEffect(() => {
        getMenus().then(setMenus as any).catch(console.error);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openMenuId && !(event.target as Element).closest('.menu-dropdown')) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openMenuId]);

    const handleMenuClick = (menuId: number) => {
        setOpenMenuId(openMenuId === menuId ? null : menuId);
    };
    console.log(menus);

    const renderMenuItem = (menu: Menu) => {
        // BlankPage type - direct link
        if (menu.type === "BlankMenu" && menu.page_path) {
            return (
                <Link href={menu.page_path} className="text-gray-700 hover:text-red-500 font-medium transition-colors duration-300 ease-in-out hover:scale-105">
                    {menu.title}
                </Link>
            );
        }

        // DropDown or Relation type
        if ((menu.type === "DropDown" && menu.children && menu.children?.length > 0)) {
        
            return (
                <div className="relative group menu-dropdown transition-colors duration-300 ease-in-out hover:scale-105">
                    <button
                        className={`text-gray-700 hover:text-red-500 font-medium py-2 ${openMenuId === menu.id ? 'text-red-500' : ''}`}
                        onClick={() => handleMenuClick(menu.id)}
                    >
                        {menu.title}
                    </button>
                    {openMenuId === menu.id && (
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-[800px] bg-white shadow-lg rounded-lg p-6 grid grid-cols-3 gap-8 z-50 mt-2">
                            {menu.children?.map((child, index) => (
                                <div key={child.id} className={`${index > 0 ? 'border-l pl-8' : ''}`}>
                                    <span className="font-semibold text-gray-800 mb-1 border-b border-gray-800 pb-2 text-lg">
                                        {child.title}
                                    </span>
                                    {child.type === "BlankPage" && child.page_path ? (
                                        <Link 
                                            href={child.page_path}
                                            className="text-gray-600 hover:text-red-500"
                                        >
                                            {child.title}
                                        </Link>
                                    ) : child.category && (
                                        <Link
                                            href={`/kategoriler/${child.category.slug}`}
                                            className="block py-2 text-gray-600 hover:text-red-500 transition-colors"
                                        >
                                            {child.category.title}
                                        </Link>
                                    )}
                                </div>
                            ))}
                           
                        </div>
                    )}
                </div>
            );
        }

        return (
            <span className="text-gray-700 font-medium">
                {menu.title}
            </span>
        );
    };

    return (
        <div className="bg-white hidden md:block">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-center items-center h-16 gap-12">
                    {menus.map(menu => (
                        <div key={menu.id}>
                            {renderMenuItem(menu)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
