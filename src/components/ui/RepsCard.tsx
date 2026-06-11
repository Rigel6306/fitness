'use client'
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Vibration, View } from 'react-native';

interface RepsCardProps {
  id: string | number;
  reps: string | number;
  index: number;
  isCompleted: boolean;
}

const RepsCard = ({ id, reps, index, isCompleted }: RepsCardProps) => {
  const { width } = Dimensions.get('window');

  // Animated state controllers
  const colorAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Performance safe: Trigger vibration ONLY once upon completion toggle change
    
 if (isCompleted){
    Vibration.vibrate([0, 10, 150, 10,0, 10, 200, 10])
  }
    // Parallel smooth transitions
    Animated.parallel([
      Animated.timing(colorAnim, {
        toValue: isCompleted ? 1 : 0,
        duration: 250,
        useNativeDriver: false, // Color interpolations require js thread backing
      }),
      Animated.spring(scaleAnim, {
        toValue: isCompleted ? 0.96 : 1,
        useNativeDriver: true,
        friction: 8,
        tension: 50,
      })
    ]).start();
  }, [isCompleted]);

  // Interpolated crisp color metrics
  const textColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#B0B5B3', '#4cddbb'], // Slates over smoothly to the emerald palette
  });

  return (
    <View style={[styles.container, isCompleted && styles.containerCompleted]}>
      <Animated.View
        style={[
          styles.rowContent,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        <View style={styles.leftMetrics}>
          <Animated.Text style={[styles.repIndex, { color: textColor }]}>
            Set {index + 1}
          </Animated.Text>
        </View>

        <View style={[styles.rightMetrics, isCompleted && styles.badgeCompleted]}>
          <Animated.Text style={[styles.repText, { color: isCompleted ? '#4cddbb' : '#FFFFFF' }]}>
            {reps} Reps
          </Animated.Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginVertical: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.03)',
  },
  containerCompleted: {
    backgroundColor: 'rgba(76, 221, 187, 0.03)',
    borderColor: 'rgba(76, 221, 187, 0.08)',
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  leftMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  repIndex: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  rightMetrics: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  badgeCompleted: {
    backgroundColor: 'rgba(76, 221, 187, 0.08)',
    borderColor: 'rgba(76, 221, 187, 0.15)',
  },
  repText: {
    fontSize: 13,
    fontWeight: '700',
  },
});

export default RepsCard;