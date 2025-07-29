import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore, } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
    apiKey: "AIzaSyCKERtuj3tjj7uqfeo0NeMPuf6zqNTFbLM",
    authDomain: "fitness-53a09.firebaseapp.com",
    projectId: "fitness-53a09",
    storageBucket: "fitness-53a09.firebasestorage.app",
    messagingSenderId: "1064916232970",
    appId: "1:1064916232970:android:860e53089db0c2ca8f68f3",
};


const app = initializeApp(firebaseConfig)
const db = getFirestore(app);
const storage = getStorage(app)
const auth = initializeAuth(app,{persistence:getReactNativePersistence(AsyncStorage)})
export { auth, db, storage };

