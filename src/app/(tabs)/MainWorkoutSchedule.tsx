'use client'
import CurentScheduleCard from '@/components/mainWorkouts/CurentScheduleCard';
import ScheduleCard from '@/components/mainWorkouts/ScheduleCard';
import WorkoutsListModal from '@/components/mainWorkouts/WorkoutListModal';
import SafeScreenWrapper from '@/components/SafeScreenWrapper';
import TipsCard from '@/components/ui/TipsCard';
import { Colors } from '@/constants/Colors';
import { mainSchedules } from '@/data/data';
import { useUserDataContext } from '@/hooks/useContext';
import { getAsyncStorageData, setAsyncStorageData } from '@/services/asynchStorageService';
import { getScheduleFromUser } from '@/services/workoutService';
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const { textPimary, textSecondary } = Colors;

const HeadingProgress = () => (
  <View style={styles.headingProgressContainer}>
    <View style={styles.progressItem}>
      <Text style={styles.progressLabel}>Schedule Progress</Text>
      <Text style={styles.progressValue}>0%</Text>
    </View>
    <View style={styles.progressDivider} />
    <View style={styles.progressItem}>
      <Text style={styles.progressLabel}>Days Completed</Text>
      <Text style={styles.progressValue}>0/30</Text>
    </View>
  </View>
);

type Exercise = {
  id: number;
  name: string;
  reps: (number | string)[];
};
type Workouts = {
  day: number;
  schedule: Exercise[];
};
type ScheduleType = {
  id: string;
  title: string;
  frequency: string;
  workoutsCount: number;
  workouts: Workouts[];
  duration: number;
  focus: string[];
};

