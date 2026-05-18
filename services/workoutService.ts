
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";



export const getScheduleFromUser = async (userId: string) => {
  
    try {
        // Step 1: Reference the user document
        const userDocRef = doc(db, "users", userId);

        // Step 2: Reference the schedules subcollection inside that document
        const scheduleRef = collection(userDocRef, "schedules");

        // Step 3: Fetch all documents in the schedules subcollection
        const snap = await getDocs(scheduleRef);

        const schedules = snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        console.log("Schedules at getSchedule from users:", schedules);
        return schedules;
    } catch (err: any) {
        console.error("Error fetching schedules:", err.message);
        throw err;
    }
};

export const getSchedule = async () => {
    const q = query(
        collection(db, 'schedules'), where("title", "==", "3rd Schedule")
    )
    getScheduleFromUser('z20R5N6ghKtPo5ucvvK4')
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]
        const data = doc.data()
        if (!data) return null
        console.log("Doc at getSchedule previous", doc.id, doc.data())
        return { id: doc.id, title: data.title, frequency: data.frequency, workoutsCount: data.workoutsCount, workouts: data.workouts, duration: data.duration, focus: data.focus, }
    }
}

