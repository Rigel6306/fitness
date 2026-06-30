'use client'
import CashPayModal from '@/components/payment/cashPayModal';
import TabScreenWrapper from '@/components/ui/TabScreenWrapper';
import { useUserDataContext } from '@/hooks/useContext';
import { handlePayment } from '@/services/payhere';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentPage() {
  const router = useRouter();
  const { userData } = useUserDataContext();
  const { width } = useWindowDimensions();
  const [isModalVisible,setIsModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [err, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');

  const splitName = (fullName: string) => {
    const names = fullName.trim().split(' ');
    const firstName = names[0] || '';
    const lastName = names.slice(1).join(' ') || '';
    return { firstName, lastName };
  };

  const { firstName, lastName } = splitName(userData?.name || '');

  const payhereInfoObject = {
    first_name: firstName,
    last_name: lastName,
    email: userData?.email,
    phone: userData?.contactNumber,
    amount: userData?.package.price
  };

  const handleCashPayment = () => {
    setIsLoading(true);
    setIsModalVisible(true)
    setTimeout(() => setIsLoading(false), 1500);
  };

  const handlePayBtn = () => {
    if (paymentMethod === 'cash') {
      handleCashPayment();
    } else {
      handlePayment(userData.id, payhereInfoObject, setIsLoading, setError, setSuccess);
    }
  };

  // Adjusting layout dynamic spacing for smaller/larger viewports
  const isLargeScreen = width > 480;

  return (
    <TabScreenWrapper routePath="/payments">
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#060708" />
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={[styles.container, isLargeScreen && styles.containerLarge]}>

            {/* Header Section */}
            <View style={styles.header}>
              <Text style={styles.title}>Secure Payment</Text>
              <Text style={styles.subtitle}>Complete your gym membership subscription</Text>
            </View>

            {/* Package Card */}
            <View style={styles.packageCard}>
              <View style={styles.packageHeader}>
                <View style={styles.packageIconBox}>
                  <MaterialCommunityIcons name="package-variant" size={20} color="#4cddbb" />
                </View>
                <View style={styles.packageInfo}>
                  <Text style={styles.packageName}>{userData?.package?.name || 'Standard Plan'}</Text>
                  <Text style={styles.packageTermText}>Access Microcycle Billing Block</Text>
                </View>
              </View>
              <View style={styles.priceDivider} />
              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Amount Due</Text>
                <Text style={styles.priceValue}>Rs : {userData?.package?.price || '0'}.00</Text>
              </View>
            </View>

            {/* Payment Method Selector Grid */}
            <View style={styles.methodContainer}>
              <Text style={styles.sectionTitle}>Select Payment Method</Text>
              <View style={styles.methodRow}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[styles.methodOption, paymentMethod === 'card' && styles.methodOptionActive]}
                  onPress={() => setPaymentMethod('card')}
                >
                  <Ionicons
                    name="card"
                    size={18}
                    color={paymentMethod === 'card' ? '#4cddbb' : '#8E9492'}
                  />
                  <Text style={[styles.methodText, paymentMethod === 'card' && styles.methodTextActive]}>
                    Pay Online
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[styles.methodOption, paymentMethod === 'cash' && styles.methodOptionActive]}
                  onPress={() => setPaymentMethod('cash')}
                >
                  <Ionicons
                    name="cash"
                    size={18}
                    color={paymentMethod === 'cash' ? '#ffb03a' : '#8E9492'}
                  />
                  <Text style={[styles.methodText, paymentMethod === 'cash' && styles.methodTextActive]}>
                    Cash at Desk
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Dynamic Content Switching */}
            {paymentMethod === 'card' ? (
              <View style={styles.formCard}>
                <Text style={styles.sectionTitleInside}>Member Information</Text>

                <View style={styles.cardRow}>
                  <View style={[styles.textGroup, { flex: 1, marginRight: 10 }]}>
                    <Text style={styles.label}>First Name</Text>
                    <Text style={styles.textValue} numberOfLines={1}>{firstName}</Text>
                  </View>
                  <View style={[styles.textGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Last Name</Text>
                    <Text style={styles.textValue} numberOfLines={1}>{lastName || '—'}</Text>
                  </View>
                </View>

                <View style={styles.textGroup}>
                  <Text style={styles.label}>Email Address</Text>
                  <View style={styles.valueRow}>
                    <Ionicons name="mail" size={14} color="#8E9492" style={styles.infoIcon} />
                    <Text style={styles.textValue}>{userData?.email}</Text>
                  </View>
                </View>

                <View style={styles.textGroup}>
                  <Text style={styles.label}>Phone Number</Text>
                  <View style={styles.valueRow}>
                    <Ionicons name="call" size={14} color="#8E9492" style={styles.infoIcon} />
                    <Text style={styles.textValue}>{userData?.contactNumber}</Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.qrCard}>
                <View style={styles.qrHeading}>
                  <Text style={styles.qrTitle}>Present QR Code at Desk</Text>
                  <Text style={styles.qrSubtitle}>Let the desk admin scan this code to process your cash transaction securely.</Text>
                </View>
                {/* Clean, contrasted wrapper container for crisp QR rendering */}
                <View style={styles.qrWrapper}>
                 
                </View>
              </View>
            )}

            {/* Dynamic CTA Action Button */}
            <TouchableOpacity
              style={[styles.payButton, paymentMethod === 'cash' && styles.payButtonCash, { marginBottom: 45 }]}
              onPress={handlePayBtn}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#060708" />
              ) : (
                <>
                  <Ionicons
                    name={paymentMethod === 'card' ? "shield-checkmark" : "sync"}
                    size={18}
                    color="#060708"
                  />
                  <Text style={styles.payButtonText}>
                    {paymentMethod === 'card'
                      ? `Pay Now • Rs : ${userData?.package?.price || '0'}.00`
                      : 'Listen for Desk Approval'
                    }
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
        <CashPayModal isModalVisible={isModalVisible} setModalVisible={setIsModalVisible} userData={userData}/>
      </SafeAreaView>
    </TabScreenWrapper >
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
  containerLarge: {
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    marginBottom: 20,
    paddingLeft: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#8E9492',
    fontWeight: '500',
    marginTop: 4,
  },
  packageCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  packageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  packageIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(76, 221, 187, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(76, 221, 187, 0.2)',
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
    fontSize: 12,
    color: '#8E9492',
    fontWeight: '500',
    marginTop: 2,
  },
  priceDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginVertical: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 13,
    color: '#8E9492',
    fontWeight: '600',
  },
  priceValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#4cddbb',
    letterSpacing: -0.3,
  },
  methodContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8E9492',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
    paddingLeft: 2,
  },
  sectionTitleInside: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
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
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    gap: 8,
  },
  methodOptionActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  methodText: {
    fontSize: 14,
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
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  textGroup: {
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  label: {
    fontSize: 10,
    color: '#8E9492',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 6,
  },
  textValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  qrCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  qrHeading: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: "center",

  },
  qrTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
    textAlign:'left',
  },
  qrSubtitle: {
    fontSize: 12,
    color: '#8E9492',
  
    lineHeight: 18,
    
    marginBottom: 20,
  },
  qrWrapper: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  infoNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 176, 58, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 176, 58, 0.15)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 20,
    gap: 8,
  },
  infoNoticeText: {
    fontSize: 11,
    color: '#ffb03a',
    fontWeight: '600',
  },
  payButton: {
    height: 52,
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
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  payButtonCash: {
    backgroundColor: '#ffb03a',
    shadowColor: '#ffb03a',
  },
  payButtonText: {
    color: '#060708',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
});