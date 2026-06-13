import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';

type MealItem = {
  id: string;
  type: string;
  time: string;
  targetCalories: number;
  isLogged: boolean;
};

type CurrentMealCardProps = {
  meal: MealItem;
  setModalVisible: (visible: boolean) => void;
  setSelectedMealType: (type: string) => void;
};

export default function CurrentMealCard({ meal, setModalVisible, setSelectedMealType }: CurrentMealCardProps) {
  const handlePress = () => {
    setSelectedMealType(meal.type);
    setModalVisible(true);
  };

  return (
    <Pressable 
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]} 
      onPress={handlePress}
    >
      <View style={styles.leftSection}>
        <View style={[styles.statusIconContainer, meal.isLogged && styles.statusIconLogged]}>
          {meal.isLogged ? (
            <Ionicons name="checkmark" size={16} color="#4cddbb" />
          ) : (
            <Feather name="clock" size={14} color="#8E9492" />
          )}
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.mealType}>{meal.type}</Text>
          <Text style={styles.mealTime}>{meal.time}</Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text style={styles.caloriesText}>{meal.targetCalories} kcal</Text>
        <Ionicons name="chevron-forward" size={16} color="#646866" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  cardPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIconLogged: {
    backgroundColor: 'rgba(76, 221, 187, 0.1)',
    borderColor: 'rgba(76, 221, 187, 0.2)',
  },
  infoContainer: {
    justifyContent: 'center',
  },
  mealType: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  mealTime: {
    color: '#8E9492',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  caloriesText: {
    color: '#B0B5B3',
    fontSize: 14,
    fontWeight: '600',
  },
});