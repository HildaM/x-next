"use client"

import { app } from "@/firebase"
import { collection, getFirestore, orderBy, query } from "firebase/firestore"
import { useEffect } from "react"
import Comment from "./Comment"


export default function Comments({ id }) {
    const db = getFirestore(app)
    const [comments, setComments] = useState([])
    useEffect(() => {
        onSnapshot(query(collection(db, 'posts', id, 'comments')), orderBy('timestamp', 'desc'), (snapshot) => {
            setComments(snapshot.docs)
        })
    }, [db, id])

    return (
        <div>
            {comments.map((comment) => (
                <Comment key={comment.id} id={comment.id} comment={comment.data()} />
            ))}
        </div>
    )
}