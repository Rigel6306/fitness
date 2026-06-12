import { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { icons } from "../constants/icon";

const TabBarButton = ({
  onPress,
  onLongPress,
  isFocused,
  routeName,
  color,
  label,
}: any) => {
  const scale = useSharedValue(0);
    
  useEffect(() => {
    // Standard quick button spring transition
    scale.value = withSpring(isFocused ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [isFocused]);

  const animatedTextStyle = useAnimatedStyle(() => {
    // Original opacity mapping
    const opacity = interpolate(scale.value, [0, 1], [0, 1]);
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.1]);
    return {
      transform: [{ scale: scaleValue }],
      opacity,
    };
  });

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.1]);
    // Keeps your original 'top' layout offsets but executes via native GPU translation
    const translateY = interpolate(scale.value, [0, 1], [10, 0]);
    return {
      transform: [
        { scale: scaleValue },
        { translateY: translateY }
      ],
    };
  });

  return (
    <Pressable style={styles.item} onPress={onPress} onLongPress={onLongPress}>
      <Animated.View style={animatedIconStyle}>
        {icons[routeName] ? (
          icons[routeName]({ color })
        ) : (
          <Animated.View style={{ width: 24, height: 24, backgroundColor: color, borderRadius: 12 }} />
        )}
      </Animated.View>
      <Animated.Text style={[{ color, fontWeight: '600' }, animatedTextStyle]}>
        {label}
      </Animated.Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  item: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: '100%', // Ensures item spans the entire 70px height of the parent container
  },
});

export default TabBarButton;