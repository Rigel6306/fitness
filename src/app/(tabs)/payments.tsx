import TabScreenWrapper from '@/components/ui/TabScreenWrapper';
import { Ionicons } from '@expo/vector-icons';
import CryptoJS from 'crypto-js';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,

  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

export default function PaymentPage() {
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [webViewUri, setWebViewUri] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  
  // Card details state (only for UI – actual card processing via PayHere)
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Fixed package details
  const packageName = 'Workout + Treadmill Package';
  const amount = '3500.00';

  const [firstName, setFirstName] = useState('Charitha');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('user@example.com');
  const [phone, setPhone] = useState('0771234567');

  const merchantId = '1231840';
  const merchantSecret = 'MTgwNTg4MDc3MTAxNzMyOTIyNTIzNTgwNTY1ODMzNDU4MDg2MTA1'; // SANDBOX ONLY
  const currency = 'LKR';
  const isSandbox = true;

  // Format card number with spaces every 4 digits
  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const handleCardNumberChange = (text: string) => {
    const formatted = formatCardNumber(text.replace(/\s/g, '').slice(0, 16));
    setCardNumber(formatted);
  };

  const handleExpiryChange = (text: string) => {
    let cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    setExpiry(cleaned.slice(0, 5));
  };

  const handleCvvChange = (text: string) => {
    setCvv(text.replace(/\D/g, '').slice(0, 4));
  };

  const initiateCardPayment = () => {
    // Simple validation (optional)
    if (cardNumber.replace(/\s/g, '').length < 16) {
      Alert.alert('Invalid Card', 'Please enter a valid 16-digit card number.');
      return;
    }
    if (expiry.length < 5) {
      Alert.alert('Invalid Expiry', 'Please enter expiry in MM/YY format.');
      return;
    }
    if (cvv.length < 3) {
      Alert.alert('Invalid CVV', 'Please enter a 3-4 digit CVV.');
      return;
    }

    setIsLoading(true);
    const orderId = `Gym_Package_${Date.now()}`;
    const items = packageName;
    const formattedAmount = Number(amount).toFixed(2);

    const secretMd5 = CryptoJS.MD5(merchantSecret)
      .toString(CryptoJS.enc.Hex)
      .toUpperCase();

    const hashString = merchantId + orderId + formattedAmount + currency + secretMd5;
    const hash = CryptoJS.MD5(hashString)
      .toString(CryptoJS.enc.Hex)
      .toUpperCase();

    const baseUrl = isSandbox
      ? 'https://sandbox.payhere.lk/pay/checkout'
      : 'https://www.payhere.lk/pay/checkout';

    const formHtml = `
      <html>
        <body style="margin:0;padding:0;background:#0A0A0A;">
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
            <input type="hidden" name="address" value="No 123, Main Street" />
            <input type="hidden" name="city" value="Colombo" />
            <input type="hidden" name="country" value="Sri Lanka" />
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
    setIsLoading(false);
  };

  const handleCashPayment = () => {
    Alert.alert(
      'Cash on Hand',
      'Thank You for Your Payment!',
      [{ text: 'OK', onPress: () => router.push('/') }]
    );
  };

  const handlePayment = () => {
    if (paymentMethod === 'card') {
      initiateCardPayment();
    } else {
      handleCashPayment();
    }
  };

  const handleNavigationStateChange = (navState: any) => {
    const url = navState.url;
    if (url.includes('success')) {
      setModalVisible(false);
      Alert.alert('Success', 'Payment completed successfully!');
      router.push('/');
    } else if (url.includes('cancel')) {
      setModalVisible(false);
      Alert.alert('Cancelled', 'Payment was cancelled.');
    }
  };

  const accentColor = '#525354';

  return (
    <TabScreenWrapper>
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Fitness Gym</Text>
            <Text style={styles.subtitle}>Complete your purchase</Text>
          </View>

          {/* Package Card */}
          <View style={[styles.packageCard, { borderColor: accentColor }]}>
            <View style={styles.packageHeader}>
              <Ionicons name="fitness-outline" size={32} color={accentColor} />
              <Text style={styles.packageName}>{packageName}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Total Amount</Text>
              <Text style={[styles.priceValue, { color: accentColor }]}>LKR {amount}</Text>
            </View>
          </View>

          {/* Payment Method Selection */}
          <View style={styles.methodContainer}>
            <Text style={styles.sectionTitle}>Select Payment Method</Text>
            <View style={styles.methodRow}>
              <TouchableOpacity
                style={[
                  styles.methodOption,
                  paymentMethod === 'card' && styles.methodOptionActive,
                ]}
                onPress={() => setPaymentMethod('card')}
              >
                <Ionicons
                  name="card-outline"
                  size={24}
                  color={paymentMethod === 'card' ? accentColor : '#8E8E93'}
                />
                <Text
                  style={[
                    styles.methodText,
                    paymentMethod === 'card' && { color: accentColor },
                  ]}
                >
                  Credit/Debit Card
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.methodOption,
                  paymentMethod === 'cash' && styles.methodOptionActive,
                ]}
                onPress={() => setPaymentMethod('cash')}
              >
                <Ionicons
                  name="cash-outline"
                  size={24}
                  color={paymentMethod === 'cash' ? accentColor : '#8E8E93'}
                />
                <Text
                  style={[
                    styles.methodText,
                    paymentMethod === 'cash' && { color: accentColor },
                  ]}
                >
                  Cash on Hand
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Card Details Form (only shown when card is selected) */}
          {paymentMethod === 'card' && (
            <View style={styles.cardDetailsContainer}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.sectionTitle}>Card Details</Text>
               
              </View>

              <View style={styles.cardInputGroup}>
                <Ionicons name="card-outline" size={20} color="#6B6B6B" style={styles.inputIconLeft} />
                <TextInput
                  style={styles.cardInput}
                  value={cardNumber}
                  onChangeText={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor="#6B6B6B"
                  keyboardType="numeric"
                  maxLength={19}
                />
              </View>

              <View style={styles.cardRow}>
                <View style={[styles.cardInputGroup, { flex: 1, marginRight: 12 }]}>
                  <Ionicons name="calendar-outline" size={20} color="#6B6B6B" style={styles.inputIconLeft} />
                  <TextInput
                    style={styles.cardInput}
                    value={expiry}
                    onChangeText={handleExpiryChange}
                    placeholder="MM/YY"
                    placeholderTextColor="#6B6B6B"
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
                <View style={[styles.cardInputGroup, { flex: 1 }]}>
                  <Ionicons name="lock-closed-outline" size={20} color="#6B6B6B" style={styles.inputIconLeft} />
                  <TextInput
                    style={styles.cardInput}
                    value={cvv}
                    onChangeText={handleCvvChange}
                    placeholder="CVV"
                    placeholderTextColor="#6B6B6B"
                    keyboardType="numeric"
                    secureTextEntry
                    maxLength={4}
                  />
                </View>
              </View>
            </View>
          )}

          {/* Personal Details Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="person-outline" size={22} color={accentColor} />
              <Text style={styles.cardTitle}>Personal Information</Text>
            </View>

            <View style={styles.inputGroup}>
              <Ionicons name="person-outline" size={20} color="#6B6B6B" style={styles.inputIconLeft} />
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First Name"
                placeholderTextColor="#6B6B6B"
              />
            </View>

            <View style={styles.inputGroup}>
              <Ionicons name="person-outline" size={20} color="#6B6B6B" style={styles.inputIconLeft} />
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last Name"
                placeholderTextColor="#6B6B6B"
              />
            </View>

            <View style={styles.inputGroup}>
              <Ionicons name="mail-outline" size={20} color="#6B6B6B" style={styles.inputIconLeft} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Email Address"
                placeholderTextColor="#6B6B6B"
              />
            </View>

            <View style={styles.inputGroup}>
              <Ionicons name="call-outline" size={20} color="#6B6B6B" style={styles.inputIconLeft} />
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="Phone Number"
                placeholderTextColor="#6B6B6B"
              />
            </View>
          </View>

          {/* Payment Summary */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Ionicons name="receipt-outline" size={22} color={accentColor} />
              <Text style={styles.summaryTitle}>Order Summary</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Package</Text>
              <Text style={styles.summaryValue}>{packageName}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>Total</Text>
              <Text style={[styles.summaryAmount, { color: accentColor }]}>LKR {amount}</Text>
            </View>
          </View>

          {/* Pay Button */}
          <TouchableOpacity
            style={[styles.payButton, { backgroundColor: accentColor }]}
            onPress={handlePayment}
            disabled={isLoading}
            activeOpacity={0.9}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="card-outline" size={22} color="#FFFFFF" style={styles.payIcon} />
                <Text style={styles.payButtonText}>
                  {paymentMethod === 'card' ? `Pay LKR ${amount}` : 'Confirm Cash Payment'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Back Link */}
          <Link href="/" style={styles.backLink}>
            <Ionicons name="arrow-back-outline" size={18} color="#6B6B6B" />
            <Text style={styles.backLinkText}>Back to Home</Text>
          </Link>
        </View>
      </ScrollView>

      {/* Payment WebView Modal (only for card) */}
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
    </SafeAreaView>
    </TabScreenWrapper>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  header: {
    marginBottom: 28,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  packageCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#000000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  packageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  packageName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#928e93',
  },
  priceValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#29a5da',
  },
  methodContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    
    fontWeight: '600',
    color: '#cccad1',
    marginBottom: 12,
  },
  methodRow: {
    flexDirection: 'row',
    gap: 12,
  },
  methodOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    
    gap: 8,
  },
  methodOptionActive: {
    borderColor: '#000000',
    backgroundColor: '#cccad1',
  },
  methodText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#606565',
  },
  cardDetailsContainer: {
    backgroundColor: '#000000',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardLogos: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  cardLogo: {
    width: 40,
    height: 24,
  },
  cardInputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  inputIconLeft: {
    marginRight: 10,
  },
  cardInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#cccad1',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#000000c1',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#cccad1',
    marginLeft: 10,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#1c1c1c',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#cccad1',
  },
  summaryCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#cccad1',
    marginLeft: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  summaryValue: {
    fontSize: 14,
    color: '#606565',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#cccad1',
    marginVertical: 12,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#cccad1',
  },
  summaryAmount: {
    
    fontSize: 20,
    fontWeight: 'bold',
    color: '#cccad1',
  },
  payButton: {
    backgroundColor: '#a02c9e',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#616262',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  payIcon: {
    marginRight: 8,
  },
  payButtonText: {
    color: '#cccad1',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  backLinkText: {
    color: '#6B6B6B',
    fontSize: 15,
    marginLeft: 6,
  },
});
















