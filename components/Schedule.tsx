
import { useUserDataContext } from '@/hooks/useContext'
import Octicons from '@expo/vector-icons/Octicons'
import { useNavigation, useRouter } from 'expo-router'
import LottieView from 'lottie-react-native'
import { useState } from 'react'
import { Dimensions, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import PackageSelectionModal from './PackageSelectionModal'
import WeightTargetModal from './weightTarget/WeightTargetModal'

const {height} = Dimensions.get('screen')
const Schedule = () => {

const{userData} = useUserDataContext()
  console.log("At Schedule",userData)

  const [isModalOpen,setIsModalOpen] = useState(false)
  const [isPackageModalOpen,setIsPackageModalOpen] = useState(false)
  const router = useRouter()
  const navigator = useNavigation()
  return (
    <View style={style.container}>

      <View style={style.schedule}>

        <View style={{ flex: 1, justifyContent: 'center' }}>
        {/* Main workout schedule card section */}
          <TouchableOpacity style={{ flex: 1, elevation: 15, borderRadius: 15 }} onPress={() => { router.navigate('/(tabs)/MainWorkoutSchedule') }}>
            <ImageBackground
              style={{ flex: 1, elevation: 15, justifyContent: 'center' }}
              source={require('../assets/images/cardsImg/card2.jpg')}
            >

              {/* Overlay with opacity */}
              <View style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: 'rgba(50, 30, 73, 0.84)',

              }} />

              {/* Text content stays fully visible */}

              <Text style={style.scheduleTextHeading}>Your Schedule</Text>
              <Text style={style.scheduleText}>Basic</Text>

            </ImageBackground>
          </TouchableOpacity>
        </View>

      </View>
      {/* Meal plan card */}
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
                  backgroundColor: '#328a84df',
                }}
              />
            </View>


          </TouchableOpacity>
          {/* Weigth management card */}
          <TouchableOpacity
          onPress={()=>{setIsModalOpen(!isModalOpen)}}
          style={{ flex: 1, backgroundColor: 'rgb(71, 67, 172)', elevation: 15, borderRadius: 15, alignItems: 'center', gap:10, justifyContent: 'center', }}>
            <Text style={{ fontWeight: 'bold',color:'#000000', }}>
            Set Target
            </Text>
            {/* <Text style={style.yourWeight}>
              110 KG
            </Text> */}
            <Octicons name="goal"  size={30} color="gray" />
         
          </TouchableOpacity>
        </View>
        {/* Package selection card */}
        <TouchableOpacity 
        onPress={()=>{setIsPackageModalOpen(!isPackageModalOpen)}}
        style={{
          flex: 1, backgroundColor: 'rgb(180, 180, 76)',
          alignItems: 'center', justifyContent: 'center',
          elevation: 15, borderRadius: 15
        }}>

          <Text style={style.payment}>your package</Text>

        </TouchableOpacity>
      </View>
      {/* Weight target modal */}
        <WeightTargetModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        />
        {/* package selection modal */}
        <PackageSelectionModal
        isVisible={isPackageModalOpen}
        onClose={()=>setIsPackageModalOpen(false)}
        />
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 2,
    height:height*0.223,
   maxHeight:height*0.3,
   marginTop:0,
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
    fontSize: 20,
    color: 'rgb(252, 252, 252)'
  },
  payment: {
    textAlign: 'center',
    fontFamily: 'Bebas',
    fontSize: 20,
  }


})

export default Schedule