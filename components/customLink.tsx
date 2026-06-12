
import { useNavigation } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';
const CustomLink = ({ href, data, children }) => {
    const navigator = useNavigation()
  const handlePress = () => {
 
    navigator.navigate(href , {data})
  };

  return (
      <Pressable onPress={handlePress}>
        {children}
      </Pressable>
  );
};

export default CustomLink;