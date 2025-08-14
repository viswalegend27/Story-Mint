import Message from "@/components/message";
import { auth, db } from "@/utils/firebase";
import { arrayUnion, onSnapshot, Timestamp, doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Details() {
  const router = useRouter();
  const routeData = router.query;
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);

  // Submit a message
  const submitMessage = async () => {
    console.log("Submit button clicked");

    if (!auth.currentUser) {
      console.warn("No user detected. Redirecting to login...");
      return router.push("/auth/login");
    }

    if (!message.trim()) {
      console.warn("Empty message detected");
      toast.error("Don't leave an empty message 😓", {
        position: "top-center",
        autoClose: 1500,
      });
      return;
    }

    try {
      console.log("Submitting message:", message);
      const docRef = doc(db, "posts", routeData.id);
      await updateDoc(docRef, {
        comments: arrayUnion({
          message: message.trim(),
          avatar: auth.currentUser.photoURL,
          userName: auth.currentUser.displayName,
          time: Timestamp.now(),
        }),
      });
      console.log("Message submitted successfully");
      setMessage("");
    } catch (error) {
      console.error("Error submitting message:", error);
      toast.error("Something went wrong while sending the message");
    }
  };

  // Get comments in real-time
  const getComments = () => {
    console.log("Fetching comments for post ID:", routeData.id);
    const docRef = doc(db, "posts", routeData.id);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const comments = snapshot.data().comments || [];
          console.log("Fetched comments:", comments);
          setAllMessages(comments);
        } else {
          console.warn("No such document found in Firestore");
          setAllMessages([]);
        }
      },
      (error) => {
        console.error("Error fetching comments:", error);
      }
    );

    return unsubscribe;
  };

  useEffect(() => {
    if (!router.isReady || !routeData.id) {
      console.log("Router not ready or missing routeData.id");
      return;
    }

    console.log("Starting comments listener for ID:", routeData.id);
    const unsubscribe = getComments();
    return () => {
      console.log("Unsubscribing from comments listener");
      unsubscribe();
    };
  }, [router.isReady, routeData.id]);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Message {...routeData}></Message>

      <div className="my-4">
        {/* Input box */}
        <div className="flex items-center space-x-4 bg-gray-800 rounded-lg p-2 shadow-md">
          <input
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            value={message}
            className="bg-blue-900 flex-1 text-white text-sm placeholder-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 rounded-md"
            placeholder="Send a message 🤗"
          />
          <button
            className="bg-green-600 text-white font-medium py-2 px-4 rounded-md hover:bg-green-700 text-sm transition duration-200"
            onClick={submitMessage}
          >
            Submit
          </button>
        </div>

        {/* Comments list */}
        <div className="py-6">
          <h2 className="font-bold">Comments</h2>
          {Array.isArray(allMessages) && allMessages.length > 0 ? (
            allMessages.map((msg, index) => (
              <div
                className="bg-white p-4 my-4 border-2"
                key={`${msg.userName}-${msg.time?.seconds || index}`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <img className="w-10 rounded-full" src={msg.avatar} alt="user avatar" />
                  <h2>{msg.userName}</h2>
                </div>
                <h2>{msg.message}</h2>
              </div>
            ))
          ) : (
            <p>No comments yet!</p>
          )}
        </div>
      </div>
    </div>
  );
}
