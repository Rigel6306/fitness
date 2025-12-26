import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const Header = () => {


  return (
    <View style={styles.container}>
      <View>
        <Text style={{
          fontFamily:'bebas',
          color:'white'
        }}>Welcome</Text>
        <Text style={{
          fontFamily:'bebas',
          fontSize:18,
          color:'white'
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
    backgroundColor: '#1d1824ff',
    maxHeight: 70,
    padding: 10,
    margin:10,
    borderRadius:15,
    flexDirection:'row',
    justifyContent:"space-between",
    alignItems:'center',
    elevation: 6    
  },

})

export default Header