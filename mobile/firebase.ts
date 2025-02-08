// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBKucMnWAuhheHH0zpsc-1ZZV8_PU8847I",
    authDomain: "firstproject-cda07.firebaseapp.com",
    projectId: "firstproject-cda07",
    storageBucket: "firstproject-cda07.appspot.com",
    messagingSenderId: "837091711699",
    appId: "1:837091711699:android:fd7eca96f69b190ead1226",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app);
const db = getFirestore(app);

export { auth, db };


