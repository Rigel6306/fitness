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

        {/* Ambient liquid fluid glow nodes behind the glass sheet */}
        <View style={styles.liquidGlowOrbOrchid} />
        <View style={styles.liquidGlowOrbTeal} />

        <Animated.View 
          style={[
            styles.modalContainer, 
            { height: getModalHeight() },
            activeTransformStyle
          ]}
          {...panResponder.panHandlers}
        >
          <SafeAreaView style={styles.safeAreaWrapper} edges={['bottom']}>
            
            {/* Interactive Liquid Drag Handle */}
            <View style={styles.dragHandleZone}>
              <View style={styles.dragIndicator} />
            </View>

            {/* Glass Frosted Header Panel */}
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
                style={({ pressed }) => [pressed && { opacity: 0.7 }, styles.glassCloseButton]}
              >
                <Ionicons name="close-outline" size={22} color="#ffffff" />
              </Pressable>
            </View>

            {/* Main Content body */}
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
                      <Ionicons name="fitness-outline" size={32} color="#0affca" />
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

// --- LIQUID GLASSY DESIGN THEME SYSTEM ---

const styles = StyleSheet.create({
  modalContentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgb(0, 0, 0)', // Tinted transparency for natural glassy bleedthrough
  },
  backdropOverlay: {
    ...StyleSheet.absoluteFill,
  },
  // Ambient fluid backdrop layers
  liquidGlowOrbOrchid: {
    position: 'absolute',
    bottom: height * 0.5,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgb(157, 0, 255)',
    opacity: 0.8,
  },
  liquidGlowOrbTeal: {
    position: 'absolute',
    bottom: 40,
    left: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(10, 255, 202, 0.56)',
    opacity: 0.6,
  },
  modalContainer: {
    width: '100%',
    // High translucent base simulating fluid back-surface refraction
    backgroundColor: 'rgba(18, 22, 33, 0.72)', 
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    borderWidth: 1.5,
    // Specular crisp glass reflection edge
    borderColor: 'rgba(255, 255, 255, 0.12)', 
    paddingHorizontal: 22,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
      },
      android: {
        elevation: 24,
      },
    }),
  },
  safeAreaWrapper: {
    flex: 1,
  },
  dragHandleZone: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  dragIndicator: {
    width: 48,
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.25)', // Glossy liquid bar appearance
    borderRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 16,
  },
  headerTextContainer: {
    flex: 1,
    gap: 4,
  },
  modalTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-condensed',
    fontSize: width < 360 ? 22 : 26,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  modalSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 0.5,
  },
  counterGlassBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  highlightCount: {
    color: '#0affca',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  // Specular reflection stylized round action button
  glassCloseButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  modalBody: {
    flex: 1,
  },
  listContentContainer: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'ios' ? 42 : 26,
  },
  cardGlassWrapper: {
    marginVertical: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 70,
    gap: 14,
  },
  emptyIconGlassBubble: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(10, 255, 202, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(10, 255, 202, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: 'Bebas',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.3)',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
})

export default WorkoutsListModal;