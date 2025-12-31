
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";

export const getSchedule = async (setData)=>{
    console.log("Fetching from database")
    const q = query(
        collection(db,'schedules'), where("title", "==", "Basic Schedule")
    )
    const querySnapshot = await getDocs(q);
    if(!querySnapshot.empty){
        const doc = querySnapshot.docs[0]
        setData({id:doc.id,...doc.data()})
    }
}