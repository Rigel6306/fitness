import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';
import CryptoJS from 'crypto-js';
import { Link, useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

export default function PaymentPage() {
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [webViewUri, setWebViewUri] = useState('');

  const [membershipType, setMembershipType] = useState('monthly');
  const [amount, setAmount] = useState('1000.00');
  const [firstName, setFirstName] = useState('Charitha');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('user@example.com');
  const [phone, setPhone] = useState('0771234567');

  const merchantId = '1231840';
  const merchantSecret = 'MTgwNTg4MDc3MTAxNzMyOTIyNTIzNTgwNTY1ODMzNDU4MDg2MTA1'; // SANDBOX ONLY
  const currency = 'LKR';
  const isSandbox = true;

  const handleMembershipChange = (type: string) => {
    setMembershipType(type);
    if (type === 'monthly') setAmount('1000.00');
    else if (type === 'quarterly') setAmount('2500.00');
    else if (type === 'annual') setAmount('9000.00');
  };

  const initiatePayment = () => {
    const orderId = `Gym_${membershipType}_${Date.now()}`;
    const items = `${membershipType.charAt(0).toUpperCase() + membershipType.slice(1)} Gym Membership`;

    // Ensure amount has exactly 2 decimal places
    const formattedAmount = Number(amount).toFixed(2);

    // PayHere hash: merchant_id + order_id + amount + currency + md5(merchant_secret)
    const secretMd5 = CryptoJS.MD5(merchantSecret)
      .toString(CryptoJS.enc.Hex)
      .toUpperCase();

    const hashString = merchantId + orderId + formattedAmount + currency + secretMd5;
    const hash = CryptoJS.MD5(hashString)
      .toString(CryptoJS.enc.Hex)
      .toUpperCase();

    // Debug logs – check these in your console
    console.log('Hash calculation:');
    console.log('  merchant_id   :', merchantId);
    console.log('  order_id      :', orderId);
    console.log('  amount        :', formattedAmount);
    console.log('  currency      :', currency);
    console.log('  secret_md5    :', secretMd5);
    console.log('  full string   :', hashString);
    console.log('  final hash    :', hash);

    const baseUrl = isSandbox
      ? 'https://sandbox.payhere.lk/pay/checkout'
      : 'https://www.payhere.lk/pay/checkout';

    const formHtml = `
      <html>
        <body>
          <form id="payhereForm" method="post" action="${baseUrl}">
            <input type="hidden" name="merchant_id" value="${merchantId}" />
            <input type="hidden" name="hash" value="${hash}" />
            <input type="hidden" name="order_id" value="${orderId}" />
            <input type="hidden" name="items" value="${items}" />
            <input type="hidden" name="amount" value="${formattedAmount}" />
            <input type="hidden" name="currency" value="${currency}" />
            <input type="hidden" name="first_name" value="${firstName}" />
            <input type="hidden" name="last_name" value="${lastName}" />
            <input type="hidden" name="email" value="${email}" />
            <input type="hidden" name="phone" value="${phone}" />
            <!-- Optional fields -->
            <input type="hidden" name="address" value="No 123, Main Street" />
            <input type="hidden" name="city" value="Colombo" />
            <input type="hidden" name="country" value="Sri Lanka" />
            <!-- Redirects -->
            <input type="hidden" name="return_url" value="fitness://payment/success" />
            <input type="hidden" name="cancel_url" value="fitness://payment/cancel" />
            <input type="hidden" name="notify_url" value="https://your-server.com/payhere-notify" />
          </form>
          <script>
            document.getElementById('payhereForm').submit();
          </script>
        </body>
      </html>
    `;

    const base64Html = btoa(formHtml);
    setWebViewUri(`data:text/html;base64,${base64Html}`);
    setModalVisible(true);
  };

  const handleNavigationStateChange = (navState: any) => {
    const url = navState.url;

    if (url.includes('success')) {
      setModalVisible(false);
      Alert.alert('Success', 'Payment completed successfully!');
      // You can navigate to a success screen or update membership status
      // router.push('/membership-active');
    } else if (url.includes('cancel')) {
      setModalVisible(false);
      Alert.alert('Cancelled', 'Payment was cancelled.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fitness Gym Membership</Text>
      <Text style={styles.subtitle}>Pay securely with PayHere</Text>

      <Text style={styles.label}>Membership Type</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={membershipType}
          onValueChange={handleMembershipChange}
          style={styles.picker}
        >
          <Picker.Item label="Monthly – LKR 1,000.00" value="monthly" />
          <Picker.Item label="Quarterly – LKR 2,500.00" value="quarterly" />
          <Picker.Item label="Annual – LKR 9,000.00" value="annual" />
        </Picker>
      </View>

      <Text style={styles.label}>Amount: LKR {Number(amount).toFixed(2)}</Text>

      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
      />

      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <View style={styles.buttonContainer}>
        <Button title="Pay Now" onPress={initiatePayment} color="#4CAF50" />
      </View>

      <Link href="/" style={styles.backLink}>
        Back to Home
      </Link>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <WebView
          source={{ uri: webViewUri }}
          style={{ flex: 1 }}
          onNavigationStateChange={handleNavigationStateChange}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a3c34',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  picker: {
    height: 50,
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  backLink: {
    color: '#0066cc',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
  },
});