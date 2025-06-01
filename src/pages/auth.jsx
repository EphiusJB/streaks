/*
V1.0.0 of the auth component for the Habit Tracker app.

import React, { useState, useEffect } from 'react';

import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';

import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

import { auth, db } from '../firebase';

import Home from './Home';
import fire_services from '../fire_services';

function AuthComponent() {
  const [user, setUser] = useState(null);

  const [profile, setProfile] = useState(null);

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([])


  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {

      if (firebaseUser) {

        setUser(firebaseUser);

        const profileData = await getUserProfile(firebaseUser.uid);
            const loadTasks = async()=>{
              const storedTasks = await fire_services.getAllTasks(props.user.uid)
              setTasks(storedTasks)
            }

        setProfile(profileData);

      } else {

        setUser(null);

        setProfile(null);

      }

    });

    return () => unsubscribe();

  }, []);


  const handleSignIn = async () => {

    setError(null);

    try {

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const profileData = await getUserProfile(user.uid);

        setProfile(profileData);

    } catch (error) {

      setError(error.message);

    }

  };


  const handleSignUp = async () => {

    setError(null);

    try {

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const user = userCredential.user;

      await createUserProfile(user.uid, user.email, user.displayName); // Create profile immediately after signup

      console.log('Profile created on signup');
      const profileData = await getUserProfile(user.uid);

        setProfile(profileData);

    } catch (error) {

      setError(error.message);

    }

  };



  const handleSignOut = async () => {

    await signOut(auth);

  };

  //Simplified create/update function

  const createUserProfile = async (uid, email, displayName) => {

    const userRef = doc(db, "users", uid);

    try {

      await setDoc(userRef, { uid, email, displayName, createdAt: serverTimestamp() });

    } catch (error) {

      console.error("Error creating user profile:", error);

    }

  };


  const getUserProfile = async (uid) => {

    const docRef = doc(db, "users", uid);

    const docSnap = await getDoc(docRef);

    return docSnap.exists() ? docSnap.data() : null;

  };

  return (
    <div>
      {user ? (
        <Home user={profile} tasks={tasks} logout={handleSignOut}/>
      ) : (
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleSignUp}>Sign Up</button>
          <button onClick={handleSignIn}>Sign In</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
        
      )}
    </div>
  );
}
*/

import {useState} from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate, useLocation } from "react-router-dom";

export default function AuthComponent({auth}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [isSignup, setIsSignup] = useState(true);

  //for routing
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home";

  const switchForm = ()=>{
    if(isSignup){
      setIsSignup(false);
    }
    else{
      setIsSignup(true);
    }
  }

  const handleSignUp = async (e) =>{
    e.preventDefault();
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // set display name in firebase Auth
      const displayName = `${firstname} ${lastname}`;
      await updateProfile(result.user, {displayName});

      // save user ingfo in firestore
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        email: result.user.email,
        firstname,
        lastname,
        displayName,
        createdAt: Date.now(),
      });

      alert("user registered!");
      navigate("/dashboard");
    } catch (error) {
      console.log("failed to register user",error.message)
    }
  }

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("User signed in successfully");
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Error signing in:", error);
      alert("Error signing in: " + error.message);
    }
  };

  /* create a user profile for the tasks in the firestore

  const createUserProfile = async (uid, email, displayName) => {

    const userRef = doc(db, "users", uid);

    try {

      await setDoc(userRef, { uid, email, displayName, createdAt: serverTimestamp() });
      console.log("User profile created successfully");

    } catch (error) {

      console.error("Error creating user profile:", error);

    }

  };*/

  return (
    <div className="userAuth">
      {isSignup ? (
      <div className="signUp">
      <h1>Welcome to Streaks</h1>
      <h2>Sign In</h2>

      <input type="text" placeholder="First name" value={firstname} onChange={(e)=> setFirstname(e.target.value)} />

      <input type="text" placeholder="Last Name" value={lastname} onChange={(e)=> setLastname(e.target.value)} />

      <input type="text" placeholder="Email" value={email} onChange={(e)=> setEmail(e.target.value)} />

      <input type="text" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)} />

      <button onClick={handleSignUp}>Sign Up</button>
      <p>already have an account <b onClick={switchForm}>Sign In</b></p>
      </div>):(
      <div className="signIn">
      <h1>Welcome back</h1>
      <h2>Sign In</h2>
      <input type="text" placeholder="Email" value={email} onChange={(e)=> setEmail(e.target.value)} />
      <input type="text" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)} />
      <button onClick={handleSignIn}>Sign In</button>
      <p>Don't have an account? <b onClick={switchForm}>Sign Up</b></p>
      </div>)}

    </div>
  
  )
}
