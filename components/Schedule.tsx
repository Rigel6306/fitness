
import { useNavigation, useRouter } from 'expo-router'
import LottieView from 'lottie-react-native'
import { useState } from 'react'
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import WeightTargetModal from './weightTarget/WeightTargetModal'
import PackageSelectionModal from './PackageSelectionModal'
const Schedule = () => {

  const [isModalOpen,setIsModalOpen] = useState(false)
  const [isPackageModalOpen,setIsPackageModalOpen] = useState(false)
  const router = useRouter()
  const navigator = useNavigation()
  return (
    <View style={style.container}>

      <View style={style.schedule}>

        <View style={{ flex: 1, justifyContent: 'center' }}>

          <TouchableOpacity style={{ flex: 1, elevation: 15, borderRadius: 15 }} onPress={() => { router.navigate('/(tabs)/MainWorkoutSchedule') }}>
            <ImageBackground
              style={{ flex: 1, elevation: 15, justifyContent: 'center' }}
              source={require('../assets/images/cardsImg/card2.jpg')}
            >

              {/* Overlay with opacity */}
              <View style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: 'rgba(59, 57, 57, 0.5)',

              }} />

              {/* Text content stays fully visible */}

              <Text style={style.scheduleTextHeading}>Your Schedule</Text>
              <Text style={style.scheduleText}>Basic</Text>

            </ImageBackground>
          </TouchableOpacity>
        </View>

      </View>
      <View style={{ flex: 1, gap: 10 }}>
        <View style={{ flex: 1, flexDirection: 'row', gap: 10 }} >
          <TouchableOpacity style={{ flex: 1, elevation: 15, borderRadius: 15 }} onPress={() => { router.navigate('/(tabs)/MealPlan') }}>
            <View style={{ flex: 1, borderRadius: 15, overflow: 'hidden' }}>
              <LottieView
                autoPlay
                source={require('../assets/lottie/diet.json')}
                style={{

                  height: '100%',
                  width: '100%',
                  backgroundColor: '#313f55df',
                }}
              />
            </View>


          </TouchableOpacity>
          <TouchableOpacity
          onPress={()=>{setIsModalOpen(!isModalOpen)}}
          style={{ flex: 1, backgroundColor: 'rgba(67, 48, 95, 1)', elevation: 15, borderRadius: 15, alignItems: 'center', justifyContent: 'center', }}>
            <Text style={style.yourWeight}>
              110
            </Text>
            <Text style={{ fontWeight: 'bold' }}>
              Kg
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
        onPress={()=>{setIsPackageModalOpen(!isPackageModalOpen)}}
        style={{
          flex: 1, backgroundColor: 'hsla(60, 1%, 29%, 1.00)',
          alignItems: 'center', justifyContent: 'center',
          elevation: 15, borderRadius: 15
        }}>

          <Text style={style.payment}>3000</Text>

        </TouchableOpacity>
      </View>
        <WeightTargetModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        />
        <PackageSelectionModal
        isVisible={isPackageModalOpen}
        onClose={()=>setIsPackageModalOpen(false)}
        />
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    flexDirection: 'row',
    gap: 10,
  },
  schedule: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden'

  },
  scheduleText: {
    textAlign: 'center',
    fontFamily: 'Bebas',
    fontSize: 60,
    fontWeight: '400',
    color: 'rgba(233, 125, 53, 1)'
  },
  scheduleTextHeading: {
    textAlign: 'center',
    fontFamily: 'Bebas',
    fontSize: 20,
    color: 'white',
  },
  yourWeight: {
    textAlign: 'center',
    fontFamily: 'Bebas',
    fontSize: 40,
    color: 'rgba(233, 125, 53, 1)'
  },
  payment: {
    textAlign: 'center',
    fontFamily: 'Bebas',
    fontSize: 40,
  }


})

export default Schedule