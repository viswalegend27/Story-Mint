import { auth, db } from "../utils/firebase";
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect , useState } from 'react';
import { collection, query, where, onSnapshot, doc, deleteDoc} from "firebase/firestore";
import Message from "@/components/message";
import {BsTrash2Fill} from 'react-icons/bs'
import {AiFillEdit} from 'react-icons/ai';
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);
  
  //Handling sign out button
  const handleSignOut = () => {
    auth.signOut()
    .then(() => {router.push('/auth/login');}).
    catch((error) => console.error('Sign-out error:', error));
  };


  //To verify that the user is logged in
  const getData = async () => {
    //Check if the user is present
    if(loading) return;
    //If not revert back to login page
    if(!user) return router.push('/auth/login');
    const collectionRef = collection(db, "posts"); 
    const q = query(collectionRef, where('user','==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
    const postsData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setPosts(postsData);
    }, (error) => {
    console.error("Error fetching posts:", error);
    toast.error("Failed to load posts: " + error.message, 
      { position: "top-center", autoClose: 1000 });
    });

    return unsubscribe;
  }

  //Deletion processing function
  const deletePost = async (id) => {
    //Getting the reference to the actual document instead of the collection as we done in previous functioning
    const docRef = doc(db,'posts',id);
    await deleteDoc(docRef);
  };

  //Running the getData to get the user's information
  useEffect(() => {
    getData();
  },[user, loading]);

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <h1 className="text-1xl font-bold mb-4">Your posts</h1>
      <div>{posts.map(post=>{
        return <Message {...post} key={post.id}>
          <div className="flex gap-4">
            <button onClick= {()=> deletePost(post.id)} className="text-green-700 hover:bg-green-600 hover:text-black  duration-900 rounded-md flex items-center justify-center gap-2 py-2 px-2 text-sm">
              <BsTrash2Fill className="text-2xl"/>Delete</button>
            <Link href={{pathname: "/post", query:post}}>
            <button className="text-green-700 hover:bg-green-600 hover:text-yellow-400 duration-900 rounded-md flex items-center justify-center gap-2 py-2 px-2 text-sm"><AiFillEdit className="text-2xl"/>Edit</button>
            </Link>
          </div>
        </Message>;
      })}</div>
      <button onClick={handleSignOut}
      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" >Sign out</button>
    </div>
  );
}

