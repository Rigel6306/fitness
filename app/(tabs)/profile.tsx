import { ContributionGraphComp, LineChartComp } from '@/components/AnalyticsChart';
import SafeScreenWrapper from '@/components/SafeScreenWrapper';
import { Colors } from '@/constants/Colors';
import { getAnalyticalData } from '@/services/analyticsService';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { SetStateAction, useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, ImageBackground, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { achievementBadges } from '../../data/data';
const { height, width } = Dimensions.get('screen')
const { textPimary, textSecondary, background, cardBackgroundSecondary } = Colors


const Profile = () => {

  const [chartData,setChartData ]= useState<{ date: string; data: any; }[]>();



  useEffect(()=>{

    const getData=async()=>{
        const data = await getAnalyticalData(new Date("2026-02-26"),new Date("2026-03-05"))
        

        setChartData([...data]);
        console.log(chartData)
    }

  

    getData();

  },[])

  console.log(chartData)


  const [isModalVisible, setIsModalVisible] = useState(false)
  const [badge, setBadge] = useState({
    name: '',
    description: '',
    achieved: false,
    badge: ''
  })

  const handleModalVisible = () => {
    setIsModalVisible(false)
  }

  const handleBagePress = (badge: SetStateAction<{ name: string; description: string; achieved: boolean; badge: string; }>) => {

    setBadge(badge)
    setIsModalVisible(true)

  }

  

  return (
    <View style={styles.container}>
      <SafeScreenWrapper>

        <View style={styles.header}>
          <View style={styles.headingContent}>
            <View style={styles.profileAvatar}>
              <Text style={{ fontWeight: 'bold', color: textPimary }}>AJ</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={{ fontWeight: 'bold', fontSize: 20, color: textPimary }}>Charitha Iravana</Text>
              <View style={styles.packageContainer}>
                <FontAwesome6 name="crown" size={18} color="gold" />
                <Text style={{ color: "gold" }}>Premium</Text>
              </View>
              <Text style={{ color: textSecondary }}>Member Since 2023</Text>

            </View>
          </View>
        </View>

        <View style={styles.scrollSection}>
          <ScrollView>
           {chartData &&<LineChartComp chartData={chartData}/>}

            {/* Your Status section */}
            <Text style={styles.statsHeadingText}>Your Stats</Text>
            <View style={styles.statsContainer}>
              <View style={{ flex: 1, flexDirection: 'row', gap: 10 }}>
                <View style={[styles.statItem, { backgroundColor: 'rgba(44, 45, 46, 0.39)', }]}>
                  <Entypo name="medal" size={20} color="gold" />
                  <Text style={{ fontWeight: 'bold', marginTop: 10, color: textPimary, fontSize: 24, }}>1</Text>
                  <Text style={{ color: textSecondary, fontWeight: 'bold' }}>Challenges</Text>
                </View>
                <View style={[styles.statItem, { backgroundColor: 'rgba(44, 45, 46, 0.39)', }]}>
                  <FontAwesome5 name="fire" size={20} color="crimson" />
                  <Text style={{ fontWeight: 'bold', marginTop: 10, color: textPimary, fontSize: 24, }}>10</Text>
                  <Text style={{ color: textSecondary, fontWeight: 'bold' }}>Day Streak</Text>
                </View>
                <View style={[styles.statItem, { backgroundColor: 'rgba(44, 45, 46, 0.39)', }]}>
                  <FontAwesome6 name="dumbbell" size={20} color="rgb(58, 167, 131)" />
                  <Text style={{ fontWeight: 'bold', marginTop: 10, color: textPimary, fontSize: 24, }}>10</Text>
                  <Text style={{ color: textSecondary, fontWeight: 'bold' }}>Workouts</Text>
                </View>
                <View style={[styles.statItem, { backgroundColor: 'rgba(44, 45, 46, 0.39)', }]}>
                  <FontAwesome6 name="clock" size={20} color="rgb(57, 125, 193)" />
                  <Text style={{ fontWeight: 'bold', marginTop: 10, color: textPimary, fontSize: 24, }}>10</Text>
                  <Text style={{ color: textSecondary, fontWeight: 'bold' }}>hours</Text>
                </View>
              </View>
              {/* <View style={{ flex: 1, flexDirection: 'row', gap: 10 }}>
                <View style={[styles.statItem, { backgroundColor: 'rgba(44, 45, 46, 0.39)', }]}>
                  <FontAwesome6 name="dumbbell" size={34} color="rgb(58, 167, 131)" />
                  <Text style={{ fontWeight: 'bold', marginTop: 10, color: textPimary, fontSize: 24, }}>10</Text>
                  <Text style={{ color: textSecondary, fontWeight: 'bold' }}>Workouts</Text>
                </View>
                <View style={[styles.statItem, { backgroundColor: 'rgba(44, 45, 46, 0.39)', }]}>
                  <FontAwesome6 name="clock" size={34} color="rgb(57, 125, 193)" />
                  <Text style={{ fontWeight: 'bold', marginTop: 10, color: textPimary, fontSize: 24, }}>10</Text>
                  <Text style={{ color: textSecondary, fontWeight: 'bold' }}>hours</Text>
                </View>
              </View> */}
            </View>

            {/* Achievement badge Section */}
            <Text style={styles.statsHeadingText}>Achievements</Text>
            <AchievementBadgeCard achievementBadges={achievementBadges} handlePress={handleBagePress} />

            {/* ── New Sections Start ── */}
            <ContributionGraphComp />

            {/* Your Goals */}

            {/* Extra bottom spacing */}
            <View style={{ height: 60 }} />

          </ScrollView>
        </View>

        <BadgeModal badge={badge} isVisible={isModalVisible} close={handleModalVisible} />
      </SafeScreenWrapper>
    </View>
  );
}

interface AchievementBadgeProps {
  achievementBadges: typeof achievementBadges;
  handlePress: (badge: any) => void;
}

const AchievementBadgeCard = ({ achievementBadges, handlePress }: AchievementBadgeProps) => {
  return (
    <View style={styles.badgeContainer} >
      <FlatList
        data={achievementBadges}
        horizontal={true}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => { handlePress(item) }}
            style={({ pressed }) => [pressed && { opacity: 0.5 },]}>
            <ImageBackground
              imageStyle={{ borderRadius: 100, opacity: 0.9 }}
              style={styles.badgeItem}
              source={typeof item.badge === 'string' ? { uri: item.badge } : item.badge}
            >
            </ImageBackground>
            {
              !item.achieved && <View style={[styles.badgeLockOVerlay, { ...StyleSheet.absoluteFillObject, borderRadius: 100, backgroundColor: 'rgba(76, 69, 69, 0.46)', }]} >
                <MaterialCommunityIcons name="lock" size={44} color="rgba(252, 249, 249, 0.87)" />
              </View>}
          </Pressable>)
        }
        keyExtractor={(item, index) => item.name.toString()}
      />
    </View>
  )
}

