import { Colors } from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const {cardBackground,textPimary,textSecondary} = Colors
const Header = () => {


  return (
    <View style={styles.container}>
      <View>
        <Text style={{
          fontFamily:'bebas',
          color:textSecondary
        }}>Hey There</Text>
        <Text style={{
          fontFamily:'bebas',
          fontSize:18,
          color:textPimary,
          fontWeight:'bold'
        }}>Charitha Iravana</Text>
      </View>
      <View style={{flexDirection:'row',gap:10}}>
       <TouchableOpacity>
       
       </TouchableOpacity>
      <TouchableOpacity>
          <Ionicons name="notifications" size={24} color="white" />
       </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b2220',
    maxHeight: 70,
    padding: 10,
    margin:10,
    borderRadius:15,
    flexDirection:'row',
    justifyContent:"space-between",
    alignItems:'center',
   
  },

})

export default Header