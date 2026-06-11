import Carousel from '@/components/carousel'
import Header from '@/components/header'
import Progress from '@/components/Progress'
import SafeScreenWrapper from '@/components/SafeScreenWrapper'
import Schedule from '@/components/Schedule'
import TabScreenWrapper from '@/components/ui/TabScreenWrapper'
import { Colors } from '@/constants/Colors'
import { ScrollView, StyleSheet, View } from 'react-native'
const {background,primaryBackground} = Colors
const Home = () => {
  return (
    <>
    <TabScreenWrapper >
      <View style={styles.container}>
    <SafeScreenWrapper>
      <ScrollView >
          <Header />
           <Carousel />
        
            <Schedule />
                    
          <Progress />
         </ScrollView>
      </SafeScreenWrapper>
    </View>
    </TabScreenWrapper>
 </>
  )
}


const styles = StyleSheet.create({
  container: {
    backgroundColor:'#000000',
    flex: 1,
    resizeMode: 'cover'
  },

})

export default Home