const BadgeModal = ({ badge, isVisible, close }: any) => {


  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={close}
      animationType='slide'
    >
      <View style={styles.badgeModalContainer}>
        {
          badge.achieved ? <>
            <Text style={styles.congratsTxt}>Congratulation!</Text>
            <Text style={styles.congratsSubTxt}>You have achieved {badge.name} award on 2025/01/01</Text>
          </> :
            <>
              <Text style={[styles.congratsTxt, { color: 'crimson' }]}>Achievement Locked</Text>
              <Text style={styles.congratsSubTxt}>Work Hard. You'll get there</Text>
            </>
        }

        <Image style={styles.badgeImg} source={badge.badge} />
        <Text style={styles.badgeHeading}>{badge.name}</Text>
        <Text style={styles.badgeDescription}>{badge.description}</Text>
      </View>
      {
        !badge.achieved && <View style={[styles.lockedAchievementOverlay, { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(1, 1, 1, 0.45)', }]} >
          <MaterialCommunityIcons name="lock" size={100} color="rgba(252, 249, 249, 0.87)" />
        </View>}

    </Modal>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height,
    maxHeight: height,
    backgroundColor: "rgb(0, 0, 0)"
  },
  header: {

  },
  scrollSection: {
    flex: 5,

  },
  headingContent: {
    flexDirection: 'row',
    backgroundColor: 'rgb(16, 17, 17)',
    gap: 8,
    margin: 8,
    padding: 8,
    borderRadius: 20

  },
  profileAvatar: {
    padding: 8,
    width: 70,
    height: 70,

    backgroundColor: "#123",
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',

  },
  infoContainer: {
    justifyContent: 'center',
    marginLeft: 20,
  },
  packageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statsHeadingText: {
    fontWeight: 'bold',
    color: textPimary,
    margin: 8,
    padding: 8,
    fontSize: 20,
  },
  statsContainer: {
    height: height * 0.12,
    margin: 8,
    gap: 8,
  },
  statItem: {
    flex: 1,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeContainer: {
    gap: 12,
    padding: 8,
  },
  badgeItem: {
    gap: 8,
    height: 100,
    width: 100,
    backgroundColor: "rgba(248, 248, 248, 0.69)",
    margin: 8,
    padding: 8,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  badgeLockOVerlay: {
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedAchievementOverlay: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  badgeModalContainer: {
    backgroundColor: 'rgb(0, 0, 0)',
    flex: 1,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',

  },
  badgeImg: {
    height: 200,
    width: 200,
    objectFit: 'cover',
    borderRadius: 100,


  },
  congratsTxt: {
    margin: 20,
    color: 'gold',
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 32,
  },
  congratsSubTxt: {
    marginBottom: 20,
    color: textPimary,
    fontWeight: 'bold',
  },
  badgeHeading: {
    color: textPimary,
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 16
  },
  badgeDescription: {
    color: textSecondary,
    maxWidth: 200,
    marginTop: 8,
    textAlign: 'center'
  },

  // ── New Styles ──
  goalsContainer: {
    margin: 8,
    gap: 16,
    paddingHorizontal: 4,
  },
  goalItem: {
    backgroundColor: 'rgba(44, 45, 46, 0.39)',
    padding: 16,
    borderRadius: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  goalTitle: {
    color: textPimary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  goalProgressText: {
    color: textSecondary,
    fontSize: 14,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },

  recentWorkoutCard: {
    backgroundColor: 'rgba(44, 45, 46, 0.39)',
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentWorkoutInfo: {
    flex: 1,
  },
  recentWorkoutName: {
    color: textPimary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  recentWorkoutDate: {
    color: textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  recentWorkoutStats: {
    alignItems: 'flex-end',
  },
  recentWorkoutDuration: {
    color: textPimary,
    fontSize: 14,
  },
  recentWorkoutCalories: {
    color: '#FF9500',
    fontWeight: 'bold',
    marginTop: 4,
  },

  quickActionsContainer: {
    margin: 16,
    gap: 12,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(44, 45, 46, 0.39)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  quickActionText: {
    color: textPimary,
    fontSize: 16,
    fontWeight: '600',
  },

})

export default Profile;