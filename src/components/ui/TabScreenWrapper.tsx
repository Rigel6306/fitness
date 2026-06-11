// TabScreenWrapper.tsx (adjusted)
import { useNavigation, usePathname } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

interface TabScreenWrapperProps {
  children: React.ReactNode;
}

export default function TabScreenWrapper({ children }: TabScreenWrapperProps) {
  const pathname = usePathname();
  const navigation = useNavigation();

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(132);
  const scale = useSharedValue(0);

  // Plain RN initial style to avoid first-frame flash
  const initialStyle = {
    opacity: 0,
    transform: [{ translateY: 132 }, { scale: 0 }],
  };

  useEffect(() => {
    const unsubscribeBlur = navigation.addListener('blur', () => {
      opacity.value = 0;
      translateY.value = 132;
      scale.value = 0;
    });
    return unsubscribeBlur;
  }, [navigation, opacity, translateY, scale]);

  useEffect(() => {
    // Ensure starting values are locked
    opacity.value = 0;
    translateY.value = 132;
    scale.value = 0;

    // Animate in
    opacity.value = withSpring(1, { damping: 12, stiffness: 150 });
    translateY.value = withSpring(0, { damping: 10.5, stiffness: 170, mass: 0.8 });
    scale.value = withSpring(1, { damping: 16, stiffness: 130, mass: 0.8 });
  }, [pathname, opacity, translateY, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return (
    // initialStyle is applied immediately by RN; animatedStyle will take over smoothly
  
      <Animated.View style={[styles.container, initialStyle, animatedStyle]}>
        
      {children}
      
      </Animated.View>
   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0e',
  },
});
