import { doc, onSnapshot, } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";
import { db } from "./firebase";




export const subscribeToPaymentListner = (id: string, setPaymentStatus: Dispatch<SetStateAction<string>>) => {

    const docRef = doc(db, 'payment', id)
    console.log("Subscribe fired")
    const unsubscribe = onSnapshot(docRef, snap => {
        if (!snap.exists()) {
            setPaymentStatus("waiting")
            console.log("Waiting qr code scaning")
            return
        }
        const data = snap.data()
        if (data.status_message === "pending") {
            console.log("Qr Code Scaned, Waiting for payment aprovel")
            setPaymentStatus('pending')
        }
        if (data.status_message === 'completed') {
            console.log("Payment approved and completed")
            setPaymentStatus('completed')
        }
        console.log("Payement Doc Detected", data)

    })


    return unsubscribe
}