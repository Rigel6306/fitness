import { useUserDataContext } from '@/hooks/useContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

type LocalWeightData = {
  startWeight: string;
  currentWeight: string;
  targetWeight: string;
  weightLoss: boolean;
  updatedOn: string;
};

const WeightTargetModal = ({ isModalOpen, setIsModalOpen }: { isModalOpen: boolean; setIsModalOpen: (v: boolean) => void }) => {
  const { weightData, setWeightData } = useUserDataContext();

  const calProgress = (
    startWeight: number,
    currentWeight: number,
    targetWeight: number,
    weightLoss: boolean
  ): number => {
    if (![startWeight, currentWeight, targetWeight].every((v) => Number.isFinite(v))) return 0;

    let totalChange: number;
    let achievedChange: number;

    if (weightLoss) {
      totalChange = startWeight - targetWeight;
      achievedChange = startWeight - currentWeight;
    } else {
      totalChange = targetWeight - startWeight;
      achievedChange = currentWeight - startWeight;
    }

    if (totalChange <= 0 || !isFinite(totalChange)) return 0;

    const progress = (achievedChange / totalChange) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const [localWeightData, setLocalWeightData] = useState<LocalWeightData>({
    startWeight: '',
    currentWeight: '',
    targetWeight: '',
    weightLoss: true,
    updatedOn: '',
  });

  useEffect(() => {
    if (isModalOpen) {
      setLocalWeightData({
        startWeight: String(weightData.startWeight ?? ''),
        currentWeight: String(weightData.currentWeight ?? ''),
        targetWeight: String(weightData.targetWeight ?? ''),
        weightLoss: Boolean(weightData.weightLoss),
        updatedOn: weightData.updatedOn ?? '',
      });
    }
  }, [isModalOpen, weightData]);

  const resetLocalAndClose = () => {
    setLocalWeightData({
      startWeight: String(weightData.startWeight ?? ''),
      currentWeight: String(weightData.currentWeight ?? ''),
      targetWeight: String(weightData.targetWeight ?? ''),
      weightLoss: Boolean(weightData.weightLoss),
      updatedOn: weightData.updatedOn ?? '',
    });
    setIsModalOpen(false);
  };

  const doSave = (finalWeightLoss: boolean) => {
    const start = Number(localWeightData.startWeight);
    const current = Number(localWeightData.currentWeight);
    const target = Number(localWeightData.targetWeight);

    setWeightData({
      startWeight: start,
      currentWeight: current,
      targetWeight: target,
      weightLoss: finalWeightLoss,
      updatedOn: new Date().toISOString().split('T')[0],
    });

    setIsModalOpen(false);
  };

  const handleSave = () => {
    const start = Number(localWeightData.startWeight);
    const current = Number(localWeightData.currentWeight);
    const target = Number(localWeightData.targetWeight);
    const weightLoss = localWeightData.weightLoss;

    if ([start, current, target].some((v) => Number.isNaN(v) || v <= 0)) {
      Alert.alert('Invalid input', 'All weights must be positive numbers.');
      return;
    }

    const isNumericLoss = start > target;
    const isNumericGain = target > start;

    if (weightLoss && !isNumericLoss) {
      Alert.alert(
        'Goal mismatch',
        'You chose "Lose Weight" but target is not below start weight.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Switch to Gain', onPress: () => doSave(false) },
          { text: 'Save Anyway (Lose)', onPress: () => doSave(true) },
        ]
      );
      return;
    }

    if (!weightLoss && !isNumericGain) {
      Alert.alert(
        'Goal mismatch',
        'You chose "Gain Weight" but target is not above start weight.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Switch to Lose', onPress: () => doSave(true) },
          { text: 'Save Anyway (Gain)', onPress: () => doSave(false) },
        ]
      );
      return;
    }

    if (weightLoss && current <= target) {
      Alert.alert('Already reached', 'Current weight is already at or below target. Save anyway?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Save', onPress: () => doSave(weightLoss) },
      ]);
      return;
    }

    if (!weightLoss && current >= target) {
      Alert.alert('Already reached', 'Current weight is already at or above target. Save anyway?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Save', onPress: () => doSave(weightLoss) },
      ]);
      return;
    }

    doSave(weightLoss);
  };

  const progress = calProgress(
    Number(localWeightData.startWeight),
    Number(localWeightData.currentWeight),
    Number(localWeightData.targetWeight),
    localWeightData.weightLoss
  );

  return (
    <Modal
      visible={isModalOpen}
      animationType="slide"
      presentationStyle="pageSheet" // Enables native iOS swipe-down to dismiss
      transparent={false} // Must be false for pageSheet to work natively
      onRequestClose={resetLocalAndClose}
    >
      <View style={styles.modalScreenOverlay}>
        <SafeAreaView style={styles.modalViewport} edges={['top', 'bottom']}>
          <KeyboardAvoidingView
            style={styles.keyboardAvoider}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            {/* Premium Drag Window Tray Handle */}
            <View style={styles.dragHandleContainer}>
              <View style={styles.dragBarIndicator} />
            </View>

            <ScrollView
              contentContainerStyle={styles.scrollContentStyle}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Header Control Panel */}
              <View style={styles.headingBox}>
                <View style={styles.headerRow}>
                  <Text style={styles.headingText}>WEIGHT GOALS</Text>
                  <Pressable 
                    onPress={resetLocalAndClose}
                    style={({ pressed }) => [pressed && { opacity: 0.5 }, styles.closeIconButton]}
                  >
                    <Ionicons name="close" size={20} color="#ffffff" />
                  </Pressable>
                </View>

                {/* STACKED DESIGN SYSTEM CARD: Current Progress */}
                <Text style={styles.sectionTitleSmall}>CURRENT PROGRESS</Text>
                
                <View style={styles.stackedPackageCard}>
                  <View style={styles.packageCardTitleRow}>
                    <Text style={styles.packageNameDisplay} numberOfLines={1}>
                      {progress.toFixed(1)}% <Text style={styles.perMonthLabel}>COMPLETED</Text>
                    </Text>
                    <View style={styles.activeBadgeChip}>
                      <Text style={styles.activeBadgeText}>
                        {localWeightData.weightLoss ? 'LOSING' : 'GAINING'}
                      </Text>
                    </View>
                  </View>
                  
                  {/* Progress Bar */}
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressTrack, { width: `${progress}%` }]} />
                    </View>
                  </View>

                  <View style={styles.weightRow}>
                    <View style={styles.weightBox}>
                      <Text style={styles.labelSmall}>START</Text>
                      <Text style={styles.bigNumber}>{localWeightData.startWeight || '—'} <Text style={styles.unitText}>kg</Text></Text>
                    </View>
                    <MaterialIcons name="keyboard-arrow-right" size={18} color="rgba(255,255,255,0.2)" />
                    <View style={styles.weightBox}>
                      <Text style={styles.labelSmall}>CURRENT</Text>
                      <Text style={[styles.bigNumber, { color: '#0affca' }]}>{localWeightData.currentWeight || '—'} <Text style={[styles.unitText, { color: 'rgba(10, 255, 202, 0.4)' }]}>kg</Text></Text>
                    </View>
                    <MaterialIcons name="keyboard-arrow-right" size={18} color="rgba(255,255,255,0.2)" />
                    <View style={styles.weightBox}>
                      <Text style={styles.labelSmall}>TARGET</Text>
                      <Text style={styles.bigNumber}>{localWeightData.targetWeight || '—'} <Text style={styles.unitText}>kg</Text></Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Main Selection Viewport */}
              <View style={styles.contentBody}>
                <Text style={styles.sectionTitle}>UPDATE MEASUREMENTS</Text>

                {/* Mode Selection Buttons */}
                <View style={styles.modeButtons}>
                  <Pressable
                    style={[styles.modeButton, localWeightData.weightLoss && styles.modeButtonActive]}
                    onPress={() => setLocalWeightData((p) => ({ ...p, weightLoss: true }))}
                  >
                    <Ionicons name="trending-down-outline" size={20} color={localWeightData.weightLoss ? "#030305" : "rgba(255,255,255,0.4)"} />
                    <Text style={[styles.modeButtonText, localWeightData.weightLoss && styles.modeButtonTextActive]}>
                      LOSE WEIGHT
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[styles.modeButton, !localWeightData.weightLoss && styles.modeButtonActive]}
                    onPress={() => setLocalWeightData((p) => ({ ...p, weightLoss: false }))}
                  >
                    <Ionicons name="trending-up-outline" size={20} color={!localWeightData.weightLoss ? "#030305" : "rgba(255,255,255,0.4)"} />
                    <Text style={[styles.modeButtonText, !localWeightData.weightLoss && styles.modeButtonTextActive]}>
                      GAIN WEIGHT
                    </Text>
                  </Pressable>
                </View>

                {/* Weight Inputs */}
                <View style={styles.inputsWrapper}>
                  {['Start Weight (kg)', 'Current Weight (kg)', 'Target Weight (kg)'].map((label, index) => {
                    const key = ['startWeight', 'currentWeight', 'targetWeight'][index];
                    const icon = index === 0 ? 'weight' : index === 1 ? 'weight' : 'flag-variant';
                    const placeholder = ['e.g. 85', 'e.g. 78', 'e.g. 72'][index];

                    return (
                      <View key={key} style={styles.inputContainer}>
                        <View style={styles.inputLabelRow}>
                          <Text style={styles.inputLabel}>{label.toUpperCase()}</Text>
                        </View>
                        <View style={styles.inputFieldWrapper}>
                          <MaterialCommunityIcons name={icon as any} size={18} color="rgba(255,255,255,0.4)" style={styles.inputIcon} />
                          <TextInput
                            style={styles.input}
                            value={localWeightData[key as keyof LocalWeightData] as string}
                            onChangeText={(v) => setLocalWeightData((p) => ({ ...p, [key]: v }))}
                            placeholder={placeholder}
                            keyboardType="numeric"
                            placeholderTextColor="rgba(255,255,255,0.2)"
                          />
                        </View>
                      </View>
                    );
                  })}
                </View>

                {/* Tactical Actions Dashboard Button Deck */}
                <View style={styles.actionBtnsContainer}>
                  <Pressable 
                    onPress={resetLocalAndClose} 
                    style={({ pressed }) => [
                      styles.actionBtnBase, 
                      styles.cancelBtnStyle,
                      pressed && { backgroundColor: 'rgba(255, 255, 255, 0.05)' }
                    ]}
                  >
                    <Text style={styles.cancelBtnText}>DISMISS</Text>
                  </Pressable>
                  
                  <Pressable 
                    onPress={handleSave}
                    style={({ pressed }) => [
                      styles.actionBtnBase,
                      styles.confirmBtnStyle,
                      pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
                    ]}
                  >
                    <Text style={styles.confirmBtnText}>SAVE MEASUREMENTS</Text>
                  </Pressable>
                </View>

                {/* Last Updated Timestamp */}
                {weightData.updatedOn && (
                   <Text style={styles.lastUpdatedText}>LAST UPDATED: {weightData.updatedOn}</Text>
                )}
                
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
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
  keyboardAvoider: {
    flex: 1,
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    width: '100%',
  },
  dragBarIndicator: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  scrollContentStyle: {
    paddingHorizontal: 12,
    paddingBottom: 24,
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
  closeIconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitleSmall: {
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  packageNameDisplay: {
    color: '#ffffff',
    fontSize: 22,
    fontFamily: 'Bebas',
    letterSpacing: 1,
  },
  perMonthLabel: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
    fontFamily: 'System', // Fallback to system for standard text
    fontWeight: '600',
    letterSpacing: 0,
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
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressTrack: {
    height: '100%',
    backgroundColor: '#0affca',
    borderRadius: 3,
  },
  weightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    padding: 12,
    borderRadius: 10,
  },
  weightBox: {
    alignItems: 'center',
  },
  labelSmall: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  bigNumber: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  unitText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
    fontWeight: '600',
  },
  contentBody: {
    flex: 1,
    backgroundColor: 'rgba(15, 15, 22, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    paddingTop: 16,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontFamily: 'Bebas',
    marginHorizontal: 16,
    marginBottom: 16,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.35)',
    letterSpacing: 1.5,
  },
  modeButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 14,
    borderRadius: 12,
  },
  modeButtonActive: {
    backgroundColor: '#0affca',
    borderColor: '#0affca',
  },
  modeButtonText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  modeButtonTextActive: {
    color: '#030305',
  },
  inputsWrapper: {
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 4,
  },
  inputLabelRow: {
    marginBottom: 8,
    paddingLeft: 4,
  },
  inputLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  inputFieldWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    height: '100%',
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
  },
  lastUpdatedText: {
    textAlign: 'center',
    fontFamily: 'Bebas',
    color: 'rgba(255, 255, 255, 0.2)',
    fontSize: 11,
    letterSpacing: 1,
    paddingBottom: 20,
    backgroundColor: '#09090d',
  }
});

export default WeightTargetModal;