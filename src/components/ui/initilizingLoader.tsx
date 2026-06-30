import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path, Defs, LinearGradient, Stop, Mask, Rect } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Design tokens ────────────────────────────────────────────────────────────
const ORANGE = '#FF5A1F';
const GREEN_ECG = '#22ff88';          
const GREEN_ECG_D = 'rgba(34,255,136,0.04)';  
const WHITE = '#FFFFFF';
const WHITE_DIM = 'rgba(255,255,255,0.35)';
const BG = '#050505';

// ─── Responsive Layout scaling ────────────────────────────────────────────────
const ECG_W = SCREEN_WIDTH * 0.85; 
const ECG_H = ECG_W * 0.6;          

const RESPONSIVE_ECG_PATH = 
  'M 0,50 L 15,50 L 20,40 L 23,75 L 28,15 L 32,55 L 35,50 L 48,50 ' +
  'L 53,40 L 56,75 L 61,15 L 65,55 L 68,50 L 80,50 ' +
  'L 85,40 L 88,75 L 93,15 L 97,55 L 100,50';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

export default function InitializingLoader() {
  // ─── Shared Values ─────────────────────────────────────────────────────────
  const dashOffset = useSharedValue(1000);
  
  // Sweep X controls the horizontal positioning of the visibility window mask
  // Moves from completely off-left (-100) to completely off-right (100)
  const sweepX = useSharedValue(-40); 

  const ringScale = useSharedValue(0.4);
  const ringOpacity = useSharedValue(0);

  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.92);

  useEffect(() => {
    // ── 1. Natural ECG Line Reveal & Trail Sweep ─────────────────────────────
    dashOffset.value = withRepeat(
      withTiming(0, { duration: 2200, easing: Easing.linear }),
      -1,
      false
    );

    sweepX.value = withRepeat(
      withTiming(100, { duration: 2200, easing: Easing.linear }),
      -1,
      false
    );

    // ── 2. Pulse ring ────────────────────────────────────────────────────────
    ringScale.value = withRepeat(
      withSequence(
        withTiming(1.5, { duration: 2200, easing: Easing.out(Easing.quad) }),
        withTiming(0.4, { duration: 0 })
      ),
      -1,
      false
    );
    ringOpacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 300 }),
        withTiming(0, { duration: 1900, easing: Easing.linear })
      ),
      -1,
      false
    );

    // ── 3. Logo entrance ─────────────────────────────────────────────────────
    logoOpacity.value = withDelay(200, withTiming(1, { duration: 800, easing: Easing.out(Easing.quad) }));
    logoScale.value = withDelay(200, withTiming(1, { duration: 800, easing: Easing.out(Easing.back(1.5)) }));
  }, []);

  // ─── UI Thread Animated Props ──────────────────────────────────────────────
  const ecgAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: dashOffset.value,
  }));

  const maskRectProps = useAnimatedProps(() => ({
    x: sweepX.value - 40, // Keeps the trailing gradient window shifting safely
  }));

  // ─── Animated Styles ──────────────────────────────────────────────────────
  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
    transform: [{ scale: ringScale.value }],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  return (
    <View style={styles.container}>
      
      {/* ── Background Aesthetic Layer ────────────────────────────────────── */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.gridOverlay} />
      </View>

      {/* ── ECG Heartbeat Panel ───────────────────────────────────────────── */}
      <View style={styles.ecgPanel}>
        <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <Defs>
            {/* Horizontal gradient mapping a sharp leading edge and a long faded tail */}
            <LinearGradient id="fadeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="black" stopOpacity={0} />
              <Stop offset="70%" stopColor="white" stopOpacity={0.2} />
              <Stop offset="100%" stopColor="white" stopOpacity={1} />
            </LinearGradient>
            
            {/* The mask references our animated rectangle moving across the viewport */}
            <Mask id="ecgMask">
              <AnimatedRect
                animatedProps={maskRectProps}
                y="0"
                width="40"
                height="100"
                fill="url(#fadeGrad)"
              />
            </Mask>
          </Defs>

          {/* Ghost trace (Unmasked) */}
          <Path
            d={RESPONSIVE_ECG_PATH}
            stroke={GREEN_ECG_D}
            strokeWidth={0.75}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dynamic organic fading trace */}
          <AnimatedPath
            animatedProps={ecgAnimatedProps}
            d={RESPONSIVE_ECG_PATH}
            stroke={GREEN_ECG}
            strokeWidth={1.75}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={1000}
            mask="url(#ecgMask)"
          />
        </Svg>
      </View>

      {/* ── Center Block: Pulse Ring + Brand ──────────────────────────────── */}
      <View style={styles.centerBlock}>
        <Animated.View style={[styles.pulseRing, ringStyle]} />

        <Animated.View style={[styles.logoBlock, logoStyle]}>
          <Text style={styles.brandTop}>SUPER</Text>
          <Text style={styles.brandBot}>BODY</Text>
          <View style={styles.taglineContainer}>
            <Text style={styles.tagline}>TRAIN BEYOND YOUR LIMITS</Text>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridOverlay: {
    flex: 1,
    opacity: 0.02,
    borderWidth: 1,
    borderColor: WHITE,
  },
  ecgPanel: {
    width: ECG_W,
    height: ECG_H,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_WIDTH * 0.8,
  },
  pulseRing: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.48,
    height: SCREEN_WIDTH * 0.48,
    borderRadius: (SCREEN_WIDTH * 0.48) / 2,
    borderWidth: 1.5,
    borderColor: ORANGE,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logoBlock: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTop: {
    fontSize: SCREEN_WIDTH * 0.12, 
    fontWeight: '900',
    color: WHITE,
    letterSpacing: SCREEN_WIDTH * 0.02,
    textAlign: 'center',
    includeFontPadding: false,
  },
  brandBot: {
    fontSize: SCREEN_WIDTH * 0.12,
    fontWeight: '900',
    color: ORANGE,
    letterSpacing: SCREEN_WIDTH * 0.02,
    textAlign: 'center',
    includeFontPadding: false,
    marginTop: -SCREEN_WIDTH * 0.02,
  },
  taglineContainer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingTop: 8,
    width: '80%',
  },
  tagline: {
    fontSize: SCREEN_WIDTH * 0.022,
    fontWeight: '700',
    color: WHITE_DIM,
    letterSpacing: 3,
    textAlign: 'center',
  },
});