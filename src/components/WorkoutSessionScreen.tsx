'use client'
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { cardBackground, cardBackgroundSecondary, textPimary, textSecondary, primaryBackground, secondaryBackground } = Colors;
const { width, height } = Dimensions.get('window');

interface WorkoutSessionScreenProps {
  dayData: any;
  onClose: () => void;
}

const WorkoutSessionScreen: React.FC<WorkoutSessionScreenProps> = ({ dayData, onClose }) => {
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const workouts = dayData?.workouts || [];
  const totalWorkouts = workouts.length;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else if (!isActive && timer !== 0 && interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  useEffect(() => {
    if (totalWorkouts > 0) {
      Animated.timing(progressAnim, {
        toValue: (currentWorkoutIndex + 1) / totalWorkouts,
        duration: 400,
        useNativeDriver: false, // width layout updates cannot utilize native driver
      }).start();
    }
  }, [currentWorkoutIndex, totalWorkouts]);

  const handleNextWorkout = () => {
    if (currentWorkoutIndex < totalWorkouts - 1) {
      setCurrentWorkoutIndex(prev => prev + 1);
    } else {
      setShowCongrats(true);
      setIsActive(false);
    }
  };

  const handlePreviousWorkout = () => {
    if (currentWorkoutIndex > 0) {
      setCurrentWorkoutIndex(prev => prev - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#060708" />
      
      {/* Structural Header Area */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={styles.backButton}>
          <Ionicons name="close" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.dayTitle}>{dayData?.day || 'Routine'}</Text>
          <Text style={styles.focusText} numberOfLines={1}>{dayData?.focus || 'Workout Active'}</Text>
        </View>
        
        <View style={styles.timerContainer}>
          <Ionicons name="time" size={14} color="#4cddbb" />
          <Text style={styles.timerText}>{formatTime(timer)}</Text>
        </View>
      </View>

      {/* Dynamic Segment Tracker Section */}
      <View style={styles.progressContainer}>
        <View style={styles.progressLabelRow}>
          <Text style={styles.progressText}>Current Segment</Text>
          <Text style={styles.progressCounterText}>
            {currentWorkoutIndex + 1} <Text style={{ color: '#8E9492' }}>/ {totalWorkouts}</Text>
          </Text>
        </View>
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
      </View>

      {/* Main Routine Execution Space Container */}
      <Animated.ScrollView 
        style={[styles.content, { opacity: fadeAnim }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Core Focal Activity Presenter Card */}
        <View style={styles.currentWorkoutCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.workoutBadge}>
              <Text style={styles.workoutBadgeText}>
                {String(currentWorkoutIndex + 1).padStart(2, '0')}
              </Text>
            </View>
            <Text style={styles.activeLabel}>IN PROGRESS</Text>
          </View>
          
          <Text style={styles.currentWorkoutTitle}>
            {workouts[currentWorkoutIndex] || 'No Exercise Found'}
          </Text>
          
          <View style={styles.workoutDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="barbell-outline" size={16} color="#4cddbb" />
              <Text style={styles.detailValue}>3 Sets</Text>
              <Text style={styles.detailLabel}>Target Volume</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="repeat-outline" size={16} color="#9d62ff" />
              <Text style={styles.detailValue}>12-15 Reps</Text>
              <Text style={styles.detailLabel}>Frequency</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="speedometer-outline" size={16} color="#ffb03a" />
              <Text style={styles.detailValue}>RPE 7-8</Text>
              <Text style={styles.detailLabel}>Intensity</Text>
            </View>
          </View>
          
          {/* Executive Instructive Walkthrough Block */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Execution Strategy</Text>
            {[
              "Maintain consistent spinal neutral alignment throughout ranges.",
              "Control eccentric phases completely—avoid leveraging kinetic bounce.",
              "Force dynamic exhalation matching peak workload engagement targets."
            ].map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <Ionicons name="arrow-forward-circle-outline" size={14} color="#4cddbb" />
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Global Track Sequence Blueprint View */}
        <View style={styles.workoutListContainer}>
          <Text style={styles.workoutListTitle}>Session Sequence Blueprint</Text>
          {workouts.map((workout: string, index: number) => {
            const isCurrent = index === currentWorkoutIndex;
            const isPast = index < currentWorkoutIndex;
            
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.85}
                style={[
                  styles.workoutListItem,
                  isCurrent && styles.activeWorkoutItem,
                ]}
                onPress={() => setCurrentWorkoutIndex(index)}
              >
                <View style={styles.workoutListContent}>
                  <View style={[
                    styles.workoutListIcon,
                    isCurrent && styles.activeWorkoutListIcon,
                    isPast && styles.pastWorkoutListIcon
                  ]}>
                    {isPast ? (
                      <Ionicons name="checkmark-sharp" size={14} color="#060708" />
                    ) : (
                      <Text style={[styles.workoutListNumber, isCurrent && styles.activeWorkoutListNumber]}>
                        {index + 1}
                      </Text>
                    )}
                  </View>
                  <Text style={[
                    styles.workoutListText,
                    isCurrent && styles.activeWorkoutListText,
                    isPast && styles.completedWorkoutText,
                  ]} numberOfLines={1}>
                    {workout}
                  </Text>
                </View>
                {isCurrent && (
                  <Ionicons name="ellipse" size={8} color="#4cddbb" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.ScrollView>

      {/* Persistent Static Interactive Workspace Controls Footer Panel */}
      <View style={styles.controlPanel}>
        <TouchableOpacity
          style={[styles.controlButton, styles.secondaryButton]}
          onPress={handlePreviousWorkout}
          disabled={currentWorkoutIndex === 0}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="chevron-back" 
            size={18} 
            color={currentWorkoutIndex === 0 ? 'rgba(255,255,255,0.15)' : '#B0B5B3'} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.controlButton, styles.primaryButton, isActive && styles.primaryButtonActive]}
          onPress={() => setIsActive(!isActive)}
          activeOpacity={0.9}
        >
          <Ionicons 
            name={isActive ? "pause-sharp" : "play-sharp"} 
            size={20} 
            color="#060708" 
          />
          <Text style={styles.primaryButtonText}>
            {isActive ? 'Halt Session' : 'Resume Pace'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.controlButton, styles.secondaryButton, styles.nextButtonConfig]}
          onPress={handleNextWorkout}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryButtonText}>
            {currentWorkoutIndex === totalWorkouts - 1 ? 'Finish' : 'Next'}
          </Text>
          <Ionicons 
            name="chevron-forward" 
            size={16} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>
      </View>

      {/* Microcycle Completion Modal Frame */}
      <Modal
        visible={showCongrats}
        transparent={true}
        animationType="fade"
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.congratsIcon}>
              <Ionicons name="trophy-sharp" size={36} color="#ffb03a" />
            </View>
            
            <Text style={styles.congratsTitle}>Routine Concluded</Text>
            <Text style={styles.congratsSubtitle}>
              Microcycle tracking target achieved successfully. Block completed safely.
            </Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statModalBox}>
                <Text style={styles.statModalValue}>{totalWorkouts}</Text>
                <Text style={styles.statModalLabel}>Segments</Text>
              </View>
              <View style={styles.statModalDivider} />
              <View style={styles.statModalBox}>
                <Text style={styles.statModalValue}>{formatTime(timer)}</Text>
                <Text style={styles.statModalLabel}>Duration</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.doneButton}
              activeOpacity={0.9}
              onPress={() => {
                setShowCongrats(false);
                onClose();
              }}
            >
              <Text style={styles.doneButtonText}>Commit Metrics & Exit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#060708', // True dark design framework baseline anchor
  },
  header: {
    backgroundColor: '#060708',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 99,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  focusText: {
    fontSize: 12,
    color: '#8E9492',
    fontWeight: '500',
    marginTop: 1,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(76, 221, 187, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(76, 221, 187, 0.15)',
  },
  timerText: {
    color: '#4cddbb',
    fontSize: 14,
    fontWeight: '700',
  },
  progressContainer: {
    backgroundColor: '#0c0e12',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
    color: '#8E9492',
    fontWeight: '600',
  },
  progressCounterText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 99,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4cddbb',
    borderRadius: 99,
  },
  content: {
    flex: 1,
    backgroundColor: '#0c0e12',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  currentWorkoutCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  workoutBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(76, 221, 187, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(76, 221, 187, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutBadgeText: {
    color: '#4cddbb',
    fontSize: 13,
    fontWeight: '700',
  },
  activeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffb03a',
    letterSpacing: 0.5,
    backgroundColor: 'rgba(255, 176, 58, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  currentWorkoutTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 20,
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  workoutDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 6,
  },
  detailLabel: {
    fontSize: 10,
    color: '#8E9492',
    fontWeight: '500',
    marginTop: 2,
  },
  instructionsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.02)',
  },
  instructionsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 12,
    color: '#8E9492',
    lineHeight: 16,
    flex: 1,
    fontWeight: '500',
  },
  workoutListContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 24,
    padding: 16,
  },
  workoutListTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    paddingLeft: 2,
  },
  workoutListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 4,
  },
  activeWorkoutItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  workoutListContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  workoutListIcon: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeWorkoutListIcon: {
    backgroundColor: 'rgba(76, 221, 187, 0.1)',
    borderColor: 'rgba(76, 221, 187, 0.2)',
  },
  pastWorkoutListIcon: {
    backgroundColor: '#4cddbb',
    borderColor: '#4cddbb',
  },
  workoutListNumber: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8E9492',
  },
  activeWorkoutListNumber: {
    color: '#4cddbb',
  },
  workoutListText: {
    fontSize: 13,
    color: '#8E9492',
    fontWeight: '500',
    flex: 1,
  },
  activeWorkoutListText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  completedWorkoutText: {
    color: 'rgba(255, 255, 255, 0.2)',
    textDecorationLine: 'line-through',
  },
  controlPanel: {
    flexDirection: 'row',
    backgroundColor: '#060708',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 14,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    gap: 8,
    alignItems: 'center',
  },
  controlButton: {
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  secondaryButton: {
    width: 52,
  },
  nextButtonConfig: {
    width: 'auto',
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 4,
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    gap: 6,
  },
  primaryButtonActive: {
    backgroundColor: '#4cddbb',
  },
  primaryButtonText: {
    color: '#060708',
    fontSize: 14,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 4, 5, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#0c0e12',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 360,
  },
  congratsIcon: {
    width: 68,
    height: 68,
    borderRadius: 99,
    backgroundColor: 'rgba(255, 176, 58, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 176, 58, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  congratsTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  congratsSubtitle: {
    fontSize: 13,
    color: '#8E9492',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    paddingVertical: 12,
    width: '100%',
    marginBottom: 20,
  },
  statModalBox: {
    alignItems: 'center',
    flex: 1,
  },
  statModalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statModalLabel: {
    fontSize: 11,
    color: '#8E9492',
    fontWeight: '600',
    marginTop: 2,
  },
  statModalDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  doneButton: {
    backgroundColor: '#4cddbb',
    paddingVertical: 14,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#060708',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default WorkoutSessionScreen;