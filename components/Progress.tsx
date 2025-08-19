import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const Progress = () => {
  return (
    <View style={style.container}>
      <Text>Progress</Text>
    </View>
  )
}
const style = StyleSheet.create({
    container:{
        flex:1,
        margin:10,
        marginBottom:120,
        borderRadius:15,
        backgroundColor:'gray',
        padding:10

    }
})
export default Progress