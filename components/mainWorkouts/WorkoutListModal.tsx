import { Colors } from "@/constants/Colors"
import { updateAsyncStorageOnDebounce } from "@/services/asynchStorageService"
import { FlatList, Modal, StyleSheet, Text, View } from "react-native"
import ExercisesCard from "../ui/ExercisesCard"
const { textPimary, textSecondary } = Colors
const WorkoutsListModal = ({ modalVisible, setModalVisible, selectedDaySchedule,workoutsList,setWorkoutsList }) => {

  const today = new Date().toISOString().split('T')[0]
  const updateWorkoutsList = (id:string)=>{
    
    const updatedList = workoutsList.list.map((item)=>{
      if (item.id ===id) {
          console.log({...item})
        return {...item,['isComplete']:!item.isComplete}}
      else return item
    })
    const completedWorkoutsList = {date:today,list:updatedList}
    updateAsyncStorageOnDebounce('workoutsList',completedWorkoutsList)
    setWorkoutsList(completedWorkoutsList)
  }

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
            <FlatList
              data={workoutsList.list}
              renderItem={({ item }) => <ExercisesCard updateWorkoutsList={updateWorkoutsList} id={item.id} name={item.name} reps={item.reps} isComplete={item.isComplete}/>}
              keyExtractor={({ id }) => id.toString()}
            />
          }
        </View>
      </View>
    </Modal>
  )
}

const styles =StyleSheet.create({
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

export default WorkoutsListModal