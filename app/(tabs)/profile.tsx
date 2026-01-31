import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Modal,
  TextInput,
  Switch,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  MaterialIcons, 
  FontAwesome5, 
  Ionicons, 
  Feather,
  AntDesign,
  Entypo 
} from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const FitnessProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    membershipLevel: 'Premium',
    joinDate: 'January 2023',
    avatar: null,
    bio: 'Fitness enthusiast, marathon runner, and health advocate.',
    stats: {
      workoutsCompleted: 142,
      currentStreak: 28,
      totalCalories: 124500,
      hoursTrained: 320,
    },
    goals: {
      dailySteps: 10000,
      weight: 75,
      bodyFat: 15,
      weeklyWorkouts: 5,
    },
    settings: {
      notifications: true,
      darkMode: true,
      autoPlayVideos: false,
      privateProfile: false,
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...userData });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Mock workout history
  const workoutHistory = [
    { id: '1', type: 'HIIT', duration: 45, calories: 420, date: 'Today' },
    { id: '2', type: 'Strength', duration: 60, calories: 380, date: 'Yesterday' },
    { id: '3', type: 'Cardio', duration: 30, calories: 320, date: '2 days ago' },
    { id: '4', type: 'Yoga', duration: 40, calories: 180, date: '3 days ago' },
    { id: '5', type: 'Running', duration: 50, calories: 520, date: '4 days ago' },
  ];

  // Mock achievements
  const achievements = [
    { id: '1', title: '30 Day Streak', icon: 'fire', color: '#FF5722', unlocked: true },
    { id: '2', title: '100 Workouts', icon: 'trophy', color: '#FFC107', unlocked: true },
    { id: '3', title: 'Marathon Finisher', icon: 'medal', color: '#9C27B0', unlocked: false },
    { id: '4', title: 'Early Bird', icon: 'sun', color: '#FF9800', unlocked: true },
    { id: '5', title: 'Weight Master', icon: 'weight', color: '#00BCD4', unlocked: false },
    { id: '6', title: 'Consistency King', icon: 'calendar-check', color: '#4CAF50', unlocked: true },
  ];

  const handleSaveProfile = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUserData(editData);
      setIsEditing(false);
      setIsLoading(false);
      Alert.alert('Success', 'Profile updated successfully!');
    }, 1000);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    // Navigate to login screen
    navigation.replace('Login');
  };

  const handleSettingToggle = (setting) => {
    setEditData({
      ...editData,
      settings: {
        ...editData.settings,
        [setting]: !editData.settings[setting],
      },
    });
  };

  const renderHeader = () => (
    <LinearGradient
      colors={['#0A0E17', '#161B22']}
      style={styles.header}
    >
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back-ios" size={24} color="#FFF" />
      </TouchableOpacity>
      
      <Text style={styles.headerTitle}>Profile</Text>
      
      <TouchableOpacity 
        style={styles.editButton}
        onPress={() => setIsEditing(!isEditing)}
      >
        <Feather 
          name={isEditing ? "x" : "edit-2"} 
          size={22} 
          color={isEditing ? "#FF5252" : "#00C853"} 
        />
      </TouchableOpacity>
    </LinearGradient>
  );

  const renderProfileHeader = () => (
    <View style={styles.profileHeader}>
      <TouchableOpacity style={styles.avatarContainer}>
        {editData.avatar ? (
          <Image source={{ uri: editData.avatar }} style={styles.avatar} />
        ) : (
          <LinearGradient
            colors={['#00C853', '#64DD17']}
            style={styles.avatarGradient}
          >
            <Text style={styles.avatarText}>
              {editData.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </LinearGradient>
        )}
        {isEditing && (
          <TouchableOpacity style={styles.cameraButton}>
            <Feather name="camera" size={18} color="#FFF" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      
      <View style={styles.profileInfo}>
        {isEditing ? (
          <TextInput
            style={[styles.nameText, styles.editInput]}
            value={editData.name}
            onChangeText={(text) => setEditData({...editData, name: text})}
            placeholder="Enter your name"
            placeholderTextColor="#8B949E"
          />
        ) : (
          <Text style={styles.nameText}>{userData.name}</Text>
        )}
        
        <View style={styles.membershipBadge}>
          <FontAwesome5 name="crown" size={12} color="#FFD700" />
          <Text style={styles.membershipText}>{userData.membershipLevel}</Text>
        </View>
        
        <Text style={styles.joinDate}>Member since {userData.joinDate}</Text>
      </View>
    </View>
  );

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <Text style={styles.sectionTitle}>Your Stats</Text>
      <View style={styles.statsGrid}>
        <LinearGradient
          colors={['rgba(0, 200, 83, 0.2)', 'rgba(100, 221, 23, 0.1)']}
          style={styles.statCard}
        >
          <MaterialIcons name="fitness-center" size={28} color="#00C853" />
          <Text style={styles.statNumber}>{userData.stats.workoutsCompleted}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </LinearGradient>
        
        <LinearGradient
          colors={['rgba(255, 87, 34, 0.2)', 'rgba(255, 152, 0, 0.1)']}
          style={styles.statCard}
        >
          <MaterialIcons name="local-fire-department" size={28} color="#FF5722" />
          <Text style={styles.statNumber}>{userData.stats.currentStreak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </LinearGradient>
        
        <LinearGradient
          colors={['rgba(76, 175, 80, 0.2)', 'rgba(139, 195, 74, 0.1)']}
          style={styles.statCard}
        >
          <FontAwesome5 name="burn" size={24} color="#4CAF50" />
          <Text style={styles.statNumber}>{(userData.stats.totalCalories / 1000).toFixed(1)}k</Text>
          <Text style={styles.statLabel}>Calories</Text>
        </LinearGradient>
        
        <LinearGradient
          colors={['rgba(33, 150, 243, 0.2)', 'rgba(30, 136, 229, 0.1)']}
          style={styles.statCard}
        >
          <MaterialIcons name="access-time" size={28} color="#2196F3" />
          <Text style={styles.statNumber}>{userData.stats.hoursTrained}</Text>
          <Text style={styles.statLabel}>Hours</Text>
        </LinearGradient>
      </View>
    </View>
  );

  const renderGoals = () => (
    <View style={styles.goalsContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Fitness Goals</Text>
        {isEditing && (
          <TouchableOpacity style={styles.editIconButton}>
            <Feather name="edit-2" size={18} color="#00C853" />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.goalsList}>
        {Object.entries(userData.goals).map(([key, value]) => (
          <View key={key} style={styles.goalItem}>
            <View style={styles.goalIconContainer}>
              {key === 'dailySteps' && <Feather name="activity" size={20} color="#00C853" />}
              {key === 'weight' && <FontAwesome5 name="weight" size={20} color="#FF9800" />}
              {key === 'bodyFat' && <MaterialIcons name="pie-chart" size={20} color="#F44336" />}
              {key === 'weeklyWorkouts' && <MaterialIcons name="fitness-center" size={20} color="#2196F3" />}
            </View>
            <View style={styles.goalContent}>
              <Text style={styles.goalTitle}>
                {key === 'dailySteps' ? 'Daily Steps' : 
                 key === 'weight' ? 'Target Weight' : 
                 key === 'bodyFat' ? 'Body Fat %' : 'Weekly Workouts'}
              </Text>
              {isEditing ? (
                <TextInput
                  style={[styles.goalValue, styles.editInput]}
                  value={value.toString()}
                  onChangeText={(text) => setEditData({
                    ...editData,
                    goals: { ...editData.goals, [key]: parseFloat(text) || 0 }
                  })}
                  keyboardType="numeric"
                />
              ) : (
                <Text style={styles.goalValue}>
                  {value} {key === 'dailySteps' ? '' : key === 'weight' ? 'kg' : key === 'bodyFat' ? '%' : ''}
                </Text>
              )}
            </View>
            <View style={styles.goalProgress}>
              <View style={[styles.progressBar, { width: '75%' }]} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderAchievements = () => (
    <View style={styles.achievementsContainer}>
      <Text style={styles.sectionTitle}>Achievements</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.achievementsScroll}
      >
        {achievements.map((achievement) => (
          <View 
            key={achievement.id} 
            style={[
              styles.achievementCard,
              !achievement.unlocked && styles.achievementLocked
            ]}
          >
            <View style={[
              styles.achievementIcon,
              { backgroundColor: achievement.color + '20' }
            ]}>
              <FontAwesome5 
                name={achievement.icon} 
                size={24} 
                color={achievement.unlocked ? achievement.color : '#30363D'} 
              />
            </View>
            <Text style={[
              styles.achievementTitle,
              !achievement.unlocked && styles.achievementTitleLocked
            ]}>
              {achievement.title}
            </Text>
            {!achievement.unlocked && (
              <MaterialIcons name="lock" size={16} color="#8B949E" style={styles.lockIcon} />
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderSettings = () => (
    <View style={styles.settingsContainer}>
      <Text style={styles.sectionTitle}>Settings</Text>
      
      <View style={styles.settingsList}>
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <MaterialIcons name="notifications" size={24} color="#00C853" />
            <Text style={styles.settingText}>Notifications</Text>
          </View>
          <Switch
            value={editData.settings.notifications}
            onValueChange={() => handleSettingToggle('notifications')}
            trackColor={{ false: '#30363D', true: '#00C853' }}
            thumbColor="#FFF"
          />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <MaterialIcons name="dark-mode" size={24} color="#673AB7" />
            <Text style={styles.settingText}>Dark Mode</Text>
          </View>
          <Switch
            value={editData.settings.darkMode}
            onValueChange={() => handleSettingToggle('darkMode')}
            trackColor={{ false: '#30363D', true: '#673AB7' }}
            thumbColor="#FFF"
          />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <MaterialIcons name="videocam" size={24} color="#2196F3" />
            <Text style={styles.settingText}>Auto-play Videos</Text>
          </View>
          <Switch
            value={editData.settings.autoPlayVideos}
            onValueChange={() => handleSettingToggle('autoPlayVideos')}
            trackColor={{ false: '#30363D', true: '#2196F3' }}
            thumbColor="#FFF"
          />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <MaterialIcons name="privacy-tip" size={24} color="#FF9800" />
            <Text style={styles.settingText}>Private Profile</Text>
          </View>
          <Switch
            value={editData.settings.privateProfile}
            onValueChange={() => handleSettingToggle('privateProfile')}
            trackColor={{ false: '#30363D', true: '#FF9800' }}
            thumbColor="#FFF"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderActionButtons = () => (
    <View style={styles.actionButtonsContainer}>
      {isEditing ? (
        <TouchableOpacity
          style={[styles.actionButton, styles.saveButton]}
          onPress={handleSaveProfile}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <MaterialIcons name="check" size={22} color="#FFF" />
              <Text style={styles.actionButtonText}>Save Changes</Text>
            </>
          )}
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity style={[styles.actionButton, styles.shareButton]}>
            <Feather name="share-2" size={20} color="#FFF" />
            <Text style={styles.actionButtonText}>Share Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.logoutButton]}
            onPress={handleLogout}
          >
            <MaterialIcons name="logout" size={20} color="#FF5252" />
            <Text style={[styles.actionButtonText, styles.logoutText]}>Logout</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  const renderLogoutModal = () => (
    <Modal
      visible={showLogoutModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowLogoutModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <MaterialIcons name="warning" size={32} color="#FF5252" />
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to logout? Your progress will be saved.
            </Text>
          </View>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowLogoutModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.confirmButton]}
              onPress={confirmLogout}
            >
              <Text style={styles.confirmButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0E17" />
      
      {renderHeader()}
      
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderProfileHeader()}
        {renderStats()}
        {renderGoals()}
        {renderAchievements()}
        {renderSettings()}
        {renderActionButtons()}
      </ScrollView>
      
      {renderLogoutModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0E17',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#30363D',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  editButton: {
    padding: 8,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#161B22',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 20,
  },
  avatarGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#00C853',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#161B22',
  },
  profileInfo: {
    flex: 1,
  },
  nameText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 6,
  },
  editInput: {
    backgroundColor: '#0A0E17',
    borderWidth: 1,
    borderColor: '#30363D',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFF',
  },
  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  membershipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFD700',
    marginLeft: 6,
  },
  joinDate: {
    fontSize: 14,
    color: '#8B949E',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 60) / 2,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 12,
    color: '#8B949E',
    marginTop: 4,
    fontWeight: '500',
  },
  goalsContainer: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  editIconButton: {
    padding: 8,
  },
  goalsList: {
    backgroundColor: '#161B22',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  goalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0A0E17',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  goalContent: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 14,
    color: '#8B949E',
    marginBottom: 4,
  },
  goalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  goalProgress: {
    width: 60,
    height: 6,
    backgroundColor: '#30363D',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#00C853',
    borderRadius: 3,
  },
  achievementsContainer: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  achievementsScroll: {
    paddingVertical: 5,
  },
  achievementCard: {
    width: 120,
    backgroundColor: '#161B22',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  achievementLocked: {
    opacity: 0.7,
  },
  achievementIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 18,
  },
  achievementTitleLocked: {
    color: '#8B949E',
  },
  lockIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  settingsContainer: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  settingsList: {
    backgroundColor: '#161B22',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#30363D',
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#30363D',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: '#FFF',
    marginLeft: 15,
    fontWeight: '500',
  },
  actionButtonsContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: '#00C853',
  },
  shareButton: {
    backgroundColor: '#2196F3',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 82, 82, 0.1)',
    borderWidth: 1,
    borderColor: '#FF5252',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginLeft: 10,
  },
  logoutText: {
    color: '#FF5252',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#161B22',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
    marginTop: 16,
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 16,
    color: '#8B949E',
    textAlign: 'center',
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#30363D',
  },
  confirmButton: {
    backgroundColor: '#FF5252',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});

export default FitnessProfileScreen;