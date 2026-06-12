

import Octicons from '@expo/vector-icons/Octicons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const TipsCard = () => {

    const guidelinse = [
        "Each Schedule Lasts about 3 Months",
        "Complete all days to unlock the next Schedule",
        "Maintain proper form over maximum weight",
        "Track progress with weekly mesurements"
    ]

    return (
        <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={['rgba(92, 93, 90, 0.58)', 'rgba(62, 64, 66, 0.52)']}
            style={styles.container}>

            <View style={styles.headingContainer}>
                <View style={styles.iconContainer}>
                    <Octicons name="light-bulb" size={20} color="#ca822bff" />
                </View>
                <View style={styles.tipsHeading}>
                    <Text style={styles.tipsHeadingText}>Guidelines</Text>
                </View>
            </View>

            <View style={styles.contentsContainer}>
                {
                    guidelinse.map((item, index) => (
                        <Text
                            style={styles.contentText}
                            key={index}>
                            • {item}
                        </Text>
                    ))
                }

            </View>

        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        height: 200,
        margin: 10,
        padding: 10,
        borderRadius: 20,
        marginBottom: 20,

    },
    headingContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    iconContainer: {
        margin: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        height: 50,
        width: 50,
        padding: 10,
        backgroundColor: 'rgba(185, 185, 133, 0.42)',
    },
    tipsHeading: {
        flex: 3,
        margin: 10,
        justifyContent: 'center',
        height: 50,
    },
    tipsHeadingText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#ca822bff'
    },
    contentsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        marginLeft: 20,
    },
    contentText:{
        fontSize:13,
        fontWeight:'bold',
        color:'#837575b5'

    }
})

export default TipsCard