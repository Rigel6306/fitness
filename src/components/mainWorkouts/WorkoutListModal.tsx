import { Colors } from "@/constants/Colors"
import { DailyAnalyticalData, ExerciseRecord } from "@/context/userDataContext"
import { useUserDataContext } from "@/hooks/useContext"
import { updateAnalyticalData } from "@/services/analyticsService"
import { saveWorkoutDataImmediately, updateAsyncStorageOnDebounce } from "@/services/asynchStorageService"

import {
  Dimensions,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  View
} from "react-native"
import ExercisesCard from "../ui/ExercisesCard"

import React, { useEffect } from "react"
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

  console.log("Workouts List at Workouts list modal", workoutsList)
  console.log("Workouts List Modal selected Day Schedule:", selectedDaySchedule)

  // Save data immediately when modal closes
  useEffect(() => {
    return () => {
      if (workoutsList && analyticalData.noOfWorkoutsCompleted > 0) {
        const dayKey = `workoutsList_day${selectedDaySchedule?.day || 1}`
        
        // Save workout list with analytical data
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

    console.log("workouts List Modal updated list", updatedList)

    // Count completed workouts and build completed exercises list
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

    // Enhanced analytical data with exercise details
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

    // Save analytical data
    updateAnalyticalData(updatedAnalyticalData)

    const dayKey = `workoutsList_day${selectedDaySchedule?.day || 1}`
    
    // Create unified workout data with analytical info linked
    const completedWorkoutsList: WorkoutsList = {
      date: today,
      list: updatedList,
      analyticalData: updatedAnalyticalData
    }

    // Debounce saves the workout data
    updateAsyncStorageOnDebounce(dayKey, completedWorkoutsList)
    setWorkoutsList(completedWorkoutsList)
    
    console.log("Workout updated:", { completionCount, allCompleted })
  }

  // Calculate modal height based on device size
  const getModalHeight = () => {
    if (height < 600) return '75%' // Small devices
    if (height < 700) return '80%' // Medium devices
    if (height < 800) return '85%' // Large devices
    return '90%' // Extra large devices
  }

  const handleCloseModal = () => {
    // Save data before closing
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

  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      animationType='slide'
      onRequestClose={handleCloseModal}
      statusBarTranslucent={true}
    >
      {/* Modal content */}
      <View style={styles.modalContentContainer}>
        <SafeAreaView style={[styles.modalContainer, { height: getModalHeight() }]}>
          {/* Draggable indicator */}
          <View style={styles.dragIndicator} />

          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Basic Schedule</Text>
            <Text style={styles.modalSubtitle}>
              Day {selectedDaySchedule?.day || 0} • {workoutsList?.list?.length || 0} Exercises
            </Text>
          </View>

          {/* Modal Body */}
          <View style={styles.modalBody}>
            <FlatList
              data={workoutsList?.list || []}
              renderItem={({ item }) => (
                <ExercisesCard
                  updateWorkoutsList={updateWorkoutsList}
                  id={item.id}
                  name={item.name}
                  reps={item.reps}
                  isComplete={item.isComplete}
                />
              )}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContentContainer}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No exercises found</Text>
                </View>
              }
            />
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    width: '100%',
    backgroundColor: "#000000",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 20 : 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  dragIndicator: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    marginTop: 8,
    marginBottom: 16,
  },
  modalHeader: {
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: width < 350 ? 22 : 26,
    fontWeight: 'bold',
    color: textPimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: width < 350 ? 13 : 15,
    fontWeight: '600',
    color: textSecondary,
    textAlign: 'center',
  },
  modalBody: {
    flex: 1,
  },
  listContentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
})

export default WorkoutsListModal