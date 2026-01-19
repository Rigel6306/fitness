import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const FitnessProfileScreen = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    height: '175 cm',
    weight: '72 kg',
    goalWeight: '68 kg',
    age: '28',
    dailyStepsGoal: '10000',
    dailyCalorieGoal: '2200',
    notifications: true,
    darkMode: false,
  });
  const [tempData, setTempData] = useState({ ...userData });
  const [profileImage, setProfileImage] = useState('https://randomuser.me/api/portraits/men/32.jpg');
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Fitness stats data
  const fitnessStats = [
    { label: 'Workouts', value: '24', icon: 'fitness', color: '#4a6fff' },
    { label: 'Active Days', value: '18', icon: 'calendar', color: '#ff6b6b' },
    { label: 'Current Streak', value: '7', icon: 'flame', color: '#ff9500' },
    { label: 'Total Calories', value: '12,450', icon: 'flash', color: '#4cd964' },
  ];

  // Recent activities
  const recentActivities = [
    { type: 'Running', duration: '45 min', date: 'Today', calories: '420' },
    { type: 'Weight Training', duration: '60 min', date: 'Yesterday', calories: '320' },
    { type: 'Yoga', duration: '30 min', date: '2 days ago', calories: '180' },
    { type: 'Cycling', duration: '50 min', date: '3 days ago', calories: '380' },
  ];

  const handleSave = () => {
    setUserData({ ...tempData });
    setIsEditing(false);
    Alert.alert('Profile Updated', 'Your changes have been saved successfully.');
  };

  const handleCancel = () => {
    setTempData({ ...userData });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setTempData({ ...tempData, [field]: value });
  };

  const renderStatIcon = (iconName, color) => {
    switch (iconName) {
      case 'fitness':
        return <Ionicons name="fitness" size={24} color={color} />;
      case 'calendar':
        return <Feather name="calendar" size={24} color={color} />;
      case 'flame':
        return <Ionicons name="flame" size={24} color={color} />;
      case 'flash':
        return <Ionicons name="flash" size={24} color={color} />;
      default:
        return <Ionicons name="fitness" size={24} color={color} />;
    }
  };

  const renderProfileContent = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <TouchableOpacity style={styles.imageContainer}>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
          <TouchableOpacity style={styles.editImageButton}>
            <Ionicons name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        </TouchableOpacity>
        
        <Text style={styles.userName}>{userData.name}</Text>
        <Text style={styles.userEmail}>{userData.email}</Text>
        
        <View style={styles.memberSinceContainer}>
          <Text style={styles.memberSinceText}>Member since Jan 2023</Text>
        </View>
      </View>

      {/* Fitness Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Fitness Stats</Text>
        <View style={styles.statsGrid}>
          {fitnessStats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: `${stat.color}15` }]}>
                {renderStatIcon(stat.icon, stat.color)}
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Personal Information */}
      <View style={styles.infoContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Feather name="edit-2" size={20} color="#4a6fff" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Height</Text>
            <Text style={styles.infoValue}>{userData.height}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Weight</Text>
            <Text style={styles.infoValue}>{userData.weight}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Goal Weight</Text>
            <Text style={styles.infoValue}>{userData.goalWeight}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Age</Text>
            <Text style={styles.infoValue}>{userData.age}</Text>
          </View>
        </View>
        
        <View style={styles.goalContainer}>
          <View>
            <Text style={styles.infoLabel}>Daily Steps Goal</Text>
            <Text style={styles.infoValue}>{userData.dailyStepsGoal} steps</Text>
          </View>
          <TouchableOpacity 
            style={styles.changeGoalButton}
            onPress={() => setShowGoalModal(true)}
          >
            <Text style={styles.changeGoalText}>Change Goal</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activities */}
      <View style={styles.activitiesContainer}>
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        {recentActivities.map((activity, index) => (
          <TouchableOpacity key={index} style={styles.activityItem}>
            <View style={styles.activityIconContainer}>
              {activity.type === 'Running' && <FontAwesome5 name="running" size={20} color="#4a6fff" />}
              {activity.type === 'Weight Training' && <Ionicons name="barbell" size={20} color="#ff6b6b" />}
              {activity.type === 'Yoga' && <FontAwesome5 name="spa" size={20} color="#4cd964" />}
              {activity.type === 'Cycling' && <FontAwesome5 name="bicycle" size={20} color="#ff9500" />}
            </View>
            <View style={styles.activityDetails}>
              <Text style={styles.activityType}>{activity.type}</Text>
              <Text style={styles.activityMeta}>{activity.duration} • {activity.date}</Text>
            </View>
            <View style={styles.activityCalories}>
              <Text style={styles.caloriesValue}>{activity.calories}</Text>
              <Text style={styles.caloriesLabel}>calories</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Settings Section */}
      <View style={styles.settingsContainer}>
        <Text style={styles.sectionTitle}>Settings</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications" size={22} color="#4a6fff" />
            <Text style={styles.settingText}>Notifications</Text>
          </View>
          <Switch
            value={userData.notifications}
            onValueChange={(value) => handleInputChange('notifications', value)}
            trackColor={{ false: '#ddd', true: '#4a6fff' }}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="moon" size={22} color="#4a6fff" />
            <Text style={styles.settingText}>Dark Mode</Text>
          </View>
          <Switch
            value={userData.darkMode}
            onValueChange={(value) => handleInputChange('darkMode', value)}
            trackColor={{ false: '#ddd', true: '#4a6fff' }}
          />
        </View>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="lock-closed" size={22} color="#4a6fff" />
            <Text style={styles.settingText}>Privacy & Security</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#a0a4b8" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="help-circle" size={22} color="#4a6fff" />
            <Text style={styles.settingText}>Help & Support</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#a0a4b8" />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.settingItem, styles.logoutButton]}>
          <View style={styles.settingLeft}>
            <Ionicons name="log-out" size={22} color="#ff6b6b" />
            <Text style={[styles.settingText, { color: '#ff6b6b' }]}>Log Out</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  const renderEditContent = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.editHeader}>
        <Text style={styles.editTitle}>Edit Profile</Text>
        <Text style={styles.editSubtitle}>Update your personal information</Text>
      </View>

      <View style={styles.editForm}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput
            style={styles.textInput}
            value={tempData.name}
            onChangeText={(text) => handleInputChange('name', text)}
            placeholder="Enter your name"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.textInput}
            value={tempData.email}
            onChangeText={(text) => handleInputChange('email', text)}
            placeholder="Enter your email"
            keyboardType="email-address"
          />
        </View>
        
        <View style={styles.doubleInputContainer}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.inputLabel}>Height (cm)</Text>
            <TextInput
              style={styles.textInput}
              value={tempData.height}
              onChangeText={(text) => handleInputChange('height', text)}
              placeholder="Height"
              keyboardType="numeric"
            />
          </View>
          
          <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
            <Text style={styles.inputLabel}>Weight (kg)</Text>
            <TextInput
              style={styles.textInput}
              value={tempData.weight}
              onChangeText={(text) => handleInputChange('weight', text)}
              placeholder="Weight"
              keyboardType="numeric"
            />
          </View>
        </View>
        
        <View style={styles.doubleInputContainer}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.inputLabel}>Goal Weight (kg)</Text>
            <TextInput
              style={styles.textInput}
              value={tempData.goalWeight}
              onChangeText={(text) => handleInputChange('goalWeight', text)}
              placeholder="Goal weight"
              keyboardType="numeric"
            />
          </View>
          
          <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
            <Text style={styles.inputLabel}>Age</Text>
            <TextInput
              style={styles.textInput}
              value={tempData.age}
              onChangeText={(text) => handleInputChange('age', text)}
              placeholder="Age"
              keyboardType="numeric"
            />
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Daily Steps Goal</Text>
          <TextInput
            style={styles.textInput}
            value={tempData.dailyStepsGoal}
            onChangeText={(text) => handleInputChange('dailyStepsGoal', text)}
            placeholder="Daily steps goal"
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Daily Calorie Goal</Text>
          <TextInput
            style={styles.textInput}
            value={tempData.dailyCalorieGoal}
            onChangeText={(text) => handleInputChange('dailyCalorieGoal', text)}
            placeholder="Daily calorie goal"
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.editButtons}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7f9fc" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerIcons}>
          {!isEditing && (
            <TouchableOpacity style={styles.iconButton} onPress={() => setIsEditing(true)}>
              <Feather name="edit-2" size={22} color="#333745" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="settings-outline" size={24} color="#333745" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      {isEditing ? renderEditContent() : renderProfileContent()}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('home')}>
          <Ionicons name="home" size={24} color={activeTab === 'home' ? '#4a6fff' : '#a0a4b8'} />
          <Text style={[styles.navText, { color: activeTab === 'home' ? '#4a6fff' : '#a0a4b8' }]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('workout')}>
          <Ionicons name="fitness" size={24} color={activeTab === 'workout' ? '#4a6fff' : '#a0a4b8'} />
          <Text style={[styles.navText, { color: activeTab === 'workout' ? '#4a6fff' : '#a0a4b8' }]}>Workout</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('stats')}>
          <Ionicons name="stats-chart" size={24} color={activeTab === 'stats' ? '#4a6fff' : '#a0a4b8'} />
          <Text style={[styles.navText, { color: activeTab === 'stats' ? '#4a6fff' : '#a0a4b8' }]}>Stats</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('profile')}>
          <Ionicons name="person" size={24} color={activeTab === 'profile' ? '#4a6fff' : '#a0a4b8'} />
          <Text style={[styles.navText, { color: activeTab === 'profile' ? '#4a6fff' : '#a0a4b8' }]}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Goal Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showGoalModal}
        onRequestClose={() => setShowGoalModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Daily Goal</Text>
            
            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>Steps Goal</Text>
              <TextInput
                style={styles.modalInput}
                value={tempData.dailyStepsGoal}
                onChangeText={(text) => handleInputChange('dailyStepsGoal', text)}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>Calorie Goal</Text>
              <TextInput
                style={styles.modalInput}
                value={tempData.dailyCalorieGoal}
                onChangeText={(text) => handleInputChange('dailyCalorieGoal', text)}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setShowGoalModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalSaveButton]}
                onPress={() => {
                  handleInputChange('dailyStepsGoal', tempData.dailyStepsGoal);
                  handleInputChange('dailyCalorieGoal', tempData.dailyCalorieGoal);
                  setShowGoalModal(false);
                }}
              >
                <Text style={styles.modalSaveButtonText}>Update Goal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333745',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 15,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 25,
    backgroundColor: '#fff',
    marginBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#4a6fff',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4a6fff',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333745',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#a0a4b8',
    marginBottom: 15,
  },
  memberSinceContainer: {
    backgroundColor: '#f0f5ff',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
  },
  memberSinceText: {
    color: '#4a6fff',
    fontSize: 14,
    fontWeight: '500',
  },
  statsContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333745',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#f7f9fc',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333745',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#a0a4b8',
  },
  infoContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoItem: {
    width: '48%',
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#a0a4b8',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333745',
  },
  goalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  changeGoalButton: {
    backgroundColor: '#f0f5ff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changeGoalText: {
    color: '#4a6fff',
    fontWeight: '600',
    fontSize: 14,
  },
  activitiesContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f7f9fc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityDetails: {
    flex: 1,
  },
  activityType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333745',
    marginBottom: 3,
  },
  activityMeta: {
    fontSize: 14,
    color: '#a0a4b8',
  },
  activityCalories: {
    alignItems: 'flex-end',
  },
  caloriesValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333745',
  },
  caloriesLabel: {
    fontSize: 12,
    color: '#a0a4b8',
  },
  settingsContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: '#333745',
    marginLeft: 15,
  },
  logoutButton: {
    borderBottomWidth: 0,
  },
  bottomSpacing: {
    height: 80,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navText: {
    fontSize: 12,
    marginTop: 5,
  },
  editHeader: {
    backgroundColor: '#fff',
    paddingVertical: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  editTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333745',
    marginBottom: 5,
  },
  editSubtitle: {
    fontSize: 16,
    color: '#a0a4b8',
  },
  editForm: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#a0a4b8',
    marginBottom: 8,
    fontWeight: '500',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e4e8',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333745',
    backgroundColor: '#f7f9fc',
  },
  doubleInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333745',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: '#4a6fff',
    marginLeft: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 25,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333745',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInputGroup: {
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 14,
    color: '#a0a4b8',
    marginBottom: 8,
    fontWeight: '500',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#e0e4e8',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333745',
    backgroundColor: '#f7f9fc',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  modalCancelButtonText: {
    color: '#333745',
    fontSize: 16,
    fontWeight: '600',
  },
  modalSaveButton: {
    backgroundColor: '#4a6fff',
    marginLeft: 10,
  },
  modalSaveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FitnessProfileScreen;