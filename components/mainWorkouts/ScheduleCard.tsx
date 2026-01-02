
import { View, Text, Pressable,StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Colors } from '@/constants/Colors'
import { FontAwesome6, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
const {textPimary,textSecondary}= Colors
const ScheduleCard = ({ title, frequency, duration, index, dayCount, workoutsCount }) => {
  return (
    <Pressable
      style={({ pressed }) => [pressed && { opacity: 0.5 }]}
    >
      <LinearGradient
        style={styles.scheduleCardContainer}
        colors={['#2d3231de', '#1b222091']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View >
          <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 40, width: 40, backgroundColor: '#ffffff3a', borderRadius: 100 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{index + 1}</Text>
          </View>
        </View>
        <View style={{ display: 'flex', marginLeft: 10, }}>
          <Text style={{ fontSize: 15, color: textPimary, marginBottom: 2, marginLeft: 2 }}>{title}</Text>
          <Text style={{ fontSize: 13, color: textSecondary, marginLeft: 3 }}>{frequency}</Text>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 20 }}>
            <View style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center' }}>
              <MaterialIcons name="calendar-month" size={24} color="rgba(73, 193, 143, 1)" />
              <Text style={{ color: textSecondary }}>{duration} Months</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center' }} >
              <MaterialCommunityIcons name="sine-wave" size={24} color="rgba(103, 47, 201, 0.88)" />
              <Text style={{ color: textSecondary }}>{dayCount} Day</Text>
            </View>
          </View>
        </View>
        <View style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <FontAwesome6 name="dumbbell" size={20} color="rgba(141, 187, 47, 0.72)" />
          <Text style={{ fontSize: 40, fontWeight: 'bold', color: '#fff3f398' }}>{workoutsCount}</Text>
          <Text style={{ fontSize: 13, color: '#ffffff3e', fontWeight: 'bold' }}>Workouts</Text>
        </View>
      </LinearGradient>
    </Pressable>
  )
}

const styles = StyleSheet.create({
      scheduleCardContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
    alignItems: 'center',
    borderRadius: 20,
    height: 130,
    padding: 10

  },
})

export default ScheduleCard
