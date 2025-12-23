import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface ChallengeStartModalProps {
  visible: boolean;
  onClose: () => void;
  challengeData: any;
  onStartDay: (day: any) => void;
}

const ChallengeStartModal: React.FC<ChallengeStartModalProps> = ({
  visible,
  onClose,
  challengeData,
  onStartDay,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.bezier(0.175, 0.885, 0.32, 1.275),
          useNativeDriver: true,
        }),
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleStartChallenge = () => {
    onStartDay(challengeData.schedule[selectedDayIndex]);
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const renderDayOption = (day: any, index: number) => {
    const isSelected = selectedDayIndex === index;
    
    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.dayOption,
          isSelected && styles.dayOptionSelected,
        ]}
        onPress={() => setSelectedDayIndex(index)}
      >
        <Animated.View style={[
          styles.dayOptionGlow,
          {
            opacity: isSelected ? fadeAnim : 0,
          }
        ]} />
        
        <View style={styles.dayOptionHeader}>
          <View style={styles.dayOptionNumber}>
            <Text style={[
              styles.dayOptionNumberText,
              isSelected && styles.dayOptionNumberTextSelected
            ]}>
              {index + 1}
            </Text>
          </View>
          
          <View style={styles.dayOptionInfo}>
            <Text style={[
              styles.dayOptionTitle,
              isSelected && styles.dayOptionTitleSelected
            ]}>
              {day.day}
            </Text>
            <Text style={[
              styles.dayOptionFocus,
              isSelected && styles.dayOptionFocusSelected
            ]}>
              {day.focus}
            </Text>
          </View>
          
          {isSelected ? (
            <Ionicons name="checkmark-circle" size={24} color="#667eea" />
          ) : (
            <Ionicons name="chevron-forward" size={20} color="#999" />
          )}
        </View>
        
        <View style={styles.workoutPreview}>
          {day.workouts.slice(0, 2).map((workout: string, i: number) => (
            <Text key={i} style={styles.workoutPreviewText}>
              • {workout}
            </Text>
          ))}
          {day.workouts.length > 2 && (
            <Text style={styles.workoutPreviewText}>• ...and more</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="dark" />
        
        <TouchableOpacity
          style={styles.closeArea}
          activeOpacity={1}
          onPress={onClose}
        />
        
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.modalGradient}
          >
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={28} color="#FFF" />
            </TouchableOpacity>
            
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.challengeIcon}>
                <Ionicons name="trophy" size={32} color="#FFF" />
              </View>
              
              <Text style={styles.modalTitle}>
                Start Challenge
              </Text>
              <Text style={styles.modalSubtitle}>
                Begin your {challengeData.duration}-day journey
              </Text>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
                </View>
                <Text style={styles.progressText}>
                  Select your starting point
                </Text>
              </View>
            </View>
            
            {/* Modal Content */}
            <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Challenge Info Card */}
                <View style={styles.challengeInfoCard}>
                  <Text style={styles.challengeName}>{challengeData.title}</Text>
                  <Text style={styles.challengeDescription}>
                    {challengeData.discription}
                  </Text>
                  
                  <View style={styles.statsGrid}>
                    <View style={styles.statBox}>
                      <Ionicons name="calendar-outline" size={20} color="#667eea" />
                      <Text style={styles.statValue}>{challengeData.duration} days</Text>
                      <Text style={styles.statLabel}>Duration</Text>
                    </View>
                    
                    <View style={styles.statBox}>
                      <Ionicons name="fitness-outline" size={20} color="#667eea" />
                      <Text style={styles.statValue}>{challengeData.schedule.length}</Text>
                      <Text style={styles.statLabel}>Workouts</Text>
                    </View>
                    
                    <View style={styles.statBox}>
                      <Ionicons name="flash-outline" size={20} color="#667eea" />
                      <Text style={styles.statValue}>{challengeData.level}</Text>
                      <Text style={styles.statLabel}>Level</Text>
                    </View>
                  </View>
                </View>
                
                {/* Days Selection */}
                <View style={styles.daysSection}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="list-outline" size={20} color="#333" />
                    <Text style={styles.sectionTitle}>Select Starting Day</Text>
                  </View>
                  
                  <Text style={styles.sectionDescription}>
                    Choose where to begin your challenge journey
                  </Text>
                  
                  {challengeData.schedule.map((day: any, index: number) =>
                    renderDayOption(day, index)
                  )}
                </View>
                
                {/* Preparation Tips */}
                <View style={styles.tipsCard}>
                  <View style={styles.tipsHeader}>
                    <Ionicons name="bulb-outline" size={20} color="#FF9800" />
                    <Text style={styles.tipsTitle}>Before You Start</Text>
                  </View>
                  
                  <View style={styles.tipItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={styles.tipText}>Wear comfortable workout clothes</Text>
                  </View>
                  <View style={styles.tipItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={styles.tipText}>Have water ready for hydration</Text>
                  </View>
                  <View style={styles.tipItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={styles.tipText}>Clear enough space for movement</Text>
                  </View>
                  <View style={styles.tipItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={styles.tipText}>Warm up for 5-10 minutes</Text>
                  </View>
                </View>
              </ScrollView>
            </Animated.View>
            
            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.secondaryAction}
                onPress={onClose}
              >
                <Text style={styles.secondaryActionText}>Not Now</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.primaryAction}
                onPress={handleStartChallenge}
              >
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
                <Ionicons name="play-circle" size={24} color="#FFF" />
                <Text style={styles.primaryActionText}>
                  Start Day {selectedDayIndex + 1}
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  closeArea: {
    flex: 1,
  },
  modalContainer: {
    height: height * 0.85,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 30,
  },
  modalGradient: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeader: {
    padding: 30,
    paddingBottom: 20,
    alignItems: 'center',
  },
  challengeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 25,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  challengeInfoCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
  },
  challengeName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  challengeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  daysSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  dayOption: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dayOptionSelected: {
    borderColor: '#667eea',
    borderWidth: 2,
    backgroundColor: '#f8f9ff',
  },
  dayOptionGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 15,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
  },
  dayOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayOptionNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dayOptionNumberSelected: {
    backgroundColor: '#667eea',
  },
  dayOptionNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  dayOptionNumberTextSelected: {
    color: '#FFF',
  },
  dayOptionInfo: {
    flex: 1,
  },
  dayOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  dayOptionTitleSelected: {
    color: '#667eea',
  },
  dayOptionFocus: {
    fontSize: 14,
    color: '#666',
  },
  dayOptionFocusSelected: {
    color: '#667eea',
  },
  workoutPreview: {
    marginLeft: 48,
  },
  workoutPreviewText: {
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
    marginBottom: 2,
  },
  tipsCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: 15,
    padding: 20,
    margin: 20,
    marginTop: 10,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF9800',
    marginLeft: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 10,
    backgroundColor: '#F8F9FA',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  primaryAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 15,
    overflow: 'hidden',
    marginLeft: 12,
  },
  primaryActionText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryAction: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  secondaryActionText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ChallengeStartModal;