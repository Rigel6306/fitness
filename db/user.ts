import { app, db } from "@/services/firebase";

import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
const auth = getAuth(app);


export const registerUser =  async  (
    email: string,
    password: string,
    name: string,
    age: number,
    height: number,
    weight: number,
    gender:string)=> {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            name: name,
            email: user.email,
            age,
            height,
            weight,
            gender,
            createdAt: new Date()
        });

        console.log("User registered and saved to Firestore!");
        return 'Registration Success, Loging In'
    } catch (err) {
       
        throw new Error(err.message)
    }
}
