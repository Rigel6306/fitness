
import { Colors } from "@/constants/Colors";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
const {textPimary,textSecondary} = Colors
const WorkoutCalendar = ({ completedDays = [2, 3, 4, 7, 8], upcomingDays = [9, 10, 11, 12, 13, 14] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState([]);
  
  // Get the start of the current week (Sunday)
  const getStartOfWeek = (date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day;
    return new Date(start.setDate(diff));
  };

  // Generate a week of dates
  const generateWeek = () => {
    const startDate = getStartOfWeek(currentDate);
    const week = [];
    
    for (let i = 0; i < 14; i++) { // Show 14 days (2 weeks)
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dayNumber = date.getDate();
      const isToday = date.toDateString() === new Date().toDateString();
      const isCompleted = completedDays.includes(i + 1);
      const isUpcoming = upcomingDays.includes(i + 1);
      const isWorkoutDay = isCompleted || isUpcoming;
      
      week.push({
        date,
        dayNumber,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        isToday,
        isCompleted,
        isUpcoming,
        isWorkoutDay,
        isPast: i < 7, // First 7 days are past/current week
      });
    }
    
    setCurrentWeek(week);
  };

  // Navigate to previous week
  const goToPreviousWeek = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() - 7);
      return newDate;
    });
  };

  // Navigate to next week
  const goToNextWeek = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + 7);
      return newDate;
    });
  };

  useEffect(() => {
    generateWeek();
  }, [currentDate]);

  const getDayStyle = (day) => {
    if (day.isToday) {
      return styles.calendarDayToday;
    }
    if (day.isCompleted) {
      return styles.calendarDayCompleted;
    }
    if (day.isUpcoming) {
      return styles.calendarDayUpcoming;
    }
    return styles.calendarDayDefault;
  };

  const getDayTextStyle = (day) => {
    if (day.isToday || day.isCompleted || day.isUpcoming) {
      return styles.calendarDayTextActive;
    }
    if (!day.isPast) {
      return styles.calendarDayTextFuture;
    }
    return styles.calendarDayTextInactive;
  };

  return (
    <View style={styles.calendarContainer}>
      {/* Calendar Header */}
      <View style={styles.calendarHeader}>
        <Pressable onPress={goToPreviousWeek} style={styles.calendarNavButton}>
          <Ionicons name="chevron-back" size={24} color={textPimary} />
        </Pressable>
        
        <View style={styles.calendarTitleContainer}>
          <MaterialIcons name="calendar-month" size={20} color={textPimary} />
          <Text style={styles.calendarTitle}>Workout Calendar</Text>
        </View>
        
        <Pressable onPress={goToNextWeek} style={styles.calendarNavButton}>
          <Ionicons name="chevron-forward" size={24} color={textPimary} />
        </Pressable>
      </View>

      {/* Calendar Legend */}
      <View style={styles.calendarLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.legendDotCompleted]} />
          <Text style={styles.legendText}>Completed</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.legendDotUpcoming]} />
          <Text style={styles.legendText}>Upcoming</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.legendDotToday]} />
          <Text style={styles.legendText}>Today</Text>
        </View>
      </View>

      {/* Calendar Days Grid */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.calendarScrollView}
      >
        <View style={styles.calendarDaysContainer}>
          {currentWeek.map((day, index) => (
            <View key={index} style={styles.calendarDayWrapper}>
              <Text style={styles.calendarDayName}>{day.dayName}</Text>
              <Pressable 
                style={({ pressed }) => [
                  styles.calendarDay,
                  getDayStyle(day),
                  pressed && styles.calendarDayPressed
                ]}
              >
                <Text style={[styles.calendarDayNumber, getDayTextStyle(day)]}>
                  {day.dayNumber}
                </Text>
                {day.isWorkoutDay && (
                  <View style={styles.workoutIndicator}>
                    <FontAwesome6 
                      name="dumbbell" 
                      size={10} 
                      color={day.isCompleted ? '#4CAF50' : day.isUpcoming ? '#FF9800' : '#fff'} 
                    />
                  </View>
                )}
              </Pressable>
              {day.isToday && <Text style={styles.todayLabel}>Today</Text>}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Week Separator */}
      <View style={styles.weekSeparatorContainer}>
        <View style={styles.weekSeparatorLine} />
        <Text style={styles.weekSeparatorText}>Current Week →</Text>
        <View style={styles.weekSeparatorLine} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
     calendarSection: {
    margin: 10,
    marginTop: 20,
  },
  calendarContainer: {
    backgroundColor: 'rgba(27, 34, 32, 0.8)',
    borderRadius: 20,
    padding: 15,
    marginBottom: 10,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  calendarNavButton: {
    padding: 5,
  },
  calendarTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: textPimary,
  },
  calendarLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    paddingVertical: 10,
    backgroundColor: 'rgba(45, 50, 49, 0.5)',
    borderRadius: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendDotCompleted: {
    backgroundColor: '#4CAF50',
  },
  legendDotUpcoming: {
    backgroundColor: '#FF9800',
  },
  legendDotToday: {
    backgroundColor: '#2196F3',
  },
  legendText: {
    color: textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  calendarScrollView: {
    marginBottom: 10,
  },
  calendarDaysContainer: {
    flexDirection: 'row',
    paddingHorizontal: 5,
  },
  calendarDayWrapper: {
    alignItems: 'center',
    marginHorizontal: 8,
    minWidth: 50,
  },
  calendarDayName: {
    color: textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 5,
  },
  calendarDay: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  calendarDayDefault: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  calendarDayToday: {
    backgroundColor: '#2196F3',
  },
  calendarDayCompleted: {
    backgroundColor: '#4CAF50',
  },
  calendarDayUpcoming: {
    backgroundColor: '#FF9800',
  },
  calendarDayPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  calendarDayNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  calendarDayTextActive: {
    color: '#FFFFFF',
  },
  calendarDayTextInactive: {
    color: textSecondary,
  },
  calendarDayTextFuture: {
    color: textPimary,
  },
  workoutIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayLabel: {
    marginTop: 4,
    fontSize: 10,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  weekSeparatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  weekSeparatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  weekSeparatorText: {
    marginHorizontal: 10,
    fontSize: 12,
    color: textSecondary,
    fontWeight: '600',
  },
})