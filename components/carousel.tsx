
import React, { useRef, useState,useEffect } from 'react';
import { Dimensions, ImageBackground, StyleSheet, Text, View } from 'react-native';
import Animated, { interpolate, SharedValue, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';


const { width, height } = Dimensions.get('screen');




const challenges = [
    {
        bckImg: require('../assets/images/cardsImg/card9.jpg'),
        title: "Mission Slimpossible",
        schedule: [
            {
                day: 'Day One',
                workouts: ['10 burpees', '10 Crunches', '12 Situps', '1 Min Plank', '10 mins endurence Walk']
            },
            {
                day: 'Day Two',
                workouts: ['10 burpees', '10 Crunches', '12 Situps', '1 Min Plank', '10 mins endurence Walk']
            },
            {
                day: 'Day Three',
                workouts: ['10 burpees', '10 Crunches', '12 Situps', '1 Min Plank', '10 mins endurence Walk']
            },
            {
                day: 'Day Four',
                workouts: ['10 burpees', '10 Crunches', '12 Situps', '1 Min Plank', '10 mins endurence Walk']
            }

        ]

    },
    {
        bckImg: require('../assets/images/cardsImg/card10.jpg'),
        title: "Endurence",
        schedule: [
            {
                day: 'Day One',
                workouts: ['10 burpees', '10 Crunches', '12 Situps', '1 Min Plank', '10 mins endurence Walk']
            },
            {
                day: 'Day Two',
                workouts: ['10 burpees', '10 Crunches', '12 Situps', '1 Min Plank', '10 mins endurence Walk']
            },
            {
                day: 'Day Three',
                workouts: ['10 burpees', '10 Crunches', '12 Situps', '1 Min Plank', '10 mins endurence Walk']
            },
            {
                day: 'Day Four',
                workouts: ['10 burpees', '10 Crunches', '12 Situps', '1 Min Plank', '10 mins endurence Walk']
            }

        ]

    },
    {
        bckImg: require('../assets/images/cardsImg/card11.jpg'),
        title: "Fit and Gain",
        schedule: [
            {
                day: 'Day One',
                workouts: ['10 burpees', '10 Crunches', '12 Situps', '1 Min Plank', '10 mins endurence Walk']
            },
            {
                day: 'Day Two',
                workouts: ['10 burpees', '10 Crunches', '12 Situps', '1 Min Plank', '10 mins endurence Walk']
            },
            {
                day: 'Day Three',
                workouts: ['10 burpees', '10 Crunches', '12 Situps', '1 Min Plank', '10 mins endurence Walk']
            },
            {
                day: 'Day Four',
                workouts: ['10 burpees', '10 Crunches', '12 Situps', '1 Min Plank', '10 mins endurence Walk']
            }

        ]

    },
    {
        bckImg: require('../assets/images/cardsImg/card12.jpg'),
        title: "Worrior",
        schedule: [
            {
                day: 'Day One',
                workouts: ['10 burpees', '10 Crunches', '12 Situps', '1 Min Plank', '10 mins endurence Walk']
            },
            {
                day: 'Day Two',
                workouts: ['10 burpees', '10 Crunches', '12 Situps', '1 Min Plank', '10 mins endurence Walk']
            },
            {
                day: 'Day Three',
                workouts: ['10 burpees', '10 Crunches', '12 Situps', '1 Min Plank', '10 mins endurence Walk']
            },
            {
                day: 'Day Four',
                workouts: ['10 burpees', '10 Crunches', '12 Situps', '1 Min Plank', '10 mins endurence Walk']
            }

        ]

    },
    
]

const bckImages = [
    require('../assets/images/cardsImg/card9.jpg'),
    require('../assets/images/cardsImg/card10.jpg'),
    require('../assets/images/cardsImg/card11.jpg'),
    require('../assets/images/cardsImg/card12.jpg'),
    require('../assets/images/cardsImg/card13.jpg'),
]
const _imgWidth = width * 0.8
const _imgHeight = width * 0.4
const Photo = ({ item, index, scrollX }: { item: any, index: number, scrollX: SharedValue<number> }) => {

    const styleZ = useAnimatedStyle(() => {
        return {
            transform: [{
                scale: interpolate(scrollX.value,
                    [index - 1, index, index + 1],
                    [2, 1.5, 2]
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
            borderRadius: 15,
            width: _imgWidth + 25,

            overflow: 'hidden',
        }}>
            <Animated.View
                style={[{
                    borderRadius: 15,
                    width: _imgWidth + 25,
                    height: _imgHeight,
                    overflow: 'hidden',
                    elevation: 15
                }, styleZ]}
            >
                <ImageBackground
                    source={item.bckImg}
                    resizeMode="contain"
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 15,

                    }}
                >
                    <Text style={{
                        fontFamily:'bebas',
                        fontWeight:'bold',
                        fontSize:20,
                        color:'rgba(0, 0, 0, 1)'
                    }}> {item.title} </Text>


                </ImageBackground>


            </Animated.View>

        </View>
    )

}


const Carousel = () => {
    const scrollRef = useRef(null)

    const [currentIndex, setCurrentIndex] = useState(0);
        useEffect(() => {
      const interval = setInterval(() => {
        const nextIndex = (currentIndex + 1) % bckImages.length;
        setCurrentIndex(nextIndex);

        if (scrollRef.current) {
          scrollRef.current.scrollToOffset({
            offset: nextIndex * (_imgWidth + 35),
            animated: true,
          });
        }
      }, 3000); 

      return () => clearInterval(interval);
    }, [currentIndex]);
    const scrollX = useSharedValue(0)
    const onScroll = useAnimatedScrollHandler((e) => {
        scrollX.value = e.contentOffset.x / (_imgWidth + 10)
    })
    return (
        <View style={styles.container}>
            <Animated.FlatList
                data={challenges}
                horizontal
                snapToInterval={_imgWidth + 35}
                decelerationRate={"fast"}
                ref={scrollRef}

                contentContainerStyle={{

                    gap: 10,
                    borderRadius: 15,
                    overflow: 'hidden'

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
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',

    }
})

export default Carousel