import SafeScreenWrapper from '@/components/SafeScreenWrapper'
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
const MainWorkoutSchedule = () => {


  const HeadingProgress = ()=>(
    <View style={styles.headingProgressContainer}>
      <View style={styles.progressItem}>
          <Text style={{fontWeight:'bold',color:'#ffffff9a'}}>Schedule Progress</Text>
          <Text style={{fontSize:25,fontWeight:'bold',color:'#fff'}}>0%</Text>
      </View>
      <View style={{width:2,height:30,backgroundColor:'#ffffff9a'}}/>
      <View style={styles.progressItem}>
         <Text style={{fontWeight:'bold',color:'#ffffff9a'}}  >Days Completed</Text>
          <Text style={{fontSize:25,fontWeight:'bold',color:'#fff'}}>0/30</Text>
      </View>
       
    </View>
  )

  

  return (
    <LinearGradient
    colors={['#2146b49f', '#813dff9e', '#373c9c8a','#087143aa']} 
    style={styles.container}>

        <BlurView intensity={1} style={styles.header} tint='dark' >  
        <SafeScreenWrapper>
          <View style={styles.headerContent}>
               <Text style={styles.headerText}>Hello</Text>
                <Text style={styles.headerSubText}>Day after day - 3 Months</Text>
                <HeadingProgress/>               
          </View>
        </SafeScreenWrapper>
       </BlurView>
      <View style={styles.contentBody}>
          <View style={styles.scheduleList}>

          </View>


      </View>

    </LinearGradient>

  )
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
  },
  // Header
  header: {
    flex: 1,
    backgroundColor: "rgba(17, 34, 51, 0.34)",
    borderBottomEndRadius:20,
    borderBottomStartRadius:20,

  },
  headerContent:{
    padding:10
  },
  headerText:{
    color:'#fff',
    fontSize:30,
    fontWeight:'bold',

  },
  headerSubText:{
    fontSize:17,
    color:'#ffffff9a',
    fontWeight:'bold',

  },
  contentBody: {
    flex: 3,
    
  },
  // heading Progress Container
  headingProgressContainer:{
    display:'flex',
    flexDirection:'row',
    gap:10,
    alignItems:'center',
   justifyContent:'space-around',
    marginTop:10,
    padding:10,
    margin:20,
    height:'50%',
    borderRadius:30,
    backgroundColor: "rgba(17, 34, 51, 0.34)",
  },
  progressItem:{
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
  },

  // Schedule List
})

export default MainWorkoutSchedule