import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

// Default iOS tab bar height (expo-router)
const TAB_BAR_HEIGHT = 49;

export default function BlurTabBarBackground() {
  return (
    <BlurView
      // System chrome material automatically adapts to the system's theme
      // and matches the native tab bar appearance on iOS.
      tint="systemChromeMaterial"
      intensity={100}
      style={StyleSheet.absoluteFill}
    />
  );
}

export function useBottomTabOverflow() {
  return TAB_BAR_HEIGHT;
}
