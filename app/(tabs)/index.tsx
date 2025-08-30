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
        colors={['#192f57ff', '#909935ff', '#435a92ff']} // Array of colors for the gradient
        style={styles.image}
        start={{ x: 0.5, y: 1 }} // Start point of the gradient (top-left)
        end={{ x: 1.5, y: 0.2 }} // End point of the gradient (bottom-right)
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