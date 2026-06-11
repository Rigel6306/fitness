'use client'
import { Colors } from "@/constants/Colors";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";

const { textPimary, textSecondary } = Colors;

interface Exercise {
  id: number;
  name: string;
  reps: (number | string)[];
}

interface Workout {
  day: number;
  schedule: Exercise[];
}

interface CurentScheduleCardProps {
  workout: Workout;
  setModalVisible: (visible: boolean) => void;
  selectedDaySchedule: (workout: Workout) => void;
}

const CurentScheduleCard = ({
  workout,
  setModalVisible,
  selectedDaySchedule,
}: CurentScheduleCardProps) => {
  const maxItems = 3;
  const itemList = workout.schedule.slice(0, maxItems);
  const remainingCount = workout.schedule.length - maxItems;

  const handlePress = () => {
    selectedDaySchedule(workout); 
    console.log("Workout At Curent Schedule card", workout);
    setModalVisible(true);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [pressed && styles.pressedCard]}
    >
      <LinearGradient
        colors={["rgba(255, 255, 255, 0.05)", "rgba(255, 255, 255, 0.01)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.dayCardContainer}
      >
        {/* Card Heading Header System */}
        <View style={styles.dayCardHeading}>
          <View style={styles.iconBadge}>
            <FontAwesome6 name="person-running" size={16} color="#4cddbb" />
          </View>
          
          <View style={styles.headerTitlesContainer}>
            <Text style={styles.dayTitleText}>
              Day — {workout.day}
            </Text>
            <Text style={styles.exerciseCounterText}>
              {workout.schedule.length} Exercises
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={18} color="#8E9492" />
        </View>

        {/* Specular Separator Rule Line */}
        <View style={styles.dividerLine} />

        {/* Dynamic Exercise Preview Slots */}
        <View style={styles.previewContainer}>
          {itemList.map((item, index) => (
            <View key={index} style={styles.previewItemRow}>
              <Text style={styles.bulletPointMarker}>•</Text>
              <Text style={styles.previewItemText} numberOfLines={1}>
                {item.name}
              </Text>
            </View>
          ))}
          
          {remainingCount > 0 && (
            <View style={styles.previewItemRow}>
              <Text style={[styles.bulletPointMarker, styles.accentText]}>•</Text>
              <Text style={[styles.previewItemText, styles.accentText]}>
                +{remainingCount} More Exercises
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressedCard: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  dayCardContainer: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 16,
    marginBottom: 12,
    width: '100%',
  },
  dayCardHeading: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBadge: {
    justifyContent: "center",
    alignItems: "center",
    height: 38,
    width: 38,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 99,
  },
  headerTitlesContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  dayTitleText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  exerciseCounterText: {
    fontSize: 13,
    color: "#8E9492",
    fontWeight: "500",
    marginTop: 1,
  },
  dividerLine: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    marginTop: 14,
    marginBottom: 14,
    width: '100%',
  },
  // Exercise Preview Architecture
  previewContainer: {
    paddingLeft: 4,
    gap: 6,
  },
  previewItemRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  bulletPointMarker: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4cddbb",
    marginRight: 8,
    width: 10,
  },
  previewItemText: {
    fontWeight: "600",
    fontSize: 13,
    color: "#B0B5B3",
    flex: 1,
  },
  accentText: {
    color: "#4cddbb",
    fontWeight: "700",
  },
});

export default CurentScheduleCard;