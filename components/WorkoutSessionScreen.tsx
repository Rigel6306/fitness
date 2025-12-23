import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface WorkoutSessionScreenProps {
  dayData: any;
  onClose: () => void;
}

const WorkoutSessionScreen: React.FC<WorkoutSessionScreenProps> = ({ dayData, onClose }) => {
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const workouts = dayData?.workouts || [];
  const totalWorkouts = workouts.length;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else if (!isActive && timer !== 0) {
      clearInterval(interval as NodeJS.Timeout);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timer]);

  useEffect(() => {
    if (currentWorkoutIndex < totalWorkouts) {
      Animated.timing(progressAnim, {
        toValue: (currentWorkoutIndex + 1) / totalWorkouts,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [currentWorkoutIndex]);

  const handleNextWorkout = () => {
    if (currentWorkoutIndex < totalWorkouts - 1) {
      setCurrentWorkoutIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Ionicons name="close" size={28} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.dayTitle}>{dayData?.day}</Text>
          <Text style={styles.focusText}>{dayData?.focus}</Text>
        </View>
        <View style={styles.timerContainer}>
          <Ionicons name="time-outline" size={20} color="#FFF" />
          <Text style={styles.timerText}>{formatTime(timer)}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Workout {currentWorkoutIndex + 1} of {totalWorkouts}
        </Text>
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
      </View>

      {/* Main Content */}
      <Animated.ScrollView 
        style={[styles.content, { opacity: fadeAnim }]}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.currentWorkoutCard}>
          <View style={styles.workoutBadge}>
            <Text style={styles.workoutBadgeText}>
              {currentWorkoutIndex + 1}
            </Text>
          </View>
          
          <Text style={styles.currentWorkoutTitle}>
            {workouts[currentWorkoutIndex]}
          </Text>
          
          <View style={styles.workoutDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="barbell-outline" size={20} color="#667eea" />
              <Text style={styles.detailText}>3 Sets</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="repeat-outline" size={20} color="#667eea" />
              <Text style={styles.detailText}>12-15 Reps</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="fitness-outline" size={20} color="#667eea" />
              <Text style={styles.detailText}>Medium Weight</Text>
            </View>
          </View>
          
          {/* Exercise Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Instructions</Text>
            <View style={styles.instructionItem}>
              <Ionicons name="checkmark-circle" size={16} color="#667eea" />
              <Text style={styles.instructionText}>
                Maintain proper form throughout the exercise
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Ionicons name="checkmark-circle" size={16} color="#667eea" />
              <Text style={styles.instructionText}>
                Control the movement, don't use momentum
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Ionicons name="checkmark-circle" size={16} color="#667eea" />
              <Text style={styles.instructionText}>
                Breathe out during exertion, in during relaxation
              </Text>
            </View>
          </View>
        </View>

        {/* Workout List */}
        <View style={styles.workoutListContainer}>
          <Text style={styles.workoutListTitle}>Today's Workouts</Text>
          {workouts.map((workout: string, index: number) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.workoutListItem,
                index === currentWorkoutIndex && styles.activeWorkoutItem,
                index < currentWorkoutIndex && styles.completedWorkoutItem,
              ]}
              onPress={() => setCurrentWorkoutIndex(index)}
            >
              <View style={styles.workoutListContent}>
                <View style={styles.workoutListIcon}>
                  {index < currentWorkoutIndex ? (
                    <Ionicons name="checkmark-circle" size={20} color="#48bb78" />
                  ) : (
                    <Text style={styles.workoutListNumber}>{index + 1}</Text>
                  )}
                </View>
                <Text style={[
                  styles.workoutListText,
                  index === currentWorkoutIndex && styles.activeWorkoutText,
                  index < currentWorkoutIndex && styles.completedWorkoutText,
                ]}>
                  {workout}
                </Text>
              </View>
              {index === currentWorkoutIndex && (
                <Ionicons name="play-circle" size={24} color="#667eea" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </Animated.ScrollView>

      {/* Control Panel */}
      <View style={styles.controlPanel}>
        <TouchableOpacity
          style={[styles.controlButton, styles.secondaryButton]}
          onPress={handlePreviousWorkout}
          disabled={currentWorkoutIndex === 0}
        >
          <Ionicons 
            name="chevron-back" 
            size={24} 
            color={currentWorkoutIndex === 0 ? '#999' : '#667eea'} 
          />
          <Text style={[
            styles.controlButtonText,
            { color: currentWorkoutIndex === 0 ? '#999' : '#667eea' }
          ]}>
            Previous
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.controlButton, styles.primaryButton]}
          onPress={() => setIsActive(!isActive)}
        >
          <Ionicons 
            name={isActive ? "pause" : "play"} 
            size={28} 
            color="#FFF" 
          />
          <Text style={[styles.controlButtonText, { color: '#FFF' }]}>
            {isActive ? 'Pause' : 'Resume'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.controlButton, styles.secondaryButton]}
          onPress={handleNextWorkout}
        >
          <Text style={[styles.controlButtonText, { color: '#667eea' }]}>
            {currentWorkoutIndex === totalWorkouts - 1 ? 'Complete' : 'Next'}
          </Text>
          <Ionicons 
            name="chevron-forward" 
            size={24} 
            color="#667eea" 
          />
        </TouchableOpacity>
      </View>

      {/* Congratulations Modal */}
      <Modal
        visible={showCongrats}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
            <View style={styles.congratsIcon}>
              <Ionicons name="trophy" size={60} color="#667eea" />
            </View>
            
            <Text style={styles.congratsTitle}>Workout Complete!</Text>
            <Text style={styles.congratsSubtitle}>
              You finished {dayData?.day} in {formatTime(timer)}
            </Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{totalWorkouts}</Text>
                <Text style={styles.statLabel}>Exercises</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{formatTime(timer)}</Text>
                <Text style={styles.statLabel}>Total Time</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.doneButton}
              onPress={() => {
                setShowCongrats(false);
                onClose();
              }}
            >
              <Text style={styles.doneButtonText}>Awesome! Back to Schedule</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#667eea',
    padding: 20,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  focusText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  timerText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  progressContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e9ecef',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#667eea',
    borderRadius: 3,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  currentWorkoutCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  workoutBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#667eea',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  workoutBadgeText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  currentWorkoutTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    lineHeight: 32,
  },
  workoutDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e9ecef',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  instructionsContainer: {
    backgroundColor: '#f8f9ff',
    padding: 16,
    borderRadius: 12,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
    flex: 1,
  },
  workoutListContainer: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
  },
  workoutListTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  workoutListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  activeWorkoutItem: {
    backgroundColor: '#f8f9ff',
    marginHorizontal: -12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  completedWorkoutItem: {
    opacity: 0.8,
  },
  workoutListContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  workoutListIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  workoutListNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  workoutListText: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  activeWorkoutText: {
    color: '#667eea',
    fontWeight: '600',
  },
  completedWorkoutText: {
    color: '#48bb78',
    textDecorationLine: 'line-through',
  },
  controlPanel: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  primaryButton: {
    backgroundColor: '#667eea',
  },
  secondaryButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 30,
    padding: 40,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  congratsIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f8f9ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  congratsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  congratsSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e9ecef',
  },
  doneButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WorkoutSessionScreen;