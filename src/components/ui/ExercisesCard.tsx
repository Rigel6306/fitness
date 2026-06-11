'use client'
import { Colors } from '@/constants/Colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import RepsCard from './RepsCard';

const { textPimary, textSecondary } = Colors;

interface ExercisesCardProps {
  id: string | number;
  name: string;
  reps: (string | number)[];
  isComplete: boolean;
  updateWorkoutsList: (id: string | number) => void;
}

const ExercisesCard = ({ id, name, reps, isComplete, updateWorkoutsList }: ExercisesCardProps) => {

  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 4, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -4, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 3, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -3, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  }, [isComplete]);

  const handleTouch = () => {
    updateWorkoutsList(id);
  };

  return (
    <Pressable onPress={handleTouch} style={styles.pressableRoot}>
      <View style={[
        styles.container, 
        isComplete ? styles.containerCompleted : styles.containerPending
      ]}>
        
        {/* Header Block Section */}
        <View style={styles.cardHeading}>
          <View style={[styles.headingNumber, isComplete && styles.headingNumberCompleted]}>
            <Text style={styles.headingNumberText}>{id}</Text>
          </View>
          
          <View style={styles.headingDetails}>
            <Text style={[styles.exerciseName, isComplete && styles.textMuted]}>{name}</Text>
            <View style={styles.setsMetaRow}>
              <MaterialCommunityIcons name="repeat-variant" size={16} color="#4cddbb" />
              <Text style={styles.setsMetaText}>Sets: {reps.length}</Text>
            </View>
          </View>
        </View>

        {/* Shaking Reps Tray */}
        <Animated.View
          style={[
            styles.repsContainer,
            { transform: [{ translateX: shakeAnim }] },
            isComplete ? styles.repsContainerCompleted : styles.repsContainerPending
          ]}
        >
          {reps.map((rep, index) => (
            <RepsCard id={id} isCompleted={isComplete} reps={rep} index={index} key={index} />
          ))}
        </Animated.View>

        {/* Dynamic Action Trigger Label */}
        <View style={[styles.markCompleted, isComplete && styles.markCompletedActive]}>
          <Text style={[
            styles.completedStatusText, 
            { color: isComplete ? '#4cddbb' : '#8E9492' }
          ]}>
            {isComplete ? "Workout Completed" : "Mark as Completed"}
          </Text>
          <MaterialCommunityIcons 
            name={isComplete ? "check-circle" : "check-circle-outline"} 
            size={18} 
            color={isComplete ? '#4cddbb' : '#8E9492'} 
          />
        </View>

      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressableRoot: {
    width: '100%',
  },
  container: {
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    marginVertical: 4,
  },
  containerPending: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  containerCompleted: {
    backgroundColor: 'rgba(76, 221, 187, 0.02)',
    borderColor: 'rgba(76, 221, 187, 0.15)',
  },
  cardHeading: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headingNumber: {
    height: 36,
    width: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: "center",
    borderRadius: 99,
  },
  headingNumberCompleted: {
    backgroundColor: 'rgba(76, 221, 187, 0.1)',
    borderColor: 'rgba(76, 221, 187, 0.25)',
  },
  headingNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headingDetails: {
    marginLeft: 14,
    flex: 1,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  setsMetaRow: {
    marginTop: 4,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  setsMetaText: {
    color: '#8E9492',
    fontSize: 12,
    fontWeight: '600',
  },
  textMuted: {
    color: '#8E9492',
    textDecorationLine: 'line-through',
    opacity: 0.8,
  },
  repsContainer: {
    borderRadius: 14,
    padding: 12,
    marginTop: 14,
    marginBottom: 8,
    borderWidth: 1,
  },
  repsContainerPending: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  repsContainerCompleted: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderColor: 'rgba(255, 255, 255, 0.02)',
    opacity: 0.6,
  },
  markCompleted: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    marginTop: 6,
  },
  markCompletedActive: {
    backgroundColor: 'rgba(76, 221, 187, 0.05)',
    borderColor: 'rgba(76, 221, 187, 0.1)',
  },
  completedStatusText: {
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: -0.1,
  },
});

export default ExercisesCard;