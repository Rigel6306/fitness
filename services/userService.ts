
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";



export const getUser = async(uid:string)=>{

    const userRef = doc(db,"users",uid)

    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) return
    const userData = userSnap.data()
    const packageRef = userData.packageRef
    const packageSnap = await getDoc(packageRef)

    if (packageSnap.exists()){
        return {
            ...userData,
            package:packageSnap.data()
        }
    }else {
        console.log("Package not found")
        return userData;
    }

}

export const getAllDocs = async(col:string)=>{

    const colRef = collection(db,col)
    const querySnapshot = await getDocs(colRef)
    const data = querySnapshot.docs.map(doc=>({id:doc.id,...doc.data()}))
    return data

}