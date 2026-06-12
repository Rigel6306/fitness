// TabScreenWrapper.tsx
import { usePathname } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';

interface Props {
  children: React.ReactNode;
  routePath: string;
  showDelay?: number;
}

export default function TabScreenWrapper({ children, routePath, showDelay = 32   }: Props) {
  const pathname = usePathname();
  const isFocused = pathname === routePath || pathname?.startsWith(routePath + '/');

  // Your original individual motion vectors
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(24);
  const scale = useSharedValue(0.94);

  // A native thread-level rendering mask
  const isReady = useSharedValue(false);

  useEffect(() => {
    let mounted = true;

    if (isFocused) {
      const t = setTimeout(() => {
        if (!mounted) return;

        // Open the native gate and fire your original spring physics together
        isReady.value = true;

        // 🚀 YOUR EXACT ORIGINAL MOTION VALUES RESTORED
        opacity.value = withTiming(1, { duration: 450 });
        translateY.value = withSpring(0, { 
          damping: 16, 
          stiffness: 60,
          mass: 0.8
        });
        
        scale.value = withSpring(1, {
          damping: 16,
          stiffness: 60,
          mass: 0.8
        });
      }, showDelay);

      return () => {
        mounted = false;
        clearTimeout(t);
      };
    } else {
      // 🔥 FIX part 1: Synchronously drop values on the UI thread immediately 
      // without waiting for the next frame tick layout pass to finish evaluation
      isReady.value = false;
      cancelAnimation(opacity);
      cancelAnimation(translateY);
      cancelAnimation(scale);
      
      opacity.value = 0;
      translateY.value = 24;
      scale.value = 0.94;
    }
  }, [isFocused, showDelay]);

  // 🔥 FIX part 2: Force clean-up on unmount/teardown to protect the structural layout cache
  useEffect(() => {
    return () => {
      isReady.value = false;
      opacity.value = 0;
      translateY.value = 24;
      scale.value = 0.94;
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    // If the native gate is closed, force-lock the component to absolute hidden values.
    // This completely blocks the stale cache frame from displaying before your timeout kicks off.
    if (!isReady.value) {
      return {
        opacity: 0,
        transform: [ { scale: 0.94 }],
      };
    }

    // Otherwise, let your original springs calculate their independent physics beautifully
    return {
      opacity: opacity.value,
      transform: [
        
        { scale: scale.value }
      ],
    };
  });

  return (
    <Animated.View
      style={[styles.container, animatedStyle]}
      collapsable={false}
      renderToHardwareTextureAndroid={true}
      shouldRasterizeIOS={true}
      pointerEvents="auto"
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0e' },
});