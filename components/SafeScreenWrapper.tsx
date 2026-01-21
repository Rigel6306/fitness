
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const SafeScreenWrapper = ({children}:{children:any}) => {
  return (
    <SafeAreaView style={[styles.container]}>
      {/* <StatusBar backgroundColor="black" /> */}
        {children}
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
container:{
    flex:1,
  
   
}

})

export default SafeScreenWrapper