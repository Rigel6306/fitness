import Carousel from '@/components/carousel'
import Header from '@/components/header'
import Progress from '@/components/Progress'
import SafeScreenWrapper from '@/components/SafeScreenWrapper'
import Schedule from '@/components/Schedule'
import { Colors } from '@/constants/Colors'
import React from 'react'
import { StyleSheet, View } from 'react-native'
const {background,primaryBackground} = Colors
const Home = () => {
  return (
    <>
      <View style={styles.container}>
   <SafeScreenWrapper>
          <Header />
           <Carousel />
          <Schedule />
          <Progress />
        </SafeScreenWrapper>
    </View>
 </>
  )
}


const styles = StyleSheet.create({
  container: {
    backgroundColor:'#000000',
    height: "100%",
    width: "100%",
    flex: 1,
    resizeMode: 'cover'
  },
  welcome: {
    margin: 10,
    marginTop: 40,
    backgroundColor: 'green'
  }
})

export default Home