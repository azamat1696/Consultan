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
    const [hoveredMenuId, setHoveredMenuId] = useState<number | null>(null);

    useEffect(() => {
        getMenus().then(setMenus as any).catch(console.error);
    }, []);

    const handleMouseEnter = (menuId: number) => {
        setHoveredMenuId(menuId);
    };

    const handleMouseLeave = () => {
        setHoveredMenuId(null);
    };

    const renderMenuItem = (menu: Menu) => {
        // BlankPage type - direct link
        if (menu.type === "BlankMenu" && menu.page_path) {
            return (
                <Link href={menu.page_path} className="text-gray-700 hover:text-[#857B9E] font-medium transition-colors duration-300 ease-in-out hover:scale-105">
                    {menu.title}
                </Link>
            );
        }

        // DropDown or Relation type
        if ((menu.type === "DropDown" && menu.children && menu.children?.length > 0)) {
        
            return (
                <div 
                    className="menu-dropdown group"
                    onMouseEnter={() => handleMouseEnter(menu.id)}
                    onMouseLeave={handleMouseLeave}
                >
                    <button
                        className={`text-gray-700 hover:text-[#857B9E] font-medium py-2 transition-colors duration-300 ease-in-out hover:scale-105 ${hoveredMenuId === menu.id ? 'text-[#857B9E]' : ''}`}
                    >
                        {menu.title}
                    </button>
                    {hoveredMenuId === menu.id && (
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-[800px] bg-white shadow-lg rounded-lg p-6 grid grid-cols-3 gap-8 z-50">
                            {menu.children?.map((child, index) => (
                                <div key={child.id} className={`${index > 0 ? 'border-l pl-8' : ''}`}>
                                    <span className="font-semibold text-gray-800 mb-1 border-b border-gray-800 pb-2 text-lg block">
                                        {child.title}
                                    </span>
                                    <div className="mt-4">
                                        {child.type === "BlankPage" && child.page_path ? (
                                            <Link 
                                                href={child.page_path}
                                                className="text-gray-600 hover:text-[#857B9E]"
                                            >
                                                {child.title}
                                            </Link>
                                        ) : child.categories && (
                                            <div className="space-y-2">
                                                {child.categories.map((category: Category) => (
                                                    <Link
                                                        key={category.id}
                                                        href={`/kategoriler/${category.slug}`}
                                                        className="block py-2 text-gray-600 hover:text-[#857B9E] transition-colors"
                                                    >
                                                        {category.title}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
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
