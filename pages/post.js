import { auth, db } from "../utils/firebase";
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Post() {
  const [post, setPost] = useState({ description: "" });
  const [user, loading] = useAuthState(auth);
  const route = useRouter();
  const routeData = route.query;

  const submitPost = async (e) => {
    e.preventDefault();
    console.log("📩 Submitting post:", post);

    if (!post.description) {
      toast.error('Description field empty 😭', { position: "top-center", autoClose: 1500 });
      return;
    }
    if (post.description.length > 300) {
      toast.error('Description length is too long 🥺', { position: "top-center", autoClose: 1500 });
      return;
    }

    try {
      if (post?.id) {
        console.log("✏ Updating post ID:", post.id);
        const docRef = doc(db, 'posts', post.id);
        const updatedPost = { ...post, timestamp: serverTimestamp() };
        await updateDoc(docRef, updatedPost);
        console.log("✅ Post updated successfully");
        return route.push('/');
      } else {
        console.log("➕ Creating new post");
        const collectionRef = collection(db, 'posts');
        await addDoc(collectionRef, {
          ...post,
          timestamp: serverTimestamp(),
          user: user.uid,
          avatar: user.photoURL,
          username: user.displayName,
        });
        setPost({ description: "" });
        toast.success("Post has been created ✍️", { position: "top-center", autoClose: 1500 });
        console.log("✅ Post created successfully");
        setTimeout(() => route.push('/'), 1600);
      }
    } catch (error) {
      console.error("❌ Error saving post:", error);
    }
  };

  const checkUser = async () => {
    if (loading) {
      console.log("⏳ Auth still loading...");
      return;
    }
    if (!user) {
      console.warn("⚠ No user, redirecting to login.");
      route.push("/auth/login");
      return;
    }
    if (routeData.id) {
      console.log("✏ Editing post:", routeData);
      setPost({ description: routeData.description, id: routeData.id });
    }
  };

  useEffect(() => {
    if (route.isReady) {
      checkUser();
    }
  }, [user, loading, route.isReady]);

  return (
    <div className="my-20 p-12 shadow-lg rounded-lg max-w-md mx-auto bg-image">
      <form onSubmit={submitPost}>
        <h1 className="text-2xl font-bold text-black">
          {post.id ? 'Edit your Post' : 'Create your post'}
        </h1>
        <div className="py-2">
          <h3 className="text-lg font-bold py-1 text-black">Description</h3>
          <textarea
            value={post.description}
            onChange={(e) => setPost({ ...post, description: e.target.value })}
            className="bg-green-600 h-48 w-full rounded-lg text-white p-2"
          ></textarea>
          <p className={`font-bold text-sm ${post.description.length > 300 ? 'text-yellow-200' : ''}`}>
            {post.description.length}/300
          </p>
        </div>
        <button type="submit" className="w-full bg-cyan-600 text-white font-bold p-2 my-2 rounded-lg text-sm">
          Submit
        </button>
      </form>
    </div>
  );
}
