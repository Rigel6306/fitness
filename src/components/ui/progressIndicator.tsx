import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const { textSecondary } = Colors;

interface ProgressIndicatorProps {
    title: string;
    mainText: string;
    subText: string;
    icon: any;
    value: number;
    actionColor: string;
    gradientArray: [string, string];
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
    title,
    mainText,
    subText,
    icon,
    value,
    actionColor,
    gradientArray
}) => {
    // Ensure math boundary constraints stay clean between 0% and 100%
    const clampValue = Math.min(Math.max(value, 0), 100);

    return (
        <LinearGradient
            style={styles.container}
            // Safe array fallback check prevents native layout engine thread exceptions
            colors={gradientArray && gradientArray.length >= 2 ? gradientArray : ['rgba(0,0,0,0)', 'rgba(0,0,0,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
        >
            {/* HEADER SECTION */}
            <View style={styles.progressHeading}>
                {/* Sleek structural square glass pod for the icon */}
                <View style={[styles.progressHeadImg, { backgroundColor: `${actionColor}12`, borderColor: `${actionColor}25` }]}>
                    <Ionicons name={icon} size={18} color={actionColor} />
                </View>

                <View>
                    <Text style={styles.headingText}>{title.toUpperCase()}</Text>
                </View>
            </View>

            {/* DYNAMIC LIQUID SEPARATOR LINE */}
            {/* Reflects the matching active core element color in space */}
            <LinearGradient
                style={styles.gradientSeperator}
                colors={['rgba(255, 255, 255, 0)', `${actionColor}90`, 'rgba(255, 255, 255, 0)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            />

            {/* CORE DATA TRADING METRICS */}
            <View style={styles.mainContent}>
                <Text style={styles.mainContentText}>{mainText}</Text>
                <Text style={styles.mainContentSubText}>{subText}</Text>
            </View>

            {/* GLOWING DATA TELEMETRY PROGRESS BAR TRACK */}
            <View style={styles.progressBarContainer}>
                <View style={styles.progressbar}>
                    <View
                        style={[
                            styles.progressTrack,
                            {
                                width: `${clampValue}%`,
                                backgroundColor: actionColor,
                                // Emits light profile signature out from behind the slider rim tracks
                                shadowColor: actionColor,
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: 0.6,
                                shadowRadius: 6,
                            }
                        ]}
                    />
                </View>
                <Text style={[styles.progressBarText, { color: actionColor }]}>{clampValue}%</Text>
            </View>

        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        borderRadius: 14, // Matches perfectly inside the parent component frame radius
    },
    progressHeading: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        marginBottom: 12,
    },
    headingText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1,
    },
    progressHeadImg: {
        width: 34,
        height: 34,
        borderRadius: 8, // Modern curved capsule square block style
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    mainContent: {
        marginTop: 12,
    },
    mainContentText: {
        fontFamily: 'Bebas',
        fontSize: 26,
        color: '#ffffff',
        letterSpacing: 0.5,
    },
    mainContentSubText: {
        fontSize: 11,
        fontWeight: '600',
        color: textSecondary,
        marginBottom: 14,
        marginTop: 1,
    },
    progressBarContainer: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        marginTop: 'auto', // Pushes structural telemetry bar cleanly to the bottom edge
    },
    gradientSeperator: {
        height: 1,
        width: '100%',
    },
    progressbar: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)', // Translucent under-track slider frame
        height: 5,
        borderRadius: 3,
        overflow: 'visible', // Enables glow effects to bleed out beautifully
    },
    progressTrack: {
        height: '100%',
        borderRadius: 3,
    },
    progressBarText: {
        fontSize: 12,
        fontFamily: 'Bebas',
        letterSpacing: 0.5,
        minWidth: 28,
        textAlign: 'right',
    }
});

export default ProgressIndicator;