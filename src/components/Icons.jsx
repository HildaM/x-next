"use client"

import { HiOutlineChat, HiOutlineHeart, HiOutlineTrash, HiHeart } from "react-icons/hi"
import { useSession, signIn } from "next-auth/react"
import { collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore"
import { app } from "@/firebase"
import { useEffect } from "react"

export default function Icons({ id }) {
    const { data: session } = useSession()
    const db = app.firestore(app)
    const [isLiked, setIsLiked] = useState(false)
    const [likes, setLikes] = useState([])
    const likePost = async () => {
        if (!session) return signIn()

        // 如果已经点赞，则取消点赞
        if (isLiked) {
            await deleteDoc(doc(db, 'posts', id, 'likes', session?.user.uid))
        } else {
            await setDoc(doc(db, 'posts', id, 'likes', session.user.uid), {
                username: session.user.username,
                timestamp: serverTimestamp(),
            })
        }
    }

    // 状态监控
    useEffect(() => {
        onSnapshot(collection(db, 'posts', id, 'likes'), (snapshot) => {
            setLikes(snapshot.docs)
        })
    }, [db])
    useEffect(() => {
        setIsLiked(likes.findIndex(like => like.id === session?.user?.uid) !== -1)
    }, [likes])


    return (
        <div className='flex justify-start gap-5 p-2 text-gray-500'>
            <HiOutlineChat className="h-8 w-8 cursor-pointer rounded-full transition duration-500 ease-in-out p-2 hover:text-sky-500 hover:bg-sky-100"/>

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

            <HiOutlineTrash className="h-8 w-8 cursor-pointer rounded-full transition duration-500 ease-in-out p-2 hover:text-sky-500 hover:bg-red-100"/>
        </div>
    )
}
