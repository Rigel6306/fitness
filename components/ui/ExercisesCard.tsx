

import { Colors } from '@/constants/Colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RepsCard from './RepsCard';
const {primaryBackground,cardBackground,cardBackgroundSecondary,textPimary,textSecondary} = Colors
const ExercisesCard = ({ id, name, reps }) => {
 
    return (
        <View style={styles.container}>
            <View style={styles.cardHeading}>
                <View style={styles.headingNumber}>
                    <Text style={{fontSize:20,fontWeight:'bold',}}>{id}</Text>
                </View>
                <View>
                    <Text style={{fontSize:16,fontWeight:'bold',color:textPimary}}>{name}</Text>
                    <View style={{display:'flex',marginTop:2,flexDirection:'row',gap:10,alignItems:'center'}}>
                        <MaterialCommunityIcons name="repeat-variant" size={24} color="rgba(34, 199, 160, 1)" />
                        <Text style={{color:textSecondary,fontWeight:'bold'}}>Sets: {reps.length}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.repsContainer}>

                        {
                            reps.map((rep:string|number,index:number)=>(<RepsCard reps={rep} index={index} key={index}/>))
                        }
            </View>

        </View>
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
        alignItems:'center',
        flexDirection: 'row'
    },
    headingNumber:{ 
  
        height:40,
        width:40,
        margin:10,
        backgroundColor:"rgba(108, 114, 120, 1)",
        alignItems:'center',
        justifyContent:"center",
        borderRadius:30,
    },
    repsContainer:{

    }
})

export default ExercisesCard