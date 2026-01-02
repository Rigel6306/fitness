
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";

export const getSchedule = async () => {
    const q = query(
        collection(db, 'schedules'), where("title", "==", "Basic Schedule")
    )
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]
        const data = doc.data()
        if (!data) return null
        return { id: doc.id, title: data.title, frequency: data.frequency, workoutsCount: data.workoutsCount, workouts: data.workouts, duration: data.duration, focus: data.focus, }
    }
}