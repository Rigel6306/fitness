
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { interpolate, SharedValue, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
const { width, height } = Dimensions.get('screen');

const bckImages = [
    require('../assets/images/cardsImg/card9.jpg'),
    require('../assets/images/cardsImg/card10.jpg'),
    require('../assets/images/cardsImg/card11.jpg'),
    require('../assets/images/cardsImg/card12.jpg'),
    require('../assets/images/cardsImg/card13.jpg'),
]
const _imgWidth = width * 0.9
const _imgHeight = width * 0.4
const Photo = ({ item, index, scrollX }: { item: any, index: number, scrollX: SharedValue<number> }) => {

    const styleZ = useAnimatedStyle(() => {
        return {
            transform: [{
                scale: interpolate(scrollX.value,
                    [index - 1, index, index + 1],
                    [1.6, 1, 1.6]
                )
            },
            {
                rotate: `${interpolate(scrollX.value,
                    [index - 1, index, index + 1],
                    [10, 0, -10]
                )}deg`
            }


            ]
        }
    })

    return (
        <View style={{
            borderRadius: 10,
            width: _imgWidth,

            overflow: 'hidden',
        }}>
            <Animated.Image
                source={item}
                style={[{ 
                    flex: 1,
                    overflow:'hidden'

                }, styleZ]}

            />

        </View>
    )

}


const Carousel = () => {
    const scrollX = useSharedValue(0)
    const onScroll = useAnimatedScrollHandler((e) => {
        scrollX.value = e.contentOffset.x / (_imgWidth + 10)
    })
    return (
        <View style={styles.container}>
            <Animated.FlatList
                data={bckImages}
                horizontal
                snapToInterval={_imgWidth + 10}
                decelerationRate={"fast"}
                contentContainerStyle={{
                    gap: 10,
                    borderRadius: 10,
                    overflow:'hidden'

                }}
                renderItem={({ item, index }) => {
                    return <Photo item={item} index={index} scrollX={scrollX} />
                }}
                onScroll={onScroll}
                scrollEventThrottle={1000 / 60}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        maxHeight: _imgHeight + 10,
        margin: 10,
        borderRadius: 10,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',

    }
})

export default Carousel