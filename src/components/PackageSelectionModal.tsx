import { Colors } from '@/constants/Colors';
import { useUserDataContext } from '@/hooks/useContext';
import { db } from '@/services/firebase';
import { getAllDocs, updateDocument } from '@/services/userService';
import Ionicons from '@expo/vector-icons/Ionicons';
import { doc } from 'firebase/firestore';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PackageCard from './ui/PackageCard';

const { textPimary, textSecondary } = Colors;

interface PackageSelectionModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const PackageSelectionModal: React.FC<PackageSelectionModalProps> = ({ isVisible, onClose }) => {
  const { userData } = useUserDataContext();
  const [updatedPackage, setUpdatedPackageName] = useState<{ name?: string; price?: string }>({});
  const [selected, setSelected] = useState<{ id?: string; name?: string; price?: string }>({});
  const [gymPackages, setGymPackages] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleSelect = useCallback((data: any) => {
    setSelected(data);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    const fetchPackages = async () => {
      try {
        const packageData = await getAllDocs('package');
        setGymPackages(packageData);
      } catch (err) {
        console.error("Error fetching packages:", err);
      }
    };
    fetchPackages();
  }, [isVisible]);

  const handleSaveChanges = async () => {
    if (!selected.id) return;
    setIsSaving(true);

    try {
      const packageRef = doc(db, "package", selected.id);
      const newData = {
        ...userData,
        packageRef, 
      };

      await updateDocument(userData.id, newData, "users");
      setUpdatedPackageName({ name: selected.name, price: selected.price });
      
      setTimeout(() => {
        setIsSaving(false);
        onClose();
      }, 400);
    } catch (err) {
      console.error("Error updating user:", err);
      setIsSaving(false);
    }
  };

  const hasPackageData = useMemo(() => {
    return !!(userData && userData.package);
  }, [userData]);

  const currentSelectedName = useMemo(() => {
    return selected.name || userData?.package?.name;
  }, [selected.name, userData]);

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet" // Enables native iOS swipe-down to dismiss
      transparent={false} // Must be false for pageSheet to work properly
      onRequestClose={onClose}
    >
      <View style={styles.modalScreenOverlay}>
        <SafeAreaView style={styles.modalViewport} edges={['top', 'bottom']}>
          {!hasPackageData ? (
            <View style={styles.loadingWrapper}>
              <ActivityIndicator size="small" color="#0affca" />
              <Text style={styles.loadingText}>SYNCING ACCOUNT PROFILES...</Text>
            </View>
          ) : (
            <View style={styles.container}>
              
              {/* Premium Drag Window Tray Handle */}
              <View style={styles.dragHandleContainer}>
                <View style={styles.dragBarIndicator} />
              </View>

              {/* Header Control Panel */}
              <View style={styles.headingBox}>
                <View style={styles.headerRow}>
                  <Text style={styles.headingText}>MEMBERSHIP PLANS</Text>
                  <Pressable 
                    onPress={onClose}
                    style={({ pressed }) => [pressed && { opacity: 0.5 }, styles.closeIconButton]}
                  >
                    <Ionicons name="close" size={22} color="#ffffff" />
                  </Pressable>
                </View>

                <Text style={styles.currentPackageTitle}>CURRENT SUBSCRIPTION</Text>
                
                {/* RE-ARCHITECTED STACKED SUBSCRIPTION DISPLAY */}
                <View style={styles.stackedPackageCard}>
                  {/* Top Row: Name Alone */}
                  <View style={styles.packageCardTitleRow}>
                    <Text style={styles.packageNameDisplay} numberOfLines={2}>
                      {updatedPackage.name ? updatedPackage.name.toUpperCase() : userData.package.name?.toUpperCase()}
                    </Text>
                  </View>
                  
                  {/* Bottom Row: Price and Badge Side-by-Side */}
                  <View style={styles.packageCardBottomRow}>
                    <Text style={styles.packagePriceDisplay} numberOfLines={1}>
                      RS. {updatedPackage.price ? updatedPackage.price : userData.package.price}
                      <Text style={styles.perMonthLabel}> / MO</Text>
                    </Text>
                    
                    <View style={styles.activeBadgeChip}>
                      <Text style={styles.activeBadgeText}>ACTIVE</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Main Selection Viewport */}
              <View style={styles.contentBody}>
                <Text style={styles.sectionTitle}>AVAILABLE PACKAGES</Text>
                
                <ScrollView 
                  style={styles.scrollContainer}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContentStyle}
                >
                  {gymPackages?.map((pkg) => (
                    <View style={styles.cardWrapperFrame} key={pkg.id}>
                      <PackageCard 
                        id={pkg.id} 
                        isSelected={currentSelectedName === pkg.name} 
                        handleSelect={handleSelect} 
                        name={pkg.name} 
                        description={pkg.description} 
                        price={pkg.price} 
                        icons={pkg.icons} 
                      />
                    </View>
                  ))}
                </ScrollView>

