"use client"

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react"
import { HiOutlinePhotograph } from "react-icons/hi";
import { app } from "@/firebase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection, getFirestore, serverTimestamp } from "firebase/firestore";

export default function Input() {
    // 从 useSession() 函数的返回值中提取 data 属性，并将其重命名为 session
    const { data: session } = useSession()

    // 图片 + 文字上传与展示
    const imagePickRef = useRef(null)
    const [imageFileUrl, setImageFileUrl] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [imageFileUploading, setImageFileUploading] = useState(false)
    const [text, setText] = useState('')
    const [postLoading, setPostLoading] = useState(false)
    const addImageToPost = (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedFile(file)
            setImageFileUrl(URL.createObjectURL(file))
        }
    }
    useEffect(() => {
        if (selectedFile) {
            uploadImageToStorage()
        }
    }, [selectedFile])

    const uploadImageToStorage = () => {
        setImageFileUploading(true)
        const storage = getStorage(app)
        const fileName = new Date().getTime() + "-" + selectedFile.name     // 避免相同文件上传造成覆盖
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, selectedFile)
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                console.log('Upload is ' + progress + '% done')
            },
            (error) => {
                console.log(error)
                setImageFileUploading(false)
                setImageFileUrl(null)
                setSelectedFile(null)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL)
                    setImageFileUploading(false)
                    setImageFileUrl(downloadURL)
                })
            },
        )
    }

    // Post 上传贴文到firebase
    const db = getFirestore(app)
    const handleSummit = async () => {
        setPostLoading(true)
        const docRef = await addDoc(collection(db, 'posts'), {
            uid: session.user.uid,
            name: session.user.name,
            username: session.user.username,
            text: text,
            profileImg: session.user.image,
            timestamp: serverTimestamp(),
            image: imageFileUrl,
        })

        // 上传成功后，清空输入框
        setPostLoading(false)
        setText('')
        setImageFileUrl(null)
        setSelectedFile(null)
        // 刷新网页获取最新贴文
        location.reload()
    }



    if (!session) return null
    return (
        <div className="flex border-b border-gray-200 p-3 space-x-3 w-full">
            <img src={session.user.image} alt="user-img" className="h-11 w-11
                rounded-full cursor-pointer hover:brightness-95" />
            
            <div className="w-full divide-y divide-gray-200">
                <textarea placeholder="Whats happening" rows="2" 
                    className="w-full border-none outline-none tracking-wide min-h-[50px] text-gray-700"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />

                {selectedFile && (
                    <img 
                        src={imageFileUrl} alt='image' 
                        className={`w-full max-h-[250px] object-cover cursor-pointer
                            ${imageFileUploading ? 'animate-pulse' : ''}`}      // 上传图片时添加动画
                    />
                )}

                <div className="flex items-center justify-between pt-2.5">
                    <HiOutlinePhotograph className="h-10 w-10 p-2 text-sky-500 
                        hover:bg-sky-100 rounded-full cursor-pointer" 
                        onClick={() => imagePickRef.current.click()}
                    />
                    <input type="file" ref={imagePickRef} accept='image/*' onChange={addImageToPost} className="hidden"/>

                    <button 
                        disabled={text.trim() === '' || postLoading || imageFileUploading}
                        className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
                        onClick={handleSummit}
                    >
                        Post
                    </button>
                </div>
                
            </div>
        </div>
    )
}
