import PayHere from "@payhere/payhere-mobilesdk-reactnative";
import { Dispatch, SetStateAction } from "react";

const MERCHANT_ID = '1231840'
const SANDBOX = true


export const handlePayment = (
    setLoading: Dispatch<SetStateAction<boolean>>,
    setError: Dispatch<SetStateAction<string|null>>,
    setSuccess: Dispatch<SetStateAction<boolean>>) => {
    setLoading(true);

    const paymentObject = {
        sandbox: SANDBOX,
        merchant_id: MERCHANT_ID,
        notify_url: 'https://dc70-182-161-11-79.ngrok-free.app/api/payment', // Your backend endpoint
        order_id: `ORDER_${Date.now()}`,
        items: 'Premium Subscription',
        amount: '3500.00',
        currency: 'LKR',
        first_name: 'Saman',
        last_name: 'Perera',
        email: 'saman@example.com',
        phone: '0771234567',
        address: 'No. 1, Galle Road',
        city: 'Colombo',
        country: 'Sri Lanka',
        custom_1: 'user_123',  // Pass any custom data (e.g. user ID)
        custom_2: '',
    };

    PayHere.startPayment(
        paymentObject,

        // ✅ Payment completed
        (paymentId: string) => {
            setLoading(false);
            console.log('Payment success:', paymentId);
            setSuccess(true)

            // Alert.alert(
            //   'Payment Successful',
            //   `Payment ID: ${paymentId}\n\nYour order has been confirmed.`,
            //   [{ text: 'OK' }]
            // );
            // TODO: verify payment status on your server using the paymentId
            // Never trust client-side success alone — always verify server-side
        },

        // ❌ Payment error
        (errorData: string) => {
            setLoading(false);
            console.error('Payment error:', errorData);
            setError(errorData)
            // Alert.alert('Payment Failed', errorData);
        },

        // ⚠️ User closed the payment dialog
        () => {
            setLoading(false);
            console.log('Payment dismissed by user');
        }
    );
};
