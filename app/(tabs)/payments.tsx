import CryptoJS from 'crypto-js';
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

  // ==================== PAYHERE CONFIGURATION ====================
  // Get these from your PayHere Sandbox Dashboard: https://sandbox.payhere.lk/merchant
  const MERCHANT_ID = 1231840; // Replace with your actual merchant ID
  const MERCHANT_SECRET = 'MjgwODYwNDA1ODM4MDEwMzg1MTkxNTE3ODI2MjMzMDkyMjYxMzQ='; // Replace with your actual secret
  const PAYHERE_SANDBOX_URL = 'https://sandbox.payhere.lk/pay/checkout';
  // ===============================================================

  const generateOrderId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `GYM${timestamp}${random}`;
  };

  const validateAmount = (value) => {
    const num = parseFloat(value);
    return !isNaN(num) && num > 0;
  };

  const generatePayHereHash = (orderId, amount, currency) => {
    // PayHere hash formula: merchant_id + order_id + amount + currency + merchant_secret
    const amountFormatted = parseFloat(amount).toFixed(2);
    const hashString = 
      MERCHANT_ID.toString() + 
      orderId + 
      amountFormatted + 
      currency + 
      MERCHANT_SECRET;
    
    console.log('Hash Debug:', {
      merchant_id: MERCHANT_ID,
      order_id: orderId,
      amount: amountFormatted,
      currency: currency,
      secret_length: MERCHANT_SECRET.length
    });
    
    const hash = CryptoJS.MD5(hashString).toString().toUpperCase();
    return hash;
  };

  const handlePayment = () => {
    if (!validateAmount(amount)) {
      Alert.alert('Invalid Amount', 'Please enter a valid payment amount (greater than 0)');
      return;
    }

    setLoading(true);

    try {
      const orderId = generateOrderId();
      const paymentAmount = parseFloat(amount).toFixed(2);
      
      // Generate hash
      const hash = generatePayHereHash(orderId, paymentAmount, 'LKR');

      // Prepare payment data according to PayHere documentation
      const paymentData = {
        merchant_id: MERCHANT_ID,
        return_url: 'https://www.yourdomain.com/success',
        cancel_url: 'https://www.yourdomain.com/cancel',
        notify_url: 'https://www.yourdomain.com/notify',
        order_id: orderId,
        items: `Gym Membership - ${orderId}`,
        currency: 'LKR',
        amount: paymentAmount,
        first_name: 'Saman',
        last_name: 'Perera',
        email: 'samanp@gmail.com',
        phone: '0777123456',
        address: 'No. 123, Main Street',
        city: 'Colombo',
        country: 'Sri Lanka',
        hash: hash,
        // Optional parameters
        delivery_address: 'No. 123, Main Street',
        delivery_city: 'Colombo',
        delivery_country: 'Sri Lanka',
        platform: 'mobile_sdk',
        custom_1: 'Gym Membership',
        custom_2: 'Monthly Payment'
      };

      // Create HTML form that auto-submits to PayHere
      const htmlForm = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
          <title>Redirecting to PayHere</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
              padding: 20px;
            }
            
            .container {
              background: white;
              border-radius: 20px;
              padding: 40px 30px;
              text-align: center;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
              max-width: 400px;
              width: 100%;
            }
            
            .spinner {
              width: 70px;
              height: 70px;
              border: 6px solid #f3f3f3;
              border-top: 6px solid #4A90E2;
              border-radius: 50%;
              animation: spin 1.5s linear infinite;
              margin: 0 auto 25px;
            }
            
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            
            h1 {
              color: #333;
              font-size: 24px;
              margin-bottom: 15px;
              font-weight: 600;
            }
            
            p {
              color: #666;
              font-size: 16px;
              line-height: 1.5;
              margin-bottom: 10px;
            }
            
            .amount {
              color: #4A90E2;
              font-weight: bold;
              font-size: 20px;
              margin: 15px 0;
            }
            
            .note {
              font-size: 14px;
              color: #888;
              margin-top: 20px;
              padding: 10px;
              background: #f9f9f9;
              border-radius: 10px;
              border-left: 4px solid #4CAF50;
            }
            
            .loading-dots:after {
              content: '.';
              animation: dots 1.5s steps(5, end) infinite;
            }
            
            @keyframes dots {
              0%, 20% { content: '.'; }
              40% { content: '..'; }
              60% { content: '...'; }
              80%, 100% { content: ''; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="spinner"></div>
            <h1>Secure Payment Processing</h1>
            <p>You are being redirected to PayHere's secure payment gateway</p>
            <div class="amount">LKR ${paymentAmount}</div>
            <p>Please wait while we connect to the payment server<span class="loading-dots"></span></p>
            <div class="note">
              <strong>Note:</strong> This is a secure connection. Your payment details are encrypted.
            </div>
          </div>
          
          <form id="payhereForm" method="post" action="${PAYHERE_SANDBOX_URL}">
            ${Object.keys(paymentData)
              .map(key => 
                `<input type="hidden" name="${key}" value="${String(paymentData[key]).replace(/"/g, '&quot;').replace(/'/g, '&#39;')}" />`
              )
              .join('')}
          </form>
          
          <script>
            // Auto-submit form after a short delay
            setTimeout(() => {
              document.getElementById('payhereForm').submit();
            }, 2000);
            
            // Fallback submission
            setTimeout(() => {
              const form = document.getElementById('payhereForm');
              if (form && form.parentNode) {
                form.submit();
              }
            }, 4000);
            
            // Show submission status
            document.addEventListener('DOMContentLoaded', function() {
              console.log('Payment form loaded with order ID: ${orderId}');
            });
          </script>
        </body>
        </html>
      `;

      setPaymentHtml(htmlForm);
      setShowWebView(true);
      
    } catch (error) {
      console.error('Payment Error:', error);
      Alert.alert(
        'Payment Error',
        'Failed to initialize payment. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleWebViewNavigation = (navState) => {
    const { url } = navState;
    
    // Debug logging
    console.log('WebView navigating to:', url);

    // Handle PayHere success URL patterns
    if (url.includes('status=2') || 
        url.includes('/success') || 
        url.includes('payment-success') ||
        url.includes('payhere.lk/pay/success')) {
      
      console.log('Payment Success Detected');
      Alert.alert(
        '✅ Payment Successful!',
        `Your payment of LKR ${amount} has been processed successfully.\n\nThank you for your payment!`,
        [
          { 
            text: 'Done', 
            onPress: () => {
              setShowWebView(false);
              setAmount('');
            }
          }
        ]
      );
      setShowWebView(false);
      return;
    }

    // Handle PayHere cancellation
    if (url.includes('status=0') || 
        url.includes('/cancel') || 
        url.includes('payment-cancel') ||
        url.includes('payhere.lk/pay/cancel')) {
      
      console.log('Payment Cancelled');
      Alert.alert(
        'Payment Cancelled',
        'Your payment was cancelled. No amount has been deducted from your account.',
        [{ text: 'OK', onPress: () => setShowWebView(false) }]
      );
      setShowWebView(false);
      return;
    }

    // Handle PayHere error
    if (url.includes('status=-1') || 
        url.includes('status=-2') || 
        url.includes('status=-3') ||
        url.includes('error=true')) {
      
      console.log('Payment Failed');
      Alert.alert(
        '❌ Payment Failed',
        'The payment could not be processed. Please try again or use a different payment method.',
        [{ text: 'OK', onPress: () => setShowWebView(false) }]
      );
      setShowWebView(false);
    }
  };

  const handleQuickAmount = (quickAmount) => {
    setAmount(quickAmount.toString());
  };

  const resetPayment = () => {
    setAmount('');
    setShowWebView(false);
  };

  // WebView Screen
  if (showWebView) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.webViewHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => {
              Alert.alert(
                'Cancel Payment',
                'Are you sure you want to cancel this payment?',
                [
                  { text: 'Continue Payment', style: 'cancel' },
                  { 
                    text: 'Cancel', 
                    style: 'destructive',
                    onPress: () => setShowWebView(false)
                  }
                ]
              );
            }}
          >
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Icon name="lock" size={18} color="#4CAF50" style={styles.lockIcon} />
            <Text style={styles.webViewHeaderTitle}>Secure Payment Gateway</Text>
          </View>
          <View style={styles.secureBadge}>
            <Icon name="verified" size={16} color="#4CAF50" />
            <Text style={styles.secureText}>Secure</Text>
          </View>
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
            <View style={styles.webViewLoadingContainer}>
              <ActivityIndicator size="large" color="#4A90E2" />
              <Text style={styles.webViewLoadingText}>Loading payment gateway...</Text>
            </View>
          )}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView Error:', nativeEvent);
            Alert.alert(
              'Connection Error',
              'Unable to connect to payment gateway. Please check your internet connection.',
              [{ text: 'OK', onPress: () => setShowWebView(false) }]
            );
          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('HTTP Error:', nativeEvent);
          }}
        />
        
        <View style={styles.webViewFooter}>
          <Icon name="security" size={14} color="#666" />
          <Text style={styles.webViewFooterText}>
            Secured by PayHere • SSL Encrypted • PCI DSS Compliant
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Main Payment Form Screen
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Icon name="payments" size={32} color="#4A90E2" />
            </View>
            <Text style={styles.headerTitle}>Gym Membership Payment</Text>
            <Text style={styles.headerSubtitle}>
              Secure payment for your fitness journey
            </Text>
          </View>

          {/* Payment Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="credit-card" size={24} color="#4A90E2" />
              <Text style={styles.cardTitle}>Enter Payment Details</Text>
            </View>

            {/* Amount Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Payment Amount (LKR)</Text>
              <View style={styles.amountInputWrapper}>
                <View style={styles.currencyBadge}>
                  <Text style={styles.currencyText}>LKR</Text>
                </View>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                  placeholderTextColor="#999"
                  maxLength={10}
                />
                {amount ? (
                  <TouchableOpacity 
                    style={styles.clearButton}
                    onPress={() => setAmount('')}
                  >
                    <Icon name="close" size={20} color="#999" />
                  </TouchableOpacity>
                ) : null}
              </View>
              <Text style={styles.helperText}>
                Enter the amount you wish to pay for your membership
              </Text>
            </View>

            {/* Quick Amounts */}
            <View style={styles.paymentOptions}>
              <Text style={styles.sectionTitle}>Quick Amounts</Text>
              <View style={styles.quickAmounts}>
                {[500, 1000, 2500, 5000].map((quickAmount) => (
                  <TouchableOpacity
                    key={quickAmount}
                    style={[
                      styles.quickAmountButton,
                      amount === quickAmount.toString() && styles.quickAmountButtonActive
                    ]}
                    onPress={() => handleQuickAmount(quickAmount)}
                  >
                    <Text style={[
                      styles.quickAmountText,
                      amount === quickAmount.toString() && styles.quickAmountTextActive
                    ]}>
                      LKR {quickAmount}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* User Info (Simulated - In production, get from user profile) */}
            <View style={styles.userInfoCard}>
              <View style={styles.userInfoHeader}>
                <Icon name="person" size={18} color="#666" />
                <Text style={styles.userInfoTitle}>Billing Information</Text>
              </View>
              <View style={styles.userInfoRow}>
                <Text style={styles.userInfoLabel}>Name:</Text>
                <Text style={styles.userInfoValue}>Saman Perera</Text>
              </View>
              <View style={styles.userInfoRow}>
                <Text style={styles.userInfoLabel}>Email:</Text>
                <Text style={styles.userInfoValue}>samanp@gmail.com</Text>
              </View>
              <View style={styles.userInfoRow}>
                <Text style={styles.userInfoLabel}>Phone:</Text>
                <Text style={styles.userInfoValue}>0777123456</Text>
              </View>
            </View>

            {/* Security Info */}
            <View style={styles.infoCard}>
              <Icon name="verified-user" size={22} color="#4CAF50" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>Secure Payment</Text>
                <Text style={styles.infoText}>
                  Your payment is processed through PayHere's secure payment gateway. 
                  We never store your card details.
                </Text>
              </View>
            </View>

            {/* Pay Button */}
            <TouchableOpacity
              style={[
                styles.payButton,
                (!validateAmount(amount) || loading) && styles.payButtonDisabled
              ]}
              onPress={handlePayment}
              disabled={!validateAmount(amount) || loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <>
                  <Icon name="lock" size={22} color="#FFF" style={styles.buttonIcon} />
                  <View style={styles.buttonTextContainer}>
                    <Text style={styles.payButtonText}>
                      Pay LKR {amount || '0.00'}
                    </Text>
                    <Text style={styles.payButtonSubtext}>
                      Secure payment via PayHere
                    </Text>
                  </View>
                  <Icon name="arrow-forward" size={22} color="#FFF" />
                </>
              )}
            </TouchableOpacity>

            {/* Security Badges */}
            <View style={styles.securityContainer}>
              <View style={styles.securityBadge}>
                <Icon name="https" size={14} color="#4CAF50" />
                <Text style={styles.securityText}>SSL Secured</Text>
              </View>
              <View style={styles.securityBadge}>
                <Icon name="payment" size={14} color="#2196F3" />
                <Text style={styles.securityText}>PCI DSS</Text>
              </View>
              <View style={styles.securityBadge}>
                <Icon name="shield" size={14} color="#FF9800" />
                <Text style={styles.securityText}>Encrypted</Text>
              </View>
            </View>
          </View>

          {/* Features */}
          <View style={styles.features}>
            <View style={styles.feature}>
              <View style={[styles.featureIcon, { backgroundColor: '#E8F5E9' }]}>
                <Icon name="security" size={20} color="#4CAF50" />
              </View>
              <Text style={styles.featureTitle}>100% Secure</Text>
              <Text style={styles.featureText}>Bank-level security</Text>
            </View>
            
            <View style={styles.feature}>
              <View style={[styles.featureIcon, { backgroundColor: '#E3F2FD' }]}>
                <Icon name="bolt" size={20} color="#2196F3" />
              </View>
              <Text style={styles.featureTitle}>Instant</Text>
              <Text style={styles.featureText}>Real-time processing</Text>
            </View>
            
            <View style={styles.feature}>
              <View style={[styles.featureIcon, { backgroundColor: '#FFF3E0' }]}>
                <Icon name="support-agent" size={20} color="#FF9800" />
              </View>
              <Text style={styles.featureTitle}>Support</Text>
              <Text style={styles.featureText}>24/7 assistance</Text>
            </View>
          </View>

          {/* Test Mode Notice */}
          <View style={styles.testModeCard}>
            <View style={styles.testModeHeader}>
              <Icon name="science" size={18} color="#FF9800" />
              <Text style={styles.testModeTitle}>Test Mode Active</Text>
            </View>
            <Text style={styles.testModeText}>
              You are using PayHere Sandbox environment for testing.
              No real money will be charged.
            </Text>
            <View style={styles.testCardInfo}>
              <Text style={styles.testCardLabel}>Test Card Details:</Text>
              <Text style={styles.testCardDetails}>
                Card: 4242 4242 4242 4242 • Exp: 12/30 • CVV: 123
              </Text>
            </View>
            <Text style={styles.warningText}>
              ⚠️ For production, merchant secret must be stored on a secure backend server.
              Storing it in the app is not secure.
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By proceeding, you agree to our Terms of Service and Privacy Policy
            </Text>
            <View style={styles.poweredBy}>
              <Text style={styles.poweredByText}>Powered by</Text>
              <Icon name="payments" size={16} color="#666" />
              <Text style={styles.payHereText}>PayHere</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  // Header Styles
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  headerIcon: {
    backgroundColor: '#E8F0FE',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A237E',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 22,
  },
  // Card Styles
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
    marginBottom: 25,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
  },
  // Input Styles
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 15,
    color: '#555',
    marginBottom: 10,
    fontWeight: '500',
  },
  amountInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 15,
    backgroundColor: '#FAFBFC',
    overflow: 'hidden',
  },
  currencyBadge: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  currencyText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  amountInput: {
    flex: 1,
    fontSize: 28,
    fontWeight: '700',
    color: '#1A237E',
    paddingHorizontal: 15,
    paddingVertical: 12,
    minHeight: 60,
  },
  clearButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  helperText: {
    fontSize: 13,
    color: '#888',
    marginTop: 8,
    marginLeft: 5,
  },
  // Quick Amounts
  paymentOptions: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAmountButton: {
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  quickAmountButtonActive: {
    backgroundColor: '#E8F0FE',
    borderColor: '#4A90E2',
  },
  quickAmountText: {
    color: '#666',
    fontWeight: '500',
    fontSize: 15,
  },
  quickAmountTextActive: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  // User Info
  userInfoCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 18,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  userInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  userInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginLeft: 10,
  },
  userInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  userInfoLabel: {
    fontSize: 14,
    color: '#777',
  },
  userInfoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  // Info Card
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#F0F9FF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#D1E9FF',
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A56DB',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  // Pay Button
  payButton: {
    backgroundColor: '#4A90E2',
    height: 65,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginBottom: 20,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 5,
  },
  payButtonDisabled: {
    backgroundColor: '#B0BEC5',
    shadowOpacity: 0,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonTextContainer: {
    flex: 1,
  },
  payButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  payButtonSubtext: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    fontWeight: '400',
  },
  // Security Badges
  securityContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 10,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  securityText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
    fontWeight: '500',
  },
  // Features
  features: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  featureText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  // Test Mode Card
  testModeCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  testModeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  testModeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF9800',
    marginLeft: 10,
  },
  testModeText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  testCardInfo: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#FFD54F',
  },
  testCardLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF9800',
    marginBottom: 5,
  },
  testCardDetails: {
    fontSize: 12,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  warningText: {
    fontSize: 11,
    color: '#F44336',
    fontStyle: 'italic',
    lineHeight: 16,
    marginTop: 10,
  },
  // Footer
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 18,
  },
  poweredBy: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  poweredByText: {
    fontSize: 12,
    color: '#888',
    marginRight: 5,
  },
  payHereText: {
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: '600',
    marginLeft: 5,
  },
  // WebView Styles
  webViewHeader: {
    backgroundColor: '#1A237E',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  lockIcon: {
    marginRight: 10,
  },
  webViewHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.5)',
  },
  secureText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 5,
  },
  webview: {
    flex: 1,
  },
  webViewLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  webViewLoadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  webViewFooter: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  webViewFooterText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default PaymentScreen;