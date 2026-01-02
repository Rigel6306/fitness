
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';


const RepsCard = ({id,reps, index,isCompleted,}) => {
    const {width} = Dimensions.get('screen')
    const [compledtSet, setCompletdeSet] = useState(false)
    // const handleComplet = ()=>{
    //     setCompletdeSet(!compledtSet)
    //     console.log(id)
    //     updateWorkoutsList(id)
    // }
    return (
      
            <View style={[styles.container]}>
                <View style={{display:'flex',flexDirection:'row',gap:10,width:width*0.3, maxWidth:width*0.3}}>
                    <Text style={styles.repIndex}>Set {index + 1}</Text>
                    <Text style={styles.repText}>{reps} Reps</Text>
                </View>

                <MaterialCommunityIcons name="check-circle" size={24} color={isCompleted?'rgba(33, 167, 149, 1)':'rgba(74, 81, 87, 1)'} />
            </View>
       
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'space-around',
        padding:5,
        borderRadius:20,
       
    },
    repIndex: {
        color: '#fff'
    },
    repText:{
        color: '#eee',
        fontSize:15,
        fontWeight:'bold'

    }
})

export default RepsCard