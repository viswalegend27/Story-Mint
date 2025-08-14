import { auth, db } from "../utils/firebase";
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import Message from "@/components/message";
import { BsTrash2Fill } from 'react-icons/bs';
import { AiFillEdit } from 'react-icons/ai';
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);

  // Sign out
  const handleSignOut = () => {
    console.log("🔹 Signing out user...");
    auth.signOut()
      .then(() => {
        console.log("✅ Sign-out successful");
        router.push('/auth/login');
      })
      .catch((error) => console.error('❌ Sign-out error:', error));
  };

  // Fetch posts
  const getData = async () => {
    if (loading) {
      console.log("⏳ Auth still loading...");
      return;
    }
    if (!user) {
      console.warn("⚠ No user found, redirecting to login.");
      router.push('/auth/login');
      return;
    }

    console.log("📡 Fetching posts for user:", user.uid);
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, where('user', '==', user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      console.log("✅ Posts fetched:", postsData);
      setPosts(postsData);
    }, (error) => {
      console.error("❌ Error fetching posts:", error);
    });

    return unsubscribe;
  };

  // Delete post
  const deletePost = async (id) => {
    console.log("🗑 Deleting post:", id);
    try {
      const docRef = doc(db, 'posts', id);
      await deleteDoc(docRef);
      console.log("✅ Post deleted successfully");
    } catch (error) {
      console.error("❌ Error deleting post:", error);
    }
  };

  useEffect(() => {
    getData();
  }, [user, loading]);

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <h1 className="text-1xl font-bold mb-4">Your posts</h1>
      <div>
        {posts.map(post => (
          <Message {...post} key={post.id}>
            <div className="flex gap-4">
              <button
                onClick={() => deletePost(post.id)}
                className="text-green-700 hover:bg-green-600 hover:text-black duration-900 rounded-md flex items-center justify-center gap-2 py-2 px-2 text-sm"
              >
                <BsTrash2Fill className="text-2xl" /> Delete
              </button>
              <Link href={{ pathname: "/post", query: post }}>
                <button className="text-green-700 hover:bg-green-600 hover:text-yellow-400 duration-900 rounded-md flex items-center justify-center gap-2 py-2 px-2 text-sm">
                  <AiFillEdit className="text-2xl" /> Edit
                </button>
              </Link>
            </div>
          </Message>
        ))}
      </div>
      <button
        onClick={handleSignOut}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Sign out
      </button>
    </div>
  );
}
