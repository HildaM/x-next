import { collection, getDocs, getFirestore, orderBy, query } from "firebase/firestore"
import "firebase/firestore"
import { app } from "@/firebase"
import Post from "./Post"

export default async function Feed() {
    const db = getFirestore(app)
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'))  // 查询贴文并按时间戳降序排列（最新的在最前面）
    const querySnapshot = await getDocs(q)
    let data = []
    querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() })
    })

    return (
        <div>
            {data.map((post) => (
                <Post key={post.id} post={post} id={post.id} />
            ))}
        </div>
    )
}
