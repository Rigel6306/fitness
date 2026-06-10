import { LineChartComp } from '@/components/AnalyticsChart';
import SafeScreenWrapper from '@/components/SafeScreenWrapper';
import { Colors } from '@/constants/Colors';
import { getAnalyticalData } from '@/services/analyticsService';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { SetStateAction, useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, ImageBackground, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { achievementBadges } from '../../data/data';

const { height } = Dimensions.get('screen');
const { textPimary, textSecondary } = Colors;

const Profile = () => {
  const [chartData, setChartData] = useState<{ date: string; data: any; }[]>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [badge, setBadge] = useState({
    name: '',
    description: '',
    achieved: false,
    badge: ''
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const today = new Date();
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);

        const data = await getAnalyticalData(lastWeek, today);
        setChartData([...data]);
      } catch (err) {
        console.error('Error fetching analytical data:', err);
      }
    };
    getData();
  }, []);

  const handleModalVisible = () => setIsModalVisible(false);

  const handleBagePress = (selectedBadge: SetStateAction<{ name: string; description: string; achieved: boolean; badge: string; }>) => {
    setBadge(selectedBadge);
    setIsModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <SafeScreenWrapper>
        {/* HEADER AREA */}
        <View style={styles.header}>
          <View style={styles.headingContent}>
            <View style={styles.profileAvatar}>
              <Text style={styles.avatarText}>AJ</Text>
              <View style={styles.onlineIndicator} />
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.userNameText}>Charitha Iravana</Text>
              <View style={styles.metaRow}>
                <View style={styles.packageContainer}>
                  <FontAwesome6 name="crown" size={12} color="#ffd700" />
                  <Text style={styles.premiumText}>PREMIUM</Text>
                </View>
                <Text style={styles.memberSinceText}>SINCE 2023</Text>
              </View>
            </View>
          </View>
        </View>

        {/* SCROLLABLE CONTENT SCENE */}
        <View style={styles.scrollSection}>
          <ScrollView showsVerticalScrollIndicator={false}>
            
            {/* ANALYTICS SECTION (Explicit layout tracking to avoid breaking dimensions) */}
            <Text style={styles.statsHeadingText}>WEEKLY METRIC TELEMETRY</Text>
            <View style={styles.chartOuterContainer}>
              {chartData ? (
                <View style={styles.chartCanvas}>
                  <LineChartComp chartData={chartData} />
                </View>
              ) : (
                <View style={styles.chartFallback}>
                  <Text style={styles.fallbackText}>Awaiting telemetry sync...</Text>
                </View>
              )}
            </View>

            {/* PERFORMANCE COUNTERS */}
            <Text style={styles.statsHeadingText}>PERFORMANCE STATS</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Entypo name="medal" size={18} color="#ffd700" />
                  <Text style={styles.statMetricNumber}>1</Text>
                  <Text style={styles.statMetricLabel}>Challenges</Text>
                </View>
                <View style={styles.statItem}>
                  <FontAwesome5 name="fire" size={18} color="#ff3b30" />
                  <Text style={styles.statMetricNumber}>10</Text>
                  <Text style={styles.statMetricLabel}>Day Streak</Text>
                </View>
                <View style={styles.statItem}>
                  <FontAwesome6 name="dumbbell" size={16} color="#0affca" />
                  <Text style={styles.statMetricNumber}>10</Text>
                  <Text style={styles.statMetricLabel}>Workouts</Text>
                </View>
                <View style={styles.statItem}>
                  <FontAwesome6 name="clock" size={16} color="#007aff" />
                  <Text style={styles.statMetricNumber}>10</Text>
                  <Text style={styles.statMetricLabel}>Hours</Text>
                </View>
              </View>
            </View>

            {/* NEW ADDITION: TARGET GOALS TRACKER */}
            <Text style={styles.statsHeadingText}>ACTIVE FITNESS TARGETS</Text>
            <View style={styles.goalsContainer}>
              <View style={styles.goalItem}>
                <View style={styles.goalHeader}>
                  <Text style={styles.goalTitle}>Body Fat Mitigation</Text>
                  <Text style={styles.goalProgressText}>14.2% / 12.0%</Text>
                </View>
                <View style={styles.progressBarBackground}>
                  <View style={[styles.progressBarFill, { width: '70%', backgroundColor: '#b17df5' }]} />
                </View>
              </View>

              <View style={styles.goalItem}>
                <View style={styles.goalHeader}>
                  <Text style={styles.goalTitle}>Deadlift Milestone Max Target</Text>
                  <Text style={styles.goalProgressText}>175kg / 180kg</Text>
                </View>
                <View style={styles.progressBarBackground}>
                  <View style={[styles.progressBarFill, { width: '92%', backgroundColor: '#0affca' }]} />
                </View>
              </View>
            </View>

            {/* ACHIEVEMENTS */}
            <Text style={styles.statsHeadingText}>UNLOCKED REWARDS</Text>
            <AchievementBadgeCard achievementBadges={achievementBadges} handlePress={handleBagePress} />

            {/* NEW ADDITION: RECENT ACTIVITY DECK */}
            <Text style={styles.statsHeadingText}>RECENT WORKOUT HISTORY</Text>
            <View style={styles.recentWorkoutCard}>
              <View style={styles.recentWorkoutInfo}>
                <Text style={styles.recentWorkoutName}>Hypertrophy Push Block A</Text>
                <Text style={styles.recentWorkoutDate}>Yesterday, 06:42 PM</Text>
              </View>
              <View style={styles.recentWorkoutStats}>
                <Text style={styles.recentWorkoutDuration}>62 Mins</Text>
                <Text style={styles.recentWorkoutCalories}>540 Kcal</Text>
              </View>
            </View>

            {/* NEW ADDITION: QUICK SYSTEM ACTIONS */}
            <Text style={styles.statsHeadingText}>ACCOUNT SYSTEMS</Text>
            <View style={styles.quickActionsContainer}>
              <Pressable style={styles.quickActionButton}>
                <Ionicons name="settings-sharp" size={18} color="rgba(255,255,255,0.6)" />
                <Text style={styles.quickActionText}>Biometric & Device Synchronization</Text>
              </Pressable>
              <Pressable style={styles.quickActionButton}>
                <Ionicons name="shield-checkmark" size={18} color="rgba(255,255,255,0.6)" />
                <Text style={styles.quickActionText}>Privacy & Shared Telemetry Access</Text>
              </Pressable>
            </View>

            {/* FOOTER EXTRA FLOATING COMPENSATION */}
            <View style={{ height: 110 }} />
          </ScrollView>
        </View>

        <BadgeModal badge={badge} isVisible={isModalVisible} close={handleModalVisible} />
      </SafeScreenWrapper>
    </View>
  );
};

