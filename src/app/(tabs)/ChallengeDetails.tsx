'use client'
import WorkoutSessionScreen from '@/components/WorkoutSessionScreen';
import { Colors } from '@/constants/Colors';
import { ChallangeContext } from '@/context/challengeContext';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useContext, useState } from 'react';
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

const { background, cardBackground, cardBackgroundSecondary, textPimary, textSecondary, primaryBackground, secondaryBackground } = Colors;
const { width, height } = Dimensions.get('window');

const ChallengeDetails = () => {
  const context = useContext(ChallangeContext);
  const data = context?.currentChallange;
  
  const [selectedDay, setSelectedDay] = useState<any>(null);
  const [showWorkoutSession, setShowWorkoutSession] = useState(false);
  const [showChallengeStartModal, setShowChallengeStartModal] = useState(false);
  
  // UNTOUCHED: Kept exactly as requested
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
      Beginner: { bg: 'rgba(76, 221, 187, 0.15)', text: '#4cddbb' },
      Intermediate: { bg: 'rgba(255, 176, 58, 0.15)', text: '#ffb03a' },
      Advanced: { bg: 'rgba(255, 114, 114, 0.15)', text: '#ff7272' },
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

  // Redesigned Day Card Subcomponent
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
        <View style={styles.dayNumberBox}>
          <Text style={styles.dayNumberText}>{String(index + 1).padStart(2, '0')}</Text>
        </View>
        <View style={styles.dayInfo}>
          <Text style={styles.dayTitle}>{schedule.day}</Text>
          <Text style={styles.dayFocus} numberOfLines={1}>{schedule.focus}</Text>
        </View>
        <Ionicons name="fitness-outline" size={16} color="#8E9492" />
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
          <Ionicons name="time-outline" size={14} color="#8E9492" />
          <Text style={styles.timeText}>45-60 min</Text>
        </View>
        <TouchableOpacity 
          style={styles.startButton}  
          activeOpacity={0.8}
          onPress={() => {
            setSelectedDay(schedule);
            setShowWorkoutSession(true);
          }}
        >
          <Text style={styles.startButtonText}>START</Text>
          <Ionicons name="play" size={10} color="#060708" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <View
      
      style={styles.container}
    >
      {/* UNTOUCHED: Collapsible Header View Structure */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>

     
        <Animated.Image
          source={data.bckImg}
          style={[styles.headerImage, { opacity: headerOpacity }]}
          resizeMode="cover"
        />
          <View style={[StyleSheet.absoluteFill,{position:'absolute',backgroundColor:'rgba(0, 0, 0, 0.36)',height:'100%'}]}/>
        
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
          
          {/* Redesigned Overview Info Card */}
          <View style={styles.overviewCard}>
            <Text style={styles.description}>{data.discription}</Text>
            
            <View style={styles.statsDivider} />
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Ionicons name="calendar-clear-outline" size={20} color="#4cddbb" />
                <Text style={styles.statValue}>{data.duration} Days</Text>
                <Text style={styles.statLabel}>Duration</Text>
              </View>
              
              <View style={styles.statItem}>
                <Ionicons name="layers-outline" size={20} color="#9d62ff" />
                <Text style={styles.statValue}>{data.schedule.length}</Text>
                <Text style={styles.statLabel}>Workouts</Text>
              </View>
              
              <View style={styles.statItem}>
                <Ionicons name="flash-outline" size={20} color="#ffb03a" />
                {renderDifficultyBadge(data.level)}
                <Text style={styles.statLabel}>Intensity</Text>
              </View>
            </View>
          </View>

          {/* Redesigned Start Action Button Area */}

          {/* Routine Button Used to open Challenge Start Modal which is unnessasary as it shows redundent UI and points back to the workouts session screen */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.primaryButton}
              activeOpacity={0.9}
              onPress={() => setShowChallengeStartModal(true)}
            >
              <Ionicons name="play-sharp" size={18} color="#ffffff" />
              <Text style={styles.primaryButtonText}>Start Today's Routine</Text>
            </TouchableOpacity>
          </View>

          {/* Redesigned Schedule Flow Timeline */}
          <View style={styles.scheduleSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Workout Schedule</Text>
              <Text style={styles.sectionSubtitle}>
                Follow your structured {data.duration}-day microcycle
              </Text>
            </View>

            {data.schedule.map((day: any, index: number) => 
              renderDayCard(day, index)
            )}
          </View>

          {/* Redesigned Guidelines Information Card */}
          <View style={styles.tipsCard}>
            <View style={styles.tipsIconContainer}>
              <Ionicons name="bulb" size={20} color="#ffb03a" />
            </View>
            <View style={styles.tipsContent}>
              <Text style={styles.tipsTitle}>Coach Guidelines</Text>
              <View style={styles.tipsList}>
                <Text style={styles.tipsText}>• Prioritize systematic recovery between microcycles.</Text>
                <Text style={styles.tipsText}>• Maintain consistent intra-workout hydration volume.</Text>
                <Text style={styles.tipsText}>• Track execution metrics within performance sub-logs.</Text>
                <Text style={styles.tipsText}>• Scale loading limits based on individual muscular fatigue.</Text>
              </View>
            </View>
          </View>
        </View>
      </Animated.ScrollView>

      {/* Workspace Modals Setup */}
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

      {/* <ChallengeStartModal
        visible={showChallengeStartModal}
        onClose={() => setShowChallengeStartModal(false)}
        challengeData={data}
        onStartDay={(day) => {
          setSelectedDay(day);
          setShowChallengeStartModal(false);
          setShowWorkoutSession(true);
        }}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  backgroundColor:'black'
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: 'hidden',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
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
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  scrollContent: {
    paddingTop: height * 0.35,
    paddingBottom: 60,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  overviewCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: '#8E9492',
    lineHeight: 20,
    fontWeight: '500',
  },
  statsDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    marginVertical: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 6,
  },
  statLabel: {
    fontSize: 11,
    color: '#8E9492',
    fontWeight: '600',
    marginTop: 2,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 5,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
  actionButtons: {
    marginBottom: 28,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#372b93', 
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  scheduleSection: {
    marginBottom: 12,
  },
  sectionHeader: {
    marginBottom: 16,
    paddingLeft: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#8E9492',
    fontWeight: '500',
    marginTop: 2,
  },
  dayCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  dayCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  dayNumberBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dayNumberText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  dayInfo: {
    flex: 1,
  },
  dayTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dayFocus: {
    fontSize: 12,
    color: '#8E9492',
    fontWeight: '500',
    marginTop: 1,
  },
  workoutsContainer: {
    backgroundColor: 'rgba(0,0,0,0.12)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    gap: 6,
  },
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bulletPoint: {
    width: 4,
    height: 4,
    borderRadius: 99,
    backgroundColor: '#4cddbb',
    marginRight: 10,
    opacity: 0.8,
  },
  workoutText: {
    flex: 1,
    fontSize: 13,
    color: '#B0B5B3',
    fontWeight: '500',
  },
  dayCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 12,
    color: '#8E9492',
    fontWeight: '600',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  startButtonText: {
    color: '#060708',
    fontSize: 11,
    fontWeight: '800',
  },
  tipsCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 176, 58, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 176, 58, 0.08)',
    borderRadius: 20,
    padding: 16,
    alignItems: 'flex-start',
    gap: 12,
    marginBottom:40,
    marginTop: 8,
  },
  tipsIconContainer: {
    padding: 8,
    backgroundColor: 'rgba(255, 176, 58, 0.05)',
    borderRadius: 10,
  },
  tipsContent: {
    flex: 1,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffb03a',
    marginBottom: 6,
  },
  tipsList: {
    gap: 4,
  },
  tipsText: {
    fontSize: 12,
    color: '#B0B5B3',
    lineHeight: 18,
    fontWeight: '500',
  },
});

export default ChallengeDetails;