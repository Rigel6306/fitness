import { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const InitializingLoader = () => {
  const masterRotation = useSharedValue(0);
  const counterRotation = useSharedValue(0);
  const corePulse = useSharedValue(1);
  const trackingOrbit = useSharedValue(0);
  const systemAlpha = useSharedValue(0.4);
  const centerPulse = useSharedValue(1); // Extracted out of style logic to prevent unmounted mutations

  useEffect(() => {
    // 1. Clockwise Ring Sweep
    masterRotation.value = withRepeat(
      withTiming(360, { duration: 6000, easing: Easing.linear }),
      -1,
      false
    );

    // 2. Counter-Clockwise Ring Sweep
    counterRotation.value = withRepeat(
      withTiming(-360, { duration: 4000, easing: Easing.linear }),
      -1,
      false
    );

    // 3. Telemetry Breathe Pulse
    corePulse.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.95, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // 4. Satellite Orbit Displacement
    trackingOrbit.value = withRepeat(
      withSequence(
        withTiming(14, { duration: 2000, easing: Easing.out(Easing.ease) }),
        withTiming(-6, { duration: 2000, easing: Easing.out(Easing.ease) })
      ),
      -1,
      true
    );

    // 5. Backlight Glow Oscillation
    systemAlpha.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 1000 }),
        withTiming(0.3, { duration: 1000 })
      ),
      -1,
      true
    );

    // 6. ✅ Fixed Center Pulse Registration (Safe inside useEffect)
    centerPulse.value = withRepeat(
      withSequence(
        withTiming(0.9, { duration: 800 }),
        withTiming(1.05, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  // --- SAFE ANIMATED STYLE HOOKS ---
  const rotateMasterStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${masterRotation.value}deg` }, { scale: corePulse.value }],
  }));

  const rotateCounterStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${counterRotation.value}deg` }],
  }));

  const satelliteOrbitStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${masterRotation.value * 1.5}deg` }, { translateY: trackingOrbit.value }],
  }));

  const ambientBacklightStyle = useAnimatedStyle(() => ({
    opacity: systemAlpha.value,
  }));

  const centerCoreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: centerPulse.value }],
    opacity: systemAlpha.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.ambientScannerBackground} />
      
      <Animated.View style={[styles.ambientBacklightPool, ambientBacklightStyle]} />

      <View style={styles.hudChassis}>
        <Animated.View style={[styles.outerOrbitTrack, rotateMasterStyle]}>
          <View style={[styles.orbitNode, { backgroundColor: '#0affca', top: 0 }]} />
          <View style={[styles.orbitNode, { backgroundColor: '#b17df5', bottom: 0 }]} />
        </Animated.View>

        <Animated.View style={[styles.innerTelemeterRing, rotateCounterStyle]}>
          <View style={styles.innerRingSegmentLeft} />
          <View style={styles.innerRingSegmentRight} />
        </Animated.View>

        <Animated.View style={[styles.satelliteSystem, satelliteOrbitStyle]}>
          <View style={styles.quantumSpark} />
        </Animated.View>

        <Animated.View style={[styles.glowingKernelCore, centerCoreStyle]} />
      </View>

      <View style={styles.metaDataBlock}>
        <Text style={styles.brandTitle}>SUPERBODY</Text>
        <View style={styles.terminalLoaderRow}>
          <Text style={styles.telemetryText}>SECURE ENGINE PROTOCOL // ONLINE</Text>
          <Text style={styles.syncPulseText}>SYS_READY</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030305',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ambientScannerBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.01)',
  },
  ambientBacklightPool: {
    position: 'absolute',
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: (width * 0.7) / 2,
    backgroundColor: 'rgba(177, 125, 245, 0.12)',
    shadowColor: '#b17df5',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 100,
    shadowOpacity: 1,
  },
  hudChassis: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerOrbitTrack: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    borderStyle: 'dashed',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 2,
  },
  orbitNode: {
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 6,
    shadowOpacity: 1,
    shadowColor: '#0affca',
  },
  innerTelemeterRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerRingSegmentLeft: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 70,
    borderWidth: 2,
    borderColor: 'rgba(177, 125, 245, 0.35)',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  innerRingSegmentRight: {
    position: 'absolute',
    width: '85%',
    height: '85%',
    borderRadius: 70,
    borderWidth: 1.5,
    borderColor: 'rgba(10, 255, 202, 0.2)',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  satelliteSystem: {
    position: 'absolute',
    width: 170,
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantumSpark: {
    position: 'absolute',
    right: 0,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#0affca',
    shadowColor: '#0affca',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 1,
  },
  glowingKernelCore: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#030305',
    borderWidth: 2,
    borderColor: '#0affca',
    shadowColor: '#0affca',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 14,
    shadowOpacity: 0.8,
  },
  metaDataBlock: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    fontFamily: 'Bebas',
    fontSize: 28,
    color: '#ffffff',
    letterSpacing: 3,
    textShadowColor: 'rgba(255, 255, 255, 0.15)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  terminalLoaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  telemetryText: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.35)',
    letterSpacing: 1.2,
  },
  syncPulseText: {
    fontSize: 9,
    fontFamily: 'Bebas',
    color: '#0affca',
    letterSpacing: 1,
  }
});

export default InitializingLoader;