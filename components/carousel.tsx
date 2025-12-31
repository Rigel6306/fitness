import { Colors } from '@/constants/Colors';
import challenges from '@/data/data';
import React from 'react';
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import CustomLink from './customLink';
const {textPimary,textSecondary} = Colors

const { width } = Dimensions.get('screen');
// Subtract 10px on each side so there's a 10px gap to the screen edges
const _imgWidth = width - 20;
const _imgHeight = _imgWidth * 0.4;

const Photo = ({
  item,
  index,
  scrollX
}: {
  item: any;
  index: number;
  scrollX: SharedValue<number>;
}) => {
  const styleZ = useAnimatedStyle(() => ({
    transform: [
      {
        // scale card up/down as it comes into center
        scale: interpolate(
          scrollX.value,
          [index - 1, index, index + 1],
          [0.95, 1, 0.95]
        )
      },
      {
        // slight rotate
        rotate: `${interpolate(
          scrollX.value,
          [index - 1, index, index + 1],
          [1, 0, -0]
        )}deg`
      }
    ]
  }));

  const levelColor = {
    Beginner:'rgba(44, 101, 157, 0.64)',
    Intermediate:'rgba(144, 151, 50, 1)',
    Advanced:'rgba(145, 38, 49, 1)'
  }
  
  return (
    <CustomLink href={'ChallengeDetails'} data={item}>
      <Animated.View style={[styles.card, styleZ]}>
        <ImageBackground
          source={item.bckImg}
          resizeMode="cover"
          style={styles.imageBg}
        >
          <View style={styles.overlay} />

          <View style={styles.textContainer}>
            <View style={styles.cardIconContainer}>
              <Text style={[styles.cardIconText,{
                color:levelColor[item.level]
              }]}> {item.level} </Text>
               
            </View>

            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.discription}</Text>
          </View>
        </ImageBackground>
      </Animated.View>
    </CustomLink>
  );
};

const Carousel = () => {
  const scrollX = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    // Divide by screen width since snap interval = screen width
    scrollX.value = e.contentOffset.x / width;
  });

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={challenges}
        horizontal
        // snap every full screen width
        snapToInterval={width - 20}
        snapToAlignment="start"
        decelerationRate="fast"
        bounces={false}
        showsHorizontalScrollIndicator={false}
        // gives each card a 10px inset on left/right
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <Photo item={item} index={index} scrollX={scrollX} />
        )}
        onScroll={onScroll}
        scrollEventThrottle={16}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: _imgHeight + 20,
    justifyContent: 'center',
    alignItems: 'center'
  },

  listContent: {
    paddingHorizontal: 10
  },

  cardWrapper: {
    // exact width for centering
    width: _imgWidth
  },

  card: {
    width: _imgWidth,
    height: _imgHeight,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 6
  },

  imageBg: {
    flex: 1,
    justifyContent: 'flex-end'
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  },

  textContainer: {
    width: '100%',
    padding: 16,
   
  },
  cardIconContainer: {
  
   maxWidth:'30%',
   padding:5,
   borderRadius:21,
   textAlign:'center',
  backgroundColor:'rgba(184, 184, 184, 0.82)'
  },
  cardIconText:{
    textAlign:'center',
    fontWeight:'bold',
 
  },
  title: {
    fontFamily: 'bebas',
    fontWeight: 'bold',
    fontSize: 20,
    color: textPimary,
    marginBottom: 6,

  },

  subtitle: {
    
    fontSize: 12,
    lineHeight: 18,
    fontWeight: 'bold',
    color: textSecondary
  }
});

export default Carousel;
