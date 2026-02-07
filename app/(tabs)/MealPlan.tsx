import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialIcons
} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

const MealPlanScreen = ({ navigation, route }) => {
  const [userGoal, setUserGoal] = useState(route?.params?.goal || 'weight_loss'); // 'weight_loss', 'maintenance', 'weight_gain'
  const [selectedDay, setSelectedDay] = useState(0);
  const [activeMeal, setActiveMeal] = useState('breakfast');
  const [isLoading, setIsLoading] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [preferences, setPreferences] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    nutFree: false,
    calories: userGoal === 'weight_loss' ? 1800 : userGoal === 'maintenance' ? 2200 : 2800,
  });

  // Meal plan data based on goals
  const mealPlans = {
    weight_loss: {
      title: 'Weight Loss Meal Plan',
      description: 'Calorie-deficit plan focused on high protein and fiber',
      dailyCalories: '1,600-1,800',
      weeklyWeightLoss: '0.5-1 kg',
      colorScheme: ['#00C853', '#64DD17'],
      meals: {
        breakfast: [
          { name: 'Greek Yogurt Bowl', calories: 320, protein: '25g', carbs: '30g', fats: '8g', time: '8:00 AM' },
          { name: 'Oatmeal with Berries', calories: 280, protein: '12g', carbs: '45g', fats: '5g', time: '8:00 AM' },
          { name: 'Egg White Scramble', calories: 250, protein: '28g', carbs: '5g', fats: '10g', time: '8:00 AM' },
        ],
        lunch: [
          { name: 'Grilled Chicken Salad', calories: 420, protein: '35g', carbs: '20g', fats: '15g', time: '1:00 PM' },
          { name: 'Quinoa & Veggie Bowl', calories: 380, protein: '18g', carbs: '55g', fats: '12g', time: '1:00 PM' },
          { name: 'Turkey Avocado Wrap', calories: 350, protein: '25g', carbs: '30g', fats: '14g', time: '1:00 PM' },
        ],
        dinner: [
          { name: 'Baked Salmon with Veggies', calories: 450, protein: '40g', carbs: '25g', fats: '20g', time: '7:00 PM' },
          { name: 'Lean Beef Stir Fry', calories: 420, protein: '35g', carbs: '30g', fats: '18g', time: '7:00 PM' },
          { name: 'Tofu & Broccoli Bowl', calories: 380, protein: '30g', carbs: '35g', fats: '12g', time: '7:00 PM' },
        ],
        snacks: [
          { name: 'Apple with Almond Butter', calories: 180, protein: '6g', carbs: '20g', fats: '10g', time: '10:00 AM' },
          { name: 'Protein Shake', calories: 150, protein: '25g', carbs: '8g', fats: '3g', time: '4:00 PM' },
        ],
      },
      tips: [
        'Drink 2-3 liters of water daily',
        'Limit processed foods and sugars',
        'Include protein in every meal',
        'Eat slowly and mindfully',
      ],
    },
    maintenance: {
      title: 'Weight Maintenance Meal Plan',
      description: 'Balanced nutrition to maintain current weight',
      dailyCalories: '2,000-2,400',
      weeklyWeightLoss: 'Maintain',
      colorScheme: ['#2196F3', '#03A9F4'],
      meals: {
        breakfast: [
          { name: 'Avocado Toast with Eggs', calories: 420, protein: '20g', carbs: '35g', fats: '22g', time: '8:00 AM' },
          { name: 'Smoothie Bowl', calories: 380, protein: '15g', carbs: '50g', fats: '15g', time: '8:00 AM' },
          { name: 'Whole Grain Pancakes', calories: 450, protein: '18g', carbs: '60g', fats: '18g', time: '8:00 AM' },
        ],
        lunch: [
          { name: 'Chicken Pasta Salad', calories: 520, protein: '30g', carbs: '45g', fats: '25g', time: '1:00 PM' },
          { name: 'Beef Burrito Bowl', calories: 580, protein: '35g', carbs: '55g', fats: '22g', time: '1:00 PM' },
          { name: 'Salmon Quinoa Bowl', calories: 550, protein: '38g', carbs: '50g', fats: '24g', time: '1:00 PM' },
        ],
        dinner: [
          { name: 'Steak with Sweet Potato', calories: 620, protein: '45g', carbs: '40g', fats: '30g', time: '7:00 PM' },
          { name: 'Chicken Alfredo', calories: 580, protein: '42g', carbs: '45g', fats: '28g', time: '7:00 PM' },
          { name: 'Shrimp Fried Rice', calories: 540, protein: '35g', carbs: '55g', fats: '20g', time: '7:00 PM' },
        ],
        snacks: [
          { name: 'Mixed Nuts', calories: 200, protein: '8g', carbs: '10g', fats: '18g', time: '11:00 AM' },
          { name: 'Greek Yogurt with Honey', calories: 180, protein: '20g', carbs: '22g', fats: '5g', time: '4:00 PM' },
          { name: 'Dark Chocolate', calories: 150, protein: '3g', carbs: '15g', fats: '10g', time: '8:00 PM' },
        ],
      },
      tips: [
        'Balance macros: 40% carbs, 30% protein, 30% fats',
        'Stay active with 150 mins exercise weekly',
        'Listen to your hunger cues',
        'Include variety for nutrient diversity',
      ],
    },
    weight_gain: {
      title: 'Weight Gain Meal Plan',
      description: 'Calorie-surplus plan for muscle building',
      dailyCalories: '2,800-3,200',
      weeklyWeightLoss: 'Gain 0.25-0.5 kg',
      colorScheme: ['#FF9800', '#FFB74D'],
      meals: {
        breakfast: [
          { name: 'Weight Gainer Shake', calories: 650, protein: '45g', carbs: '80g', fats: '18g', time: '8:00 AM' },
          { name: 'Peanut Butter Banana Toast', calories: 520, protein: '22g', carbs: '60g', fats: '25g', time: '8:00 AM' },
          { name: '6-Egg Omelette with Cheese', calories: 580, protein: '42g', carbs: '10g', fats: '40g', time: '8:00 AM' },
        ],
        lunch: [
          { name: 'Chicken & Rice Bowl', calories: 750, protein: '55g', carbs: '85g', fats: '25g', time: '1:00 PM' },
          { name: 'Beef & Potato Meal', calories: 820, protein: '60g', carbs: '75g', fats: '35g', time: '1:00 PM' },
          { name: 'Pasta with Meat Sauce', calories: 780, protein: '48g', carbs: '90g', fats: '28g', time: '1:00 PM' },
        ],
        dinner: [
          { name: 'Salmon with Rice & Avocado', calories: 850, protein: '65g', carbs: '80g', fats: '40g', time: '7:00 PM' },
          { name: 'Steak & Potato Dinner', calories: 920, protein: '70g', carbs: '70g', fats: '45g', time: '7:00 PM' },
          { name: 'Chicken Curry with Rice', calories: 810, protein: '58g', carbs: '85g', fats: '32g', time: '7:00 PM' },
        ],
        snacks: [
          { name: 'Mass Gainer Shake', calories: 400, protein: '35g', carbs: '45g', fats: '12g', time: '11:00 AM' },
          { name: 'Cottage Cheese & Fruit', calories: 280, protein: '30g', carbs: '25g', fats: '8g', time: '4:00 PM' },
          { name: 'Trail Mix', calories: 350, protein: '12g', carbs: '30g', fats: '25g', time: '9:00 PM' },
        ],
      },
      tips: [
        'Eat every 2-3 hours',
        'Prioritize protein for muscle growth',
        'Include healthy fats for calories',
        'Combine with strength training',
      ],
    },
  };

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const mealTypes = [
    { id: 'breakfast', name: 'Breakfast', icon: 'sunny' },
    { id: 'lunch', name: 'Lunch', icon: 'restaurant' },
    { id: 'dinner', name: 'Dinner', icon: 'moon' },
    { id: 'snacks', name: 'Snacks', icon: 'nutrition' },
  ];

  const currentPlan = mealPlans[userGoal];
  const activeMeals = currentPlan.meals[activeMeal];

  const renderHeader = () => (
    <LinearGradient
      colors={['#0A0E17', '#161B22']}
      style={styles.header}
    >
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back-ios" size={24} color="#FFF" />
      </TouchableOpacity>
      
      <Text style={styles.headerTitle}>Meal Plan</Text>
      
      <TouchableOpacity 
        style={styles.settingsButton}
        onPress={() => setShowCustomizeModal(true)}
      >
        <Feather name="settings" size={22} color="#00C853" />
      </TouchableOpacity>
    </LinearGradient>
  );

  const renderGoalSelector = () => (
    <View style={styles.goalSelector}>
      <TouchableOpacity
        style={[
          styles.goalButton,
          userGoal === 'weight_loss' && styles.goalButtonActive,
          { borderColor: userGoal === 'weight_loss' ? '#00C853' : '#30363D' }
        ]}
        onPress={() => setUserGoal('weight_loss')}
      >
        <LinearGradient
          colors={userGoal === 'weight_loss' ? ['#00C853', '#64DD17'] : ['#161B22', '#0A0E17']}
          style={styles.goalButtonGradient}
        >
          <MaterialIcons 
            name="trending-down" 
            size={22} 
            color={userGoal === 'weight_loss' ? '#FFF' : '#8B949E'} 
          />
          <Text style={[
            styles.goalButtonText,
            userGoal === 'weight_loss' && styles.goalButtonTextActive
          ]}>
            Weight Loss
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.goalButton,
          userGoal === 'maintenance' && styles.goalButtonActive,
          { borderColor: userGoal === 'maintenance' ? '#2196F3' : '#30363D' }
        ]}
        onPress={() => setUserGoal('maintenance')}
      >
        <LinearGradient
          colors={userGoal === 'maintenance' ? ['#2196F3', '#03A9F4'] : ['#161B22', '#0A0E17']}
          style={styles.goalButtonGradient}
        >
          <MaterialIcons 
            name="trending-flat" 
            size={22} 
            color={userGoal === 'maintenance' ? '#FFF' : '#8B949E'} 
          />
          <Text style={[
            styles.goalButtonText,
            userGoal === 'maintenance' && styles.goalButtonTextActive
          ]}>
            Maintenance
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.goalButton,
          userGoal === 'weight_gain' && styles.goalButtonActive,
          { borderColor: userGoal === 'weight_gain' ? '#FF9800' : '#30363D' }
        ]}
        onPress={() => setUserGoal('weight_gain')}
      >
        <LinearGradient
          colors={userGoal === 'weight_gain' ? ['#FF9800', '#FFB74D'] : ['#161B22', '#0A0E17']}
          style={styles.goalButtonGradient}
        >
          <MaterialIcons 
            name="trending-up" 
            size={22} 
            color={userGoal === 'weight_gain' ? '#FFF' : '#8B949E'} 
          />
          <Text style={[
            styles.goalButtonText,
            userGoal === 'weight_gain' && styles.goalButtonTextActive
          ]}>
            Weight Gain
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderPlanOverview = () => (
    <LinearGradient
      colors={currentPlan.colorScheme}
      style={styles.planOverview}
    >
      <View style={styles.planHeader}>
        <View>
          <Text style={styles.planTitle}>{currentPlan.title}</Text>
          <Text style={styles.planDescription}>{currentPlan.description}</Text>
        </View>
        <MaterialIcons name="restaurant-menu" size={32} color="#FFF" />
      </View>
      
      <View style={styles.planStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{currentPlan.dailyCalories}</Text>
          <Text style={styles.statLabel}>Daily Calories</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{currentPlan.weeklyWeightLoss}</Text>
          <Text style={styles.statLabel}>Weekly Goal</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{Object.keys(currentPlan.meals).length}</Text>
          <Text style={styles.statLabel}>Meals/Day</Text>
        </View>
      </View>
    </LinearGradient>
  );

  const renderDaySelector = () => (
    <View style={styles.daySelectorContainer}>
      <Text style={styles.sectionTitle}>Weekly Schedule</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.daySelector}
      >
        {daysOfWeek.map((day, index) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              selectedDay === index && styles.dayButtonActive
            ]}
            onPress={() => setSelectedDay(index)}
          >
            <Text style={[
              styles.dayText,
              selectedDay === index && styles.dayTextActive
            ]}>
              {day}
            </Text>
            <Text style={[
              styles.dayNumber,
              selectedDay === index && styles.dayNumberActive
            ]}>
              {index + 1}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderMealTypeSelector = () => (
    <View style={styles.mealTypeContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.mealTypeSelector}
      >
        {mealTypes.map((meal) => (
          <TouchableOpacity
            key={meal.id}
            style={[
              styles.mealTypeButton,
              activeMeal === meal.id && styles.mealTypeButtonActive
            ]}
            onPress={() => setActiveMeal(meal.id)}
          >
            <Ionicons 
              name={meal.icon} 
              size={22} 
              color={activeMeal === meal.id ? currentPlan.colorScheme[0] : '#8B949E'} 
            />
            <Text style={[
              styles.mealTypeText,
              activeMeal === meal.id && styles.mealTypeTextActive
            ]}>
              {meal.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderMealList = () => (
    <View style={styles.mealListContainer}>
      <Text style={styles.mealListTitle}>
        {mealTypes.find(m => m.id === activeMeal)?.name} Options
      </Text>
      
      {activeMeals.map((meal, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.mealCard}
          onPress={() => console.log('View meal details:', meal.name)}
        >
          <LinearGradient
            colors={['#161B22', '#0A0E17']}
            style={styles.mealCardGradient}
          >
            <View style={styles.mealHeader}>
              <View>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealTime}>{meal.time}</Text>
              </View>
              <View style={styles.calorieBadge}>
                <Text style={styles.calorieText}>{meal.calories} cal</Text>
              </View>
            </View>
            
            <View style={styles.macroContainer}>
              <View style={styles.macroItem}>
                <FontAwesome5 name="drumstick-bite" size={16} color="#00C853" />
                <Text style={styles.macroText}>{meal.protein}</Text>
                <Text style={styles.macroLabel}>Protein</Text>
              </View>
              
              <View style={styles.macroItem}>
                <FontAwesome5 name="bread-slice" size={16} color="#2196F3" />
                <Text style={styles.macroText}>{meal.carbs}</Text>
                <Text style={styles.macroLabel}>Carbs</Text>
              </View>
              
              <View style={styles.macroItem}>
                <FontAwesome5 name="oil-can" size={16} color="#FF9800" />
                <Text style={styles.macroText}>{meal.fats}</Text>
                <Text style={styles.macroLabel}>Fats</Text>
              </View>
            </View>
            
            <View style={styles.mealActions}>
              <TouchableOpacity style={styles.viewRecipeButton}>
                <Text style={styles.viewRecipeText}>View Recipe</Text>
                <MaterialIcons name="chevron-right" size={20} color="#00C853" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.addToDayButton}>
                <Feather name="plus-circle" size={18} color="#FFF" />
                <Text style={styles.addToDayText}>Add to Day</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderTips = () => (
    <View style={styles.tipsContainer}>
      <Text style={styles.sectionTitle}>Nutrition Tips</Text>
      <View style={styles.tipsList}>
        {currentPlan.tips.map((tip, index) => (
          <View key={index} style={styles.tipItem}>
            <View style={styles.tipIcon}>
              <MaterialIcons name="lightbulb" size={18} color="#FFD700" />
            </View>
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderCustomizeModal = () => (
    <Modal
      visible={showCustomizeModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowCustomizeModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Customize Meal Plan</Text>
            <TouchableOpacity onPress={() => setShowCustomizeModal(false)}>
              <MaterialIcons name="close" size={24} color="#8B949E" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalBody}>
            <Text style={styles.modalSectionTitle}>Dietary Preferences</Text>
            
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceLeft}>
                <MaterialIcons name="grass" size={22} color="#4CAF50" />
                <Text style={styles.preferenceText}>Vegetarian</Text>
              </View>
              <Switch
                value={preferences.vegetarian}
                onValueChange={() => setPreferences({...preferences, vegetarian: !preferences.vegetarian})}
                trackColor={{ false: '#30363D', true: '#4CAF50' }}
                thumbColor="#FFF"
              />
            </View>
            
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceLeft}>
                <FontAwesome5 name="leaf" size={20} color="#4CAF50" />
                <Text style={styles.preferenceText}>Vegan</Text>
              </View>
              <Switch
                value={preferences.vegan}
                onValueChange={() => setPreferences({...preferences, vegan: !preferences.vegan})}
                trackColor={{ false: '#30363D', true: '#4CAF50' }}
                thumbColor="#FFF"
              />
            </View>
            
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceLeft}>
                <MaterialIcons name="grain" size={22} color="#FF9800" />
                <Text style={styles.preferenceText}>Gluten Free</Text>
              </View>
              <Switch
                value={preferences.glutenFree}
                onValueChange={() => setPreferences({...preferences, glutenFree: !preferences.glutenFree})}
                trackColor={{ false: '#30363D', true: '#FF9800' }}
                thumbColor="#FFF"
              />
            </View>
            
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceLeft}>
                <MaterialIcons name="local-drink" size={22} color="#2196F3" />
                <Text style={styles.preferenceText}>Dairy Free</Text>
              </View>
              <Switch
                value={preferences.dairyFree}
                onValueChange={() => setPreferences({...preferences, dairyFree: !preferences.dairyFree})}
                trackColor={{ false: '#30363D', true: '#2196F3' }}
                thumbColor="#FFF"
              />
            </View>
            
            <Text style={styles.modalSectionTitle}>Daily Calories</Text>
            <View style={styles.calorieInputContainer}>
              <TextInput
                style={styles.calorieInput}
                value={preferences.calories.toString()}
                onChangeText={(text) => setPreferences({...preferences, calories: parseInt(text) || 0})}
                keyboardType="numeric"
                placeholder="Enter daily calories"
                placeholderTextColor="#8B949E"
              />
              <Text style={styles.calorieLabel}>cal/day</Text>
            </View>
            
            <View style={styles.caloriePresets}>
              <TouchableOpacity 
                style={styles.caloriePreset}
                onPress={() => setPreferences({...preferences, calories: 1800})}
              >
                <Text style={styles.caloriePresetText}>1,800</Text>
                <Text style={styles.caloriePresetLabel}>Weight Loss</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.caloriePreset}
                onPress={() => setPreferences({...preferences, calories: 2200})}
              >
                <Text style={styles.caloriePresetText}>2,200</Text>
                <Text style={styles.caloriePresetLabel}>Maintenance</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.caloriePreset}
                onPress={() => setPreferences({...preferences, calories: 2800})}
              >
                <Text style={styles.caloriePresetText}>2,800</Text>
                <Text style={styles.caloriePresetLabel}>Weight Gain</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => setShowCustomizeModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalSaveButton}
              onPress={() => {
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  setShowCustomizeModal(false);
                  // Here you would regenerate meal plan based on preferences
                }, 1000);
              }}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.modalSaveText}>Generate Plan</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0E17" />
      
      {renderHeader()}
      
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderGoalSelector()}
        {renderPlanOverview()}
        {renderDaySelector()}
        {renderMealTypeSelector()}
        {renderMealList()}
        {renderTips()}
      </ScrollView>
      
      {renderCustomizeModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0E17',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#30363D',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  settingsButton: {
    padding: 8,
  },
  goalSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    justifyContent: 'space-between',
  },
  goalButton: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
  },
  goalButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalButtonActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  goalButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B949E',
    marginTop: 6,
  },
  goalButtonTextActive: {
    color: '#FFF',
  },
  planOverview: {
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    maxWidth: '80%',
  },
  planStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  daySelectorContainer: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 16,
  },
  daySelector: {
    paddingVertical: 5,
  },
  dayButton: {
    width: 60,
    height: 70,
    backgroundColor: '#161B22',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  dayButtonActive: {
    backgroundColor: 'rgba(0, 200, 83, 0.1)',
    borderColor: '#00C853',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B949E',
    marginBottom: 6,
  },
  dayTextActive: {
    color: '#00C853',
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  dayNumberActive: {
    color: '#00C853',
  },
  mealTypeContainer: {
    marginTop: 20,
  },
  mealTypeSelector: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  mealTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161B22',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  mealTypeButtonActive: {
    backgroundColor: 'rgba(0, 200, 83, 0.1)',
    borderColor: '#00C853',
  },
  mealTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B949E',
    marginLeft: 8,
  },
  mealTypeTextActive: {
    color: '#00C853',
  },
  mealListContainer: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  mealListTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 16,
  },
  mealCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#30363D',
  },
  mealCardGradient: {
    padding: 20,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  mealName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 6,
  },
  mealTime: {
    fontSize: 14,
    color: '#8B949E',
  },
  calorieBadge: {
    backgroundColor: 'rgba(0, 200, 83, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#00C853',
  },
  calorieText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#00C853',
  },
  macroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    marginTop: 8,
    marginBottom: 4,
  },
  macroLabel: {
    fontSize: 12,
    color: '#8B949E',
    fontWeight: '500',
  },
  mealActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewRecipeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewRecipeText: {
    fontSize: 14,
    color: '#00C853',
    fontWeight: '600',
    marginRight: 4,
  },
  addToDayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00C853',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addToDayText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  tipsContainer: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  tipsList: {
    backgroundColor: '#161B22',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tipIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#C9D1D9',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#161B22',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
  },
  modalBody: {
    maxHeight: 400,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginTop: 20,
    marginBottom: 15,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#30363D',
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  preferenceText: {
    fontSize: 16,
    color: '#FFF',
    marginLeft: 12,
  },
  calorieInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0E17',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#30363D',
    marginBottom: 20,
  },
  calorieInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFF',
  },
  calorieLabel: {
    fontSize: 14,
    color: '#8B949E',
    marginLeft: 8,
  },
  caloriePresets: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  caloriePreset: {
    flex: 1,
    backgroundColor: '#0A0E17',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  caloriePresetText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  caloriePresetLabel: {
    fontSize: 12,
    color: '#8B949E',
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#30363D',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginRight: 10,
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  modalSaveButton: {
    flex: 1,
    backgroundColor: '#00C853',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginLeft: 10,
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});

export default MealPlanScreen;