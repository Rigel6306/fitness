// screens/CheckoutScreen.tsx
import PayHere from '@payhere/payhere-mobilesdk-reactnative';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MERCHANT_ID = '1231840'; // Replace with your PayHere Merchant ID
const SANDBOX    = true;       // Set false for production

export default function CheckoutScreen() {
  const [loading, setLoading] = useState(false);

  const handlePayment = () => {
    setLoading(true);

    const paymentObject = {
      sandbox:     SANDBOX,
      merchant_id: MERCHANT_ID,
      notify_url:  'https://your-server.com/payhere/notify', // Your backend endpoint
      order_id:    `ORDER_${Date.now()}`,
      items:       'Premium Subscription',
      amount:      '499.00',
      currency:    'LKR',
      first_name:  'Saman',
      last_name:   'Perera',
      email:       'saman@example.com',
      phone:       '0771234567',
      address:     'No. 1, Galle Road',
      city:        'Colombo',
      country:     'Sri Lanka',
      custom_1:    'user_123',  // Pass any custom data (e.g. user ID)
      custom_2:    '',
    };

    PayHere.startPayment(
      paymentObject,

      // ✅ Payment completed
      (paymentId: string) => {
        setLoading(false);
        console.log('Payment success:', paymentId);
        Alert.alert(
          'Payment Successful',
          `Payment ID: ${paymentId}\n\nYour order has been confirmed.`,
          [{ text: 'OK' }]
        );
        // TODO: verify payment status on your server using the paymentId
        // Never trust client-side success alone — always verify server-side
      },

      // ❌ Payment error
      (errorData: string) => {
        setLoading(false);
        console.error('Payment error:', errorData);
        Alert.alert('Payment Failed', errorData);
      },

      // ⚠️ User closed the payment dialog
      () => {
        setLoading(false);
        console.log('Payment dismissed by user');
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Summary</Text>
      <Text style={styles.amount}>LKR 499.00</Text>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handlePayment}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Processing...' : 'Pay with PayHere'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24,
  },
  title: {
    fontSize: 22, fontWeight: '600', marginBottom: 8,
  },
  amount: {
    fontSize: 32, fontWeight: '700', marginBottom: 32, color: '#2563eb',
  },
  button: {
    backgroundColor: '#2563eb', paddingVertical: 16, paddingHorizontal: 48,
    borderRadius: 12, width: '100%', alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff', fontSize: 18, fontWeight: '600',
  },
});