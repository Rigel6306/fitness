'use client'
import { Colors } from '@/constants/Colors'
import { FontAwesome6, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Pressable, StyleSheet, Text, View } from 'react-native'

const { textPimary, textSecondary } = Colors

const ScheduleCard = ({ title, frequency, duration, index, dayCount, workoutsCount }) => {
  return (
    <Pressable style={({ pressed }) => [pressed && styles.pressedCard]}>
      <LinearGradient
        style={styles.scheduleCardContainer}
        colors={['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.01)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Left Side: Dynamic Index Bubble */}
        <View style={styles.indexBadgeContainer}>
          <View style={styles.indexBadge}>
            <Text style={styles.indexText}>{index + 1}</Text>
          </View>
        </View>

        {/* Center Side: Meta Header Info & Sub-Badges */}
        <View style={styles.metaDataContainer}>
          <Text style={styles.titleText} numberOfLines={1}>{title}</Text>
          <Text style={styles.frequencyText}>{frequency}</Text>
          
          <View style={styles.metricsRow}>
            <View style={styles.metricBadge}>
              <MaterialIcons name="calendar-month" size={16} color="#4cddbb" />
              <Text style={styles.metricText}>{duration} Months</Text>
            </View>
            <View style={styles.metricBadge}>
              <MaterialCommunityIcons name="sine-wave" size={16} color="#9d62ff" />
              <Text style={styles.metricText}>{dayCount} Days</Text>
            </View>
          </View>
        </View>

        {/* Right Side: Total Combined Workout Count Specular View */}
        <View style={styles.workoutCountContainer}>
          <FontAwesome6 name="dumbbell" size={14} color="#4cddbb" style={styles.dumbbellIcon} />
          <Text style={styles.workoutsCountText}>{workoutsCount}</Text>
          <Text style={styles.workoutsLabelText}>Workouts</Text>
        </View>

      </LinearGradient>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  pressedCard: {
    opacity: 0.8,
    transform: [{ scale: 0.99 }],
  },
  scheduleCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 16,
    minHeight: 125,
    width: '100%',
  },
  // Left Layout
  indexBadgeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  indexBadge: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 38,
    width: 38,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 99,
  },
  indexText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Center Layout
  metaDataContainer: {
    flex: 2,
    marginLeft: 14,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  frequencyText: {
    fontSize: 13,
    color: '#8E9492',
    fontWeight: '500',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  metricBadge: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  metricText: {
    color: '#B0B5B3',
    fontSize: 12,
    fontWeight: '600',
  },
  // Right Layout
  workoutCountContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.06)',
    paddingLeft: 10,
  },
  dumbbellIcon: {
    marginBottom: -2,
    opacity: 0.9,
  },
  workoutsCountText: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  workoutsLabelText: {
    fontSize: 11,
    color: '#8E9492',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
})

export default ScheduleCard;