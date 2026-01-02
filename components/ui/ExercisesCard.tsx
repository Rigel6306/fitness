

import { Colors } from '@/constants/Colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import RepsCard from './RepsCard';
const { primaryBackground, cardBackground, cardBackgroundSecondary, textPimary, textSecondary } = Colors
const ExercisesCard = ({ id, name, reps, isComplete, updateWorkoutsList }) => {

    const [completedWorkout, setCompletedWorkout] = useState(false)
    const handleTouch = ()=>{

        updateWorkoutsList(id)
        setCompletedWorkout(!completedWorkout)

    }
    return (
    <Pressable onPress={handleTouch}>
        <View style={[styles.container,{
            backgroundColor:isComplete?"rgba(88, 90, 93, 0.74)":"#2a302e3d"
        }]}>
            <View style={styles.cardHeading}>
                <View style={styles.headingNumber}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', }}>{id}</Text>
                </View>
                <View>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: textPimary }}>{name}</Text>
                    <View style={{ display: 'flex', marginTop: 2, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                        <MaterialCommunityIcons name="repeat-variant" size={24} color="rgba(34, 199, 160, 1)" />
                        <Text style={{ color: textSecondary, fontWeight: 'bold' }}>Sets: {reps.length}</Text>
                    </View>
                </View>
            </View>
            <View style={[styles.repsContainer,{
                backgroundColor:isComplete?"rgba(50, 51, 52, 1)":"#23242492"
            }]}>
                {
                    reps.map((rep: string | number, index: number) => (<RepsCard id={id} isCompleted={isComplete} reps={rep} index={index} key={index} />))
                }
            </View>
            
                <View style={styles.markCompleted}>

                    <Text style={{ color: textSecondary,textAlign:'center' }}>{completedWorkout?"Workout Completed":"Mark as Completed"}</Text>
                </View>
           
        </View>
         </Pressable>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#2a302e3d',
        marginTop: 10,
        padding: 10,
        marginBottom: 10,
        borderRadius: 20,
    },
    cardHeading: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row'
    },
    headingNumber: {

        height: 40,
        width: 40,
        margin: 10,
        backgroundColor: "rgba(108, 114, 120, 1)",
        alignItems: 'center',
        justifyContent: "center",
        borderRadius: 30,
    },
    repsContainer: {
        borderRadius: 20,
        padding:10,
        margin:10,
        backgroundColor: '#2a302e'

    },
    markCompleted:{
        borderRadius:20,
       
        
        padding:10,
    }
})

export default ExercisesCard