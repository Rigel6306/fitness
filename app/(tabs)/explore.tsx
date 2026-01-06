import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert,
  Switch
} from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const WeightTrackingScreen = ({ navigation }) => {
  // Mock user data - in real app, this would come from your user context/state
  const [userData, setUserData] = useState({
    currentWeight: '',
    targetWeight: '',
    targetType: 'lose', // 'lose' or 'gain'
    weeklyGoal: 0.5, // kg per week
    lastUpdated: null
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState({ ...userData });

  // Load existing data on component mount
  useEffect(() => {
    // In your actual app, fetch from AsyncStorage or your state management
    const loadUserData = async () => {
      // Mock data - replace with actual data fetching
      const savedData = {
        currentWeight: '75',
        targetWeight: '70',
        targetType: 'lose',
        weeklyGoal: 0.5,
        lastUpdated: '2024-01-15'
      };
      setUserData(savedData);
      setTempData(savedData);
    };
    
    loadUserData();
  }, []);

  const handleSave = () => {
    // Validation
    if (!tempData.currentWeight || !tempData.targetWeight) {
      Alert.alert('Error', 'Please fill in all weight fields');
      return;
    }

    const current = parseFloat(tempData.currentWeight);
    const target = parseFloat(tempData.targetWeight);

    if (isNaN(current) || isNaN(target)) {
      Alert.alert('Error', 'Please enter valid numbers for weight');
      return;
    }

    if (current <= 0 || target <= 0) {
      Alert.alert('Error', 'Weight must be greater than 0');
      return;
    }

    // Check if target makes sense based on goal
    if (tempData.targetType === 'lose' && current < target) {
      Alert.alert('Check Target', 'For weight loss, target weight should be less than current weight');
      return;
    }

    if (tempData.targetType === 'gain' && current > target) {
      Alert.alert('Check Target', 'For weight gain, target weight should be more than current weight');
      return;
    }

    const updatedData = {
      ...tempData,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setUserData(updatedData);
    setIsEditing(false);
    
    // In your actual app, save to AsyncStorage or your backend
    // await saveUserData(updatedData);
    
    Alert.alert('Success', 'Weight goals updated successfully!');
  };

  const handleCancel = () => {
    setTempData({ ...userData });
    setIsEditing(false);
  };

  const calculateProgress = () => {
    const current = parseFloat(userData.currentWeight);
    const target = parseFloat(userData.targetWeight);
    
    if (isNaN(current) || isNaN(target)) return 0;
    
    if (userData.targetType === 'lose') {
      const totalToLose = current - target;
      const lostSoFar = 2; // This would come from actual progress tracking
      return Math.min((lostSoFar / totalToLose) * 100, 100);
    } else {
      const totalToGain = target - current;
      const gainedSoFar = 1; // This would come from actual progress tracking
      return Math.min((gainedSoFar / totalToGain) * 100, 100);
    }
  };

  const getProgressColor = () => {
    return userData.targetType === 'lose' ? '#8B5CF6' : '#10B981';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#8B5CF6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Weight Goals</Text>
        <TouchableOpacity 
          onPress={() => setIsEditing(!isEditing)}
          style={styles.editButton}
        >
          <MaterialIcons 
            name={isEditing ? "close" : "edit"} 
            size={24} 
            color="#8B5CF6" 
          />
        </TouchableOpacity>
      </View>

      {/* Progress Section */}
      {userData.currentWeight && userData.targetWeight && (
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Current Progress</Text>
            <View style={[
              styles.targetTypeBadge, 
              { backgroundColor: getProgressColor() + '20' }
            ]}>
              <Text style={[
                styles.targetTypeText, 
                { color: getProgressColor() }
              ]}>
                {userData.targetType === 'lose' ? 'Losing Weight' : 'Gaining Weight'}
              </Text>
            </View>
          </View>
          
          <View style={styles.weightComparison}>
            <View style={styles.weightItem}>
              <Text style={styles.weightLabel}>Current</Text>
              <Text style={styles.weightValue}>{userData.currentWeight} kg</Text>
            </View>
            <MaterialIcons name="arrow-forward" size={24} color="#666" />
            <View style={styles.weightItem}>
              <Text style={styles.weightLabel}>Target</Text>
              <Text style={styles.weightValue}>{userData.targetWeight} kg</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressLabels}>
              <Text style={styles.progressText}>0%</Text>
              <Text style={styles.progressText}>100%</Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { 
                    width: `${calculateProgress()}%`,
                    backgroundColor: getProgressColor()
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressPercentage}>
              {calculateProgress().toFixed(1)}% Complete
            </Text>
          </View>
        </View>
      )}

      {/* Edit Form */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>
          {isEditing ? 'Update Your Weight Goals' : 'Set Weight Goals'}
        </Text>

        {/* Target Type Selector */}
        <View style={styles.targetTypeContainer}>
          <Text style={styles.sectionLabel}>I want to:</Text>
          <View style={styles.targetTypeButtons}>
            <TouchableOpacity
              style={[
                styles.targetTypeButton,
                tempData.targetType === 'lose' && styles.targetTypeButtonActive
              ]}
              onPress={() => setTempData({...tempData, targetType: 'lose'})}
              disabled={!isEditing}
            >
              <FontAwesome5 
                name="weight" 
                size={20} 
                color={tempData.targetType === 'lose' ? '#fff' : '#8B5CF6'} 
              />
              <Text style={[
                styles.targetTypeButtonText,
                tempData.targetType === 'lose' && styles.targetTypeButtonTextActive
              ]}>
                Lose Weight
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.targetTypeButton,
                tempData.targetType === 'gain' && styles.targetTypeButtonActive
              ]}
              onPress={() => setTempData({...tempData, targetType: 'gain'})}
              disabled={!isEditing}
            >
              <FontAwesome5 
                name="dumbbell" 
                size={20} 
                color={tempData.targetType === 'gain' ? '#fff' : '#10B981'} 
              />
              <Text style={[
                styles.targetTypeButtonText,
                tempData.targetType === 'gain' && styles.targetTypeButtonTextActive
              ]}>
                Gain Weight
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Weight Inputs */}
        <View style={styles.inputGroup}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Current Weight (kg)</Text>
            <View style={styles.inputWithIcon}>
              <MaterialIcons name="scale" size={20} color="#8B5CF6" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={tempData.currentWeight}
                onChangeText={(text) => setTempData({...tempData, currentWeight: text})}
                placeholder="Enter current weight"
                keyboardType="numeric"
                editable={isEditing}
                maxLength={6}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Target Weight (kg)</Text>
            <View style={styles.inputWithIcon}>
              <MaterialIcons name="flag" size={20} color="#8B5CF6" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={tempData.targetWeight}
                onChangeText={(text) => setTempData({...tempData, targetWeight: text})}
                placeholder="Enter target weight"
                keyboardType="numeric"
                editable={isEditing}
                maxLength={6}
              />
            </View>
          </View>
        </View>

        {/* Weekly Goal */}
        <View style={styles.weeklyGoalContainer}>
          <Text style={styles.sectionLabel}>Weekly Goal</Text>
          <View style={styles.weeklyGoalButtons}>
            {[0.25, 0.5, 0.75, 1.0].map((goal) => (
              <TouchableOpacity
                key={goal}
                style={[
                  styles.weeklyGoalButton,
                  tempData.weeklyGoal === goal && styles.weeklyGoalButtonActive
                ]}
                onPress={() => setTempData({...tempData, weeklyGoal: goal})}
                disabled={!isEditing}
              >
                <Text style={[
                  styles.weeklyGoalButtonText,
                  tempData.weeklyGoal === goal && styles.weeklyGoalButtonTextActive
                ]}>
                  {goal} kg/{userData.targetType === 'lose' ? 'week' : 'week'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        {isEditing && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Last Updated */}
        {userData.lastUpdated && (
          <Text style={styles.lastUpdated}>
            Last updated: {userData.lastUpdated}
          </Text>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => navigation.navigate('ProgressTracking')}
        >
          <MaterialIcons name="show-chart" size={24} color="#8B5CF6" />
          <Text style={styles.quickActionText}>View Progress Chart</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => navigation.navigate('WorkoutPlan')}
        >
          <FontAwesome5 name="dumbbell" size={24} color="#8B5CF6" />
          <Text style={styles.quickActionText}>Adjust Workout Plan</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    marginTop: 40,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  editButton: {
    padding: 8,
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  targetTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  targetTypeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  weightComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  weightItem: {
    alignItems: 'center',
  },
  weightLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 4,
  },
  weightValue: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercentage: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  formTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 24,
  },
  targetTypeContainer: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 12,
  },
  targetTypeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  targetTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  targetTypeButtonActive: {
    borderColor: '#8B5CF6',
    backgroundColor: '#8B5CF6',
  },
  targetTypeButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  targetTypeButtonTextActive: {
    color: '#fff',
  },
  inputGroup: {
    gap: 16,
    marginBottom: 24,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
  },
  inputDisabled: {
    color: '#94A3B8',
    backgroundColor: '#F8FAFC',
  },
  weeklyGoalContainer: {
    marginBottom: 24,
  },
  weeklyGoalButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  weeklyGoalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#fff',
  },
  weeklyGoalButtonActive: {
    borderColor: '#8B5CF6',
    backgroundColor: '#8B5CF6',
  },
  weeklyGoalButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  weeklyGoalButtonTextActive: {
    color: '#fff',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 2,
    borderColor: '#E2E8F0',
    backgroundColor: '#fff',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  saveButton: {
    backgroundColor: '#8B5CF6',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  lastUpdated: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginTop: 16,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickActionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1E293B',
  },
});

export default WeightTrackingScreen;