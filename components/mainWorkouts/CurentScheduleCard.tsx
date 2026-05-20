import { Colors } from "@/constants/Colors";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
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
    selectedDaySchedule(workout); // pass the full workout object (day + exercises)
    console.log("Workout At Curent Schedule card", workout)
    setModalVisible(true);
  };

  return (
    <LinearGradient
      colors={["#1d201fff", "#2d302f35"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.dayCardContainer}
    >
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [pressed && { opacity: 0.5 }]}
      >
        {/* Card Heading */}
        <View style={styles.dayCardHeading}>
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 45,
              width: 45,
              backgroundColor: "#ffffff3a",
              borderRadius: 100,
            }}
          >
            <FontAwesome6 name="person-running" size={20} color="black" />
          </View>
          <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 20, color: textPimary, fontWeight: "bold" }}>
              Day - {workout.day}
            </Text>
            <Text style={{ color: textSecondary }}>
              {workout.schedule.length} Exercises
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </View>

        {/* Divider */}
        <LinearGradient
          style={{ height: 1, marginTop: 10 }}
          colors={[
            "rgba(4, 4, 4, 0)",
            "rgba(49, 100, 115, 0.68)",
            "rgba(156, 161, 156, 0)",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Exercise Preview */}
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            marginLeft: 60,
            marginTop: 20,
          }}
        >
          {itemList.map((item, index) => (
            <Text
              key={index}
              style={{
                fontWeight: "bold",
                fontSize: 14,
                marginBottom: 5,
                color: "#ffffff92",
              }}
            >
              • {item.name}
            </Text>
          ))}
          {remainingCount > 0 && (
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 14,
                marginBottom: 5,
                color: "#ffffff92",
              }}
            >
              • +{remainingCount} More
            </Text>
          )}
        </View>
      </Pressable>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  dayCardContainer: {
    height: 200,
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
  },
  dayCardHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    justifyContent: "space-between",
  },
});

export default CurentScheduleCard;
