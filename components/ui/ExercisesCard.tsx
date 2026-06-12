import { Colors } from '@/constants/Colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useEffect, useRef } from 'react';
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
    // Trigger shake whenever isComplete changes
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 5, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -5, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 4, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -4, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
    ]).start();
  }, [isComplete]);

  const handleTouch = () => {
    updateWorkoutsList(id);
  };

  return (
    <Pressable onPress={handleTouch}>
      <View style={[styles.container, { backgroundColor: isComplete ? "rgba(88, 90, 93, 0.74)" : "#2a302e3d" }]}>
        <View style={styles.cardHeading}>
          <View style={styles.headingNumber}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{id}</Text>
          </View>
          <View>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: textPimary }}>{name}</Text>
            <View style={{ marginTop: 2, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <MaterialCommunityIcons name="repeat-variant" size={24} color="rgba(34, 199, 160, 1)" />
              <Text style={{ color: textSecondary, fontWeight: 'bold' }}>Sets: {reps.length}</Text>
            </View>
          </View>
        </View>

        {/* Shaking reps container */}
        <Animated.View
          style={[
            styles.repsContainer,
            {
              backgroundColor: isComplete ? "rgba(50, 51, 52, 1)" : "#23242492",
              transform: [{ translateX: shakeAnim }],
            },
          ]}
        >
          {reps.map((rep, index) => (
            <RepsCard id={id} isCompleted={isComplete} reps={rep} index={index} key={index} />
          ))}
        </Animated.View>

        <View style={styles.markCompleted}>
          <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 15, color: isComplete ? 'rgba(33, 167, 149, 1)' : 'rgba(74, 81, 87, 1)' }}>
            {isComplete ? "Workout Completed" : "Mark as Completed"}
          </Text>
          <MaterialCommunityIcons name="check-circle" size={24} color={isComplete ? 'rgba(33, 167, 149, 1)' : 'rgba(74, 81, 87, 1)'} />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    padding: 10,
    marginBottom: 10,
    borderRadius: 20,
  },
  cardHeading: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headingNumber: {
    height: 40,
    width: 40,
    margin: 10,
    backgroundColor: "rgba(108, 114, 120, 1)",
    alignItems: 'center',
    justifyContent: "center",
    borderRadius: 30,
  },
  repsContainer: {
    borderRadius: 20,
    padding: 10,
    margin: 10,
  },
  markCompleted: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 20,
    padding: 10,
  },
});

export default ExercisesCard;
