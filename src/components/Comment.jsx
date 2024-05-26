"use client"

import { getFirestore, or } from "firebase/firestore"
import { HiDotsHorizontal } from "react-icons/hi"
import { HiHeart, HiOutlineHeart } from "react-icons/hi"
import {app} from "@/firebase"
import { collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore"
import { signIn, useSession } from "next-auth/react"
import { useEffect, useState } from "react"


export default function Comment({ comment, commentId, originalPostId }) {

    const [isLiked, setIsLiked] = useState(false)
    const [likes, setLikes] = useState([])
    const db = getFirestore(app)
    const { data: session } = useSession()

    const likePost = async () => {
        if (!session) return signIn()

        // 如果已经点赞，则取消点赞
        if (isLiked) {
            await deleteDoc(doc(db, 'posts', originalPostId, 'comments', commentId, 'likes', session?.user.uid))
        } else {
            await setDoc(doc(db,  originalPostId, 'comments', commentId, 'likes', session.user.uid), {
                username: session.user.username,
                timestamp: serverTimestamp(),
            })
        }
    }

    useEffect(() => {
        onSnapshot(collection(db, 'posts', originalPostId, 'comments', commentId, 'likes'), (snapshot) => {
            setLikes(snapshot.docs)
        })
    }, [db])
    useEffect(() => {
        setIsLiked(likes.findIndex(like => like.id === session?.user?.uid) !== -1)
    }, [likes])


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

                <div className="flex items-center">
                    {isLiked ?
                    (
                        <HiHeart className="h-8 w-8 cursor-pointer rounded-full transition duration-500 ease-in-out p-2 hover:text-sky-500 hover:bg-red-100 text-red-600"
                            onClick={likePost}
                        />
                    ) :
                    (
                        <HiOutlineHeart className="h-8 w-8 cursor-pointer rounded-full transition duration-500 ease-in-out p-2 hover:text-sky-500 hover:bg-red-100"
                            onClick={likePost}
                        />
                    )
                    }

                    {/* 如果存在点赞，则数字也要变红 */}
                    {likes.length > 0 && <span className={`text-xs ${isLiked && "text-red-600"}`}>{likes.length}</span>}
                </div>
            </div>
        </div>
    )
}
