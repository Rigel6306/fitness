
import { useUserDataContext } from '@/hooks/useContext'
import Octicons from '@expo/vector-icons/Octicons'
import { useNavigation, useRouter } from 'expo-router'
import LottieView from 'lottie-react-native'
import { useRef, useState } from 'react'
import { Animated, Dimensions, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native'
import PackageSelectionModal from './PackageSelectionModal'
import WeightTargetModal from './weightTarget/WeightTargetModal'

const {height} = Dimensions.get('screen')
const Schedule = () => {

const{userData} = useUserDataContext()

  const [isModalOpen,setIsModalOpen] = useState(false)
  const [isPackageModalOpen,setIsPackageModalOpen] = useState(false)
  const router = useRouter()
  const navigator = useNavigation()

  // Animation refs for all cards
  const tiltAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const mealPlanTilt = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const weightTilt = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const packageTilt = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  // Reusable function to create tilt handlers
  const createTiltHandlers = (animRef: Animated.ValueXY | Animated.Value,link?: undefined) => ({
    handlePressIn: (event: { nativeEvent: { locationX: any; locationY: any } }) => {
      const { locationX, locationY } = event.nativeEvent;
      const centerX = 100;
      const centerY = 100;

      const dx = locationX - centerX;
      const dy = locationY - centerY;

      const tiltX = -dy / 60;
      const tiltY = dx / 60;

      Animated.spring(animRef, {
        toValue: { x: tiltX, y: tiltY },
        useNativeDriver: true,
        friction: 5,
      }).start();
    },
    handlePressOut: () => {
      Animated.spring(animRef, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: true,
        friction: 5,
      }).start();
    },
  });

  const { handlePressIn, handlePressOut } = createTiltHandlers(tiltAnim);
  const { handlePressIn: mealPressIn, handlePressOut: mealPressOut } = createTiltHandlers(mealPlanTilt);
  const { handlePressIn: weightPressIn, handlePressOut: weightPressOut } = createTiltHandlers(weightTilt);
  const { handlePressIn: packagePressIn, handlePressOut: packagePressOut } = createTiltHandlers(packageTilt);

  // Reusable function to create tilt style
  const createTiltStyle = (animRef: Animated.ValueXY) => ({
    transform: [
      { perspective: 1000 },
      {
        rotateX: animRef.x.interpolate({
          inputRange: [-1, 1],
          outputRange: ['-10deg', '10deg'],
        }),
      },
      {
        rotateY: animRef.y.interpolate({
          inputRange: [-1, 1],
          outputRange: ['-10deg', '10deg'],
        }),
      },
    ],
  });

  const tiltStyle = createTiltStyle(tiltAnim);
  const mealPlanTiltStyle = createTiltStyle(mealPlanTilt);
  const weightTiltStyle = createTiltStyle(weightTilt);
  const packageTiltStyle = createTiltStyle(packageTilt);


  return (
    <View style={style.container}>
      
      <View style={style.schedule}>
        

        <Animated.View style={[{ flex: 1, justifyContent: 'center' },tiltStyle]}>
        {/* Main workout schedule card section */}
          <Pressable style={{ flex: 1, elevation: 15, borderRadius: 15, overflow:'hidden' }}
           onPressIn={handlePressIn}
          onPressOut={handlePressOut}
           onPress={() => { router.navigate('/(tabs)/MainWorkoutSchedule') }}
          >
            <ImageBackground
              style={{ flex: 1, elevation: 15, justifyContent: 'center' }}
              source={require('../../assets/images/cardsImg/card2.jpg')}
            >

              {/* Overlay with opacity */}
              <View style={{
                ...StyleSheet.absoluteFill,
                backgroundColor: 'rgba(50, 30, 73, 0.84)',

              }} />

              {/* Text content stays fully visible */}

              <Text style={style.scheduleTextHeading}>Your Schedule</Text>
              <Text style={style.scheduleText}>Basic</Text>

            </ImageBackground>
          </Pressable>
        </Animated.View>

      </View>
      {/* Meal plan card */}
      <View style={{ flex: 1, gap: 10 }}>
        <View style={{ flex: 1, flexDirection: 'row', gap: 10 }} >
          <Animated.View style={[{ flex: 1 }, mealPlanTiltStyle]}>
            <Pressable 
              style={{ flex: 1, elevation: 15, borderRadius: 15, overflow: 'hidden' }} 
              onPressIn={mealPressIn}
              onPressOut={mealPressOut}
              onPress={() => { router.navigate('/(tabs)/MealPlan') }}
            >
              <View style={{ flex: 1, borderRadius: 15, overflow: 'hidden' }}>
                <LottieView
                  autoPlay
                  source={require('../../assets/lottie/diet.json')}
                  style={{
                    height: '100%',
                    width: '100%',
                    backgroundColor: '#328a84df',
                  }}
                />
              </View>
            </Pressable>
          </Animated.View>
          {/* Weight management card */}
          <Animated.View style={[{ flex: 1 }, weightTiltStyle]}>
            <Pressable
              onPressIn={weightPressIn}
              onPressOut={weightPressOut}
              onPress={() => { setIsModalOpen(!isModalOpen) }}
              style={{ flex: 1, backgroundColor: 'rgb(71, 67, 172)', elevation: 15, borderRadius: 15, alignItems: 'center', gap: 10, justifyContent: 'center', overflow: 'hidden' }}
            >
              <Text style={{ fontWeight: 'bold', color: '#000000', }}>
                Set Target
              </Text>
              <Octicons name="goal" size={30} color="gray" />
            </Pressable>
          </Animated.View>
        </View>
        {/* Package selection card */}
        <Animated.View style={[{ flex: 1 }, packageTiltStyle]}>
          <Pressable 
            onPressIn={packagePressIn}
            onPressOut={packagePressOut}
            onPress={() => { setIsPackageModalOpen(!isPackageModalOpen) }}
            style={{
              flex: 1, 
              backgroundColor: 'rgb(180, 180, 76)',
              alignItems: 'center', 
              justifyContent: 'center',
              elevation: 15, 
              borderRadius: 15,
              overflow: 'hidden'
            }}
          >
            <Text style={style.payment}>your package</Text>
          </Pressable>
        </Animated.View>
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
   marginTop:30,
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