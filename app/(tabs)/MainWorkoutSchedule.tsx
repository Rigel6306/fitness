import { workoutSchedule } from '@/data/data';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');


const MainWorkoutSchedule = () => {
  const navigation = useNavigation();
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);
  const [refreshing, setRefreshing] = useState(false);
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: [height * 0.4, 100],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const titleScale = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: [1, 0.85],
    extrapolate: 'clamp',
  });

  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: [0, -20],
    extrapolate: 'clamp',
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const renderProgressBar = () => {
    const progressPercentage = (workoutSchedule.stats.completed / workoutSchedule.stats.totalWorkouts) * 100;
    
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Program Progress</Text>
          <Text style={styles.progressPercentage}>{Math.round(progressPercentage)}%</Text>
        </View>
        <View style={styles.progressBar}>
          <Animated.View 
            style={[
              styles.progressFill,
              {
                width: `${progressPercentage}%`,
              }
            ]}
          />
        </View>
        <View style={styles.progressStats}>
          <Text style={styles.progressText}>
            {workoutSchedule.stats.completed} of {workoutSchedule.stats.totalWorkouts} workouts completed
          </Text>
        </View>
      </View>
    );
  };

  const renderWeekCard = (week: any, index: number) => {
    const isExpanded = expandedWeek === week.week;
    const completedWorkouts = week.workouts.filter((w: any) => w.completed).length;
    const totalWorkouts = week.workouts.length;

    return (
      <Animated.View
        key={index}
        style={[
          styles.weekCard,
          {
            opacity: scrollY.interpolate({
              inputRange: [0, 300 + (index * 60)],
              outputRange: [0, 1],
              extrapolate: 'clamp',
            }),
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [0, 300 + (index * 60)],
                  outputRange: [50, 0],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.weekCardHeader}
          onPress={() => setExpandedWeek(isExpanded ? null : week.week)}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={isExpanded ? ['#667eea', '#764ba2'] : ['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.98)']}
            style={styles.weekHeaderGradient}
          >
            <View style={styles.weekMainInfo}>
              <View style={styles.weekNumberContainer}>
                <Text style={[
                  styles.weekNumber,
                  isExpanded && styles.weekNumberExpanded
                ]}>
                  Week {week.week}
                </Text>
              </View>
              
              <View style={styles.weekThemeContainer}>
                <Text style={[
                  styles.weekTheme,
                  isExpanded && styles.weekThemeExpanded
                ]}>
                  {week.theme}
                </Text>
                <View style={styles.weekMeta}>
                  <View style={[
                    styles.intensityBadge,
                    { backgroundColor: getIntensityColor(week.intensity) }
                  ]}>
                    <Text style={styles.intensityText}>{week.intensity}</Text>
                  </View>
                  <View style={styles.weekFocusTag}>
                    <Ionicons name="barbell" size={12} color="#667eea" />
                    <Text style={styles.weekFocusText}>{week.focus}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.weekStats}>
              <View style={styles.weekStatItem}>
                <MaterialCommunityIcons name="check-circle" size={16} color={isExpanded ? '#FFF' : '#4CAF50'} />
                <Text style={[
                  styles.weekStatValue,
                  isExpanded && styles.weekStatValueExpanded
                ]}>
                  {completedWorkouts}/{totalWorkouts}
                </Text>
                <Text style={[
                  styles.weekStatLabel,
                  isExpanded && styles.weekStatLabelExpanded
                ]}>
                  Done
                </Text>
              </View>
              
              <View style={styles.weekStatDivider} />
              
              <View style={styles.weekStatItem}>
                <Ionicons name="time-outline" size={16} color={isExpanded ? '#FFF' : '#FF9800'} />
                <Text style={[
                  styles.weekStatValue,
                  isExpanded && styles.weekStatValueExpanded
                ]}>
                  7 days
                </Text>
                <Text style={[
                  styles.weekStatLabel,
                  isExpanded && styles.weekStatLabelExpanded
                ]}>
                  Duration
                </Text>
              </View>
            </View>

            <View style={styles.expandButton}>
              <Ionicons 
                name={isExpanded ? "chevron-up" : "chevron-down"} 
                size={24} 
                color={isExpanded ? "#FFF" : "#667eea"} 
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {isExpanded && (
          <Animated.View 
            style={[
              styles.weekDetails,
              {
                opacity: scrollY.interpolate({
                  inputRange: [0, 300],
                  outputRange: [0, 1],
                  extrapolate: 'clamp',
                }),
              }
            ]}
          >
            {week.workouts.map((workout: any, workoutIndex: number) => (
              <TouchableOpacity
                key={workoutIndex}
                style={[
                  styles.workoutItem,
                  workout.completed && styles.workoutItemCompleted,
                ]}
                onPress={() => navigation.navigate('WorkoutSession', { workout })}
                activeOpacity={0.8}
              >
                <View style={styles.workoutMainInfo}>
                  <View style={styles.workoutDayContainer}>
                    <View style={[
                      styles.workoutDayBadge,
                      { backgroundColor: getWorkoutTypeColor(workout.type) }
                    ]}>
                      <Text style={styles.workoutDayText}>{workout.day}</Text>
                    </View>
                    <View style={styles.workoutTypeContainer}>
                      <View style={styles.workoutTypeTag}>
                        <Text style={styles.workoutTypeText}>{workout.type}</Text>
                      </View>
                      <Text style={styles.workoutFocus}>{workout.focus}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.workoutMeta}>
                    <View style={styles.workoutDuration}>
                      <Ionicons name="time-outline" size={14} color="#666" />
                      <Text style={styles.workoutDurationText}>{workout.duration}</Text>
                    </View>
                    
                    {workout.completed ? (
                      <View style={styles.completedBadge}>
                        <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                      </View>
                    ) : (
                      <TouchableOpacity style={styles.startWorkoutButton}>
                        <Text style={styles.startWorkoutText}>START</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {/* Progress indicator for workout completion */}
                <View style={styles.workoutProgressContainer}>
                  <View style={[
                    styles.workoutProgressBar,
                    { backgroundColor: workout.completed ? '#4CAF50' : '#E0E0E0' }
                  ]} />
                </View>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}
      </Animated.View>
    );
  };

  const getIntensityColor = (intensity: string) => {
    const colors: { [key: string]: string } = {
      Low: '#4CAF50',
      Medium: '#FF9800',
      High: '#F44336',
    };
    return colors[intensity] || '#667eea';
  };

  const getWorkoutTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      Strength: '#667eea',
      Cardio: '#E71D36',
      'Active Recovery': '#2EC4B6',
      Mobility: '#7209B7',
      Yoga: '#FF9F1C',
      Pilates: '#F72585',
      Rest: '#666',
    };
    return colors[type] || '#667eea';
  };

  const renderQuickStats = () => (
    <View style={styles.quickStatsContainer}>
      <LinearGradient
        colors={['rgba(102, 126, 234, 0.1)', 'rgba(118, 75, 162, 0.05)']}
        style={styles.quickStatsGradient}
      >
        <View style={styles.quickStatsRow}>
          <View style={styles.quickStatItem}>
            <View style={[styles.quickStatIcon, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
              <Ionicons name="checkmark-done" size={20} color="#4CAF50" />
            </View>
            <Text style={styles.quickStatValue}>{workoutSchedule.stats.completed}</Text>
            <Text style={styles.quickStatLabel}>Workouts Done</Text>
          </View>
          
          <View style={styles.quickStatDivider} />
          
          <View style={styles.quickStatItem}>
            <View style={[styles.quickStatIcon, { backgroundColor: 'rgba(255, 107, 107, 0.1)' }]}>
              <Ionicons name="flame" size={20} color="#FF6B6B" />
            </View>
            <Text style={styles.quickStatValue}>
              {(workoutSchedule.stats.caloriesBurned / 1000).toFixed(0)}k
            </Text>
            <Text style={styles.quickStatLabel}>Calories</Text>
          </View>
          
          <View style={styles.quickStatDivider} />
          
          <View style={styles.quickStatItem}>
            <View style={[styles.quickStatIcon, { backgroundColor: 'rgba(255, 152, 0, 0.1)' }]}>
              <Ionicons name="time" size={20} color="#FF9800" />
            </View>
            <Text style={styles.quickStatValue}>{workoutSchedule.stats.avgDuration}</Text>
            <Text style={styles.quickStatLabel}>Avg Session</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Animated Header with Parallax Effect */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.Image
          source={workoutSchedule.bckImg}
          style={[styles.headerImage, { opacity: headerOpacity }]}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.85)', 'rgba(0,0,0,0.3)', 'transparent']}
          style={StyleSheet.absoluteFill}
        />
        
        <BlurView intensity={90} style={styles.blurHeader} tint="dark">
          <SafeAreaView style={styles.headerSafeArea}>
            <View style={styles.headerTop}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={24} color="#FFF" />
              </TouchableOpacity>
              
              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.headerActionButton}>
                  <Ionicons name="calendar-outline" size={22} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerActionButton}>
                  <Ionicons name="share-outline" size={22} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
            
            <Animated.View style={[
              styles.headerContent,
              {
                transform: [
                  { translateY: titleTranslateY },
                  { scale: titleScale }
                ]
              }
            ]}>
              <Text style={styles.headerTitle}>{workoutSchedule.title}</Text>
              <Text style={styles.headerSubtitle}>{workoutSchedule.subtitle}</Text>
              
              <View style={styles.headerLevelBadge}>
                <Ionicons name="flash" size={14} color="#FFF" />
                <Text style={styles.headerLevelText}>{workoutSchedule.level}</Text>
              </View>
            </Animated.View>
          </SafeAreaView>
        </BlurView>
      </Animated.View>

      {/* Main Scroll Content */}
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#667eea"
            colors={['#667eea']}
          />
        }
      >
        <LinearGradient
          colors={['#b2939337', '#bbff3d7b', '#6bcb786b', '#4d96ff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.contentWrapper}
        >
          <View style={styles.content}>
            {/* Progress Bar Section */}
            {renderProgressBar()}

            {/* Quick Stats */}
            {renderQuickStats()}

            {/* Weekly Schedule */}
            <View style={styles.scheduleSection}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <Ionicons name="calendar" size={24} color="#333" />
                  <Text style={styles.sectionTitle}>Weekly Schedule</Text>
                </View>
                <Text style={styles.sectionSubtitle}>
                  {workoutSchedule.duration} days • {workoutSchedule.level}
                </Text>
              </View>

              {workoutSchedule.weeklyStructure.map((week, index) =>
                renderWeekCard(week, index)
              )}
            </View>

            {/* Program Tips */}
            <View style={styles.tipsCard}>
              <LinearGradient
                colors={['rgba(255, 248, 225, 0.8)', 'rgba(255, 248, 225, 0.4)']}
                style={styles.tipsGradient}
              >
                <View style={styles.tipsHeader}>
                  <View style={styles.tipsIconContainer}>
                    <Ionicons name="bulb" size={24} color="#FF9800" />
                  </View>
                  <View style={styles.tipsContent}>
                    <Text style={styles.tipsTitle}>Program Success Tips</Text>
                    <Text style={styles.tipsText}>
                      • Progressive overload is key - track your weights weekly
                      • Rest days are non-negotiable for optimal recovery
                      • Nutrition fuels performance - eat for your goals
                      • Stay consistent, results compound over time
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.quickActionButton}>
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
                <Ionicons name="add-circle" size={22} color="#FFF" />
                <Text style={styles.quickActionText}>Add Custom Workout</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.quickActionButton, styles.secondaryAction]}>
                <Ionicons name="stats-chart" size={22} color="#667eea" />
                <Text style={[styles.quickActionText, styles.secondaryActionText]}>View Analytics</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bottomSpacer} />
          </View>
        </LinearGradient>
      </Animated.ScrollView>
    </View>
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
    flex: 1,
  },
  headerSafeArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : StatusBar.currentHeight,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
  },
  headerContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 8,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 20,
    fontWeight: '500',
  },
  headerLevelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    backdropFilter: 'blur(10px)',
  },
  headerLevelText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  scrollContent: {
    paddingTop: height * 0.4,
  },
  contentWrapper: {
    minHeight: height * 0.6,
  },
  content: {
    padding: 20,
  },
  progressContainer: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 15,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  progressPercentage: {
    fontSize: 28,
    fontWeight: '800',
    color: '#667eea',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#F1F1F1',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#667eea',
    borderRadius: 5,
  },
  progressStats: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  quickStatsContainer: {
    marginBottom: 25,
    borderRadius: 20,
    overflow: 'hidden',
  },
  quickStatsGradient: {
    padding: 20,
  },
  quickStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  quickStatIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickStatValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333',
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  quickStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  scheduleSection: {
    marginBottom: 30,
  },
  sectionHeader: {
    marginBottom: 24,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333',
    marginLeft: 10,
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  weekCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 10,
  },
  weekCardHeader: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  weekHeaderGradient: {
    padding: 24,
  },
  weekMainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  weekNumberContainer: {
    marginRight: 16,
  },
  weekNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333',
  },
  weekNumberExpanded: {
    color: '#FFF',
  },
  weekThemeContainer: {
    flex: 1,
  },
  weekTheme: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  weekThemeExpanded: {
    color: '#FFF',
  },
  weekMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  intensityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  intensityText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
  },
  weekFocusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  weekFocusText: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '600',
  },
  weekStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
  },
  weekStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  weekStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginTop: 6,
    marginBottom: 2,
  },
  weekStatValueExpanded: {
    color: '#333',
  },
  weekStatLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  weekStatLabelExpanded: {
    color: '#666',
  },
  weekStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E0E0E0',
  },
  expandButton: {
    alignItems: 'center',
  },
  weekDetails: {
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 20,
  },
  workoutItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
  },
  workoutItemCompleted: {
    opacity: 0.8,
  },
  workoutMainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workoutDayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  workoutDayBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  workoutDayText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  workoutTypeContainer: {
    flex: 1,
  },
  workoutTypeTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(248, 249, 250, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 4,
  },
  workoutTypeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#666',
  },
  workoutFocus: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  workoutMeta: {
    alignItems: 'flex-end',
    gap: 8,
  },
  workoutDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  workoutDurationText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  completedBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startWorkoutButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#667eea',
    borderRadius: 15,
  },
  startWorkoutText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
  },
  workoutProgressContainer: {
    height: 4,
    backgroundColor: 'transparent',
  },
  workoutProgressBar: {
    height: '100%',
    borderRadius: 2,
  },
  tipsCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 25,
  },
  tipsGradient: {
    padding: 24,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipsIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  tipsContent: {
    flex: 1,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF9800',
    marginBottom: 12,
  },
  tipsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 18,
    borderRadius: 15,
    overflow: 'hidden',
  },
  quickActionText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryAction: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  secondaryActionText: {
    color: '#667eea',
  },
  bottomSpacer: {
    height: 100,
  },
});

export default MainWorkoutSchedule;