import Carousel from '@/components/carousel'
import Header from '@/components/header'
import Progress from '@/components/Progress'
import SafeScreenWrapper from '@/components/SafeScreenWrapper'
import Schedule from '@/components/Schedule'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { StyleSheet } from 'react-native'
const Home = () => {
  return (
    <>
      <LinearGradient
        colors={['#b2939337', '#ffd83d8a', '#6bcb77','#4d96ff']} 
        style={styles.image}
        start={{ x:-0.2 , y: 0.5 }}
        end={{ x: 1, y:1 }} 
      >
   <SafeScreenWrapper>
          <Header />
           <Carousel />
          <Schedule />
          <Progress />
        </SafeScreenWrapper>
    </LinearGradient>
 </>
  )
}


const styles = StyleSheet.create({
  image: {

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