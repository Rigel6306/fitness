import { Colors } from '@/constants/Colors';
import { useUserDataContext } from '@/hooks/useContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

const { textPimary, textSecondary, secondaryBackground, primaryBackground, cardBackground } = Colors;

type LocalWeightData = {
  currentWeight: string;
  targetWeight: string;
  weightLoss: boolean;
  updatedOn: string;
};

const WeightTargetModal = ({ isModalOpen, setIsModalOpen }: { isModalOpen: boolean; setIsModalOpen: (v: boolean) => void }) => {
  const { weightData, setWeightData } = useUserDataContext();

  // Progress calculation (handles both loss and gain and clamps 0-100)
  const calProgress = (startWeight: number, currentWeight: number, targetWeight: number, weightLoss: boolean): number => {
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

    // If totalChange is zero or invalid, try to infer direction
    if (totalChange === 0 || !isFinite(totalChange)) return 0;

    const progress = (achievedChange / totalChange) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  // Use context startWeight (not editable here)
  const startWeightFromContext = Number(weightData.startWeight);

  // Progress shown in the original card uses context values (keeps original behavior)
  const progress = calProgress(
    startWeightFromContext,
    Number(weightData.currentWeight),
    Number(weightData.targetWeight),
    Boolean(weightData.weightLoss)
  );

  const [localWeightData, setLocalWeightData] = useState<LocalWeightData>({
    currentWeight: '',
    targetWeight: '',
    weightLoss: true,
    updatedOn: ''
  });

  useEffect(() => {
    // initialize local state from context (strings for TextInput)
    setLocalWeightData({
      currentWeight: String(weightData.currentWeight ?? ''),
      targetWeight: String(weightData.targetWeight ?? ''),
      weightLoss: Boolean(weightData.weightLoss),
      updatedOn: weightData.updatedOn ?? ''
    });
  }, [isModalOpen, weightData]);

  const resetLocalAndClose = () => {
    setLocalWeightData({
      currentWeight: String(weightData.currentWeight ?? ''),
      targetWeight: String(weightData.targetWeight ?? ''),
      weightLoss: Boolean(weightData.weightLoss),
      updatedOn: weightData.updatedOn ?? ''
    });
    setIsModalOpen(false);
  };

  // Save helper that actually writes to context
  const doSave = (finalWeightLoss: boolean) => {
    const start = startWeightFromContext;
    const current = Number(localWeightData.currentWeight);
    const target = Number(localWeightData.targetWeight);

    setWeightData({
      startWeight: start,
      currentWeight: current,
      targetWeight: target,
      weightLoss: finalWeightLoss,
      updatedOn: new Date().toISOString().split('T')[0]
    });

    setIsModalOpen(false);
  };

  // Main save handler with validation and friendly alerts
  const handleSave = () => {
    const start = startWeightFromContext; // not editable here
    const current = Number(localWeightData.currentWeight);
    const target = Number(localWeightData.targetWeight);
    const weightLoss = Boolean(localWeightData.weightLoss);

    // Basic numeric validation
    if ([start, current, target].some((v) => Number.isNaN(v))) {
      Alert.alert('Invalid input', 'Please enter numeric values for current and target weights.');
      return;
    }

    if (start <= 0 || current <= 0 || target <= 0) {
      Alert.alert('Invalid input', 'Weights must be greater than zero.');
      return;
    }

    // If the user selected a mode that contradicts the numeric relation between start and target,
    // we allow changing the goal anytime but present a clear choice:
    // - Save Anyway (keep selected mode)
    // - Switch Mode (flip weightLoss to match numeric relation)
    // - Cancel
    const isNumericLoss = start > target;
    const isNumericGain = target > start;

    if (weightLoss && !isNumericLoss) {
      // User chose "Lose" but target is not less than start
      Alert.alert(
        'Inconsistent goal',
        'You selected "Lose Weight" but the target weight is not less than your start weight. What would you like to do?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Switch to Gain',
            onPress: () => doSave(false)
          },
          {
            text: 'Save Anyway',
            onPress: () => doSave(true)
          }
        ],
        { cancelable: true }
      );
      return;
    }

    if (!weightLoss && !isNumericGain) {
      // User chose "Gain" but target is not greater than start
      Alert.alert(
        'Inconsistent goal',
        'You selected "Gain Weight" but the target weight is not greater than your start weight. What would you like to do?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Switch to Lose',
            onPress: () => doSave(true)
          },
          {
            text: 'Save Anyway',
            onPress: () => doSave(false)
          }
        ],
        { cancelable: true }
      );
      return;
    }

    // If current already beyond target, show an informational alert but allow save
    if (weightLoss && current <= target) {
      Alert.alert(
        'Note',
        'Your current weight is already at or below the target. Do you still want to save?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Save', onPress: () => doSave(weightLoss) }
        ],
        { cancelable: true }
      );
      return;
    }

    if (!weightLoss && current >= target) {
      Alert.alert(
        'Note',
        'Your current weight is already at or above the target. Do you still want to save?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Save', onPress: () => doSave(weightLoss) }
        ],
        { cancelable: true }
      );
      return;
    }

    // All validations passed — save normally
    doSave(weightLoss);
  };

  return (
    <Modal
      visible={isModalOpen}
      transparent={true}
      animationType="slide"
      onRequestClose={resetLocalAndClose}
    >
      <View style={styles.container}>
        <View style={styles.headingContainer}>
          <Pressable style={({ pressed }) => [pressed && { opacity: 0.5 }]} onPress={resetLocalAndClose}>
            <Ionicons name="chevron-back" size={24} color={textPimary} />
          </Pressable>
          <Text style={{ textAlign: 'center', fontSize: 20, color: textPimary, fontWeight: 'bold' }}>Weight Goals</Text>
          <Pressable style={({ pressed }) => [pressed && { opacity: 0.5 }]} onPress={resetLocalAndClose} >
            <Ionicons name="close-circle-sharp" size={24} color={textPimary} />
          </Pressable>
        </View>

        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView style={styles.bodyContainer}>
            {/* Current Progress Card */}
            <View style={styles.curentProgress}>
              <View style={styles.progressHeading}>
                <Text style={{ color: textPimary, fontSize: 19, fontWeight: 'bold' }}>Current Progress</Text>
                <Text style={{ color: textPimary, borderRadius: 20, padding: 7, backgroundColor: cardBackground, fontSize: 11, fontWeight: 'bold' }}>
                  {weightData.weightLoss ? 'Losing Weight' : 'Gaining Weight'}
                </Text>
              </View>

              <View style={styles.weightTargetContainer}>
                <View style={styles.curentWeight}>
                  <Text style={{ color: textSecondary, fontSize: 12, fontWeight: 'bold' }}>Current</Text>
                  <Text style={{ color: textPimary, fontSize: 22, fontWeight: 'bold' }}>{weightData.currentWeight}Kg</Text>
                </View>

                <MaterialIcons name="keyboard-double-arrow-right" size={24} color="black" />

                <View style={styles.targetWeight}>
                  <Text style={{ color: textSecondary, fontSize: 12, fontWeight: 'bold' }}>Target</Text>
                  <Text style={{ color: textPimary, fontSize: 22, fontWeight: 'bold' }}>{weightData.targetWeight}Kg</Text>
                </View>
              </View>

              <View style={styles.progressBarContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ color: textSecondary }}>0%</Text>
                  <Text style={{ color: textSecondary }}>100%</Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressTrack, { width: `${progress}%` }]} />
                </View>
                <Text style={{ textAlign: 'center', color: textPimary, marginTop: 10, fontWeight: 'bold' }}>{progress.toFixed(1)}% Complete</Text>
              </View>
            </View>

            {/* Weight Goal Update Section */}
            <View style={styles.weightGoalFormContainer} >
              <Text style={styles.goalHeadingText}>Set Your Weight Goal</Text>
              <Text style={styles.goalSubText}>I Want to</Text>

              <View style={styles.targetButtonContainer}>
                <Pressable
                  style={({ pressed }) => [pressed && { opacity: 0.5 }, styles.targetButton, { backgroundColor: localWeightData.weightLoss ? "rgb(38, 69, 62)" : secondaryBackground }]}
                  onPress={() => setLocalWeightData((prev) => ({ ...prev, weightLoss: true }))}
                >
                  <Ionicons name="trending-down-outline" size={24} color="green" />
                  <Text style={styles.targetButtonText}>Lose Weight</Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [pressed && { opacity: 0.5 }, styles.targetButton, { backgroundColor: !localWeightData.weightLoss ? "rgb(38, 69, 62)" : secondaryBackground }]}
                  onPress={() => setLocalWeightData((prev) => ({ ...prev, weightLoss: false }))}
                >
                  <Ionicons name="trending-up-outline" size={24} color="crimson" />
                  <Text style={styles.targetButtonText}>Gain Weight</Text>
                </Pressable>
              </View>

              {/* Current Weight */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLable}>Current Weight (KG)</Text>
                <View style={styles.inputFieldContainer}>
                  <MaterialCommunityIcons name="weight" size={24} color="black" />
                  <TextInput
                    value={String(localWeightData.currentWeight)}
                    onChangeText={(value) => setLocalWeightData((prev) => ({ ...prev, currentWeight: value }))}
                    placeholder="75"
                    keyboardType="numeric"
                    style={styles.inputField}
                  />
                </View>
              </View>

              {/* Target Weight */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLable}>Target Weight (KG)</Text>
                <View style={styles.inputFieldContainer}>
                  <Ionicons name="flag-sharp" size={24} color="black" />
                  <TextInput
                    value={String(localWeightData.targetWeight)}
                    onChangeText={(value) => setLocalWeightData((prev) => ({ ...prev, targetWeight: value }))}
                    placeholder="75"
                    keyboardType="numeric"
                    style={styles.inputField}
                  />
                </View>
              </View>

              <View style={styles.actionButtonsContainer}>
                <Pressable style={({ pressed }) => [pressed && { opacity: 0.5 }, styles.cancleBtn]} onPress={resetLocalAndClose}>
                  <Text style={styles.targetButtonText}>Cancel</Text>
                </Pressable>

                <Pressable style={({ pressed }) => [pressed && { opacity: 0.5 }, styles.saveBtn]} onPress={handleSave}>
                  <Text style={styles.targetButtonText}>Save Changes</Text>
                </Pressable>
              </View>

              <Text style={{ textAlign: 'center', color: textSecondary }}>Last Updated On: {weightData.updatedOn ?? '—'}</Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    backgroundColor: "#000000ff",
  },
  headingContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: "center",
    justifyContent: 'space-between'
  },
  bodyContainer: {
    flex: 4,
    marginBottom: 20,
  },
  curentProgress: {
    padding: 10,
    marginTop: 10,
    borderRadius: 20,
    backgroundColor: "rgb(36, 36, 49)",
  },
  progressHeading: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  weightTargetContainer: {
    marginTop: 20,
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  curentWeight: {
    alignItems: "center",
    justifyContent: 'center'
  },
  targetWeight: {
    alignItems: "center",
    justifyContent: 'center'
  },
  progressBarContainer: {
    margin: 10,
  },
  progressBar: {
    backgroundColor: textSecondary,
    height: 10,
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden'
  },
  progressTrack: {
    height: '100%',
    borderRadius: 10,
    backgroundColor: "rgb(38, 69, 62)",
  },
  weightGoalFormContainer: {
    padding: 10,
    marginTop: 10,
    borderRadius: 20,
    backgroundColor: "rgb(36, 36, 49)"
  },
  goalHeadingText: {
    padding: 10,
    fontSize: 19,
    color: textPimary,
    fontWeight: 'bold',
  },
  goalSubText: {
    padding: 10,
    fontSize: 15,
    color: textPimary,
    fontWeight: 'bold',
  },
  targetButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    margin: 10,
  },
  targetButton: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: secondaryBackground,
    padding: 20,
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    gap: 10,
  },
  targetButtonText: {
    color: textPimary,
    fontWeight: 'bold',
  },
  inputContainer: {
    margin: 10,
    gap: 10
  },
  inputLable: {
    fontSize: 15,
    color: textPimary,
    fontWeight: 'bold',
  },
  inputFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: textSecondary,
    borderRadius: 15,
    padding: 10,
  },
  inputField: {
    flex: 1,
    padding: 10,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    margin: 10,
    marginTop: 20,
    gap: 10,
  },
  cancleBtn: {
    flex: 1,
    backgroundColor: secondaryBackground,
    padding: 20,
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
  },
  saveBtn: {
    flex: 1,
    backgroundColor: "rgb(40, 111, 152)",
    padding: 20,
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
  },
});

export default WeightTargetModal;
