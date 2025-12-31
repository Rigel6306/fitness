import SafeScreenWrapper from '@/components/SafeScreenWrapper';
import ExercisesCard from '@/components/ui/ExercisesCard';
import TipsCard from '@/components/ui/TipsCard';
import { Colors } from '@/constants/Colors';
import { mainSchedules } from '@/data/data';
import { getAsyncStorageData, setAsyncStorageData } from '@/services/asynchStorageService';
import { getSchedule } from '@/services/workoutService';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const { primaryBackground,
  secondaryBackground,
  textPimary,
  textSecondary,
  cardBackground,
  cardBackgroundSecondary,
  background } = Colors




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
//displays Each Schedule overview
const ScheduleCard = ({ title, frequency, duration, index, dayCount, workoutsCount }) => {

  return (
    <Pressable
      style={({ pressed }) => [pressed && { opacity: 0.5 }]}
    >
      <LinearGradient
        style={styles.scheduleCardContainer}
        colors={['#2d3231de', '#1b222091']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View >
          <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 40, width: 40, backgroundColor: '#ffffff3a', borderRadius: 100 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{index + 1}</Text>
          </View>
        </View>
        <View style={{ display: 'flex', marginLeft: 10, }}>
          <Text style={{ fontSize: 15, color: textPimary, marginBottom: 2, marginLeft: 2 }}>{title}</Text>
          <Text style={{ fontSize: 13, color: textSecondary, marginLeft: 3 }}>{frequency}</Text>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 20 }}>
            <View style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center' }}>
              <MaterialIcons name="calendar-month" size={24} color="rgba(73, 193, 143, 1)" />
              <Text style={{ color: textSecondary }}>{duration} Months</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center' }} >
              <MaterialCommunityIcons name="sine-wave" size={24} color="rgba(103, 47, 201, 0.88)" />
              <Text style={{ color: textSecondary }}>{dayCount} Day</Text>
            </View>
          </View>
        </View>
        <View style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <FontAwesome6 name="dumbbell" size={20} color="rgba(141, 187, 47, 0.72)" />
          <Text style={{ fontSize: 40, fontWeight: 'bold', color: '#fff3f398' }}>{workoutsCount}</Text>
          <Text style={{ fontSize: 13, color: '#ffffff3e', fontWeight: 'bold' }}>Workouts</Text>
        </View>
      </LinearGradient>
    </Pressable>
  )
}
//Displays Curent Schedule Day Card
const CurentScheduleCard = ({ workout, setModalVisible, selectedDaySchedule }) => {
  const maxItems = 3
  const itemList = workout.schedule.slice(0, maxItems)
  const remainingCount = workout.schedule.length - maxItems
  return (

    <LinearGradient
      colors={['#1d201fff', '#2d302f35']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.dayCardContainer}>
      <Pressable onPress={() => {
        selectedDaySchedule(workout)
        setModalVisible(true)
      }}
        style={({ pressed }) => [pressed && { opacity: 0.5 }]}
      >
        <View style={styles.dayCardHeading}>
          <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 60, width: 60, backgroundColor: '#ffffff3a', borderRadius: 100 }}>
            <FontAwesome6 name="person-running" size={24} color="black" />
          </View>
          <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, color: textPimary, fontWeight: 'bold' }}>Day - {workout.day}</Text>
            <Text style={{ color: textSecondary }}>10 Exercices</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </View>
        <LinearGradient
          style={{ height: 1, marginTop: 10, }}
          colors={['rgba(4, 4, 4, 0)', 'rgba(49, 100, 115, 0.68)', 'rgba(156, 161, 156, 0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginLeft: 60, marginTop: 20, }}>
          {
            itemList.map((item, index) => (
              <Text key={index} style={{ fontWeight: 'bold', fontSize: 14, marginBottom: 5, color: '#ffffff92' }}>
                • {item.name}
              </Text>
            ))
          }
          {
            remainingCount > 0 && <Text style={{ fontWeight: 'bold', fontSize: 14, marginBottom: 5, color: '#ffffff92' }} >
              • +{remainingCount} More
            </Text>
          }
        </View>
      </Pressable>
    </LinearGradient>

  )
}

