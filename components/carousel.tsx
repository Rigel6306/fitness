import challenges from '@/data/data';
import React from 'react';
import CustomLink from './customLink';

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
          [0.95, 1,0.95]
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

  return (
    <CustomLink href={'ChallengeDetails' } data={item}>
      <Animated.View style={[styles.card, styleZ]}>
        <ImageBackground
          source={item.bckImg}
          resizeMode="cover"
          style={styles.imageBg}
        >
          <View style={styles.overlay} />
          <View style={styles.textContainer}>
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
        snapToInterval={width-20}
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15
  },

  title: {
    fontFamily: 'bebas',
    fontWeight: '700',
    fontSize: 22,
    color: '#fff',
    marginBottom: 6
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 18,
    color: '#fff'
  }
});

export default Carousel;
