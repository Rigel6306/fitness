
import React from 'react'
import { Platform, SafeAreaView, StatusBar, StyleSheet } from 'react-native'

const SafeScreenWrapper = ({children}:{children:any}) => {
  return (
    <SafeAreaView style={[styles.container]}>
      <StatusBar backgroundColor="red" />
        {children}
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
container:{
    flex:1,
    paddingTop:Platform.OS==='android'?StatusBar.currentHeight:0
    
}

})

export default SafeScreenWrapper