const WorkoutsListModal = ({ modalVisible, setModalVisible, selectedDaySchedule }) => {

  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      animationType='slide'
      onRequestClose={() => setModalVisible(false)}
      style={{}}>
      <View style={styles.modalContainer}>
        <View style={styles.modalHeading}>
          <Text style={{ fontSize: 25, fontWeight: 'bold', color: textPimary }}>Basic Schedule</Text>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: textSecondary }}>Day {selectedDaySchedule.day} - 10 Exercises</Text>

        </View>
        <View style={styles.modalBody}>

          {
            // mainSchedules[1].workouts[0].schedule.map((item,index)=>(
            //   <ExercisesCard key={index}/>
            // ))

            <FlatList
              data={selectedDaySchedule.schedule}
              renderItem={({ item }) => <ExercisesCard id={item.id} name={item.name} reps={item.reps} />}
              keyExtractor={({ id }) => id.toString()}
            />
          }

        </View>

      </View>

    </Modal>
  )
}

type Exercise={
  id:number,
  name:string,
  reps:(number|string)[]
}
type Workouts = {
  day:number,
  schedule:Exercise[]
}

type ScheduleType = {
  title:string;
  frequency:string,
  workoutsCount:number,
  workouts:Workouts[],
  duration:number,
  focus:string[]
}

const MainWorkoutSchedule = () => {
  const [modelVisible, setModelVisible] = useState(false)
  const [selectedDaySchedule, setSelectedDaySchedule] = useState([])
  const [schedule, setSchedule] = useState<ScheduleType | null>();
  useEffect(() => {

    const loadData = async () => {
      const parse = await getAsyncStorageData('schedule', setSchedule)
      if (!parse) {
        getSchedule(setSchedule)

      }

    }
    loadData()
  }, [])

  useEffect(() => {
    if (schedule) {
      setAsyncStorageData('schedule', schedule)
    }
  }, [schedule])

  console.log('state after useState', schedule)
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
                  frequency={schedule.frequency}
                  duration={schedule.duration}
                  title={schedule.title}
                  dayCount={schedule.workouts.length}
                  workoutsCount={schedule.workoutsCount}
                />
              }

            </View>
            {/* Curent Schedule */}
            <View style={styles.currentScheduleContainer}>
              <View style={styles.curentScheduleHeading}>
                <Ionicons name="calendar-sharp" size={20} color={textPimary} />
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: textPimary, textAlign: 'left' }}>Your Schedule</Text>
                <Pressable onPress={() => { console.log("pres") }}>
                  <View style={{ padding: 10, backgroundColor: 'rgba(37, 249, 192, 0.57)', borderRadius: 15 }}>
                    <Text style={{ fontWeight: 'bold' }} >Start Now</Text>
                  </View>
                </Pressable>
              </View>
              {/*Curent Schedule Focus List */}
              <View style={styles.focusList}>
                {mainSchedules[2].focus.map((item, index) => (
                  <View key={index} style={styles.focusListItem}>
                    <Text style={{ fontWeight: 'bold', color: textSecondary }} >{item}</Text>
                  </View >))
                }
              </View>
              {/*Curent Schedule Day Card, */}

              {
                schedule && schedule.workouts.map((workout, index: React.Key) => (
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
      <WorkoutsListModal
        modalVisible={modelVisible}
        setModalVisible={setModelVisible}
        selectedDaySchedule={selectedDaySchedule}
      />

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
  scheduleCardContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
    alignItems: 'center',
    borderRadius: 20,
    height: 130,
    padding: 10

  },
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
  dayCardContainer: {
    height: 200,

    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
  },
  dayCardHeading: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'space-between'
  },
  // WORKOUT Modal 
  modalContainer: {
    flex: 1,
    padding: 10,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    backgroundColor: "#000000ff",
  },
  modalHeading: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

  },
  modalBody: {
    display: 'flex',
    flex: 5,



  },
})

export default MainWorkoutSchedule