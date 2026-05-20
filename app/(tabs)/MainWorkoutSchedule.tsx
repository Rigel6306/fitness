import CurentScheduleCard from '@/components/mainWorkouts/CurentScheduleCard';
import ScheduleCard from '@/components/mainWorkouts/ScheduleCard';
import WorkoutsListModal from '@/components/mainWorkouts/WorkoutListModal';
import SafeScreenWrapper from '@/components/SafeScreenWrapper';
import TipsCard from '@/components/ui/TipsCard';
import { Colors } from '@/constants/Colors';
import { useUserDataContext } from '@/hooks/useContext';
import { getScheduleFromUser } from '@/services/workoutService';
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
const { textPimary, textSecondary } = Colors
const HeadingProgress = () => (
  <View style={styles.headingProgressContainer}>
    <View style={styles.progressItem}>
      <Text style={{ fontWeight: 'bold', color: '#ffffff9a' }}>Schedule Progress</Text>
      <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#fff' }}>0%</Text>
    </View>
    <View style={{ width: 2, height: 30, backgroundColor: '#ffffff9a' }} />
    <View style={styles.progressItem}>
      <Text style={{ fontWeight: 'bold', color: '#ffffff9a' }}  >Days Completed</Text>
      <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#fff' }}>0/30</Text>
    </View>
  </View>
)

type Exercise = {
  id: number,
  name: string,
  reps: (number | string)[]
}
type Workouts = {
  day: number,
  schedule: Exercise[]
}
type ScheduleType = {
  id: string,
  title: string,
  frequency: string,
  workoutsCount: number,
  workouts: Workouts[],
  duration: number,
  focus: string[]
}

const MainWorkoutSchedule = () => {
  const [modelVisible, setModelVisible] = useState(false)
  const [selectedDaySchedule, setSelectedDaySchedule] = useState<Workouts | null>(null)
  const [schedule, setSchedule] = useState<ScheduleType[] | null>(null)
  const [workoutList, setWorkoutList] = useState<any>()
  const [isScheduleLoading,setIsScheduleLoading] = useState(true)
  const today = new Date().toISOString().split('T')[0]
  const {userData} = useUserDataContext()
  console.log("userData at main workout schedule", userData)
  
 

  useEffect(()=>{

    const loadSchedule = async ()=>{
      setIsScheduleLoading(true)
      const dbSchedule = await getScheduleFromUser(userData.id) as ScheduleType[]
      setSchedule(dbSchedule)
      setWorkoutList(dbSchedule?.[0]?.workouts)

    }

    loadSchedule()
      
    
  },[])
   console.log("Schedule at main workouts", schedule,workoutList)
  return (

   
    <>
      <LinearGradient
        colors={['#00000037', '#000000f6', '#000000ff', '#000000ff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}>
        <View style={styles.header} >
          <SafeScreenWrapper>
            <View style={styles.headerContent}>
              <Text style={styles.headerText}>Hello</Text>
              <Text style={styles.headerSubText}>Day after day - 3 Months</Text>
              <HeadingProgress />
            </View>
          </SafeScreenWrapper>
        </View>
        <View style={styles.contentBody}>
          <ScrollView style={{ marginBottom: 20 }}>
            <View style={styles.scheduleList}>
              <View style={styles.scheduleListHeading}>
                <Octicons name="stack" size={20} color={textPimary} />
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: textPimary }}>Training Progression</Text>
              </View>
              <Text style={{ fontWeight: 'bold', color: textSecondary }}>Progress through each schedule after completing the duration period</Text>

              {
                schedule && <ScheduleCard
                  index={0}
                  frequency={schedule[0].frequency}
                  duration={schedule[0].duration}
                  title={schedule[0].title}
                  dayCount={schedule[0].workouts.length}
                  workoutsCount={schedule[0].workoutsCount}
                />
              }

            </View>
            {/* Curent Schedule */}
            <View style={styles.currentScheduleContainer}>
              <View style={styles.curentScheduleHeading}>
                <Ionicons name="calendar-sharp" size={20} color={textPimary} />
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: textPimary, textAlign: 'left' }}>{schedule && schedule[0]?.title}</Text>
                <Pressable onPress={() => { console.log("pres") }}>
                  <View style={{ padding: 10, backgroundColor: 'rgba(37, 249, 192, 0.57)', borderRadius: 15 }}>
                    <Text style={{ fontWeight: 'bold' }} >Start Now</Text>
                  </View>
                </Pressable>
              </View>
              {/*Curent Schedule Focus List */}
              <View style={styles.focusList}>
                {schedule && schedule[0] && schedule[0].focus.map((item, index) => (
                  <View key={index} style={styles.focusListItem}>
                    <Text style={{ fontWeight: 'bold', color: textSecondary }} >{item}</Text>
                  </View >))
                }
              </View>
              {/*Curent Schedule Day Card, */}
              {
                schedule && schedule[0] && schedule[0].workouts.map((workout, index: React.Key) => (
                  <CurentScheduleCard
                    setModalVisible={setModelVisible}
                    selectedDaySchedule={setSelectedDaySchedule}
                    key={index} workout={workout} />
                ))
              }
            </View>
            <TipsCard />
          </ScrollView>
        </View>

      </LinearGradient>
      {workoutList && selectedDaySchedule && <WorkoutsListModal
        setWorkoutsList={setWorkoutList}
        workoutsList={workoutList}
        modalVisible={modelVisible}
        setModalVisible={setModelVisible}
        selectedDaySchedule={selectedDaySchedule}
      />}
    </>
  )
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },
  // Header
  header: {
    flex: 1,
    backgroundColor: "#000000c0",
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,

  },
  headerContent: {
    padding: 10
  },

  headerText: {
    color: textPimary,
    fontSize: 20,
    fontWeight: 'bold',

  },
  headerSubText: {
    fontSize: 15,
    color: textSecondary,
    fontWeight: 'bold',

  },
  contentBody: {
    flex: 3,
    paddingBottom: 70
  },
  // heading Progress Container
  headingProgressContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 10,
    padding: 10,
    margin: 20,
    height: '50%',
    borderRadius: 30,
    backgroundColor: "#3a403e5e",
  },
  progressItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Schedule List
  scheduleList: {
    margin: 10

  },
  scheduleListHeading: {

    display: 'flex',
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  //ScheduleCard
  // Curent Schedule
  currentScheduleContainer: {
    margin: 10,
    marginTop: 20
  },

  curentScheduleHeading: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 10,
  },
  focusList: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 30,
  },
  focusListItem: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#1b2220dc'
  },
  // WORKOUT Modal 

})

export default MainWorkoutSchedule