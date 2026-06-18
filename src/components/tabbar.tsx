import { useEffect, useRef, useState } from 'react';
import { Dimensions, LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring } from 'react-native-reanimated';
import { useTabContext } from "../hooks/useContext";
import TabBarButton from './tabBarButton';

const { width } = Dimensions.get('screen');

const TabBar = ({ state, descriptors, navigation }: { state: any, descriptors: any, navigation: any }) => {
  const { isTabOpen } = useTabContext();
  const primaryColor = '#5718a4f7'; // Fluid violet accent
  const inactiveColor = 'rgba(255, 255, 255, 0.4)';

  const [dimentions, setDimentions] = useState({ height: 20, width: 100 });
  const buttonWidth = dimentions.width / 3;

  const onTabBarLayout = (e: LayoutChangeEvent) => {
    setDimentions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  };

  const tabPositionX = useSharedValue(0);
  
  // Dedicated liquid structural nodes
  const bubbleScaleX = useSharedValue(1);
  const bubbleScaleY = useSharedValue(1);
  const prevIndexRef = useRef(state.index);

  // ✅ EXACT PREVIOUS PHYSICS RESTORED
  useEffect(() => {
    const targetX = buttonWidth * state.index + 2;

    // Your exact spring parameters that give it that loose, springy travel physics
    tabPositionX.value = withSpring(targetX, {
      damping: 5,
      mass: 1,
      stiffness: 80,
      overshootClamping: false,
    });

    // Clean, structured liquid distortion that doesn't ruin the bubble shape
    if (state.index !== prevIndexRef.current) {
      const travelDistance = Math.abs(state.index - prevIndexRef.current);
      
      // Subtly scale up horizontal stretch based on distance without distorting boundaries
      const targetStretchX = 1 + travelDistance * 0.09;
      const targetSquashY = 1 - travelDistance * 0.04;

      // Stretch instantly when movement starts
      bubbleScaleX.value = targetStretchX;
      bubbleScaleY.value = targetSquashY;

      // Smoothly snap back to a perfect container shape right as the position spring finishes
      bubbleScaleX.value = withDelay(20, withSpring(1, { damping: 32, stiffness: 350 }));
      bubbleScaleY.value = withDelay(20, withSpring(1, { damping:32, stiffness: 950 }));
    }

    prevIndexRef.current = state.index;
  }, [state.index, buttonWidth]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: tabPositionX.value },
        { scaleX: bubbleScaleX.value },
        { scaleY: bubbleScaleY.value }
      ],
    };
  });

  return (
    isTabOpen && (
      <View onLayout={onTabBarLayout} style={Style.container}>
        {/* PREMIUM LIQUID GLASS BUBBLE CONTAINER */}
        <Animated.View
          style={[
            animatedStyle,
            {
              position: 'absolute',
              backgroundColor: 'rgba(255, 255, 255, 0.05)', // Sleek glass tint
              borderRadius: 12,
              margin: 10,
              height: dimentions.height - 20,
              width: buttonWidth - 25,
              borderWidth: 1,
              // Light catching frosted perimeter ridges
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

        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          if (
            [
              '_sitemap',
              '+not-found',
              'articles',
              'MainWorkoutSchedule',
              'ChallengeDetails',
              'MealPlan',
              'signup',
            ].includes(route.name)
          )
            return null;

          const onPress = () => {
            // Your exact click override properties
            tabPositionX.value = withSpring(buttonWidth * index + 2, {
              damping: 45,
              mass: 1,
              stiffness: 450,
              overshootClamping: false,
            });

            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TabBarButton
              key={route.name}
              onPress={onPress}
              onLongPress={onLongPress}
              isFoucused={isFocused}
              routeName={route.name}
              color={isFocused ? primaryColor : inactiveColor}
              label={label}
            />
          );
        })}
      </View>
    )
  );
};

const Style = StyleSheet.create({
  container: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 2, // Floating glass HUD positioning profile
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    backgroundColor: 'rgb(0, 0, 0)', // Dark smoked glass base chassis
    borderTopWidth:0,
    borderWidth: 1.5,
    borderColor: 'rgba(122, 22, 215, 0.2)', // Fine crisp perimeter edge track
    paddingVertical: 15,
    borderRadius: 16,
    width: width - 20,
    overflow: 'hidden',
    shadowColor: 'rgb(122, 22, 215)',
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 16,
    shadowOpacity: 0.5,
    elevation: 4,
  },
});

export default TabBar;