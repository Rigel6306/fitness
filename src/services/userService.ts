
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";



export const getUser = async (uid: string) => {


    try {
        const userRef = doc(db, "users", uid)
        const userSnap = await getDoc(userRef)
        const userData = userSnap.data()
        return userData;

    }
    catch(err:any){

        throw new Error(err.message)
    }
    


}

export const getAllDocs = async (col: string) => {

    const colRef = collection(db, col)
    const querySnapshot = await getDocs(colRef)
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    return data

}

export const updateDocument = async (docId: string, newData: any, collection: string) => {

    try {
        const docRef = doc(db, collection, docId)
        await updateDoc(docRef, newData)
        return 'success'
    } catch (err: any) {
        throw new Error(`Update failed: ${err.message || "Unknown error"}`)
    }

}



export const updateAnalyticalDataToDb = async (
    userId: string,
    dateStr: string,
    data: any
): Promise<string> => {
    try {
        const dayDocRef = doc(db, "users", userId, "analyticalData", dateStr)
        await setDoc(dayDocRef, data, { merge: true })
        return "Update success"
    } catch (err: any) {
        console.error("Firestore update failed:", err.message || err)
        throw new Error(`Update failed: ${err.message || "Unknown error"}`)
    }
}
