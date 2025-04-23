"use client";

import { FcGoogle } from "react-icons/fc";
import {signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from "../../../utils/firebase";
import { useState } from "react"; 
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";

export default function Login() {
  const router = useRouter();
  const [ user, loading ] = useAuthState(auth);
  //Sign in with google 
    const googleProvider = new GoogleAuthProvider();
    const GoogleLogin = async() => {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        router.push("/");
      } catch (error) {
        console.log(error);
      }
    };

  useEffect(()=>{
    if (!loading && user) {
      router.push("/");
    } else {
      console.log('Login');
    }
  }, [user,loading,router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Checking login status...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="shadow-xl p-10 text-gray-700 rounded-lg bg-amber-300 w-full max-w-md min-h-[300px] flex flex-col items-center text-center">
        <h2 className="text-3xl font-bold mb-1 mt-2">Join Today</h2>
          <div className="py-4">
            <p className="text-lg mb-6 text-gray-600">Sign in with one of the providers</p>
          </div>
            <button type="button" onClick={GoogleLogin} className="text-white bg-gray-700 hover:bg-gray-800 transition-colors w-full font-medium rounded-lg flex items-center justify-center p-4 gap-2 mt-auto">
            <FcGoogle className="text-2xl" />
            Sign in with Google
            </button>
      </div>
    </div>
  );
}
