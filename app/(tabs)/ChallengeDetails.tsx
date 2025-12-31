import ChallengeStartModal from '@/components/ChallengeStartModal';
import WorkoutSessionScreen from '@/components/WorkoutSessionScreen';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
const {background,cardBackground,cardBackgroundSecondary,textPimary,textSecondary,primaryBackground,secondaryBackground} = Colors

const { width, height } = Dimensions.get('window');


type RootStackParamList = {
  ChallengeDetails: { data: any };
};

const ChallengeDetails = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'ChallengeDetails'>>();
  const { data } = route.params;
  
const [selectedDay, setSelectedDay] = useState<any>(null);
const [showWorkoutSession, setShowWorkoutSession] = useState(false);
const [showChallengeStartModal, setShowChallengeStartModal] = useState(false);
  const scrollY = new Animated.Value(0);
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: [height * 0.35, 80],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const titleScale = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  const renderDifficultyBadge = (level: string) => {
    const colors = {
      Beginner: { bg: '#4CAF50', text: '#FFFFFF' },
      Intermediate: { bg: '#FF9800', text: '#FFFFFF' },
      Advanced: { bg: '#F44336', text: '#FFFFFF' },
    };

    const color = colors[level as keyof typeof colors] || colors.Beginner;

    return (
      <View style={[styles.difficultyBadge, { backgroundColor: color.bg }]}>
        <Text style={[styles.difficultyText, { color: color.text }]}>
          {level}
        </Text>
      </View>
    );
  };

  const renderDayCard = (schedule: any, index: number) => (
    <Animated.View 
      key={index}
      style={[
        styles.dayCard,
        {
          opacity: scrollY.interpolate({
            inputRange: [0, 300 + (index * 50)],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          }),
          transform: [
            {
              translateY: scrollY.interpolate({
                inputRange: [0, 300 + (index * 50)],
                outputRange: [50, 0],
                extrapolate: 'clamp',
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.dayCardHeader}>
        <View style={styles.dayNumber}>
          <Text style={styles.dayNumberText}>{index + 1}</Text>
        </View>
        <View style={styles.dayInfo}>
          <Text style={styles.dayTitle}>{schedule.day}</Text>
          <Text style={styles.dayFocus}>{schedule.focus}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </View>
      
      <View style={styles.workoutsContainer}>
        {schedule.workouts.map((workout: string, workoutIndex: number) => (
          <View key={workoutIndex} style={styles.workoutItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.workoutText}>{workout}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.dayCardFooter}>
        <View style={styles.timeTag}>
          <Ionicons name="time-outline" size={14} color="#666" />
          <Text style={styles.timeText}>45-60 min</Text>
        </View>
        <TouchableOpacity style={styles.startButton}  onPress={() => {
    setSelectedDay(schedule);
    setShowWorkoutSession(true);
  }}>
          <Text style={styles.startButtonText}>START</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
   
    <LinearGradient
      colors={['#00000037', '#000000f6', '#000000ff','#000000ff']} // Array of colors for the gradient
        start={{ x: 0, y: 0 }} 
        end={{ x: 1, y:1 }}
    style={styles.container}>
      
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.Image
          source={data.bckImg}
          style={[styles.headerImage, { opacity: headerOpacity }]}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.8)', 'transparent', 'rgba(0,0,0,0.2)']}
          style={StyleSheet.absoluteFill}
        />
        
        <BlurView intensity={80} style={styles.blurHeader} tint="dark">
          <Animated.Text 
            style={[
              styles.headerTitle, 
              { 
                fontSize: scrollY.interpolate({
                  inputRange: [0, 300],
                  outputRange: [32, 20],
                  extrapolate: 'clamp',
                }),
                transform: [{ scale: titleScale }]
              }
            ]}
            numberOfLines={1}
          >
            {data.title}
          </Animated.Text>
        </BlurView>
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          {/* Challenge Overview Card */}
          <Animated.View 
            style={[
              styles.overviewCard,
              {
                // opacity: scrollY.interpolate({
                //   inputRange: [0, 200],
                //   outputRange: [0, 1],
                //   extrapolate: 'clamp',
                // }),
                // transform: [
                //   {
                //     translateY: scrollY.interpolate({
                //       inputRange: [0, 200],
                //       outputRange: [30, 0],
                //       extrapolate: 'clamp',
                //     }),
                //   },
                // ],
              },
            ]}
          >
            <Text style={styles.description}>{data.discription}</Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Ionicons name="calendar-outline" size={24} color="#4CAF50" />
                <Text style={styles.statValue}>{data.duration} days</Text>
                <Text style={styles.statLabel}>Duration</Text>
              </View>
              
              <View style={styles.statItem}>
                <Ionicons name="fitness-outline" size={24} color="#2196F3" />
                <Text style={styles.statValue}>{data.schedule.length}</Text>
                <Text style={styles.statLabel}>Workouts</Text>
              </View>
              
              <View style={styles.statItem}>
                <Ionicons name="flash-outline" size={24} color="#FF9800" />
                {renderDifficultyBadge(data.level)}
                <Text style={styles.statLabel}>Level</Text>
              </View>
            </View>
          </Animated.View>

          {/* Challenge Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.primaryButton}
            onPress={() => setShowChallengeStartModal(true)}
            >
              <Ionicons name="play-circle" size={20} color="#FFF" />
              <Text style={styles.primaryButtonText}>Start Challenge</Text>
            </TouchableOpacity>
            
            {/* <TouchableOpacity style={styles.secondaryButton}>
              <Ionicons name="bookmark-outline" size={20} color="#666" />
              <Text style={styles.secondaryButtonText}>Save</Text>
            </TouchableOpacity> */}
          </View>

          {/* Schedule Section */}
          <View style={styles.scheduleSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Challenge Workout Schedule</Text>
              <Text style={styles.sectionSubtitle}>
                {data.duration}-day program • {data.level}
              </Text>
            </View>

            {data.schedule.map((day: any, index: number) => 
              renderDayCard(day, index)
            )}
          </View>

          {/* Tips Section */}
          <View style={styles.tipsCard}>
            <Ionicons name="bulb-outline" size={24} color="#FF9800" />
            <View style={styles.tipsContent}>
              <Text style={styles.tipsTitle}>Pro Tips</Text>
              <Text style={styles.tipsText}>
                • Rest days are crucial for muscle recovery
                • Stay hydrated throughout your workouts
                • Track your progress with photos and measurements
                • Listen to your body and adjust intensity as needed
              </Text>
            </View>
          </View>
        </View>
      </Animated.ScrollView>

    <Modal
      visible={showWorkoutSession}
      animationType="slide"
      onRequestClose={() => setShowWorkoutSession(false)}
    >
      {selectedDay && (
        <WorkoutSessionScreen
          dayData={selectedDay}
          onClose={() => setShowWorkoutSession(false)}
        />
      )}
    </Modal>

    <ChallengeStartModal
  visible={showChallengeStartModal}
  onClose={() => setShowChallengeStartModal(false)}
  challengeData={data}
  onStartDay={(day) => {
    setSelectedDay(day);
    setShowChallengeStartModal(false);
    setShowWorkoutSession(true);
  }}
/>


</LinearGradient>


  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: 'hidden',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  blurHeader: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  scrollContent: {
    paddingTop: height * 0.35,
    paddingBottom: 100,
  },
  content: {
    padding: 20,
  },
  overviewCard: {
    backgroundColor: cardBackground,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  description: {
    fontSize: 16,
    color: textPimary,
    lineHeight: 24,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: textPimary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: textSecondary,
    marginTop: 4,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtons: {
   
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 15,
    overflow: 'hidden',
     backgroundColor:primaryBackground,
  },
  primaryButtonText: {
    color:textPimary,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#FFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  scheduleSection: {
    marginBottom: 30,
  },
  sectionHeader: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color:textPimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  dayCard: {
    backgroundColor: '#2a302e75',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    
  },
  dayCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dayNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dayNumberText: {
    color: textPimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  dayInfo: {
    flex: 1,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: textPimary,
    marginBottom: 2,
  },
  dayFocus: {
    fontSize: 14,
    color: textSecondary,
  },
  workoutsContainer: {
    marginBottom: 20,
  },
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: secondaryBackground,
    marginTop: 8,
    marginRight: 12,
  },
  workoutText: {
    flex: 1,
    fontSize: 14,
    color: textPimary,
    lineHeight: 20,
  },
  dayCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color:textSecondary,
  },
  startButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: secondaryBackground,
    borderRadius: 20,
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  tipsCard: {
    flexDirection: 'row',
    backgroundColor: cardBackgroundSecondary,
    borderRadius: 20,
    padding: 20,
    alignItems: 'flex-start',
  },
  tipsContent: {
    flex: 1,
    marginLeft: 16,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF9800',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
});

export default ChallengeDetails;