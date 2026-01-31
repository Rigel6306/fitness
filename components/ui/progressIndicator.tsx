

import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
const {textPimary,textSecondary} = Colors
const ProgressIndicator = ({title,mainText,subText,icon,value,actionColor,gradientArray}) => {
    const progressValue =90
  return (
    <LinearGradient 
    style={styles.container}
    colors={gradientArray}
    >
      <View style={styles.progressHeading}>
        <View style={styles.progressHeadImg}>
             <Ionicons name={icon} size={20} color={actionColor} />
        </View>
        
        <View>
            <Text style={styles.headingText}>{title}</Text>
        </View>
      </View>
         <LinearGradient 
      style={styles.gradientSeperator}
       colors={['rgba(4, 4, 4, 0)', 'rgba(132, 45, 176, 0.68)','rgba(156, 161, 156, 0)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
     />
      <View style={styles.mainContent}>
        <Text style={styles.mainContentText}>{mainText}</Text>
        <Text style={styles.mainContentSubText}>{subText}</Text>
      </View>
   

      <View style={styles.progressBarContainer}>
            <View style={styles.progressbar}>
                <View style={[styles.progressTrack,{
                     width: `${(value / 100) * 100}%`,
                     backgroundColor:actionColor
                }]}/>
            </View>
            <Text style={styles.progressBarText}>{(value/100)*100}%</Text>
      </View>
      
    </LinearGradient>
  )
}


const styles = StyleSheet.create({

    container:{
        flex:1,
        padding:20,
        backgroundColor:"rgba(81, 85, 88, 0.3)",
        borderRadius:20,
    },
    progressHeading:{
        
        flexDirection:'row',
        gap:10,
        alignItems:'center',
        marginBottom:10,

    },
    headingText:{
        color:textPimary,
        fontSize:17,
        fontWeight:'bold',
    },
    progressHeadImg:{
        backgroundColor:"rgba(47, 94, 142, 0.3)",
        padding:10,
        borderRadius:50

    },
    mainContent:{

    },
    mainContentText:{
        fontSize:20,
        fontWeight:'bold',
        color:textPimary,
        marginBottom:2
    },
    mainContentSubText:{
       fontSize: 12,
        color: textSecondary,
        marginBottom: 12,
    },
    progressBarContainer:{
        flexDirection:'row',
        gap:10,
        alignItems:'center',
      
    },
    gradientSeperator:{
        height:1,
    },
    progressbar:{
        flex:1,
        backgroundColor:'#123',
        height:6,
        borderRadius:10,

    },
    progressTrack:{
        height:"100%",
        borderRadius:10,
        
    }, 
    progressBarText:{
        color:textPimary,
        fontWeight:'bold',
    }

})
export default ProgressIndicator