const MainWorkoutSchedule = () => {
  const [modelVisible, setModelVisible] = useState(false);
  const [selectedDaySchedule, setSelectedDaySchedule] = useState<Workouts | null>(null);
  const [schedule, setSchedule] = useState<ScheduleType | null>();
  const [workoutList, setWorkoutList] = useState<any>();
  const today = new Date().toISOString().split('T')[0];
  
  const { userData } = useUserDataContext();

  useEffect(() => {
    const loadData = async () => {
      const storedSchedule = await getAsyncStorageData('schedule');
      if (storedSchedule) {
        const storedWorkouts = await getAsyncStorageData('workoutsList');
        setSchedule(storedSchedule);
        if (storedWorkouts && storedWorkouts.date === today) {
          setWorkoutList(storedWorkouts);
        } else {
          const baseList = (storedWorkouts && storedWorkouts.list)
            ? storedWorkouts.list
            : (storedSchedule.workouts && storedSchedule.workouts.length > 0
              ? storedSchedule.workouts[0].schedule
              : []);
          const newWorkoutsList = { date: today, list: baseList.map((item: any) => ({ ...item, isComplete: false })) };
          setWorkoutList(newWorkoutsList);
          await setAsyncStorageData('workoutsList', newWorkoutsList);
        }
      } else {
        const dbSchedule = await getScheduleFromUser(userData.id); 
        setSchedule(dbSchedule);
      }
    };
    loadData();
  }, []);
  
  useEffect(() => {
    const loadSelectedDayWorkouts = async () => {
      if (selectedDaySchedule && selectedDaySchedule.schedule) {
        const today = new Date().toISOString().split('T')[0];
        const dayKey = `workoutsList_day${selectedDaySchedule.day}`;
        const storedDayWorkouts = await getAsyncStorageData(dayKey);
        
        if (storedDayWorkouts && storedDayWorkouts.date === today) {
          setWorkoutList(storedDayWorkouts);
        } else {
          const newWorkoutsList = {
            date: today,
            list: selectedDaySchedule.schedule.map(item => ({
              ...item,
              isComplete: false
            }))
          };
          setWorkoutList(newWorkoutsList);
          await setAsyncStorageData(dayKey, newWorkoutsList);
        }
      }
    };
    loadSelectedDayWorkouts();
  }, [selectedDaySchedule]);

  useEffect(() => {
    const initializeFirstDay = async () => {
      if (schedule && schedule.workouts && schedule.workouts.length > 0 && !selectedDaySchedule) {
        const firstDay = schedule.workouts[0];
        setSelectedDaySchedule(firstDay)
        await setAsyncStorageData('schedule', schedule);
      }
    };
    initializeFirstDay();
  }, [schedule]);

  return (
    <View style={styles.masterWrapper}>
      <View style={styles.container}>
        {/* Glass Header Panel */}
            <SafeScreenWrapper>
        <View style={styles.header}>
      
            <View style={styles.headerContent}>

              <Text style={styles.headerSubText}>Day after day — 3 Months</Text>
              <HeadingProgress />
            </View>
         
        </View>

        {/* Workspace Body Elements */}
        <View style={styles.contentBody}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >
            {/* Section 1: Training Progression Panel */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderHeading}>
                <Octicons name="stack" size={16} color="#4cddbb" />
                <Text style={styles.sectionTitleText}>Training Progression</Text>
              </View>
              <Text style={styles.sectionDescriptionText}>
                Progress through each schedule after completing the duration period
              </Text>

              {schedule && (
                <ScheduleCard
                  index={0}
                  frequency={schedule.frequency}
                  duration={schedule.duration}
                  title={schedule.title}
                  dayCount={schedule.workouts.length}
                  workoutsCount={schedule.workoutsCount}
                />
              )}
            </View>

            {/* Section 2: Current Track Schedule Display Panel */}
            <View style={styles.sectionContainer}>
              <View style={styles.curentScheduleHeading}>
                <View style={styles.sectionHeaderHeading}>
                  <Ionicons name="calendar-sharp" size={16} color="#4cddbb" />
                  <Text style={styles.sectionTitleText}>Your Schedule</Text>
                </View>
                <Pressable 
                  style={({ pressed }) => [styles.startNowButton, pressed && styles.buttonPressed]} 
                  onPress={() => console.log("Pressed")}
                >
                  <Text style={styles.startNowButtonText}>Start Now</Text>
                </Pressable>
              </View>

              {/* High-Contrast Target Focus List Tags */}
              <View style={styles.focusList}>
                {mainSchedules[2].focus.map((item, index) => (
                  <View key={index} style={styles.focusListItem}>
                    <Text style={styles.focusListItemText}>{item}</Text>
                  </View>
                ))}
              </View>

              {/* Nested Iterative Track Workout Node Elements */}
              {schedule && schedule.workouts.map((workout, index) => (
                <CurentScheduleCard
                  setModalVisible={setModelVisible}
                  selectedDaySchedule={setSelectedDaySchedule}
                  key={index} 
                  workout={workout} 
                />
              ))}
            </View>

            <TipsCard />
          </ScrollView>
        </View>
         </SafeScreenWrapper>
      </View>

      {workoutList && selectedDaySchedule && (
        <WorkoutsListModal
          setWorkoutsList={setWorkoutList}
          workoutsList={workoutList}
          modalVisible={modelVisible}
          setModalVisible={setModelVisible}
          selectedDaySchedule={selectedDaySchedule}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  masterWrapper: {
    flex: 1,
    backgroundColor: '#030405',
  },
  container: {
    flex: 1,
  },
  // Header Panel Layout Architecture
  header: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    backgroundColor: 'rgba(12, 15, 14, 0.35)',
    paddingBottom: 16,
  },
  headerContent: {
    paddingHorizontal: 20,
  
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  headerSubText: {
    fontSize: 13,
    color: '#8E9492',
    fontWeight: '600',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contentBody: {
    flex: 1,
  },
  scrollContainer: {
    paddingTop: 24,
    paddingBottom: 70,
  },
  // Specular Refractive Progress Box
  headingProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 8,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  progressItem: {
    alignItems: 'center',
    flex: 1,
  },
  progressLabel: {
    fontWeight: '600',
    fontSize: 12,
    color: '#8E9492',
    marginBottom: 4,
  },
  progressValue: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  progressDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  // Global Workspace Component Blocks
  sectionContainer: {
    marginHorizontal: 16,
    marginBottom: 28,
  },
  sectionHeaderHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  sectionDescriptionText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8E9492',
    lineHeight: 18,
    marginBottom: 16,
  },
  curentScheduleHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  // Action Pill Trigger Nodes
  startNowButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(76, 221, 187, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(76, 221, 187, 0.3)',
    borderRadius: 99,
  },
  startNowButtonText: {
    color: '#4cddbb',
    fontWeight: '700',
    fontSize: 13,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  // Targets Specification Tag Badges List
  focusList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  focusListItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  focusListItemText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B0B5B3',
  },
});

export default MainWorkoutSchedule;