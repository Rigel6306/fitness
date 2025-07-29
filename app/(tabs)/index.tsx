import Carousel from '@/components/carousel'
import Header from '@/components/header'
import SafeScreenWrapper from '@/components/SafeScreenWrapper'
import React from 'react'
import { ImageBackground, StyleSheet } from 'react-native'
const Home = () => {
  return (


    <ImageBackground
    style={styles.image}
    source={require('../../assets/images/cardsImg/card11.jpg')}
    >

    <SafeScreenWrapper>
    <Header/>
    <Carousel/>
    </SafeScreenWrapper>
    </ImageBackground>
  )
}


const styles = StyleSheet.create({
  image:{
   
    height:"100%",
    width:"100%",
    flex:1,
    resizeMode:'cover'
  },
  welcome:{
    margin:10,
    marginTop:40,
    backgroundColor:'green'
  }
})

export default Home