import { Colors } from '@/constants/Colors';
import { mealPlanData } from '@/data/data';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
const {textPimary,textSecondary,secondaryBackground,primaryBackground,cardBackground,cardBackgroundSecondary,background}=Colors
const { width, height } = Dimensions.get('window');

const MealPlanScreen = () => {
  const navigation = useNavigation();
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const [showMealDetail, setShowMealDetail] = useState(false);
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: [height * 0.35, 80],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const titleScale = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  const renderDayCard = (day: any, index: number) => {
    const isSelected = selectedDay === index;
    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.dayButton,
          isSelected && styles.dayButtonSelected,
        ]}
        onPress={() => setSelectedDay(index)}
      >
        <LinearGradient
          colors={isSelected ? ['#2c2d31ff', '#2d282dff'] : ['#c6cbeaff', '#e3dadaf6']}
          style={styles.dayButtonGradient}
        >
          <Text style={[
            styles.dayButtonText,
            isSelected && styles.dayButtonTextSelected
          ]}>
            {day.day}
          </Text>
          <Text style={[
            styles.dayButtonSubtext,
            isSelected && styles.dayButtonSubtextSelected
          ]}>
            {day.focus}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderMealCard = (meal: any, index: number, dayIndex: number) => (
    <Animated.View 
      key={index}
      style={[
        styles.mealCard,
        {
          opacity: scrollY.interpolate({
            inputRange: [0, 300 + (dayIndex * 50) + (index * 30)],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          }),
          transform: [
            {
              translateY: scrollY.interpolate({
                inputRange: [0, 300 + (dayIndex * 50) + (index * 30)],
                outputRange: [50, 0],
                extrapolate: 'clamp',
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.mealCardHeader}>
        <View style={[
          styles.mealTypeBadge,
          { backgroundColor: getMealTypeColor(meal.type) }
        ]}>
          <Text style={styles.mealTypeText}>{meal.type}</Text>
        </View>
        
        <View style={styles.mealTimeTag}>
          <Ionicons name="time-outline" size={14} color="#667eea" />
          <Text style={styles.mealTimeText}>{meal.time}</Text>
        </View>
      </View>
      
      <View style={styles.mealContent}>
        <Text style={styles.mealName}>{meal.name}</Text>
        
        <View style={styles.caloriesContainer}>
          <Ionicons name="flame-outline" size={16} color="#FF6B6B" />
          <Text style={styles.caloriesText}>{meal.calories} calories</Text>
        </View>
        
        <View style={styles.macroTags}>
          <View style={styles.macroTag}>
            <Text style={styles.macroTagText}>High Protein</Text>
          </View>
          <View style={styles.macroTag}>
            <Text style={styles.macroTagText}>Low Sugar</Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.viewRecipeButton}
        onPress={() => {
          setSelectedMeal(meal);
          setShowMealDetail(true);
        }}
      >
        <Text style={styles.viewRecipeText}>View Recipe</Text>
        <Ionicons name="chevron-forward" size={16} color="#667eea" />
      </TouchableOpacity>
    </Animated.View>
  );

  const getMealTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      Breakfast: '#FF9F1C',
      Lunch: '#2EC4B6',
      Dinner: '#E71D36',
      Snack: '#7209B7',
    };
    return colors[type] || '#667eea';
  };

  const renderStatsItem = (icon: string, value: string, label: string, color: string) => (
    <View style={styles.statItem}>
      <Ionicons name={icon as any} size={24} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <View
    
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      
      {/* Animated Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.Image
          source={mealPlanData.bckImg}
          style={[styles.headerImage, { opacity: headerOpacity }]}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.8)', 'transparent', 'rgba(0,0,0,0.2)']}
          style={StyleSheet.absoluteFill}
        />
        
        <BlurView intensity={80} style={styles.blurHeader} tint="dark">
          <Animated.Text 
            style={[
              styles.headerTitle, 
              { 
                fontSize: scrollY.interpolate({
                  inputRange: [0, 300],
                  outputRange: [32, 20],
                  extrapolate: 'clamp',
                }),
                transform: [{ scale: titleScale }]
              }
            ]}
            numberOfLines={1}
          >
            {mealPlanData.title}
          </Animated.Text>
        </BlurView>
      </Animated.View>

      {/* Main ScrollView */}
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          {/* Overview Card */}
          <Animated.View 
            style={[
              styles.overviewCard,
              {
                opacity: scrollY.interpolate({
                  inputRange: [0, 200],
                  outputRange: [1, 0],
                  extrapolate: 'clamp',
                }),
                transform: [
                  {
                    translateY: scrollY.interpolate({
                      inputRange: [0, 200],
                      outputRange: [0, 210],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.description}>{mealPlanData.description}</Text>
            
            <View style={styles.statsContainer}>
              {renderStatsItem("restaurant-outline", `${mealPlanData.stats.calories}`, "Calories", "#4CAF50")}
              {renderStatsItem("nutrition-outline", `${mealPlanData.stats.protein}g`, "Protein", "#2196F3")}
              {renderStatsItem("barbell-outline", `${mealPlanData.duration}`, "Days", "#FF9800")}
              {renderStatsItem("flash-outline", mealPlanData.level, "Level", "#F44336")}
            </View>
          </Animated.View>

          {/* Action Buttons */}
          {/* <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.primaryButton}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
              <Ionicons name="cart-outline" size={20} color="#FFF" />
              <Text style={styles.primaryButtonText}>Generate Shopping List</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryButton}>
              <Ionicons name="bookmark-outline" size={20} color="#666" />
              <Text style={styles.secondaryButtonText}>Save Plan</Text>
            </TouchableOpacity>
          </View> */}

          {/* Day Selector */}
          <View style={styles.daySelector}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.daySelectorContent}
            >
              {mealPlanData.schedule.map((day, index) => renderDayCard(day, index))}
            </ScrollView>
          </View>

          {/* Selected Day Meals */}
          <View style={styles.mealsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {mealPlanData.schedule[selectedDay].day} Meals
              </Text>
              <Text style={styles.sectionSubtitle}>
                {mealPlanData.schedule[selectedDay].focus}
              </Text>
            </View>

            {mealPlanData.schedule[selectedDay].meals.map((meal, index) =>
              renderMealCard(meal, index, selectedDay)
            )}
          </View>

          {/* Nutrition Tips */}
          <View style={styles.tipsCard}>
            <Ionicons name="bulb-outline" size={24} color="#FF9800" />
            <View style={styles.tipsContent}>
              <Text style={styles.tipsTitle}>Nutrition Tips</Text>
              <Text style={styles.tipsText}>
                • Drink 500ml water 30 minutes before each meal
                • Chew food thoroughly for better digestion
                • Space meals 3-4 hours apart for optimal absorption
                • Include protein in every meal for muscle preservation
              </Text>
            </View>
          </View>

          {/* Macronutrient Guide */}
          <View style={styles.macroGuideCard}>
            <LinearGradient
              colors={['rgba(102, 126, 234, 0.1)', 'rgba(118, 75, 162, 0.05)']}
              style={styles.macroGuideGradient}
            >
              <View style={styles.macroGuideHeader}>
                <Ionicons name="pie-chart-outline" size={24} color="#667eea" />
                <Text style={styles.macroGuideTitle}>Daily Macros Target</Text>
              </View>
              
              <View style={styles.macroBars}>
                <View style={styles.macroBarItem}>
                  <View style={styles.macroBarHeader}>
                    <Text style={styles.macroBarLabel}>Protein</Text>
                    <Text style={styles.macroBarValue}>{mealPlanData.stats.protein}g</Text>
                  </View>
                  <View style={styles.macroBarTrack}>
                    <LinearGradient
                      colors={['#4ECDC4', '#2EC4B6']}
                      style={[styles.macroBarFill, { width: '70%' }]}
                    />
                  </View>
                </View>
                
                <View style={styles.macroBarItem}>
                  <View style={styles.macroBarHeader}>
                    <Text style={styles.macroBarLabel}>Carbs</Text>
                    <Text style={styles.macroBarValue}>{mealPlanData.stats.carbs}g</Text>
                  </View>
                  <View style={styles.macroBarTrack}>
                    <LinearGradient
                      colors={['#FFD166', '#FFB347']}
                      style={[styles.macroBarFill, { width: '60%' }]}
                    />
                  </View>
                </View>
                
                <View style={styles.macroBarItem}>
                  <View style={styles.macroBarHeader}>
                    <Text style={styles.macroBarLabel}>Fat</Text>
                    <Text style={styles.macroBarValue}>{mealPlanData.stats.fat}g</Text>
                  </View>
                  <View style={styles.macroBarTrack}>
                    <LinearGradient
                      colors={['#06D6A0', '#048A81']}
                      style={[styles.macroBarFill, { width: '30%' }]}
                    />
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>
      </Animated.ScrollView>

      {/* Meal Detail Modal */}
      <Modal
        visible={showMealDetail}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMealDetail(false)}
      >
        {selectedMeal && (
          <MealDetailModal
            meal={selectedMeal}
            onClose={() => setShowMealDetail(false)}
          />
        )}
      </Modal>
    </View>
  );
};

const MealDetailModal = ({ meal, onClose }: { meal: any; onClose: () => void }) => {
  return (
    <View style={styles.modalContainer}>
      <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="dark" />
      
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          
          <View style={[
            styles.mealTypeBadge,
            styles.modalMealTypeBadge,
            { backgroundColor: getMealTypeColor(meal.type) }
          ]}>
            <Text style={styles.mealTypeText}>{meal.type}</Text>
          </View>
          
          <Text style={styles.modalMealName}>{meal.name}</Text>
          <Text style={styles.modalMealTime}>{meal.time} • {meal.calories} calories</Text>
        </View>
        
        <ScrollView style={styles.modalBody}>
          <View style={styles.ingredientsSection}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {[
              "Oat flour (1 cup)",
              "Whey protein (2 scoops)",
              "Egg whites (4)",
              "Berries (1/2 cup)",
              "Almond milk (1/2 cup)",
              "Baking powder (1 tsp)",
            ].map((item, index) => (
              <View key={index} style={styles.ingredientItem}>
                <View style={styles.ingredientBullet} />
                <Text style={styles.ingredientText}>{item}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.instructionsSection}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            {[
              "Mix dry ingredients in a bowl",
              "Add wet ingredients and whisk until smooth",
              "Heat non-stick pan over medium heat",
              "Pour batter and cook 3-4 minutes per side",
              "Serve with berries and sugar-free syrup",
            ].map((step, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.instructionNumber}>
                  <Text style={styles.instructionNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{step}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.nutritionFacts}>
            <Text style={styles.sectionTitle}>Nutrition Facts</Text>
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>420</Text>
                <Text style={styles.nutritionLabel}>Calories</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>35g</Text>
                <Text style={styles.nutritionLabel}>Protein</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>45g</Text>
                <Text style={styles.nutritionLabel}>Carbs</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>12g</Text>
                <Text style={styles.nutritionLabel}>Fat</Text>
              </View>
            </View>
          </View>
        </ScrollView>
        
      
      </View>
    </View>
  );
};

const getMealTypeColor = (type: string) => {
  const colors: { [key: string]: string } = {
    Breakfast: '#FF9F1C',
    Lunch: '#2EC4B6',
    Dinner: '#E71D36',
    Snack: '#7209B7',
  };
  return colors[type] || '#667eea';
};

const styles = StyleSheet.create({
  container: {
    backgroundColor:'rgb(0, 0, 0)',
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: 'hidden',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  blurHeader: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  scrollContent: {
    paddingTop: height * 0.35,
    paddingBottom: 100,
  },
  content: {
    padding: 20,
  },
  overviewCard: {
    backgroundColor: secondaryBackground,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  description: {
    fontSize: 16,
    color: textPimary,
    lineHeight: 24,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: textSecondary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 15,
    overflow: 'hidden',
  },
  primaryButtonText: {
    color: textPimary,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#8f4949',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  daySelector: {
    marginBottom: 25,
  },
  daySelectorContent: {
    paddingVertical: 5,
  },
  dayButton: {
    marginRight: 12,
    borderRadius: 15,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  dayButtonSelected: {
    shadowColor: '#4b516b',
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  dayButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 15,
  },
  dayButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  dayButtonTextSelected: {
    color: '#FFF',
  },
  dayButtonSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  dayButtonSubtextSelected: {
    color: 'rgba(255,255,255,0.9)',
  },
  mealsSection: {
    marginBottom: 30,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: textPimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: textSecondary,
  },
  mealCard: {
    backgroundColor: secondaryBackground,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
  },
  mealCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  mealTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  mealTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  mealTimeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mealTimeText: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '500',
  },
  mealContent: {
    marginBottom: 15,
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: textPimary,
    marginBottom: 8,
  },
  caloriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  caloriesText: {
    fontSize: 14,
    color: textSecondary,
  },
  macroTags: {
    flexDirection: 'row',
    gap: 8,
  },
  macroTag: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  macroTagText: {
    fontSize: 11,
    color: '#667eea',
    fontWeight: '500',
  },
  viewRecipeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
  },
  viewRecipeText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
    marginRight: 4,
  },
  tipsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF8E1',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  tipsContent: {
    flex: 1,
    marginLeft: 16,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF9800',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  macroGuideCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  macroGuideGradient: {
    padding: 20,
  },
  macroGuideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  macroGuideTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  macroBars: {
    gap: 15,
  },
  macroBarItem: {
    gap: 6,
  },
  macroBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  macroBarLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  macroBarValue: {
    fontSize: 12,
    color: '#666',
  },
  macroBarTrack: {
    height: 8,
    backgroundColor: '#F1F1F1',
    borderRadius: 4,
    overflow: 'hidden',
  },
  macroBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: height * 0.9,
  },
  modalHeader: {
    padding: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 30,
    right: 30,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalMealTypeBadge: {
    marginBottom: 12,
  },
  modalMealName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalMealTime: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  modalBody: {
    padding: 20,
  },
  ingredientsSection: {
    marginBottom: 30,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ingredientBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#667eea',
    marginRight: 12,
  },
  ingredientText: {
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  instructionsSection: {
    marginBottom: 30,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  instructionNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#667eea',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  instructionNumberText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  nutritionFacts: {
    marginBottom: 20,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 20,
    marginTop: 10,
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#666',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
    gap: 12,
  },
  modalPrimaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 15,
    overflow: 'hidden',
  },
  modalPrimaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalSecondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  modalSecondaryButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default MealPlanScreen;