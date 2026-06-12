import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ActivityIndicator, Alert, ScrollView } from 'react-native';
import SafeScreenWrapper from '@/components/SafeScreenWrapper';
import { Colors } from '@/constants/Colors';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
// TypeScript fallback for PayHere package without declaration files
// @ts-ignore
// import PayHere from '@payhere/payhere-mobilesdk-reactnative';

const { textPimary, textSecondary, cardBackgroundSecondary } = Colors;

const Payments = ()=> {
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'IDLE' | 'SUCCESS' | 'FAILED'>('IDLE');

  const handlePayHereCheckout = () => {
    setLoading(true);
    setPaymentStatus('IDLE');

    // ⚡ Pre-configured Sandbox Test Object
    const paymentDetails = {
      sandbox: true,                           // Must be true for testing
      merchant_id: '1231840',                  // Replace with your real PayHere Merchant ID if you have one
      notify_url: 'https://webhook.site/test', // Dummy backend callback URL
      order_id: `FIT-${Date.now()}`,           // Unique ID generated for every test run
      items: 'Premium Gym Membership - 1 Month',
      amount: 2500.00,                         // Amount in LKR
      currency: 'LKR',
      first_name: 'Charitha',
      last_name: 'Iravana',
      email: 'charitha.iravana@example.com',
      phone: '0771234567',
      address: 'No. 123, Galle Road',
      city: 'Colombo',
      country: 'Sri Lanka',
    };

    // 🚀 Fire up the native payment engine sheet
    PayHere.startPayment(
      paymentDetails,
      (paymentId: any) => {
        setLoading(false);
        setPaymentStatus('SUCCESS');
        console.log(`✅ Payment Successfully Completed. ID: ${paymentId}`);
        Alert.alert('Success', `Payment authorized! ID: ${paymentId}`);
      },
      (errorData: any) => {
        setLoading(false);
        setPaymentStatus('FAILED');
        console.warn('❌ Payment Cancelled or Dismissed:', errorData);
        Alert.alert('Cancelled', 'You cancelled the payment gateway view.');
      },
      (errorMessage: any) => {
        setLoading(false);
        setPaymentStatus('FAILED');
        console.error('💥 Fatal Native SDK Error:', errorMessage);
        Alert.alert('Error', `Native Bridge Error: ${errorMessage}`);
      }
    );
  };

  return (
    <View style={styles.container}>
      <SafeScreenWrapper>
        <ScrollView contentContainerStyle={styles.content}>
          
          {/* Header Banner */}
          <View style={styles.card}>
            <View style={styles.iconCircle}>
              <FontAwesome6 name="crown" size={32} color="gold" />
            </View>
            <Text style={styles.title}>Upgrade to Premium</Text>
            <Text style={styles.subtitle}>Unlock unrestricted background geofencing tracking & automated check-ins.</Text>
          </View>

          {/* Pricing Info */}
          <View style={styles.priceRow}>
            <Text style={styles.label}>Total Amount:</Text>
            <Text style={styles.price}>LKR 2,500.00</Text>
          </View>

          {/* Dynamic Status Badges */}
          {paymentStatus === 'SUCCESS' && (
            <View style={[styles.statusBox, { backgroundColor: 'rgba(40, 167, 69, 0.15)', borderColor: '#28a745' }]}>
              <FontAwesome6 name="circle-check" size={18} color="#28a745" />
              <Text style={{ color: '#28a745', fontWeight: 'bold', marginLeft: 8 }}>Transaction Verified Successfully</Text>
            </View>
          )}

          {paymentStatus === 'FAILED' && (
            <View style={[styles.statusBox, { backgroundColor: 'rgba(220, 53, 69, 0.15)', borderColor: 'crimson' }]}>
              <FontAwesome6 name="circle-xmark" size={18} color="crimson" />
              <Text style={{ color: 'crimson', fontWeight: 'bold', marginLeft: 8 }}>Transaction Failed / Interrupted</Text>
            </View>
          )}

          {/* Action Button */}
          <Pressable 
            onPress={handlePayHereCheckout} 
            disabled={loading}
            style={({ pressed }) => [
              styles.payButton,
              pressed && { opacity: 0.8 },
              loading && { backgroundColor: '#333' }
            ]}
          >
            {loading ? (
              <ActivityIndicator color="gold" />
            ) : (
              <>
                <FontAwesome6 name="credit-card" size={18} color="black" style={{ marginRight: 10 }} />
                <Text style={styles.buttonText}>Pay Securely with PayHere</Text>
              </>
            )}
          </Pressable>

          <Text style={styles.footerNotice}>
            🔒 Sandbox Environment Enabled. Real funds will not be charged during this test build sequence.
          </Text>

        </ScrollView>
      </SafeScreenWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'rgb(16, 17, 17)',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,215,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: textPimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 30,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  label: {
    fontSize: 16,
    color: textSecondary,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'gold',
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 20,
  },
  payButton: {
    backgroundColor: 'gold',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerNotice: {
    color: textSecondary,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 24,
    paddingHorizontal: 20,
    lineHeight: 16,
  },
});

export default Payments