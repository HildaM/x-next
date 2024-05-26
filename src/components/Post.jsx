import Link from "next/link"
import { HiDotsHorizontal } from "react-icons/hi"
import Icons from "./Icons"

export default function Post({ post, id }) {
    return (
        <div className="flex p-3 border-b border-gray-200 hover:bg-gray-50">
            {/* 左边头像 */}
            <img src={post?.profileImg} alt="user-img" className="h-11 w-11 rounded-full mr-4" />

            {/* 右边贴文 */}
            <div className="flex-1">
                {/* 贴文头部个人信息 */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 whitespace-nowrap">
                        <h4 className="font-bold text-sm truncate">{ post?.name }</h4>
                        <span className="text-sm truncate">@{ post?.username }</span>
                    </div>
                    <HiDotsHorizontal className="text-xl" />
                </div>
                
                {/* 贴文正文 */}
                <Link href={`/post/${id}`}>
                    <p className="text-gray-800 text-sm my-3">{ post?.text }</p>
                </Link>
                <Link href={`/post/${id}`}>
                    <img src={post?.image} className="rounded-2xl mr-2" />
                </Link>

                <Icons />
            </div>
        </div>
    )
}
