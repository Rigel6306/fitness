
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "./firebase";



export const getUser = async (uid: string) => {

    const userRef = doc(db, "users", uid)
    await new Promise(res => setTimeout(res, 500))
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) return
    const userData = userSnap.data()
    const packageRef = userData.packageRef
    const packageSnap = await getDoc(packageRef)

    if (packageSnap.exists()) {
        return {
           
            ...userData,
            package: packageSnap.data()
        }
    } else {
  
        return userData;
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
    } catch (err) {
        throw new Error(err.message)
    }




}