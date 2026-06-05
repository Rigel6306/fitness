import { LinearGradient } from 'expo-linear-gradient';
import type { PropsWithChildren, ReactElement } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HEADER_HEIGHT = 300;
const HEADER_MIN_HEIGHT = 100;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
  showGradientOverlay?: boolean;
  blurIntensity?: number;
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
  showGradientOverlay = true,
  blurIntensity = 20,
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const bottom = useBottomTabOverflow();

  // Main header animation with parallax effect
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollOffset.value,
      [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
      [1.3, 1, 0.95],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      scrollOffset.value,
      [0, HEADER_HEIGHT],
      [0, -HEADER_HEIGHT * 0.3],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      scrollOffset.value,
      [0, HEADER_HEIGHT * 0.5],
      [1, 0.3],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }, { translateY }],
      opacity,
      height: interpolate(
        scrollOffset.value,
        [0, HEADER_HEIGHT],
        [HEADER_HEIGHT, HEADER_MIN_HEIGHT],
        Extrapolate.CLAMP
      ),
    };
  });

  // Floating header animation (appears when scrolling up)
  const floatingHeaderStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollOffset.value,
      [HEADER_HEIGHT * 0.5, HEADER_HEIGHT],
      [-50, 0],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      scrollOffset.value,
      [HEADER_HEIGHT * 0.5, HEADER_HEIGHT],
      [0, 1],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY }],
      opacity,
    };
  });

  // Content fade-in animation
  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollOffset.value,
        [0, HEADER_HEIGHT * 0.3],
        [0, 1],
        Extrapolate.CLAMP
      ),
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [0, HEADER_HEIGHT * 0.3],
            [20, 0],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  // Blur overlay animation
  const blurOverlayStyle = useAnimatedStyle(() => {
    const blurOpacity = interpolate(
      scrollOffset.value,
      [0, HEADER_HEIGHT * 0.7],
      [0, 0.8],
      Extrapolate.CLAMP
    );

    return {
      opacity: blurOpacity,
    };
  });

  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={{ paddingBottom: bottom + 20 }}
      >
        {/* Main Header */}
        <Animated.View
          style={[
            styles.header,
            { backgroundColor: headerBackgroundColor[colorScheme] },
            headerAnimatedStyle,
          ]}
        >
          {headerImage}
          
          {/* Gradient Overlay */}
          {showGradientOverlay && (
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />
          )}

          {/* Blur Overlay (appears on scroll) */}
          <Animated.View
            style={[
              styles.blurOverlay,
              { backgroundColor: headerBackgroundColor[colorScheme] },
              blurOverlayStyle,
            ]}
            pointerEvents="none"
          />
        </Animated.View>

        {/* Content with fade-in animation */}
        <Animated.View style={[styles.content, contentAnimatedStyle]}>
          {/* Floating Card-like Content Container */}
          <ThemedView style={styles.contentCard}>
            {children}
          </ThemedView>
        </Animated.View>
      </Animated.ScrollView>

      {/* Floating Header (appears on scroll) */}
      <Animated.View
        style={[
          styles.floatingHeader,
          { backgroundColor: headerBackgroundColor[colorScheme] },
          floatingHeaderStyle,
        ]}
      >
        <LinearGradient
          colors={[
            headerBackgroundColor[colorScheme],
            `${headerBackgroundColor[colorScheme]}E6`,
          ]}
          style={StyleSheet.absoluteFill}
        />
        <ThemedView style={styles.floatingHeaderContent}>
          {/* You can add a title or other header content here */}
        </ThemedView>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Light background for modern look
  },
  header: {
    overflow: 'hidden',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backdropFilter: 'blur(10px)',
  },
  content: {
    flex: 1,
    marginTop: -20, // Pull content up slightly over the header
    paddingHorizontal: 20,
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 20,
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_MIN_HEIGHT,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    overflow: 'hidden',
  },
  floatingHeaderContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});