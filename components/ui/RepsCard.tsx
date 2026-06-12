import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Vibration, View } from 'react-native';

const RepsCard = ({ id, reps, index, isCompleted }) => {
  const { width } = Dimensions.get('screen');

  // Animated values
  const colorAnim = useRef(new Animated.Value(0)).current;
  const positionAnim = useRef(new Animated.Value(0)).current; // 0 = left, 1 = right

  useEffect(() => {
    // Animate color
    Animated.timing(colorAnim, {
      toValue: isCompleted ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // Animate horizontal shift
    Animated.spring(positionAnim, {
      toValue: isCompleted ? 1 : 0,
      useNativeDriver: true,
      friction: 6.8,
      tension: 60,
    }).start();
  }, [isCompleted]);

  // Interpolated color
  const textColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#fff', 'rgba(33, 167, 149, 1)'],
  });

  // Interpolated horizontal translation
  const translateX = positionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width * 0.4], // adjust distance to match "flex-end"
  });

  if (isCompleted){
    Vibration.vibrate([0, 10, 150, 10,0, 10, 300, 10])
  }
  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          flexDirection: 'row',
          gap: 10,
          width: width * 0.3,
          maxWidth: width * 0.3,
          transform: [{ translateX }],
        }}
      >
        <Animated.Text style={[styles.repIndex, { color: textColor }]}>
          Set {index + 1}
        </Animated.Text>
        <Animated.Text style={[styles.repText, { color: textColor }]}>
          {reps} Reps
        </Animated.Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    padding: 5,
    borderRadius: 20,
  },
  repIndex: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  repText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default RepsCard;
