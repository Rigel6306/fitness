'use client'
import TabScreenWrapper from '@/components/ui/TabScreenWrapper';
import { handlePayment } from '@/services/payhere';
import { Ionicons } from '@expo/vector-icons';
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
  const [err,setError]=useState(null)
  const [success,setSuccess] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  
  // Card Details States
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Fixed Package Details
  const packageName = 'Workout + Treadmill Package';
  const amount = '3500.00';

  const [firstName, setFirstName] = useState('Charitha');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('user@example.com');
  const [phone, setPhone] = useState('0771234567');



  
  const handleCashPayment = () => {
    Alert.alert(
      'Cash Commitment Registered',
      'Please settle the dues directly at the front reception grid layout counter.',
      [{ text: 'Acknowledge', onPress: () => router.push('/') }]
    );
  };


  const handlePayBtn = ()=>{
    handlePayment(setIsLoading,setError,setSuccess)
  }



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

  return (
    <TabScreenWrapper routePath="/payments">
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#060708" />
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            
            {/* Fluid Header Section */}
            <View style={styles.header}>
              <Text style={styles.title}>Secure Checkout</Text>
              <Text style={styles.subtitle}>Complete subscription processing cycle safely</Text>
            </View>

            {/* Package Card */}
            <View style={styles.packageCard}>
              <View style={styles.packageHeader}>
                <View style={styles.packageIconBox}>
                  <Ionicons name="sparkles-sharp" size={18} color="#4cddbb" />
                </View>
                <View style={styles.packageInfo}>
                  <Text style={styles.packageName}>{packageName}</Text>
                  <Text style={styles.packageTermText}>Access Microcycle Billing Block</Text>
                </View>
              </View>
              <View style={styles.priceDivider} />
              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Total Amount Assessed</Text>
                <Text style={styles.priceValue}>LKR {amount}</Text>
              </View>
            </View>

            {/* Payment Method Selector Grid */}
            <View style={styles.methodContainer}>
              <Text style={styles.sectionTitle}>Select Access Gateway</Text>
              <View style={styles.methodRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.methodOption, paymentMethod === 'card' && styles.methodOptionActive]}
                  onPress={() => setPaymentMethod('card')}
                >
                  <Ionicons
                    name="card"
                    size={16}
                    color={paymentMethod === 'card' ? '#4cddbb' : '#8E9492'}
                  />
                  <Text style={[styles.methodText, paymentMethod === 'card' && styles.methodTextActive]}>
                    PAY ONLINE
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.methodOption, paymentMethod === 'cash' && styles.methodOptionActive]}
                  onPress={() => setPaymentMethod('cash')}
                >
                  <Ionicons
                    name="cash"
                    size={16}
                    color={paymentMethod === 'cash' ? '#4cddbb' : '#8E9492'}
                  />
                  <Text style={[styles.methodText, paymentMethod === 'cash' && styles.methodTextActive]}>
                   CASH AT DESK
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Interactive Card Fields (Render-locked conditionally) */}
      

            {/* Personal Details Registry Card */}
            <View style={styles.formCard}>
              <Text style={styles.sectionTitleInside}>Account Identification Information</Text>

              <View style={styles.cardRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <TextInput
                    style={styles.input}
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="First Name"
                    placeholderTextColor="rgba(255, 255, 255, 0.2)"
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <TextInput
                    style={styles.input}
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Last Name"
                    placeholderTextColor="rgba(255, 255, 255, 0.2)"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Ionicons name="mail-outline" size={16} color="#8E9492" style={styles.inputIconLeft} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="Email Address"
                  placeholderTextColor="rgba(255, 255, 255, 0.2)"
                />
              </View>

              <View style={styles.inputGroup}>
                <Ionicons name="call-outline" size={16} color="#8E9492" style={styles.inputIconLeft} />
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  placeholder="Phone Number"
                  placeholderTextColor="rgba(255, 255, 255, 0.2)"
                />
              </View>
            </View>

            {/* Secure Tokenized Action Execution Button */}
            <TouchableOpacity
              style={[styles.payButton, paymentMethod === 'cash' && styles.payButtonCash]}
              onPress={handlePayBtn}
              disabled={isLoading}
              activeOpacity={0.9}
            >
              {isLoading ? (
                <ActivityIndicator color="#060708" />
              ) : (
                <>
                  <Ionicons 
                    name={paymentMethod === 'card' ? "shield-checkmark" : "checkmark-circle"} 
                    size={16} 
                    color="#060708" 
                  />
                  <Text style={styles.payButtonText}>
                    {paymentMethod === 'card' ? `Commit Payment • LKR ${amount}` : 'Confirm Cash Schedule'}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Back Home Anchor */}
            <Link href="/" asChild>
              <TouchableOpacity style={styles.backLink} activeOpacity={0.7}>
                <Ionicons name="chevron-back" size={14} color="#8E9492" />
                <Text style={styles.backLinkText}>Return to Dashboard</Text>
              </TouchableOpacity>
            </Link>

          </View>
        </ScrollView>

        {/* Modal Web Container */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <WebView
            source={{ uri: webViewUri }}
            style={{ flex: 1, backgroundColor: '#060708' }}
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
    backgroundColor: '#060708',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    marginBottom: 24,
    paddingLeft: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#8E9492',
    fontWeight: '500',
    marginTop: 4,
  },
  packageCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 24,
    padding: 18,
    marginBottom: 24,
  },
  packageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  packageIconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(76, 221, 187, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(76, 221, 187, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  packageInfo: {
    flex: 1,
  },
  packageName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.1,
  },
  packageTermText: {
    fontSize: 11,
    color: '#8E9492',
    fontWeight: '500',
    marginTop: 2,
  },
  priceDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    marginVertical: 14,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 12,
    color: '#8E9492',
    fontWeight: '600',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#4cddbb',
    letterSpacing: -0.3,
  },
  methodContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 12,
    paddingLeft: 2,
  },
  sectionTitleInside: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 14,
    opacity: 0.9,
  },
  methodRow: {
    flexDirection: 'row',
    gap: 10,
  },
  methodOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.03)',
    gap: 8,
  },
  methodOptionActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomWidth: 1.5,
  },
  methodText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E9492',
  },
  methodTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  inputIconLeft: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 46,
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  payButton: {
    height: 50,
    backgroundColor: '#4cddbb',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    marginBottom: 20,
    shadowColor: '#4cddbb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 3,
  },
  payButtonCash: {
    backgroundColor: '#ffb03a',
    shadowColor: '#ffb03a',
  },
  payButtonText: {
    color: '#060708',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.1,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 12,
  },
  backLinkText: {
    color: '#8E9492',
    fontSize: 13,
    fontWeight: '600',
  },
});