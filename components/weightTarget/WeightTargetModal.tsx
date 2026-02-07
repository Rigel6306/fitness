import { Colors } from '@/constants/Colors';
import { useUserDataContext } from '@/hooks/useContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const { textPimary, textSecondary, secondaryBackground, primaryBackground, cardBackground } = Colors;
const { width, height } = Dimensions.get('window');

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

  // Initialize from context when modal opens
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
        'You chose "Lose Weight" but target is not below start weight. What do you want to do?',
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
        'You chose "Gain Weight" but target is not above start weight. What do you want to do?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Switch to Lose', onPress: () => doSave(true) },
          { text: 'Save Anyway (Gain)', onPress: () => doSave(false) },
        ]
      );
      return;
    }

    // Goal already reached / overshot warnings
    if (weightLoss && current <= target) {
      Alert.alert(
        'Already reached',
        'Current weight is already at or below target. Save anyway?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Save', onPress: () => doSave(weightLoss) },
        ]
      );
      return;
    }

    if (!weightLoss && current >= target) {
      Alert.alert(
        'Already reached',
        'Current weight is already at or above target. Save anyway?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Save', onPress: () => doSave(weightLoss) },
        ]
      );
      return;
    }

    doSave(weightLoss);
  };

  // Calculate current progress using local values (so user sees live preview while editing)
  const progress = calProgress(
    Number(localWeightData.startWeight),
    Number(localWeightData.currentWeight),
    Number(localWeightData.targetWeight),
    localWeightData.weightLoss
  );

  // Responsive font sizes
  const getResponsiveFontSize = (baseSize: number): number => {
    const scale = width / 375; // Base width (iPhone 6/7/8)
    return Math.round(baseSize * Math.min(scale, 1.2));
  };

  // Responsive padding/margin
  const getResponsiveSpacing = (baseSpacing: number): number => {
    return Math.round(baseSpacing * (width / 375));
  };

  return (
    <Modal
      visible={isModalOpen}
      transparent={true}
      animationType="slide"
      onRequestClose={resetLocalAndClose}
      statusBarTranslucent={true}
    >
      <View style={styles.backdrop}>
        <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView
            style={styles.keyboardAvoider}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
          >
            <View style={styles.modalContent}>
              {/* Header */}
              <View style={styles.header}>
                <Pressable 
                  onPress={resetLocalAndClose} 
                  style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.6 }]}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="chevron-back" size={getResponsiveFontSize(28)} color={textPimary} />
                </Pressable>

                <Text style={[styles.heading, { fontSize: getResponsiveFontSize(22) }]}>
                  Weight Goals
                </Text>

                <Pressable 
                  onPress={resetLocalAndClose} 
                  style={({ pressed }) => [styles.closeButton, pressed && { opacity: 0.6 }]}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close-circle-sharp" size={getResponsiveFontSize(28)} color={textPimary} />
                </Pressable>
              </View>

              <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                bounces={true}
              >
                {/* Current Progress Card */}
                <View style={styles.card}>
                  <View style={styles.progressHeader}>
                    <Text style={[styles.cardTitle, { fontSize: getResponsiveFontSize(18) }]}>
                      Current Progress
                    </Text>
                    <View style={styles.modeBadge}>
                      <Text style={[styles.modeBadgeText, { fontSize: getResponsiveFontSize(12) }]}>
                        {localWeightData.weightLoss ? 'Losing Weight' : 'Gaining Weight'}
                      </Text>
                    </View>
                  </View>

                  {/* Weight Display Row - Responsive layout */}
                  <View style={styles.weightRow}>
                    <View style={styles.weightBox}>
                      <Text style={[styles.labelSmall, { fontSize: getResponsiveFontSize(12) }]}>
                        Start
                      </Text>
                      <Text style={[styles.bigNumber, { fontSize: getResponsiveFontSize(22) }]}>
                        {localWeightData.startWeight || '—'} kg
                      </Text>
                    </View>

                    <MaterialIcons 
                      name="keyboard-double-arrow-right" 
                      size={getResponsiveFontSize(24)} 
                      color={textSecondary} 
                      style={styles.arrowIcon}
                    />

                    <View style={styles.weightBox}>
                      <Text style={[styles.labelSmall, { fontSize: getResponsiveFontSize(12) }]}>
                        Current
                      </Text>
                      <Text style={[styles.bigNumber, { fontSize: getResponsiveFontSize(22) }]}>
                        {localWeightData.currentWeight || '—'} kg
                      </Text>
                    </View>

                    <MaterialIcons 
                      name="keyboard-double-arrow-right" 
                      size={getResponsiveFontSize(24)} 
                      color={textSecondary} 
                      style={styles.arrowIcon}
                    />

                    <View style={styles.weightBox}>
                      <Text style={[styles.labelSmall, { fontSize: getResponsiveFontSize(12) }]}>
                        Target
                      </Text>
                      <Text style={[styles.bigNumber, { fontSize: getResponsiveFontSize(22) }]}>
                        {localWeightData.targetWeight || '—'} kg
                      </Text>
                    </View>
                  </View>

                  {/* Progress Bar */}
                  <View style={styles.progressContainer}>
                    <View style={styles.progressLabels}>
                      <Text style={[styles.percentLabel, { fontSize: getResponsiveFontSize(12) }]}>
                        0%
                      </Text>
                      <Text style={[styles.percentLabel, { fontSize: getResponsiveFontSize(12) }]}>
                        100%
                      </Text>
                    </View>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressTrack, { width: `${progress}%` }]} />
                    </View>
                    <Text style={[styles.progressText, { fontSize: getResponsiveFontSize(16) }]}>
                      {progress.toFixed(1)}% Complete
                    </Text>
                  </View>
                </View>

                {/* Form Section */}
                <View style={styles.card}>
                  <Text style={[styles.sectionTitle, { fontSize: getResponsiveFontSize(19) }]}>
                    Set Your Weight Goal
                  </Text>
                  <Text style={[styles.sectionSubtitle, { fontSize: getResponsiveFontSize(15) }]}>
                    I want to
                  </Text>

                  {/* Mode Selection Buttons */}
                  <View style={styles.modeButtons}>
                    <Pressable
                      style={[
                        styles.modeButton,
                        localWeightData.weightLoss && styles.modeButtonActive,
                      ]}
                      onPress={() => setLocalWeightData((p) => ({ ...p, weightLoss: true }))}
                    >
                      <Ionicons 
                        name="trending-down-outline" 
                        size={getResponsiveFontSize(26)} 
                        color="green" 
                      />
                      <Text style={[styles.modeButtonText, { fontSize: getResponsiveFontSize(15) }]}>
                        Lose Weight
                      </Text>
                    </Pressable>

                    <Pressable
                      style={[
                        styles.modeButton,
                        !localWeightData.weightLoss && styles.modeButtonActive,
                      ]}
                      onPress={() => setLocalWeightData((p) => ({ ...p, weightLoss: false }))}
                    >
                      <Ionicons 
                        name="trending-up-outline" 
                        size={getResponsiveFontSize(26)} 
                        color="crimson" 
                      />
                      <Text style={[styles.modeButtonText, { fontSize: getResponsiveFontSize(15) }]}>
                        Gain Weight
                      </Text>
                    </Pressable>
                  </View>

                  {/* Weight Inputs */}
                  {['Start Weight (kg)', 'Current Weight (kg)', 'Target Weight (kg)'].map((label, index) => {
                    const key = ['startWeight', 'currentWeight', 'targetWeight'][index];
                    const icon = index === 0 ? 'weight' : index === 1 ? 'weight' : 'flag-sharp';
                    const IconComponent = index < 2 ? MaterialCommunityIcons : Ionicons;
                    const placeholder = ['e.g. 85', 'e.g. 78', 'e.g. 72'][index];

                    return (
                      <View key={key} style={styles.inputWrapper}>
                        <Text style={[styles.inputLabel, { fontSize: getResponsiveFontSize(15) }]}>
                          {label}
                        </Text>
                        <View style={styles.inputContainer}>
                          <IconComponent 
                            name={icon} 
                            size={getResponsiveFontSize(24)} 
                            color={textSecondary} 
                          />
                          <TextInput
                            style={[styles.input, { fontSize: getResponsiveFontSize(17) }]}
                            value={localWeightData[key as keyof LocalWeightData] as string}
                            onChangeText={(v) => setLocalWeightData((p) => ({ ...p, [key]: v }))}
                            placeholder={placeholder}
                            keyboardType="numeric"
                            placeholderTextColor={textSecondary}
                          />
                        </View>
                      </View>
                    );
                  })}

                  {/* Action Buttons */}
                  <View style={styles.buttonRow}>
                    <Pressable 
                      style={styles.cancelButton} 
                      onPress={resetLocalAndClose}
                    >
                      <Text style={[styles.buttonText, { fontSize: getResponsiveFontSize(16) }]}>
                        Cancel
                      </Text>
                    </Pressable>

                    <Pressable 
                      style={styles.saveButton} 
                      onPress={handleSave}
                    >
                      <Text style={[styles.buttonText, { fontSize: getResponsiveFontSize(16) }]}>
                        Save Changes
                      </Text>
                    </Pressable>
                  </View>

                  {/* Last Updated */}
                  <Text style={[styles.lastUpdated, { fontSize: getResponsiveFontSize(13) }]}>
                    Last Updated: {weightData.updatedOn || '—'}
                  </Text>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  keyboardAvoider: {
    flex: 1,
    maxHeight: '90%', // Prevent modal from covering entire screen
  },
  modalContent: {
    backgroundColor: '#000000ff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flex: 1,
    maxHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Math.max(16, width * 0.04),
    paddingVertical: Math.max(16, height * 0.02),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  closeButton: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  heading: {
    fontWeight: 'bold',
    color: textPimary,
    textAlign: 'center',
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Math.max(12, width * 0.03),
    paddingBottom: Math.max(40, height * 0.05),
  },
  card: {
    backgroundColor: 'rgb(18,18,18)',
    borderRadius: 16,
    padding: Math.max(16, width * 0.04),
    marginBottom: Math.max(16, height * 0.02),
    marginTop: Math.max(8, height * 0.01),
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Math.max(16, height * 0.02),
  },
  cardTitle: {
    color: textPimary,
    fontWeight: 'bold',
  },
  modeBadge: {
    backgroundColor: cardBackground,
    borderRadius: 20,
    paddingVertical: Math.max(6, height * 0.007),
    paddingHorizontal: Math.max(12, width * 0.03),
  },
  modeBadgeText: {
    color: textPimary,
    fontWeight: 'bold',
  },
  weightRow: {
    flexDirection: width < 350 ? 'column' : 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: Math.max(12, height * 0.015),
    gap: width < 350 ? 12 : 0,
  },
  weightBox: {
    alignItems: 'center',
    flex: width < 350 ? 0 : 1,
    marginVertical: width < 350 ? 8 : 0,
    minWidth: width < 350 ? '100%' : 0,
  },
  arrowIcon: {
    transform: [{ rotate: width < 350 ? '90deg' : '0deg' }],
    marginVertical: width < 350 ? 4 : 0,
  },
  labelSmall: {
    color: textSecondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  bigNumber: {
    color: textPimary,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginTop: Math.max(8, height * 0.01),
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  percentLabel: {
    color: textSecondary,
  },
  progressBar: {
    height: 10,
    backgroundColor: 'rgba(100,100,100,0.4)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressTrack: {
    height: '100%',
    backgroundColor: 'rgb(38, 150, 92)',
    borderRadius: 5,
  },
  progressText: {
    textAlign: 'center',
    color: textPimary,
    fontWeight: 'bold',
    marginTop: 10,
  },
  sectionTitle: {
    color: textPimary,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: textPimary,
    fontWeight: '600',
    marginBottom: Math.max(12, height * 0.015),
  },
  modeButtons: {
    flexDirection: 'row',
    gap: Math.max(12, width * 0.03),
    marginBottom: Math.max(20, height * 0.025),
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Math.max(10, width * 0.02),
    backgroundColor: secondaryBackground,
    paddingVertical: Math.max(16, height * 0.02),
    borderRadius: 12,
    minHeight: 60, // Ensure minimum touch target
  },
  modeButtonActive: {
    backgroundColor: 'rgb(38, 69, 62)',
  },
  modeButtonText: {
    color: textPimary,
    fontWeight: 'bold',
  },
  inputWrapper: {
    marginBottom: Math.max(16, height * 0.02),
  },
  inputLabel: {
    color: textPimary,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingHorizontal: Math.max(12, width * 0.03),
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
  },
  input: {
    flex: 1,
    color: textPimary,
    paddingVertical: 10,
    paddingLeft: 10,
    minHeight: 44, // Better touch target
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Math.max(12, width * 0.03),
    marginTop: Math.max(24, height * 0.03),
    marginBottom: Math.max(16, height * 0.02),
  },
  cancelButton: {
    flex: 1,
    backgroundColor: secondaryBackground,
    paddingVertical: Math.max(16, height * 0.02),
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 56, // Better touch target
  },
  saveButton: {
    flex: 1,
    backgroundColor: 'rgb(40, 111, 152)',
    paddingVertical: Math.max(16, height * 0.02),
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 56, // Better touch target
  },
  buttonText: {
    color: textPimary,
    fontWeight: 'bold',
  },
  lastUpdated: {
    textAlign: 'center',
    color: textSecondary,
    marginTop: 8,
  },
});

export default WeightTargetModal;