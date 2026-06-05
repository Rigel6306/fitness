import { useEffect, useState } from 'react';
import { Dimensions, LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTabContext } from "../hooks/useContext";
import TabBarButton from './tabBarButton';

const { width } = Dimensions.get('screen');

const TabBar = ({ state, descriptors, navigation }: { state: any, descriptors: any, navigation: any }) => {
  const { isTabOpen } = useTabContext();
  const primaryColor = 'rgba(16, 17, 16, 0.96)';
  const inactiveColor = '#606565';

  const [dimentions, setDimentions] = useState({ height: 20, width: 100 });
  const buttonWidth = dimentions.width / 3;

  const onTabBarLayout = (e: LayoutChangeEvent) => {
    setDimentions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  };

  const tabPositionX = useSharedValue(0);

  // ✅ Fix: update indicator position when active tab changes
  useEffect(() => {
    tabPositionX.value = withSpring(buttonWidth * state.index + 2, {
      damping: 15,
      mass: 1,
      stiffness: 180,
      overshootClamping: false,
    });
  }, [state.index, buttonWidth]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    };
  });

  return (
    isTabOpen && (
      <View onLayout={onTabBarLayout} style={Style.container}>
        <Animated.View
          style={[
            animatedStyle,
            {
              position: 'absolute',
              backgroundColor: '#cccad1',
              borderRadius: 15,
              margin: 10,
              height: dimentions.height - 20,
              width: buttonWidth - 25,
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

          // Skip hidden routes
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
            tabPositionX.value = withSpring(buttonWidth * index + 2, {
              damping: 25,
              mass: 1,
              stiffness: 180,
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
    bottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    backgroundColor: '#131313',
    paddingVertical: 15,
    borderRadius: 20,
    shadowColor: 'green',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
    width: width - 20,
  },
});

export default TabBar;
