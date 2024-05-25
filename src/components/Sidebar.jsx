"use client"

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { SiOpenaigym } from "react-icons/si";
import { TiHome } from "react-icons/ti";
import { HiDotsHorizontal } from "react-icons/hi"

export default function Sidebar() {
    const { data: session } = useSession()

    return (
        // 利用 justify-between(space-between) 来实现两个元素首尾排列
        <div className="flex flex-col p-3 justify-between h-screen">
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
            
            {/* 只有当 session 不为空的时候，才能展示角色卡 */}
            {
                session && (
                    <div className="relative flex items-center rounded-full hover:bg-gray-100 cursor-pointer 
                        p-3 transition duration-200 text-gray-700 text-sm">
                        <img src={session.user.image} alt="user-img" className="h-10 w-10 rounded-full xl:mr-2"/>
                        <div className="hidden xl:inline">
                            <h4 className="font-bold">{ session.user.name }</h4>
                            <p className="text-gray-500 ">@{ session.user.username }</p>
                        </div>
                        <HiDotsHorizontal className='h-5 xl:ml-8 hidden xl:inline absolute right-3'/>
                    </div>
                )
            }

        </div>
    )
}
