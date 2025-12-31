
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';


const RepsCard = ({ reps, index }) => {
    const {width} = Dimensions.get('screen')
    const [compledtSet, setCompletdeSet] = useState(false)

    return (
        <Pressable style={({ pressed }) => [pressed && { opacity: 0.5 }]} onPress={()=>setCompletdeSet(!compledtSet)}>
            <View style={styles.container}>
                <View style={{display:'flex',flexDirection:'row',gap:10,width:width*0.3, maxWidth:width*0.3}}>
                    <Text style={styles.repIndex}>Set {index + 1} -</Text>
                    <Text style={{ color: '#eee' }}>{reps} Reps</Text>
                </View>

                <MaterialCommunityIcons name="check-circle" size={24} color={compledtSet?'white':'green'} />
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'space-around',
        margin:5,
        padding:5,
        borderRadius:20,
        backgroundColor:'#2a302e'
    },
    repIndex: {
        color: '#fff'
    }
})

export default RepsCard