                {/* Tactical Actions Dashboard Button Deck */}
                <View style={styles.actionBtnsContainer}>
                  <Pressable 
                    onPress={onClose} 
                    disabled={isSaving}
                    style={({ pressed }) => [
                      styles.actionBtnBase, 
                      styles.cancelBtnStyle,
                      pressed && { backgroundColor: 'rgba(255, 255, 255, 0.05)' }
                    ]}
                  >
                    <Text style={styles.cancelBtnText}>DISMISS</Text>
                  </Pressable>
                  
                  <Pressable 
                    onPress={handleSaveChanges}
                    disabled={isSaving || !selected.id || selected.name === userData.package.name}
                    style={({ pressed }) => [
                      styles.actionBtnBase,
                      styles.confirmBtnStyle,
                      (!selected.id || selected.name === userData.package.name) && styles.confirmBtnDisabled,
                      pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
                    ]}
                  >
                    {isSaving ? (
                      <ActivityIndicator size="small" color="#030305" />
                    ) : (
                      <Text style={styles.confirmBtnText}>SAVE SELECTION</Text>
                    )}
                  </Pressable>
                </View>
              </View>

            </View>
          )}
        </SafeAreaView>
      </View>
    </Modal>
  );
};

// --- STYLESHEET ---

const styles = StyleSheet.create({
  modalScreenOverlay: {
    flex: 1,
    backgroundColor: '#030305',
  },
  modalViewport: {
    flex: 1,
  },
  loadingWrapper: {
    flex: 1,
    backgroundColor: '#030305',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontFamily: 'Bebas',
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 14,
    letterSpacing: 2,
  },
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
  },
  dragBarIndicator: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headingBox: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: 'rgba(15, 15, 22, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 12,
  },
  headerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  headingText: {
    fontFamily: 'Bebas',
    color: '#ffffff',
    fontSize: 22,
    letterSpacing: 1.5,
    flex: 1,
  },
  
  // Redesigned premium circular frosted close button
  closeIconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentPackageTitle: {
    fontFamily: 'Bebas',
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 8,
  },
  
  // STACKED DESIGN SYSTEM CARD
  stackedPackageCard: {
    backgroundColor: '#030305',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(10, 255, 202, 0.25)',
  },
  packageCardTitleRow: {
    width: '100%',
    marginBottom: 8, // Clean separation from the price below
  },
  packageNameDisplay: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  packageCardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  activeBadgeChip: {
    backgroundColor: 'rgba(10, 255, 202, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: 'rgba(10, 255, 202, 0.3)',
  },
  activeBadgeText: {
    color: '#0affca',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  packagePriceDisplay: {
    color: '#0affca',
    fontSize: 16,
    fontWeight: '800',
  },
  perMonthLabel: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 11,
    fontWeight: '500',
  },
  contentBody: {
    flex: 1,
    backgroundColor: 'rgba(15, 15, 22, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    paddingTop: 16,
    marginBottom: 6,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontFamily: 'Bebas',
    marginHorizontal: 16,
    marginBottom: 12,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.35)',
    letterSpacing: 1.5,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentStyle: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  cardWrapperFrame: {
    width: '100%',
    marginVertical: 4,
    minHeight: 80, 
  },
  actionBtnsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    backgroundColor: '#09090d',
  },
  actionBtnBase: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  cancelBtnStyle: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  confirmBtnStyle: {
    flex: 1.4,
    backgroundColor: '#0affca',
  },
  confirmBtnDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: 'transparent',
    opacity: 0.25,
  },
  cancelBtnText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 1,
  },
  confirmBtnText: {
    color: '#030305',
    fontFamily: 'Bebas',
    fontSize: 15,
    letterSpacing: 1,
  }
});

export default PackageSelectionModal;