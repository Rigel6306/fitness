import PayHere from "@payhere/payhere-mobilesdk-reactnative";
import { Dispatch, SetStateAction } from "react";
import { Alert } from "react-native";

const MERCHANT_ID = '1231840'
const SANDBOX = true

type InfoObj = {
    first_name: string,
    last_name: string,
    email: string,
    phone: string,
    amount:string,

}



export const handlePayment = (
    userId: string,
    infoObj:InfoObj,
    setLoading: Dispatch<SetStateAction<boolean>>,
    setError: Dispatch<SetStateAction<string | null>>,
    setSuccess: Dispatch<SetStateAction<boolean>>) => {
    setLoading(true);

    const paymentObject = {
        sandbox: SANDBOX,
        merchant_id: MERCHANT_ID,
        notify_url: 'https://b16f-111-223-141-231.ngrok-free.app/api/payment',
        order_id: `ORDER_${Date.now()}`,
        items: 'Premium Subscription',
        currency: 'LKR',
        ...infoObj,
        address: 'Superbody Gym',
        city: 'Bandarawela',
        country: 'Sri Lanka',
        custom_1: userId,
        custom_2: infoObj,
    };

    PayHere.startPayment(
        paymentObject,

        // ✅ Payment completed
        (paymentId: string) => {


            setImmediate(() => {
                setLoading(false);
                console.log('Payment success:', paymentId);
                setSuccess(true)

                Alert.alert(
                    'Payment Successful',
                    `Payment ID: ${paymentId}\n\nYour order has been confirmed.`,
                    [{ text: 'OK' }]
                );

            })


        },

        // ❌ Payment error
        (errorData: string) => {
            setImmediate(() => {
                setLoading(false);
                setError(errorData);
                console.error('Payment error:', errorData);
                Alert.alert(
                    'Payment Declined',
                    `Your order has not been Confirmed.`,
                    [{ text: 'OK' }]
                );
            });
        },

        // ⚠️ User closed the payment dialog
        () => {

            requestAnimationFrame(() => {
                setTimeout(() => {
                    setLoading(false);
                    console.log('Payment dismissed safely without layout glitches');
                }, 150);
            })

        }
    );
};
