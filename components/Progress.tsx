import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CircularProgress from "react-native-circular-progress-indicator";
const Progress = () => {
  return (
    <View style={style.container}>
      
         
      

            <View style={style.progressContainer}>
              <Text style={style.progressText}>Target Progress</Text>
                  <CircularProgress
                    value={100}
                    duration={2000}
                    progressValueColor={'#ecf0f1'}
                    maxValue={200}
                    title={'KG'}
                    titleColor={'rgba(233, 125, 53, 1)'}
                    titleStyle={{fontWeight: 'bold'}}
                  />

            </View>

            <View style={style.progressContainer}>
              <Text style={style.progressText}>Challenge Progress</Text>
                  <CircularProgress
                    value={60}
                    duration={2000}
                    progressValueColor={'#ecf0f1'}
                    maxValue={200}
                    title={'KG'}
                    titleColor={'rgba(233, 125, 53, 1)'}
                    titleStyle={{fontWeight: 'bold'}}
                  />

            </View>
    </View>

  
  )
}
const style = StyleSheet.create({
    container:{
        flex:1,
        margin:10,
        marginBottom:120,
        borderRadius:15,
        backgroundColor:'rgba(64, 96, 109, 0.52)',
        padding:10,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-around',
        

    },
    progressContainer:{
      flex:1,
      alignItems:'center',
      justifyContent:'center',
      gap:20,
    },

    progressText:{
       textAlign: 'center',
    fontFamily: 'Bebas',
    fontSize: 15,
    fontWeight:'100',
    color:'white'
    }

})
export default Progress