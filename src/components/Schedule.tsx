import { useUserDataContext } from '@/hooks/useContext';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Octicons from '@expo/vector-icons/Octicons';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useRef, useState } from 'react';
import { Animated, Dimensions, ImageBackground, LayoutChangeEvent, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import PackageSelectionModal from './PackageSelectionModal';
import WeightTargetModal from './weightTarget/WeightTargetModal';

const { height } = Dimensions.get('screen');

const Schedule = () => {
  const { userData } = useUserDataContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const router = useRouter();

  const [dimensions, setDimensions] = useState({
    schedule: { width: 0, height: 0 },
    meal: { width: 0, height: 0 },
    weight: { width: 0, height: 0 },
    package: { width: 0, height: 0 },
  });

  const handleLayout = (key: keyof typeof dimensions) => (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setDimensions(prev => ({ ...prev, [key]: { width, height } }));
  };

  const tiltAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const mealPlanTilt = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const weightTilt = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const packageTilt = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const createDynamicTiltHandlers = (animRef: Animated.ValueXY, layoutKey: keyof typeof dimensions) => ({
    handlePressIn: (event: { nativeEvent: { locationX: number; locationY: number } }) => {
      const { locationX, locationY } = event.nativeEvent;
      const { width, height } = dimensions[layoutKey];
      
      const centerX = width / 2;
      const centerY = height / 2;
      const dx = locationX - centerX;
      const dy = locationY - centerY;

      const tiltX = -dy / (height / 2.5);
      const tiltY = dx / (width / 2.5);

      Animated.spring(animRef, {
        toValue: { x: tiltX, y: tiltY },
        useNativeDriver: true,
        friction: 4, 
        tension: 55,
      }).start();
    },
    handlePressOut: () => {
      Animated.spring(animRef, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: true,
        friction: 5,
        tension: 40,
      }).start();
    },
  });

  const createTiltStyle = (animRef: Animated.ValueXY) => ({
    transform: [
      { perspective: 700 },
      {
        rotateX: animRef.x.interpolate({
          inputRange: [-1, 1],
          outputRange: ['-14deg', '14deg'],
        }),
      },
      {
        rotateY: animRef.y.interpolate({
          inputRange: [-1, 1],
          outputRange: ['-14deg', '14deg'],
        }),
      },
    ],
  });

  return (
    <View style={style.container}>
      
      {/* 1. LEFT TILE: Main Schedule */}
      <View style={style.schedule} onLayout={handleLayout('schedule')}>
        <Animated.View style={[{ flex: 1, justifyContent: 'center' }, createTiltStyle(tiltAnim)]}>
          <Pressable 
            style={style.solidCardWrapper}
            onPressIn={createDynamicTiltHandlers(tiltAnim, 'schedule').handlePressIn}
            onPressOut={createDynamicTiltHandlers(tiltAnim, 'schedule').handlePressOut}
            onPress={() => { router.navigate('/(tabs)/MainWorkoutSchedule') }}
          >
            <ImageBackground
              style={style.imageBackgroundStyle}
              source={require('../../assets/images/cardsImg/card2.jpg')}
            >
              {/* Smoked Indigo Liquid Glass Overlay Mask */}
              <View style={style.mainWorkoutBgMask} />

              <View style={style.mainWorkoutContent}>
                <View style={style.tagContainer}>
                  <FontAwesome5 name="dumbbell" size={10} color="#0affca" />
                  <Text style={style.tagText}>ROUTINE</Text>
                </View>
                <View>
                  <Text style={style.scheduleTextHeading}>Your Schedule</Text>
                  <Text style={style.scheduleText}>Basic</Text>
                </View>
              </View>
            </ImageBackground>
          </Pressable>
        </Animated.View>
      </View>

      {/* RIGHT STACK MATRIX VIEW */}
      <View style={style.rightColumnContainer}>
        
        {/* Top Splits Row */}
        <View style={style.splitRow} >
          
          {/* 2. Diet Module Tile */}
          <Animated.View 
            style={[{ flex: 1 }, createTiltStyle(mealPlanTilt)]}
            onLayout={handleLayout('meal')}
          >
            <Pressable 
              style={style.solidCardWrapper} 
              onPressIn={createDynamicTiltHandlers(mealPlanTilt, 'meal').handlePressIn}
              onPressOut={createDynamicTiltHandlers(mealPlanTilt, 'meal').handlePressOut}
              onPress={() => { router.navigate('/(tabs)/MealPlan') }}
            >
              <View style={[style.solidBaseCard, style.dietSolidColor]}>
                <LottieView
                  autoPlay
                  loop
                  source={require('../../assets/lottie/diet.json')}
                  style={style.lottieAsset}
                />
                <View style={style.miniBottomBar}>
                  <Text style={style.miniBarText}>MEAL PLAN</Text>
                </View>
              </View>
            </Pressable>
          </Animated.View>

          {/* 3. Target Management Control Tile - REDESIGNED */}
          <Animated.View 
            style={[{ flex: 1 }, createTiltStyle(weightTilt)]}
            onLayout={handleLayout('weight')}
          >
            <Pressable
              onPressIn={createDynamicTiltHandlers(weightTilt, 'weight').handlePressIn}
              onPressOut={createDynamicTiltHandlers(weightTilt, 'weight').handlePressOut}
              onPress={() => { setIsModalOpen(!isModalOpen) }}
              style={[style.solidBaseCard, style.weightSolidColor]}
            >
              {/* Futuristic structural glass integrated target icon block */}
              <View style={style.targetGlassIconContainer}>
                <Octicons name="goal" size={22} color="#9b3eff" />
              </View>
              <Text style={style.weightButtonLabel}>SET TARGET</Text>
            </Pressable>
          </Animated.View>

        </View>

        {/* 4. Package Selection Module Tile */}
        <Animated.View 
          style={[{ flex: 1 }, createTiltStyle(packageTilt)]}
          onLayout={handleLayout('package')}
        >
          <Pressable 
            onPressIn={createDynamicTiltHandlers(packageTilt, 'package').handlePressIn}
            onPressOut={createDynamicTiltHandlers(packageTilt, 'package').handlePressOut}
            onPress={() => { setIsPackageModalOpen(!isPackageModalOpen) }}
            style={[style.solidBaseCard, style.packageSolidColor]}
          >
            <View style={style.packageContentRow}>
              <MaterialCommunityIcons name="badge-account-horizontal" size={20} color="#00e5ff" />
              <Text style={style.payment}>YOUR PACKAGE</Text>
            </View>
          </Pressable>
        </Animated.View>

      </View>

      <WeightTargetModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <PackageSelectionModal isVisible={isPackageModalOpen} onClose={() => setIsPackageModalOpen(false)} />
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 2,
    height: height * 0.223,
    maxHeight: height * 0.3,
    marginTop: 10,
    margin: 10,
    flexDirection: 'row',
    gap: 10,
  },
  schedule: {
    flex: 1,
    borderRadius: 16,
  },
  rightColumnContainer: {
    flex: 1, 
    gap: 10,
  },
  splitRow: {
    flex: 1, 
    flexDirection: 'row', 
    gap: 10,
  },
  solidCardWrapper: {
    flex: 1, 
    borderRadius: 16, 
    overflow: 'hidden',
    backgroundColor: '#0c0b12',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  solidBaseCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  imageBackgroundStyle: {
    flex: 1,
    justifyContent: 'center',
  },
  mainWorkoutBgMask: {
    ...StyleSheet.absoluteFill,
    // Saturated Deep Cosmic-Violet liquid sheen backdrop mask
    backgroundColor: 'rgba(21, 21, 22, 0.82)', 
    borderWidth: 1.5,
    borderRadius:20,
    borderColor: 'rgba(138, 92, 246, 0.3)',
  },
  mainWorkoutContent: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(22, 71, 61, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(10, 255, 202, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  tagText: {
    color: '#0affca',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  // Opaque Deep Emerald Teal Liquid Glass Look
  dietSolidColor: {
    backgroundColor: '#18635f',
    borderWidth: 1.5,
  
  },
  // Opaque Midnight Amethyst Liquid Glass Look
  weightSolidColor: {
    backgroundColor: '#53266ed3', 
    borderWidth: 1.5,
    
    gap: 8,
  },
  // Opaque Deep Electric Ocean Liquid Glass Look
  packageSolidColor: {
    backgroundColor: '#0a192f', 
    borderWidth: 1.5,
   
  },
  lottieAsset: {
    height: '100%',
    width: '100%',
    transform: [{ scale: 1.2 }],
  },
  miniBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(10, 33, 32, 0.85)',
    paddingVertical: 4,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: 'rgba(10, 255, 202, 0.1)',
  },
  miniBarText: {
    color: '#0affca',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  // Integrated premium target glass icon capsule container
  targetGlassIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: 'rgba(78, 62, 255, 0.27)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(123, 62, 255, 0.83)',
  },
  packageContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
  },
  scheduleTextHeading: {
    textAlign: 'left',
    fontFamily: 'Bebas',
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.5,
  },
  scheduleText: {
    textAlign: 'left',
    fontFamily: 'Bebas',
    fontSize: 48,
    lineHeight: 48,
    fontWeight: '400',
    color: '#ffffff',
    marginTop: 2,
  },
  weightButtonLabel: {
    fontWeight: '900', 
    color: '#fdfdfd',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  payment: {
    textAlign: 'center',
    fontFamily: 'Bebas',
    fontSize: 16,
    color: '#00e5ff',
    letterSpacing: 0.5,
  },
});

export default Schedule;