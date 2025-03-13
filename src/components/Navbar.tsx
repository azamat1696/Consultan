"use client"
import Image from "next/image";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope} from "@fortawesome/free-regular-svg-icons";
import DropDownMenu from "@/components/DropDownMenu";

import {MyAccountDropdownMenu} from "@/components/MyAccountDropdownMenu";
import MobileDrawer from "@/components/MobileDrawer";
import {signOut,useSession} from "next-auth/react";
export default function Navbar(){
    const session = useSession()
    return (
        <nav className="flex w-full border-b-[1px] border-[#f2f2f2]  pt-9 pb-4 bg-white relative shadow-sm z-[9]">
            <div className="lg:px-10 xl:container 2xl:container w-full mx-auto px-3">
                <div className="w-full flex flex-wrap lg:flex-nowrap justify-between items-start gap-3">

                    <div className="w-1/4 flex-none order-1">
                        <div className="flex justify-between items-center">
                            <MobileDrawer/>
                            <Link href="/">
                                <Image
                                    src="/assets/icons/logo.png"
                                    alt="logo"
                                    width={230}
                                    height={25}
                                    className="lg:hidden xl:hidden  transition ease-out"
                                />
                            </Link>
                        </div>
                        <Link href="/">
                            <Image
                                src="/assets/icons/logo.png"
                                alt="logo"
                                width={230}
                                height={50}
                                className="hidden lg:flex xl:flex transition ease-out"
                            />
                        </Link>
                    </div>

                    <div className="lg:w-1/2 w-full flex-none order-3 lg:order-2 lg:mt-0 mt-8">
                        <SearchBar/>
                    </div>

                    <div className="w-1/4 flex-none order-2 lg:order-3 mr-4 flex justify-center items-center">
                        <div className="relative">

                                    <MyAccountDropdownMenu/>

                        </div>
                        {/* <div className="cursor-pointer flex justify-between items-center">
                            <FontAwesomeIcon icon={faEnvelope} color={'#35303E'} height={25} className="mr-4"/>
                        </div> */}
                        <div className="cursor-pointer sm:flex justify-between items-center hidden">
                            <Link  href="/danisman/kayit-ol"
                                  className="text-xs font-semibold transition ease-out uppercase border-1.5 py-1.5 px-3 rounded-full border-[#35303E] text-[#35303E]  transform scale-80 cursor-pointer">
                                Danışman Ol
                            </Link>
                        </div>
                    </div>
                </div>
                <DropDownMenu/>
            </div>
        </nav>
    )
}
