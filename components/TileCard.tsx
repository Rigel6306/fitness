
import { useRouter } from 'expo-router';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';

const TileCard = ({ children,link }) => {

   
    const router = useRouter();
  const tiltAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;    
  const handlePressIn = (event) => {
    const { locationX, locationY } = event.nativeEvent;

    // Assume card size ~200x200 for demo; you can measure dynamically
    const centerX = 100;
    const centerY = 100;

    const dx = locationX - centerX;
    const dy = locationY - centerY;

    // Normalize tilt strength
    const tiltX = dy / 50; // rotateX based on vertical offset
    const tiltY = -dx / 50; // rotateY based on horizontal offset

    Animated.spring(tiltAnim, {
      toValue: { x: tiltX, y: tiltY },
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(tiltAnim, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
      friction: 5,
    }).start();

    router.navigate('/(tabs)/MainWorkoutSchedule')
  };

  const tiltStyle = {
    transform: [
      { perspective: 1000 }, // required for 3D tilt
      {
        rotateX: tiltAnim.x.interpolate({
          inputRange: [-1, 1],
          outputRange: ['-10deg', '10deg'],
        }),
      },
      {
        rotateY: tiltAnim.y.interpolate({
          inputRange: [-1, 1],
          outputRange: ['-10deg', '10deg'],
        }),
      },
    ],
  };

  return (
    <Pressable style={} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.card, tiltStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flex:1,
    backgroundColor: '#8d5f5f',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TileCard;

function useNavigation() {
    throw new Error('Function not implemented.');
}
