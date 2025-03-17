"use client";
import { LogIn, PlusCircle } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {faSignOut} from "@fortawesome/free-solid-svg-icons/faSignOut";

export function MyAccountDropdownMenu() {
    const router = useRouter();
    const { data: session,status } = useSession();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex justify-between items-center active:scale-95 transition transform duration-150 cursor-pointer">
                    <FontAwesomeIcon icon={faUser} color={"#35303E"} height={45} className="mr-8" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 z-[99999] mt-5">
                <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    { status === "unauthenticated" ? (
                        <>
                            <DropdownMenuItem onClick={() => router.push("/signin")}>
                                <LogIn color="#35303E" />
                                <span className="text-gray-500 font-bold text-md">Giriş</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push("/kayit-ol")}>
                                <PlusCircle color="#35303E" />
                                <span className="text-gray-500 font-bold text-md">Kayıt Ol</span>
                            </DropdownMenuItem>
                        </>
                    ) : (
                        <>
                            <DropdownMenuItem onClick={() => router.push(`/${session?.user?.role}`)}>
                                <FontAwesomeIcon icon={faUser} color="#35303E" />
                                <span className="text-gray-500 font-bold text-md">Hesabım</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => signOut()}>
                                <FontAwesomeIcon icon={faSignOut} color="#35303E" />
                                <span className="text-gray-500 font-bold text-md">Çıkış Yap</span>
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
