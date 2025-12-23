import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import WebView from 'react-native-webview';

const PaymentScreen = () => {
  const [amount, setAmount] = useState('');
  const [showWebView, setShowWebView] = useState(false);
  const [paymentHtml, setPaymentHtml] = useState('');
  const [loading, setLoading] = useState(false);

  // PayHere Sandbox Credentials
  const MERCHANT_ID = 1231840; // Replace with your PayHere Merchant ID
  const PAYHERE_SANDBOX_URL = 'http://10.0.2.2:3000';

  const generateOrderId = () => {
    return `GYM${Date.now()}${Math.floor(Math.random() * 1000)}`;
  };

  const validateAmount = (value) => {
    const num = parseFloat(value);
    return !isNaN(num) && num > 0;
  };

  const handlePayment = async () => {
    if (!validateAmount(amount)) {
      Alert.alert('Invalid Amount', 'Please enter a valid payment amount');
      return;
    }

    setLoading(true);

    try {
      const orderId = generateOrderId();


      const HASH = '521ADFC23450026BDF7E5C723C2D4955';

      const paymentData = {
        merchant_id: MERCHANT_ID,
        return_url: 'https://www.yourdomain.com/return',
        cancel_url: 'https://www.yourdomain.com/cancel',
        notify_url: 'https://www.yourdomain.com/notify',
        order_id: "ItemNo12345",
        items: `Gym Membership Payment - ${orderId}`,
        currency: 'LKR',
        amount: parseFloat(amount).toFixed(2),
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        phone: '0771234567',
        address: 'No.1, Galle Road',
        city: 'Colombo',
        country: 'Sri Lanka',
        hash: HASH,
      };


      // const htmlForm = `
      //   <html>
      //     <body onload="document.forms[0].submit()">
      //       <form method="post" action="http://192.168.8.200:3000">
      //         ${Object.keys(paymentData)
      //     .map(
      //       (key) =>
      //         `<input type="hidden" name="${key}" value="${String(paymentData[key]).replace(/"/g, '&quot;')}" />`
      //     )
      //     .join('')}
      //       </form>
      //     </body>
      //   </html>
      // `;

    
 

      try {
        const res = await fetch('https://codementorian.com/create-payment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(paymentData) })
        const data = await res.json();
        console.log(res)
         setPaymentHtml(data.htmlForm);
        setShowWebView(true);
      }catch(err){
        console.log('error from codemento',err)
      }
  
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleWebViewNavigation = (navState) => {
    const { url } = navState;


    if (url.includes('/success')) {
      Alert.alert(
        'Payment Successful',
        'Your gym payment has been processed successfully!',
        [{ text: 'OK', onPress: () => setShowWebView(false) }]
      );
      setShowWebView(false);
    }


    if (url.includes('/cancel')) {
      Alert.alert(
        'Payment Cancelled',
        'Your payment was cancelled. No amount was deducted.',
        [{ text: 'OK', onPress: () => setShowWebView(false) }]
      );
      setShowWebView(false);
    }
  };

  if (showWebView) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setShowWebView(false)}
          >
            <Icon name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Complete Payment</Text>
        </View>
        <WebView
          source={{ html: paymentHtml }}
          originWhitelist={['*']}
          style={styles.webview}
          onNavigationStateChange={handleWebViewNavigation}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4A90E2" />
            </View>
          )}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Payment</Text>
            <Text style={styles.headerSubtitle}>Complete your gym membership payment</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="payment" size={24} color="#4A90E2" />
              <Text style={styles.cardTitle}>Payment Details</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Payment Amount (LKR)</Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencySymbol}>LKR</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                  placeholderTextColor="#999"
                />
              </View>
              <Text style={styles.helperText}>
                Enter the amount you wish to pay
              </Text>
            </View>

            <View style={styles.paymentOptions}>
              <Text style={styles.sectionTitle}>Quick Amounts</Text>
              <View style={styles.quickAmounts}>
                {[500, 1000, 2000, 5000].map((quickAmount) => (
                  <TouchableOpacity
                    key={quickAmount}
                    style={styles.quickAmountButton}
                    onPress={() => setAmount(quickAmount.toString())}
                  >
                    <Text style={styles.quickAmountText}>LKR {quickAmount}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.infoCard}>
              <Icon name="info" size={20} color="#666" />
              <Text style={styles.infoText}>
                This is a secure payment powered by PayHere. Your payment information is encrypted.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.payButton, !validateAmount(amount) && styles.payButtonDisabled]}
              onPress={handlePayment}
              disabled={!validateAmount(amount) || loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Icon name="lock" size={20} color="#FFF" style={styles.buttonIcon} />
                  <Text style={styles.payButtonText}>Pay LKR {amount || '0.00'}</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.securityInfo}>
              <Icon name="security" size={16} color="#4CAF50" />
              <Text style={styles.securityText}>Secure SSL Encryption</Text>
            </View>
          </View>

          <View style={styles.features}>
            <View style={styles.feature}>
              <Icon name="verified-user" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>100% Secure Payments</Text>
            </View>
            <View style={styles.feature}>
              <Icon name="autorenew" size={20} color="#2196F3" />
              <Text style={styles.featureText}>Instant Confirmation</Text>
            </View>
            <View style={styles.feature}>
              <Icon name="support-agent" size={20} color="#FF9800" />
              <Text style={styles.featureText}>24/7 Support</Text>
            </View>
          </View>

          <Text style={styles.note}>
            Note: This is using PayHere Sandbox environment for testing purposes.
            Use test card: 4242 4242 4242 4242, Exp: 12/30, CVV: 123
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 55,
    backgroundColor: '#FAFAFA',
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginRight: 10,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  helperText: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  paymentOptions: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickAmountButton: {
    backgroundColor: '#F0F7FF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  quickAmountText: {
    color: '#4A90E2',
    fontWeight: '500',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    marginLeft: 10,
    lineHeight: 18,
  },
  payButton: {
    backgroundColor: '#4A90E2',
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  payButtonDisabled: {
    backgroundColor: '#CCC',
  },
  buttonIcon: {
    marginRight: 10,
  },
  payButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  securityInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  securityText: {
    color: '#4CAF50',
    fontSize: 12,
    marginLeft: 5,
    fontWeight: '500',
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureText: {
    fontSize: 11,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  note: {
    fontSize: 12,
    color: '#FF9800',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 16,
  },
  webview: {
    flex: 1,
  },
  backButton: {
    padding: 10,
    marginRight: 10,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

export default PaymentScreen;
