import { useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring } from 'react-native-reanimated';
import { useTabContext } from "../hooks/useContext";
import TabBarButton from './tabBarButton';

const { width: SCREEN_WIDTH } = Dimensions.get('screen');
const TAB_BAR_WIDTH = SCREEN_WIDTH - 20;

const TabBar = ({ state, descriptors, navigation }: { state: any, descriptors: any, navigation: any }) => {
  const { isTabOpen } = useTabContext();
  const primaryColor = '#5718a4f7'; // Fluid violet accent
  const inactiveColor = 'rgba(255, 255, 255, 0.4)';

  const hiddenRoutes = [
    '_sitemap',
    '+not-found',
    'articles',
    'MainWorkoutSchedule',
    'ChallengeDetails',
    'MealPlan',
    'signup',
  ];
  
  const visibleRoutes = state.routes.filter((route: any) => !hiddenRoutes.includes(route.name));
  const totalTabs = visibleRoutes.length || 3;
  const buttonWidth = TAB_BAR_WIDTH / totalTabs;

  const currentRouteKey = state.routes[state.index].key;
  const visibleIndex = visibleRoutes.findIndex((r: any) => r.key === currentRouteKey);
  const normalizedIndex = visibleIndex !== -1 ? visibleIndex : 0;

  const tabPositionX = useSharedValue(0);
  const bubbleScaleX = useSharedValue(1);
  const bubbleScaleY = useSharedValue(1);
  const prevIndexRef = useRef(normalizedIndex);

  // ✅ YOUR EXACT PHYSICS AND DISTORTION COMPLETELY RESTORED
  useEffect(() => {
    const targetX = buttonWidth * normalizedIndex + 2;

    // Original loose, springy travel physics
    tabPositionX.value = withSpring(targetX, {
      damping: 10,
      mass: 1,
      stiffness: 80,
      overshootClamping: false,
    });

    if (normalizedIndex !== prevIndexRef.current) {
      const travelDistance = Math.abs(normalizedIndex - prevIndexRef.current);
      
      const targetStretchX = 1 + travelDistance * 0.09;
      const targetSquashY = 1 - travelDistance * 0.04;

      bubbleScaleX.value = targetStretchX;
      bubbleScaleY.value = targetSquashY;

      // Original snappy recovery timings
      bubbleScaleX.value = withDelay(20, withSpring(1, { damping: 15, stiffness: 750 }));
      bubbleScaleY.value = withDelay(20, withSpring(1, { damping: 15, stiffness: 950 }));
    }

    prevIndexRef.current = normalizedIndex;
  }, [normalizedIndex, buttonWidth]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: tabPositionX.value },
        { scaleX: bubbleScaleX.value },
        { scaleY: bubbleScaleY.value }
      ],
    };
  });

  if (!isTabOpen) return null;

  return (
    <View style={Style.container}>
      {/* PREMIUM LIQUID GLASS BUBBLE CONTAINER */}
      <Animated.View
        style={[
          animatedStyle,
          {
            position: 'absolute',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 12,
            margin: 10,
            left: 2, // Minor alignment nudge
            height: 58, // Matches original container inner math (70 height - 20 padding)
            width: buttonWidth - 35, // Your original layout gap width
            borderWidth: 1,
            borderTopColor: 'rgba(255, 255, 255, 0.35)',
            borderLeftColor: 'rgba(255, 255, 255, 0.15)',
            borderRightColor: 'rgba(255, 255, 255, 0.15)',
            borderBottomColor: 'rgba(255, 255, 255, 0.05)',
            shadowColor: '#ffffff',
            shadowOffset: { width: 0, height: 14 },
            shadowRadius: 8,
            shadowOpacity: 0.04,
          },
        ]}
      />

      {visibleRoutes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name;
        const isFocused = normalizedIndex === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <TabBarButton
            key={route.name}
            onPress={onPress}
            onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
            isFocused={isFocused}
            routeName={route.name}
            color={isFocused ? primaryColor : inactiveColor}
            label={label}
          />
        );
      })}
    </View>
  );
};

const Style = StyleSheet.create({
  container: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgb(0, 0, 0)',
    borderWidth: 1,
    borderTopWidth:0,
    borderColor: 'rgba(122, 22, 215, 0.2)',
    height: 75, // Explicit layout height back to original
    borderRadius: 16,
    width: TAB_BAR_WIDTH,
    overflow: 'hidden',
    shadowColor: 'rgb(122, 22, 215)',
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 16,
    shadowOpacity: 0.5,
    elevation: 4,
  },
});

export default TabBar;