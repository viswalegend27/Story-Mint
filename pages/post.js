import {auth, ab, db } from "../utils/firebase";
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect , useState } from 'react'; 
import { addDoc, collection, doc, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";

export default function Post() {
  //Defining elements for form
  const [post, setPost] = useState({description : ""});
  //Defining user
  const[user, loading] = useAuthState(auth);
  //Defining router
  const route = useRouter();
  //Getting query from the existing data for updation(editing)
  const routeData = route.query;

  //Submitting post
  const submitPost = async (e) => {
    e.preventDefault();


    //Run checks for description
    if(!post.description){
      toast.error('Description field empty 😭',{
        position: "top-center",
        autoClose: 1500,
      });
      return;
    }
    //Run checks for post description's length
    if(post.description.length > 300){
      toast.error('Description length is too long 🥺',{
        position: "top-center",
        autoClose: 1500,
      });
      return;
    }

    if(post?.hasOwnProperty("id")){
      const docRef = doc(db,'posts',post.id);
      const updatedPost = {...post, timestamp: serverTimestamp()};
      await updateDoc(docRef,updatedPost);
      return route.push('/');
    }
    else {
      // Making a post
      const collectionRef = collection(db, 'posts');
      await addDoc(collectionRef, {
        ...post,
        timestamp: serverTimestamp(),
        user: user.uid,
        avatar: user.photoURL,
        username: user.displayName,
      });
      setPost({ description: "" });
      toast.success("Post has been created ✍️",{
          position: "top-center",
          autoClose: 1500,
        });
      setTimeout(() =>{
        return route.push('/');
      }, 1600)
      } 
  };


  //User check
  const checkUser = async () => {
    if(loading) return;
    if(!user) route.push("/auth/login");
    if(routeData.id){
      setPost({description: routeData.description, id: routeData.id})
    }
  };

  useEffect(() => {
    checkUser();
  },[user,loading]);

  return (
    <div className="my-20 p-12 shadow-lg rounded-lg max-w-md mx-auto bg-image">
      <form onSubmit={submitPost}>
        <h1 className="text-2xl font-bold text-black">
          {post.hasOwnProperty('id') ? 'Edit your Post' : 'Create your post'}
        </h1>
        <div className="py-2">
          <h3 className="text-lg font-bold py-1 text-black">Description</h3>
          <textarea value={post.description}
          onChange={(e) => setPost({...post,description: e.target.value})}
          className="bg-green-600 h-48 w-full rounded-lg text-white p-2"></textarea>
          <p className={`font-bold text-sm ${post.description.length > 300 ? 'text-yellow-200 font-extrabold text-sm' : ''}`}>{post.description.length}/300</p>
        </div>
        <button type="submit" className="w-full bg-cyan-600 text-white font-bold p-2 my-2 rounded-lg text-sm">Submit</button>
      </form>
    </div>
  )
}