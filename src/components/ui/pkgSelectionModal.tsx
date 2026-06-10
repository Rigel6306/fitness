import React from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import PackageCard from './PackageCard';

interface PackageSelectionModalProps {
  isVisible: boolean;
  onClose: () => void;
  packageList: any[];
  selected: { id?: string; name?: string };
  handleSelect: (data: any) => void;
}

const PkgSelectionModal: React.FC<PackageSelectionModalProps> = ({
  isVisible,
  onClose,
  packageList,
  selected,
  handleSelect
}) => {
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalViewport} edges={['top', 'bottom']}>
        <View style={styles.container}>
          
          {/* Header Action Row */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headingText}>MEMBERSHIP PLANS</Text>
              <Text style={styles.headingSubText}>SELECT A PLAN TO UNLOCK ACCESS</Text>
            </View>
            <Pressable 
              onPress={onClose}
              style={({ pressed }) => [pressed && { opacity: 0.6 }]}
            >
              <Ionicons name="close-circle-outline" size={28} color="rgba(255, 255, 255, 0.4)" />
            </Pressable>
          </View>

          {/* Card List Viewport */}
          <ScrollView 
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {packageList?.map((pkg) => (
              <PackageCard
                id={pkg.id}
                onClose={onClose}
                isSelected={selected.name === pkg.name}
                handleSelect={handleSelect}
                key={pkg.id}
                name={pkg.name}
                description={pkg.description}
                price={pkg.price}
                icons={pkg.icons}
              />
            ))}
          </ScrollView>

        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalViewport: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  headerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 12,
  },
  headingText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1.5,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  headingSubText: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  }
});

export default PkgSelectionModal;