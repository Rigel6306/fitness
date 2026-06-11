'use client'
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { secondaryBackground, cardBackgroundSecondary, textPimary, textSecondary } = Colors;
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
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 350,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false, // Layout animations on width cannot leverage native drivers
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
          duration: 250,
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
        activeOpacity={0.85}
        style={[
          styles.dayOption,
          isSelected ? styles.dayOptionSelected : styles.dayOptionPending,
        ]}
        onPress={() => setSelectedDayIndex(index)}
      >
        <View style={styles.dayOptionHeader}>
          <View style={[
            styles.dayOptionNumber,
            isSelected && styles.dayOptionNumberSelected
          ]}>
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
            <Text style={styles.dayOptionFocus} numberOfLines={1}>
              {day.focus}
            </Text>
          </View>
          
          {isSelected ? (
            <Ionicons name="checkmark-circle" size={22} color="#4cddbb" />
          ) : (
            <Ionicons name="chevron-forward" size={18} color="#8E9492" />
          )}
        </View>
        
        <View style={styles.workoutPreview}>
          {day.workouts.slice(0, 2).map((workout: string, i: number) => (
            <Text key={i} style={styles.workoutPreviewText} numberOfLines={1}>
              • {workout}
            </Text>
          ))}
          {day.workouts.length > 2 && (
            <Text style={styles.workoutPreviewText}>• ...and more exercises</Text>
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
      statusBarTranslucent
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.closeArea}
          activeOpacity={1}
          onPress={onClose}
        />
        
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.modalGradient}>
            {/* Structural Custom Action Close Layer */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            
            {/* Modal Header Panel Area */}
            <View style={styles.modalHeader}>
              <View style={styles.challengeIcon}>
                <Ionicons name="trophy" size={24} color="#4c75dd" />
              </View>
              
              <Text style={styles.modalTitle}>Start Challenge</Text>
              <Text style={styles.modalSubtitle}>
                Begin your {challengeData.duration}-day journey
              </Text>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
                </View>
                <Text style={styles.progressText}>Select your starting point</Text>
              </View>
            </View>
            
            {/* Scrollable Container Elements Layer */}
            <View style={styles.modalContent}>
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
                
                {/* Challenge Main Overview Card */}
                <View style={styles.challengeInfoCard}>
                  <Text style={styles.challengeName}>{challengeData.title}</Text>
                  <Text style={styles.challengeDescription}>
                    {challengeData.discription}
                  </Text>
                  
                  <View style={styles.stylesDivider} />
                  
                  <View style={styles.statsGrid}>
                    <View style={styles.statBox}>
                      <Ionicons name="calendar-outline" size={18} color="#4cddbb" />
                      <Text style={styles.statValue}>{challengeData.duration} Days</Text>
                      <Text style={styles.statLabel}>Duration</Text>
                    </View>
                    
                    <View style={styles.statBox}>
                      <Ionicons name="fitness-outline" size={18} color="#9d62ff" />
                      <Text style={styles.statValue}>{challengeData.schedule.length}</Text>
                      <Text style={styles.statLabel}>Workouts</Text>
                    </View>
                    
                    <View style={styles.statBox}>
                      <Ionicons name="flash-outline" size={18} color="#ffb03a" />
                      <Text style={styles.statValue}>{challengeData.level}</Text>
                      <Text style={styles.statLabel}>Difficulty</Text>
                    </View>
                  </View>
                </View>
                
                {/* Dynamic List Configuration Layer */}
                <View style={styles.daysSection}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="list" size={18} color="#FFFFFF" />
                    <Text style={styles.sectionTitle}>Select Starting Day</Text>
                  </View>
                  <Text style={styles.sectionDescription}>
                    Choose where to begin your challenge journey
                  </Text>
                  
                  {challengeData.schedule.map((day: any, index: number) =>
                    renderDayOption(day, index)
                  )}
                </View>
                
                {/* Preparation Guide Card Panel */}
                <View style={styles.tipsCard}>
                  <View style={styles.tipsHeader}>
                    <Ionicons name="bulb" size={18} color="#ffb03a" />
                    <Text style={styles.tipsTitle}>Before You Start</Text>
                  </View>
                  
                  <View style={styles.tipsGrid}>
                    {[
                      "Wear comfortable workout clothes",
                      "Have water ready for hydration",
                      "Clear enough space for movement",
                      "Warm up for 5-10 minutes"
                    ].map((text, idx) => (
                      <View key={idx} style={styles.tipItem}>
                        <Ionicons name="checkmark-circle-outline" size={15} color="#ffb03a" />
                        <Text style={styles.tipText}>{text}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </ScrollView>
            </View>
            
            {/* Fixed Action Button Footer Core */}
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
                <Ionicons name="play-sharp" size={16} color="#060708" />
                <Text style={styles.primaryActionText}>
                  Start Day {selectedDayIndex + 1}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 4, 5, 0.7)', // Premium translucent dark mesh backdrop
    justifyContent: 'flex-end',
  },
  closeArea: {
    flex: 1,
  },
  modalContainer: {
    height: height * 0.92,
    backgroundColor: '#060708a4', // Matches master dark skin
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  modalGradient: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 12,
    width: 32,
    height: 32,
    borderRadius: 99,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeader: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    alignItems: 'center',
  },
  challengeIcon: {
    width: 52,
    height: 52,
    borderRadius: 99,
    backgroundColor: '#243665',
    borderWidth: 1,
    borderColor: '#4c75dd',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#8E9492',
    fontWeight: '500',
    marginTop: 2,
    marginBottom: 16,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 99,
    marginBottom: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4c75dd',
    borderRadius: 99,
  },
  progressText: {
    fontSize: 11,
    color: '#8E9492',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#000000', // Slightly deeper content valley backdrop
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  scrollPadding: {
    paddingBottom: 24,
  },
  challengeInfoCard: {
    backgroundColor: 'rgba(24, 50, 98, 0.42)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 20,
    padding: 16,
    margin: 16,
    marginBottom: 8,
  },
  challengeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  challengeDescription: {
    fontSize: 13,
    color: '#8E9492',
    lineHeight: 18,
    marginTop: 6,
    fontWeight: '500',
  },
  stylesDivider: {
    height: 1,
    backgroundColor: 'rgba(36, 117, 164, 0.49)',
    marginVertical: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 14,
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
  daysSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sectionDescription: {
    fontSize: 13,
    color: '#8E9492',
    marginTop: 2,
    marginBottom: 14,
    fontWeight: '500',
  },
  dayOption: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
  },
  dayOptionPending: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  dayOptionSelected: {
    backgroundColor: 'rgba(76, 221, 187, 0.03)',
    borderColor: 'rgba(76, 221, 187, 0.2)',
  },
  dayOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayOptionNumber: {
    width: 28,
    height: 28,
    borderRadius: 99,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dayOptionNumberSelected: {
    backgroundColor: 'rgba(76, 221, 187, 0.1)',
    borderColor: 'rgba(76, 221, 187, 0.25)',
  },
  dayOptionNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8E9492',
  },
  dayOptionNumberTextSelected: {
    color: '#4cddbb',
  },
  dayOptionInfo: {
    flex: 1,
    paddingRight: 8,
  },
  dayOptionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B0B5B3',
  },
  dayOptionTitleSelected: {
    color: '#FFFFFF',
  },
  dayOptionFocus: {
    fontSize: 12,
    color: '#8E9492',
    fontWeight: '500',
    marginTop: 1,
  },
  workoutPreview: {
    marginLeft: 40,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.03)',
    gap: 2,
  },
  workoutPreviewText: {
    fontSize: 12,
    color: '#8E9492',
    fontWeight: '500',
  },
  tipsCard: {
    backgroundColor: 'rgba(255, 176, 58, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 176, 58, 0.1)',
    borderRadius: 16,
    padding: 16,
    margin: 16,
    marginTop: 8,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffb03a',
  },
  tipsGrid: {
    gap: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tipText: {
    fontSize: 12,
    color: '#B0B5B3',
    fontWeight: '600',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    backgroundColor: '#0c0e12',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.04)',
    gap: 12,
  },
  primaryAction: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#4cddbb',
  },
  primaryActionText: {
    color: '#060708',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryAction: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 14,
  },
  secondaryActionText: {
    color: '#B0B5B3',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default ChallengeStartModal;