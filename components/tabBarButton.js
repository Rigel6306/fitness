import { Pressable } from "react-native";
import { icons } from "../constants/icon";
import {StyleSheet } from "react-native";
import { interpolate, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import Animated from "react-native-reanimated";
import { useEffect } from "react";
const TabBarButton = ({
  onPress,
  onLongPress,
  isFoucused,
  routeName,
  color,
  label,
}) => {
    const scale = useSharedValue(0);
    useEffect(()=>{
        scale.value = withSpring(typeof isFoucused === 'boolean' ? (isFoucused?1:0):isFoucused,{duration:350})
    },[scale,isFoucused])
    const animatedTextStyle = useAnimatedStyle(()=>{
        const opacity = interpolate(scale.value,[0,1],[1,0])
        return {
            opacity
        }
    })
    const animatedIconStyle = useAnimatedStyle(()=>{
        const scaleValue = interpolate(scale.value, [0,1],[1,1.3])
        const top = interpolate(scale.value, [0,1],[0,9])
        return{
            transform:[{
                scale:scaleValue
            }],
            top
          
        }
    })
   return (
    <Pressable style={styles.item} onPress={onPress} onLongPress={onLongPress}>
        <Animated.View style={animatedIconStyle}>
        {icons[routeName]({ color })}
        </Animated.View>
        <Animated.Text style={[{ color },animatedTextStyle]}>{label}</Animated.Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  item: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TabBarButton;
