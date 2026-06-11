'use client'
import Octicons from '@expo/vector-icons/Octicons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

const TipsCard = () => {
    const guidelines = [
        "Each Schedule Lasts about 3 Months",
        "Complete all days to unlock the next Schedule",
        "Maintain proper form over maximum weight",
        "Track progress with weekly measurements"
    ];

    return (
        <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors={['rgba(255, 172, 51, 0.05)', 'rgba(255, 255, 255, 0.01)']}
            style={styles.container}
        >
            {/* Header Layout Setup */}
            <View style={styles.headingContainer}>
                <View style={styles.iconContainer}>
                    <Octicons name="light-bulb" size={16} color="#ffb03a" />
                </View>
                <View style={styles.tipsHeading}>
                    <Text style={styles.tipsHeadingText}>Guidelines</Text>
                </View>
            </View>

            {/* Content Core Node */}
            <View style={styles.contentsContainer}>
                {guidelines.map((item, index) => (
                    <View key={index} style={styles.bulletItemRow}>
                        <Text style={styles.bulletMarker}>•</Text>
                        <Text style={styles.contentText}>
                            {item}
                        </Text>
                    </View>
                ))}
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 32,
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 176, 58, 0.15)', // Premium specular amber glass edge
        
    },
    headingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 99,
        height: 36,
        width: 36,
        backgroundColor: 'rgba(255, 176, 58, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255, 176, 58, 0.2)',
    },
    tipsHeading: {
        marginLeft: 12,
        justifyContent: 'center',
    },
    tipsHeadingText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#ffb03a',
        letterSpacing: -0.2,
    },
    contentsContainer: {
        gap: 8,
        paddingLeft: 4,
    },
    bulletItemRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    bulletMarker: {
        fontSize: 14,
        fontWeight: '700',
        color: '#ffb03a',
        marginRight: 8,
        width: 8,
    },
    contentText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#B0B5B3',
        flex: 1,
        lineHeight: 18,
    }
});

export default TipsCard;