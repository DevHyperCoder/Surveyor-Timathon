import  firebase from "firebase/app";
import "firebase/auth";
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCcuPqf9IBGAOvh51TargYDU-lKYtEbYOg",
    authDomain: "surveyor-svelte.firebaseapp.com",
    databaseURL: "https://surveyor-svelte.firebaseio.com",
    projectId: "surveyor-svelte",
    storageBucket: "surveyor-svelte.appspot.com",
    messagingSenderId: "1036069859689",
    measurementId: "G-GX5TBLYJGE"
  };

firebase.initializeApp(firebaseConfig)

export const auth =firebase.auth()
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const db = firebase.firestore()