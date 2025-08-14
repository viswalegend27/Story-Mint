'use client';

import Link from 'next/link';
import { auth } from '../utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useState, useEffect } from 'react';

export default function Nav() {
  const [user, loading] = useAuthState(auth);
  const [spin, setSpin] = useState(false);
  
  if (loading) {
    return (
      <nav className="bg-white text-black px-6 py-4 flex justify-between items-center">
        <Link href="/">
        <div className="group px-2 py-0 text-xl font-bold text-green-500 hover:text-green-600 transition-colors duration-300">
          Story Mint
          <span className="ml-1 inline-block group-hover:animate-spin-once transition-transform duration-1000 cursor-pointer">🍃</span>
        </div>
      </Link>
        <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"/>
      </nav>
    );
  }

  return (
    <nav className="bg-white text-black px-6 py-4 flex justify-between items-center">
      <Link href="/">
        <div className="group px-2 py-0 text-xl font-bold text-green-500 hover:text-green-600 transition-colors duration-300 cursor-pointer">
          Story Mint
          <span className="ml-1 inline-block group-hover:animate-spin-once transition-transform  duration-1000 cursor-pointer"> 🍃 
          </span>
        </div>
      </Link>
      {!user && (
        <Link href="/auth/login" className="py-2 px-4 text-sm bg-cyan-500 text-white rounded-lg font-medium">
          Join Now
        </Link>
      )}

      {user && (
        <div className="flex items-center gap-6">
          <Link href="/post">
            <button className="py-2 px-4 font-medium bg-green-500 hover:bg-green-600 text-white rounded-md text-sm duration-300">
              Post
            </button>
          </Link>
          <Link href="/dashboard" className="mr-4">
            <img
              src={user.photoURL}
              alt="profile"
              onError={(e) => {
                console.log("Image load error, falling back to default");
              }}
              className="w-12 h-12 rounded-full object-cover cursor-pointer ring-2 ring-green-500 hover:shadow-lg transition-shadow"
            />
          </Link>
        </div>
      )}
    </nav>
  );
}