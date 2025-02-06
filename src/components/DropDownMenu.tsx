"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getMenus } from "@/app/(home)/action";

interface Menu {
    id: number;
    title: string;
    type: "BlankPage" | "DropDown" | "Relation";
    page_path: string | null;
    parentId: number | null;
    categoryId: number | null;
    status: boolean;
    children?: Menu[];
    categories?: any[];
}

export default function DropDownMenu() {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    useEffect(() => {
        getMenus().then(setMenus as any).catch(console.error);
    }, []);

    const handleMenuClick = (menuId: number) => {
        setOpenMenuId(openMenuId === menuId ? null : menuId);
    };

    const renderMenuItem = (menu: Menu) => {
        // BlankPage type - direct link
        if (menu.type === "BlankPage" && menu.page_path) {
            return (
                <Link href={menu.page_path} className="px-4 py-2 hover:text-red-500">
                    {menu.title}
                </Link>
            );
        }

        // DropDown type with children or Relation type with categories
        if ((menu.type === "DropDown" && menu.children?.length > 0) || 
            (menu.type === "Relation" && menu.category?.length > 0)) {
            return (
                <div className="relative">
                    <button
                        className="px-4 py-2 hover:text-red-500"
                        onClick={() => handleMenuClick(menu.id)}
                    >
                        {menu.title}
                    </button>
                    {openMenuId === menu.id && (
                        <div className="absolute left-0 w-64 bg-white shadow-md rounded-md mt-2 p-4">
                            {menu.type === "DropDown" && menu.children?.map(child => (
                                <Link
                                    key={child.id}
                                    href={child.page_path || '#'}
                                    className="block py-2 px-4 hover:bg-gray-50 rounded-md"
                                >
                                    {child.title}
                                </Link>
                            ))}
                            {menu.type === "Relation" && menu.categories?.map(category => (
                                <Link
                                    key={category.id}
                                    href={category.page_path || '#'}
                                    className="block py-2 px-4 hover:bg-gray-50 rounded-md"
                                >
                                    {category.title}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        // Default case - just show title
        return (
            <span className="px-4 py-2">
                {menu.title}
            </span>
        );
    };

    return (
        <div className="relative hidden xl:block lg:block">
            <div className="w-full flex justify-center mt-5 gap-4">
                {menus.map(menu => (
                    <div key={menu.id}>
                        {renderMenuItem(menu)}
                    </div>
                ))}
            </div>
        </div>
    );
}