// --- SUB COMPONENTS ---

interface AchievementBadgeProps {
  achievementBadges: typeof achievementBadges;
  handlePress: (badge: any) => void;
}

const AchievementBadgeCard = ({ achievementBadges, handlePress }: AchievementBadgeProps) => {
  return (
    <View style={styles.badgeContainer}>
      <FlatList
        data={achievementBadges}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handlePress(item)}
            style={({ pressed }) => [
              styles.badgePressableNode,
              pressed && { opacity: 0.7, transform: [{ scale: 0.96 }] }
            ]}
          >
            <ImageBackground
              imageStyle={styles.badgeImageCore}
              style={[styles.badgeItem, !item.achieved && { opacity: 0.4 }]}
              source={typeof item.badge === 'string' ? { uri: item.badge } : item.badge}
            />
            {!item.achieved && (
              <View style={styles.badgeLockOverlay}>
                <MaterialCommunityIcons name="lock" size={18} color="rgba(255, 255, 255, 0.75)" />
              </View>
            )}
          </Pressable>
        )}
        keyExtractor={(item) => item.name.toString()}
      />
    </View>
  );
};

const BadgeModal = ({ badge, isVisible, close }: any) => {
  return (
    <Modal transparent={true} visible={isVisible} onRequestClose={close} animationType="fade">
      <Pressable style={styles.modalBlurBackdrop} onPress={close}>
        <View style={styles.badgeModalContainer}>
          <View style={styles.dismissHandleTray} />
          <Pressable style={styles.closeModalAbsoluteButton} onPress={close}>
            <AntDesign name="closecircle" size={22} color="rgba(255, 255, 255, 0.25)" />
          </Pressable>

          <View style={styles.modalStatusTextWrapper}>
            <Text style={[styles.congratsTxt, !badge.achieved && { color: '#ff453a' }]}>
              {badge.achieved ? 'CONGRATULATIONS!' : 'LOCKED TARGET'}
            </Text>
            <Text style={styles.congratsSubTxt}>
              {badge.achieved ? 'Unlocked on 2025/01/01' : 'Complete core routines to claim this badge'}
            </Text>
          </View>

          <View style={styles.modalImageChassis}>
            <Image style={[styles.badgeImg, !badge.achieved && { opacity: 0.35 }]} source={typeof badge.badge === 'string' ? { uri: badge.badge } : badge.badge} />
            {!badge.achieved && (
              <View style={styles.modalAbsoluteLockPlate}>
                <MaterialCommunityIcons name="lock" size={48} color="rgba(255, 255, 255, 0.8)" />
              </View>
            )}
          </View>

          <Text style={styles.badgeHeading}>{badge.name?.toUpperCase()}</Text>
          <Text style={styles.badgeDescription}>{badge.description}</Text>
        </View>
      </Pressable>
    </Modal>
  );
};

