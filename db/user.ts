import { app, db } from "@/services/firebase";

import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
const auth = getAuth(app);


export const registerUser = async (
    email: string,
    password: string,
    name: string,
    age: number,
    height: number,
    weight: number,
    gender: string) => {
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

const scheduleData = {
          title: 'Basic Schedule',
        frequency: 'day after day',
        workoutsCount:10,
        workouts: [
            {
                day: 1,
                schedule:
                    [{ id: 1, name: "Leg Extension", reps: [10, 8, 6] },
                    { id: 2, name: "Barbell Shoulder Press", reps: [10, 8, 6] },
                    { id: 3, name: "Dumbbell Side Lateral", reps: [10, 8, 6] },
                    { id: 4, name: "Bent-Over Side Lateral", reps: ["10-12", "10-12", "10-12"] },
                    { id: 5, name: "Flat Bench Press", reps: [10, 8, 6] },
                    { id: 6, name: "Straight-Arm Pullover", reps: [12, 12, 12] },
                    { id: 7, name: "Lat Pulldown", reps: [12, 10, 8] },
                    { id: 8, name: "Barbell Curl", reps: [10, 8, 6] },
                    { id: 9, name: "Triceps Extension", reps: [10, 8, 6] },
                    { id: 10, name: "Forearm Exercise", reps: [15, 15, 15] }]
            }

        ],
        duration: 3,
        focus: ["Balanced full-body workout with emphasis on chest", "Shoulders", "Arms", "Basic strength"]
}
export const addSchedule = async () =>{
    try{
        const docRef = await addDoc(collection(db,'schedules'),scheduleData)
        console.log('Schedule added',docRef.id)
    }catch(err){
        console.log('Error ading schedule',err)
    }

}