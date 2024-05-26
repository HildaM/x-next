"use client"

import { HiDotsHorizontal } from "react-icons/hi"

export default function Comment({ comment, id }) {

    return (
        <div className="flex p-3 border-b border-gray-200 hover:bg-gray-50 pl-10">
            {/* 左边头像 */}
            <img src={comment?.userImg} alt="user-img" className="h-9 w-9 rounded-full mr-4" />

            {/* 右边贴文 */}
            <div className="flex-1">
                {/* 贴文头部个人信息 */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 whitespace-nowrap">
                        <h4 className="font-bold text-sm truncate">{ comment?.name }</h4>
                        <span className="text-xs truncate">@{ comment?.username }</span>
                    </div>
                    <HiDotsHorizontal className="text-xl" />
                </div>
                
                {/* 贴文正文 */}
                <p className="text-gray-800 text-xs my-3">{ comment?.comment }</p>

            </div>
        </div>
    )
}
