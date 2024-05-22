"use client"

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { SiOpenaigym } from "react-icons/si";
import { TiHome } from "react-icons/ti";

export default function Sidebar() {
    const { data: session } = useSession()

    return (
        <div className="flex flex-col gap-4 p-3">
            <Link href="/">
                <SiOpenaigym className="w-16 h-16 cursor-pointer p-3 hover:bg-gray-100 rounded-full transition-all duration-200"/>
            </Link>
            <Link href="/" className="flex items-center p-3 hover:bg-gray-100 rounded-full 
                transition-all duration-200 gap-2 w-fit">
                <TiHome className="w-7 h-7"/>
                <span className="font-bold hidden xl:inline">Home</span>
            </Link>

            {/* 根据session来判断用户是否登录 */}
            {session ? (
                <button className="bg-blue-400 text-white rounded-full mt-4 hover:brightness-95
                    transition-all duration-200 w-48 h-9 shadow-md hidden xl:inline"
                    onClick={() => signOut()}
                >
                    Sign Out
                </button>
            ) : (
                <button className="bg-blue-400 text-white rounded-full mt-4 hover:brightness-95
                    transition-all duration-200 w-48 h-9 shadow-md hidden xl:inline"
                    onClick={() => signIn()}
                >
                    Sign In
                </button>
            )}

        </div>
    )
}
