import Message from "@/components/message"
import { auth , db} from "@/utils/firebase"
import { arrayUnion, onSnapshot, Timestamp } from "firebase/firestore"
import { useRouter } from "next/router"
import { useEffect , useState} from "react"
import { toast } from "react-toastify"
import { doc, updateDoc } from "firebase/firestore"

export default function Details(){
  const router = useRouter();
  const routeData = router.query;
  const [message, setMessage] = useState('');
  const [allMessages, setAllMessages] = useState([]);
  
  //Submiting a message
  const submitMessage = async() => {
    if(!auth.currentUser) return router.push('/auth.login');

    if(!message){
      toast.error("Don't leave an empty message 😓",
      { position: "top-center", autoClose: 1500 });
      return;
    }
    //Creating a comment in your firebase datastore
    const docRef = doc(db,"posts",routeData.id);
    await updateDoc(docRef, {
      comments: arrayUnion ({
        message,
        avatar: auth.currentUser.photoURL,
        userName: auth.currentUser.displayName,
        time: Timestamp.now(),
      }),
    });
    
    setMessage("");
  }
  //Get comments
  const getComments = () => {
    const docRef = doc(db, 'posts', routeData.id);// Reference
    const unsubscribe = onSnapshot (docRef, (snapshot) => {
      if(snapshot.exists()) {
        setAllMessages(snapshot.data().comments || []);;
      } else {
        console.log("No such document!");
        setAllMessages([]);
      }
    });
    return unsubscribe;
  };

  useEffect(()=>{
    if(!router.isReady) return;
    const unsubscribe = getComments();// Cleanup on unmount
    return ()=> unsubscribe(); // Rerun if routeData.id changes
  },[routeData.id]);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Message {...routeData}></Message>
      <div className="my-4">
        <div className="flex items-center space-x-4 bg-gray-800 rounded-lg p-2 shadow-md">
          <input onChange={(e) => setMessage(e.target.value)} 
          type="text" 
          value={message} 
          className="bg-blue-900 flex-1 text-white text-sm placeholder-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 rounded-md"
          placeholder="Send a message 🤗"/>
          <button className="bg-green-600 text-white font-medium py-2 px-4 rounded-md hover:bg-green-700 text-sm transition duration-200" onClick={submitMessage}>
          Submit</button>
        </div>
        <div className="py-6">
          <h2 className="font-bold">Comments</h2>
          {Array.isArray(allMessages) && allMessages.length > 0 ? (
            allMessages.map(message => (
              <div className="bg-white p-4 my-4 border-2" key={message.time}>
                <div className="flex items-center gap-2 mb-4">
                  <img className="w-10 rounded-full" src={message.avatar} alt="" />
                  <h2>{message.userName}</h2>
                </div>
                <h2>{message.message}</h2>
              </div>
            ))
          ) : (
          <p>No comments yet!</p>
          )
        }
        </div>
      </div>
    </div>
  )
}