'use client'
import { Colors } from "@/constants/Colors"
import { DailyAnalyticalData, ExerciseRecord } from "@/context/userDataContext"
import { useUserDataContext } from "@/hooks/useContext"
import { updateAnalyticalData } from "@/services/analyticsService"
import { saveWorkoutDataImmediately, updateAsyncStorageOnDebounce } from "@/services/asynchStorageService"
import Ionicons from '@expo/vector-icons/Ionicons'

import {
  Animated,
  Dimensions,
  FlatList,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native"
import ExercisesCard from "../ui/ExercisesCard"

import { useEffect, useRef } from "react"
import { SafeAreaView } from "react-native-safe-area-context"

const { textPimary, textSecondary } = Colors
const { width, height } = Dimensions.get('window')

interface WorkoutItem {
  id: string;
  name: string;
  reps: string;
  isComplete: boolean;
}

interface WorkoutsList {
  date: string;
  list: WorkoutItem[];
  analyticalData?: DailyAnalyticalData;
}

interface WorkoutsListModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  selectedDaySchedule: {
    day: number;
    schedule: Array<any>;
  };
  workoutsList: WorkoutsList;
  setWorkoutsList: (list: WorkoutsList) => void;
}

const WorkoutsListModal = ({
  modalVisible,
  setModalVisible,
  selectedDaySchedule,
  workoutsList,
  setWorkoutsList
}: WorkoutsListModalProps) => {

  const today = new Date().toISOString().split('T')[0]
  const { analyticalData, setAnalyticalData } = useUserDataContext()

  // Animated value tracking for drag sheet tracking
  const animatedTranslateY = useRef(new Animated.Value(0)).current

  // Reset animation translation layout when modal becomes visible
  useEffect(() => {
    if (modalVisible) {
      animatedTranslateY.setValue(0)
    }
  }, [modalVisible])

  // Save data immediately when modal closes
  useEffect(() => {
    return () => {
      if (workoutsList && analyticalData.noOfWorkoutsCompleted > 0) {
        const dayKey = `workoutsList_day${selectedDaySchedule?.day || 1}`
        
        const completedWorkoutsList = {
          date: today,
          list: workoutsList.list,
          analyticalData: analyticalData
        }
        
        saveWorkoutDataImmediately(dayKey, completedWorkoutsList)
        updateAnalyticalData(analyticalData)
        console.log("Modal closed - data saved immediately")
      }
    }
  }, [])

  // Updating the workout as completed or not
  const updateWorkoutsList = (id: string) => {
    const updatedList = workoutsList.list.map((item) => {
      if (item.id === id) {
        return { ...item, isComplete: !item.isComplete }
      }
      return item
    })

    let completionCount = 0
    const completedExercises: ExerciseRecord[] = []
    
    updatedList.forEach((item) => {
      if (item.isComplete) {
        completionCount++
        completedExercises.push({
          id: item.id,
          name: item.name,
          reps: typeof item.reps === 'string' ? [item.reps] : item.reps,
          isComplete: true,
          completedAt: new Date().toISOString()
        })
      }
    })

    const allCompleted = updatedList.every(ex => ex.isComplete)

    const updatedAnalyticalData: DailyAnalyticalData = {
      date: today,
      dayNumber: selectedDaySchedule?.day || 1,
      noOfWorkoutsCompleted: completionCount,
      totalWorkouts: updatedList.length,
      isTotallyCompleted: allCompleted,
      completedExercises: completedExercises,
      durationMinutes: 0,
      caloriesBurned: 0,
      startTime: analyticalData.startTime,
      endTime: new Date().toISOString()
    }

    setAnalyticalData(updatedAnalyticalData)
    updateAnalyticalData(updatedAnalyticalData)

    const dayKey = `workoutsList_day${selectedDaySchedule?.day || 1}`
    
    const completedWorkoutsList: WorkoutsList = {
      date: today,
      list: updatedList,
      analyticalData: updatedAnalyticalData
    }

    updateAsyncStorageOnDebounce(dayKey, completedWorkoutsList)
    setWorkoutsList(completedWorkoutsList)
  }

  const getModalHeight = () => {
    if (height < 600) return height * 0.80
    if (height < 700) return height * 0.85
    return height * 0.90
  }

  const handleCloseModal = () => {
    if (analyticalData.noOfWorkoutsCompleted > 0) {
      const dayKey = `workoutsList_day${selectedDaySchedule?.day || 1}`
      const completedWorkoutsList = {
        date: today,
        list: workoutsList.list,
        analyticalData: analyticalData
      }
      saveWorkoutDataImmediately(dayKey, completedWorkoutsList)
    }
    setModalVisible(false)
  }

  // PanResponder bottom sheet swipe system
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          animatedTranslateY.setValue(gestureState.dy)
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const modalLimit = getModalHeight()
        if (gestureState.dy > modalLimit * 0.25 || gestureState.vy > 0.6) {
          Animated.timing(animatedTranslateY, {
            toValue: modalLimit,
            duration: 200,
            useNativeDriver: true,
          }).start(() => handleCloseModal())
        } else {
          Animated.spring(animatedTranslateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 45,
            friction: 8
          }).start()
        }
      },
    })
  ).current

  const activeTransformStyle = {
    transform: [{ translateY: animatedTranslateY }]
  }

  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      animationType='slide'
      onRequestClose={handleCloseModal}
      statusBarTranslucent={true}
    >
      <View style={styles.modalContentContainer}>
        {/* Backdrop overlay area for click out */}
        <Pressable style={styles.backdropOverlay} onPress={handleCloseModal} />

        <Animated.View 
          style={[
            styles.modalContainer, 
            { height: getModalHeight() },
            activeTransformStyle
          ]}
          {...panResponder.panHandlers}
        >
          <SafeAreaView style={styles.safeAreaWrapper} edges={['bottom']}>
            
            {/* Interactive Drag Handle Area */}
            <View style={styles.dragHandleZone}>
              <View style={styles.dragIndicator} />
            </View>

            {/* Flat Solid Header Layout Panel */}
            <View style={styles.modalHeader}>
              <View style={styles.headerTextContainer}>
                <Text style={styles.modalTitle}>BASIC SCHEDULE</Text>
                <View style={styles.badgeRow}>
                  <Text style={styles.modalSubtitle}>DAY {selectedDaySchedule?.day || 0}</Text>
                  <View style={styles.counterGlassBadge}>
                    <Text style={styles.highlightCount}>{workoutsList?.list?.length || 0} EXERCISES</Text>
                  </View>
                </View>
              </View>
              
              <Pressable 
                onPress={handleCloseModal}
                style={({ pressed }) => [pressed && styles.closeButtonPressed, styles.glassCloseButton]}
              >
                <Ionicons name="close" size={20} color="#FFFFFF" />
              </Pressable>
            </View>

            {/* Main Scroll Content Body */}
            <View style={styles.modalBody}>
              <FlatList
                data={workoutsList?.list || []}
                renderItem={({ item }) => (
                  <View style={styles.cardGlassWrapper}>
                    <ExercisesCard
                      updateWorkoutsList={updateWorkoutsList}
                      id={item.id}
                      name={item.name}
                      reps={item.reps}
                      isComplete={item.isComplete}
                    />
                  </View>
                )}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContentContainer}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconGlassBubble}>
                      <Ionicons name="fitness" size={26} color="#4cddbb" />
                    </View>
                    <Text style={styles.emptyText}>NO EXERCISES SCHEDULED</Text>
                  </View>
                }
              />
            </View>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(3, 4, 5, 0.65)', // Native translucent background backdrop masking
  },
  backdropOverlay: {
    ...StyleSheet.absoluteFill,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#060708', // Solid master canvas layout layer matching base theme profile
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)', // Specular crisp reflection edge
    paddingHorizontal: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  safeAreaWrapper: {
    flex: 1,
  },
  dragHandleZone: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 6,
  },
  dragIndicator: {
    width: 36,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 99,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  modalSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8E9492',
    letterSpacing: 0.5,
  },
  counterGlassBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  highlightCount: {
    color: '#4cddbb',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  glassCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 99,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  closeButtonPressed: {
    opacity: 0.7,
    scaleX: 0.96,
    scaleY: 0.96,
  },
  modalBody: {
    flex: 1,
  },
  listContentContainer: {
    flexGrow: 1,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
  },
  cardGlassWrapper: {
    marginVertical: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
    gap: 12,
  },
  emptyIconGlassBubble: {
    width: 56,
    height: 56,
    borderRadius: 99,
    backgroundColor: 'rgba(76, 221, 187, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(76, 221, 187, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8E9492',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
})

export default WorkoutsListModal;