// --- STYLESHEET BLUEPRINTS ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030305',
  },
  header: {
    paddingHorizontal: 12,
    marginTop: 10,
  },
  scrollSection: {
    flex: 1,
  },
  headingContent: {
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 15, 22, 0.85)',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  profileAvatar: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(177, 125, 245, 0.15)',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#b17df5',
  },
  avatarText: {
    fontFamily: 'Bebas',
    fontSize: 22,
    color: '#ffffff',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0affca',
    borderWidth: 2,
    borderColor: '#0f0f16',
  },
  infoContainer: {
    justifyContent: 'center',
    marginLeft: 16,
    flex: 1,
  },
  userNameText: {
    fontWeight: '800',
    fontSize: 20,
    color: '#ffffff',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 12,
  },
  packageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  premiumText: {
    fontFamily: 'Bebas',
    fontSize: 10,
    color: '#ffd700',
  },
  memberSinceText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.35)',
  },
  // --- CHART FIX CONTAINER BLOCK ---
  chartOuterContainer: {
    marginHorizontal: 12,
    overflow: 'hidden',
    alignItems: 'center',
  },
  chartCanvas: {
    width: '100%',
    height: 220, // Forces explicit scale limits onto third-party components
    paddingRight: 10,
    justifyContent: 'center',
  },
  chartFallback: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 12,
  },
  statsHeadingText: {
    fontFamily: 'Bebas',
    color: '#ffffff',
    marginLeft: 16,
    marginTop: 26,
    marginBottom: 12,
    fontSize: 15,
    letterSpacing: 1.5,
  },
  statsContainer: {
    paddingHorizontal: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statItem: {
    flex: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 15, 22, 0.85)',
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  statMetricNumber: {
    fontFamily: 'Bebas',
    marginTop: 6,
    color: '#ffffff',
    fontSize: 26,
  },
  statMetricLabel: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontWeight: '700',
    fontSize: 10,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  // --- GOALS TARGET PLATFORM ---
  goalsContainer: {
    paddingHorizontal: 12,
    gap: 10,
  },
  goalItem: {
    backgroundColor: 'rgba(15, 15, 22, 0.85)',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  goalTitle: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  goalProgressText: {
    fontFamily: 'Bebas',
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  badgeContainer: {
    paddingLeft: 12,
  },
  badgePressableNode: {
    marginRight: 14,
    position: 'relative',
  },
  badgeItem: {
    height: 76,
    width: 76,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 38,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  badgeImageCore: {
    borderRadius: 38,
  },
  badgeLockOverlay: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(5, 5, 8, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    bottom: -2,
    right: -2,
  },
  // --- WORKOUT HISTORY CARD ---
  recentWorkoutCard: {
    backgroundColor: 'rgba(15, 15, 22, 0.85)',
    padding: 16,
    borderRadius: 18,
    marginHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  recentWorkoutInfo: {
    flex: 1,
  },
  recentWorkoutName: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  recentWorkoutDate: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  recentWorkoutStats: {
    alignItems: 'flex-end',
  },
  recentWorkoutDuration: {
    fontFamily: 'Bebas',
    color: '#ffffff',
    fontSize: 18,
  },
  recentWorkoutCalories: {
    color: '#ff9500',
    fontWeight: '800',
    fontSize: 12,
    marginTop: 2,
  },
  // --- SETTINGS QUICK METRICS DECK ---
  quickActionsContainer: {
    paddingHorizontal: 12,
    gap: 10,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(15, 15, 22, 0.5)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.03)',
  },
  quickActionText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: '600',
  },
  // --- OVERLAY CORE SHEET CONFIGS ---
  modalBlurBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(3, 3, 5, 0.85)',
    justifyContent: 'flex-end',
  },
  badgeModalContainer: {
    backgroundColor: '#0b0b0f',
    borderTopRightRadius: 28,
    borderTopLeftRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 50,
    paddingTop: 16,
  },
  dismissHandleTray: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: 24,
  },
  closeModalAbsoluteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  modalStatusTextWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  congratsTxt: {
    fontFamily: 'Bebas',
    color: '#ffd700',
    fontSize: 28,
    letterSpacing: 1.5,
  },
  congratsSubTxt: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontWeight: '600',
    fontSize: 12,
    marginTop: 4,
  },
  modalImageChassis: {
    position: 'relative',
    marginBottom: 20,
  },
  badgeImg: {
    height: 150,
    width: 150,
    borderRadius: 75,
  },
  modalAbsoluteLockPlate: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(5, 5, 8, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    top: 45,
    left: 45,
  },
  badgeHeading: {
    fontFamily: 'Bebas',
    color: '#ffffff',
    fontSize: 20,
    letterSpacing: 2,
  },
  badgeDescription: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
    textAlign: 'center',
    maxWidth: 260,
  },
});

export default Profile;