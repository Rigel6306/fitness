import Carousel from '@/components/carousel'
import Header from '@/components/header'
import Progress from '@/components/Progress'
import SafeScreenWrapper from '@/components/SafeScreenWrapper'
import Schedule from '@/components/Schedule'
import TabScreenWrapper from '@/components/ui/TabScreenWrapper'
import { ScrollView, StyleSheet, View } from 'react-native'

const Home = () => {
  return (

      <View style={styles.container}>
        <SafeScreenWrapper>
          {/* ✅ FIXED: Added an explicit background style structure to the ScrollView container layers */}
          <ScrollView 
            style={styles.scrollWindow} 
            contentContainerStyle={styles.scrollContent}
          >
            <Header />
            <Carousel />
            <Schedule />
            <Progress />
          </ScrollView>
        </SafeScreenWrapper>
      </View>
   
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    flex: 1,
  },
  scrollWindow: {
    backgroundColor: '#000000', // Explicitly forces the window boundary viewport to initialize black
    flex: 1,
  },
  scrollContent: {
    backgroundColor: '#000000', // Keeps content foundation dark during rubber-band overscroll bounces
  }
})

export default Home;