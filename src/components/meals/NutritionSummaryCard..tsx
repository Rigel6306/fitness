import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type NutritionSummaryCardProps = {
  title: string;
  duration: number;
  mealCount: number;
};

export default function NutritionSummaryCard({ title, duration, mealCount }: NutritionSummaryCardProps) {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{duration} Weeks</Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <MaterialCommunityIcons name="silverware-clean" size={14} color="#8E9492" />
          <Text style={styles.metaText}>{mealCount} Daily Meals</Text>
        </View>
        <View style={styles.metaItem}>
          <MaterialCommunityIcons name="scale-balanced" size={14} color="#4cddbb" />
          <Text style={styles.metaText}>Macro Tracked</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    padding: 16,
    marginTop: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  badge: {
    backgroundColor: 'rgba(76, 221, 187, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(76, 221, 187, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#4cddbb',
    fontSize: 11,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginVertical: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: '#8E9492',
    fontSize: 13,
    fontWeight: '500',
  },
});