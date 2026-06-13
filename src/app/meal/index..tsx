'use client';

import SafeScreenWrapper from '@/components/SafeScreenWrapper';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

// Enhanced Immersive Data Structure
const TIMELINE_MEALS = [
  { 
    id: '1', 
    period: 'Morning Fuel', 
    title: 'Overnight Protein Oats', 
    macros: { p: 35, c: 60, f: 9 }, 
    kcal: 460, 
    time: '07:30 AM', 
    status: 'logged' as const,
    image: 'https://images.unsplash.com/photo-1517686469429-8faf88b9f7af?w=400',
    micros: 'Fiber: 12g • Omega-3: 1.2g',
    notes: 'Complex carbs clean-burn engine for sustained daily focus.'
  },
  { 
    id: '2', 
    period: 'Post-Workout', 
    title: 'Macro Salmon Bowl', 
    macros: { p: 45, c: 50, f: 14 }, 
    kcal: 620, 
    time: '12:45 PM', 
    status: 'pending' as const,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
    micros: 'Omega-3: 2.8g • Vit D: 120%',
    notes: 'Anti-inflammatory structural integrity optimization.'
  },
  { 
    id: '3', 
    period: 'Mid-Day Charge', 
    title: 'Almond Butter Crunch Cakes', 
    macros: { p: 12, c: 25, f: 11 }, 
    kcal: 240, 
    time: '04:15 PM', 
    status: 'pending' as const,
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=400',
    micros: 'Magnesium: 18%',
    notes: 'Immediate glucose pickup optimized to handle high afternoon cognitive load.'
  },
  { 
    id: '4', 
    period: 'Night Repair', 
    title: 'Lean Beef & Asparagus Platter', 
    macros: { p: 50, c: 15, f: 12 }, 
    kcal: 510, 
    time: '08:00 PM', 
    status: 'skipped' as const,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
    micros: 'Zinc: 45% • Iron: 28%',
    notes: 'Slow-digesting nighttime systemic recovery building blocks.'
  }
];

type Meal = typeof TIMELINE_MEALS[0];

export default function InnovativeMealPlanScreen() {
  const [activeMealIndex, setActiveMealIndex] = useState(0);
  const [meals, setMeals] = useState(TIMELINE_MEALS);
  const [selectedDay, setSelectedDay] = useState(1); // Today (Tuesday)
  const [showMealModal, setShowMealModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  
  const [remainingKcal, setRemainingKcal] = useState(2500);
  const [totalLoggedKcal, setTotalLoggedKcal] = useState(0);
  const [xp, setXp] = useState(340);
  const [streak, setStreak] = useState(6);

  // Dynamic Animated Values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const macroPAnim = useRef(new Animated.Value(0)).current;
  const macroCAnim = useRef(new Animated.Value(0)).current;
  const macroFAnim = useRef(new Animated.Value(0)).current;

  const targetMacros = { p: 160, c: 200, f: 65 };
  const TARGET_KCAL = 2500;

  // Track dynamic real-time aggregated metrics
  const recalculateMetrics = (currentMeals: Meal[]) => {
    const loggedMeals = currentMeals.filter(m => m.status === 'logged');
    const loggedKcal = loggedMeals.reduce((sum, m) => sum + m.kcal, 0);
    
    const loggedP = loggedMeals.reduce((sum, m) => sum + m.macros.p, 0);
    const loggedC = loggedMeals.reduce((sum, m) => sum + m.macros.c, 0);
    const loggedF = loggedMeals.reduce((sum, m) => sum + m.macros.f, 0);

    setTotalLoggedKcal(loggedKcal);
    setRemainingKcal(Math.max(0, TARGET_KCAL - loggedKcal));

    // Fire UI dashboard bar updates smoothly
    Animated.parallel([
      Animated.timing(macroPAnim, { toValue: Math.min(1, loggedP / targetMacros.p), duration: 800, useNativeDriver: false }),
      Animated.timing(macroCAnim, { toValue: Math.min(1, loggedC / targetMacros.c), duration: 800, useNativeDriver: false }),
      Animated.timing(macroFAnim, { toValue: Math.min(1, loggedF / targetMacros.f), duration: 800, useNativeDriver: false }),
    ]).start();
  };

  useEffect(() => {
    recalculateMetrics(meals);
  }, [meals]);

  const toggleMealStatus = (mealId: string) => {
    const freshMeals = meals.map(meal => {
      if (meal.id === mealId) {
        const targetStatus = meal.status === 'logged' ? 'pending' : 'logged';
        
        // Dynamic game loop rewards logic
        if (targetStatus === 'logged') {
          setXp(prev => prev + 25);
          // Trigger crisp tactile scale pulse
          Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 1.12, duration: 150, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
          ]).start();
        } else {
          setXp(prev => Math.max(0, prev - 25));
        }
        return { ...meal, status: targetStatus as 'logged' | 'pending' };
      }
      return meal;
    });

    setMeals(freshMeals);
    
    // Maintain local state structural references synchronized inside open frames
    if (selectedMeal && selectedMeal.id === mealId) {
      setSelectedMeal(freshMeals.find(m => m.id === mealId) || null);
    }
  };

  const suggestAlternative = () => {
    Alert.alert(
      "🧠 AI Smart Swap Engine", 
      "Your current remaining carb target is constrained. Trade the Mid-Day Sugar spikes for an optimized High-Density Greek Yogurt Bowl? (P: 32g • C: 12g • F: 4g)",
      [
        { text: "Deploy Matrix Upgrade", onPress: () => {
          const updated = [...meals];
          if (updated[2]) {
            updated[2] = { 
              ...updated[2], 
              title: "AI Optimized Yogurt Bowl", 
              kcal: 210, 
              macros: { p: 32, c: 12, f: 4 },
              image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400'
            };
            setMeals(updated);
            Alert.alert("Matrix Swapped ✅", "Macros realigned dynamically.");
          }
        }},
        { text: "Dismiss" }
      ]
    );
  };

  const currentLoggedMacros = () => {
    return meals.filter(m => m.status === 'logged').reduce((acc, m) => {
      acc.p += m.macros.p;
      acc.c += m.macros.c;
      acc.f += m.macros.f;
      return acc;
    }, { p: 0, c: 0, f: 0 });
  };

  const macroStats = currentLoggedMacros();
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  return (
    <SafeScreenWrapper>
      <ScrollView style={styles.masterWrapper} showsVerticalScrollIndicator={false}>
        
        {/* HEADER AREA */}
        <View style={styles.header}>
          <View>
            <Text style={styles.screenTitle}>FUEL MATRIX</Text>
            <Text style={styles.systemStatusText}>CORE ENGINE STATUS: ACTIVE</Text>
          </View>
          <View style={styles.headerRightGroup}>
            <View style={styles.xpBadge}>
              <Text style={styles.xpText}>{xp} XP</Text>
            </View>
            <Pressable style={styles.iconCircle} onPress={() => Alert.alert("Neural database scanning open...")}>
              <Ionicons name="search" size={20} color="#4cddbb" />
            </Pressable>
          </View>
        </View>

        {/* HUD ENERGY ORBIT RING */}
        <View style={styles.radialContainer}>
          <View style={styles.radialRingOuter}>
            <Animated.View style={[styles.radialOrbInner, { transform: [{ scale: scaleAnim }] }]}>
              <Text style={styles.remainingValue}>{remainingKcal}</Text>
              <Text style={styles.remainingLabel}>NET KCAL REQ</Text>
              
              <View style={styles.quickStreakBadge}>
                <Ionicons name="flame" size={12} color="#030405" />
                <Text style={styles.quickStreakText}>{streak}D STREAK</Text>
              </View>
            </Animated.View>
            <View style={styles.peripheralOrbit1} />
            <View style={styles.peripheralOrbit2} />
          </View>

          {/* SYSTEM REAL-TIME BAR READOUTS */}
          <View style={styles.macroPillRow}>
            {[
              { label: 'PRO', current: macroStats.p, target: targetMacros.p, color: '#4cddbb', anim: macroPAnim },
              { label: 'CARB', current: macroStats.c, target: targetMacros.c, color: '#FF9F1C', anim: macroCAnim },
              { label: 'FAT', current: macroStats.f, target: targetMacros.f, color: '#FF4D94', anim: macroFAnim },
            ].map((macro, i) => (
              <View key={i} style={styles.macroOrbMetric}>
                <Text style={styles.orbMetricLabel}>{macro.label}</Text>
                <View style={styles.progressBarBackground}>
                  <Animated.View style={[styles.progressBarFill, { 
                    backgroundColor: macro.color, 
                    width: macro.anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%']
                    }) 
                  }]} />
                </View>
                <Text style={styles.orbMetricValue}>{macro.current}g <Text style={styles.orbMetricTarget}>/ {macro.target}g</Text></Text>
              </View>
            ))}
          </View>

          {/* AI INSIGHT CHIP */}
          <Pressable style={styles.aiInsightChip} onPress={suggestAlternative}>
            <View style={styles.sparkleDot}>
              <Ionicons name="sparkles" size={12} color="#030405" />
            </View>
            <Text style={styles.aiInsightText}>AI Recommendation: Optimize Mid-Day Fuel Specs</Text>
            <Ionicons name="chevron-forward" size={14} color="#4cddbb" style={{ marginLeft: 'auto' }} />
          </Pressable>
        </View>

        {/* TIME HORIZON NODE TRACK */}
        <View style={styles.dayStrip}>
          {days.map((day, idx) => (
            <Pressable 
              key={idx} 
              style={[styles.dayNode, selectedDay === idx && styles.dayNodeActive]}
              onPress={() => setSelectedDay(idx)}
            >
              <Text style={[styles.dayNodeText, selectedDay === idx && styles.dayNodeTextActive]}>{day}</Text>
              {idx === 1 && <View style={styles.activeDayPulseDot} />}
            </Pressable>
          ))}
        </View>

        {/* CAROUSEL FLOW */}
        <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }}>
          <Text style={styles.sectionLabel}>TIMELINE STREAM</Text>
          <Text style={styles.indexCounter}>{activeMealIndex + 1} / {meals.length}</Text>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselScroll}
          snapToInterval={width * 0.84 + 16}
          decelerationRate="fast"
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / (width * 0.84 + 16));
            setActiveMealIndex(index);
          }}
        >
          {meals.map((meal, index) => {
            const isFocused = index === activeMealIndex;
            return (
              <Pressable 
                key={meal.id}
                onPress={() => {
                  setActiveMealIndex(index);
                  setSelectedMeal(meal);
                  setShowMealModal(true);
                }}
                style={[styles.focusMealCard, isFocused && styles.focusMealCardActive]}
              >
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.cardPeriodText}>{meal.period}</Text>
                    <Text style={styles.cardTimeText}>{meal.time}</Text>
                  </View>
                  <View style={[
                    styles.statusPill, 
                    meal.status === 'logged' && styles.statusPillLogged,
                    meal.status === 'skipped' && styles.statusPillSkipped
                  ]}>
                    <Text style={[
                      styles.statusPillText,
                      meal.status === 'logged' && styles.statusPillTextLogged,
                      meal.status === 'skipped' && styles.statusPillTextSkipped
                    ]}>
                      {meal.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardImageWrapper}>
                  <Image source={{ uri: meal.image }} style={styles.mealHeroImage} />
                  <View style={styles.imageOverlayGlass}>
                    <Text style={styles.imageFoodTitle}>{meal.title}</Text>
                    <Text style={styles.imageFoodMacros}>P:{meal.macros.p}g • C:{meal.macros.c}g • F:{meal.macros.f}g</Text>
                  </View>
                </View>

                <View style={styles.cardActionStrip}>
                  <View>
                    <Text style={styles.cardKcalValue}>{meal.kcal}</Text>
                    <Text style={styles.cardKcalLabel}>TOTAL KCAL</Text>
                  </View>

                  <View style={styles.actionButtonGroup}>
                    <Pressable 
                      style={[styles.pillActionButton, meal.status === 'logged' && styles.pillActionButtonLogged]} 
                      onPress={(e) => {
                        e.stopPropagation();
                        toggleMealStatus(meal.id);
                      }}
                    >
                      <MaterialCommunityIcons 
                        name={meal.status === 'logged' ? "shield-check" : "lightning-bolt"} 
                        size={16} 
                        color="#030405" 
                      />
                      <Text style={styles.pillActionText}>
                        {meal.status === 'logged' ? 'SECURED' : 'ENGAGE'}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* OPERATIONS BAR */}
        <View style={styles.quickActions}>
          <Pressable style={styles.quickActionBtn} onPress={suggestAlternative}>
            <View style={styles.actionIconWrapper}><Ionicons name="sparkles" size={20} color="#4cddbb" /></View>
            <Text style={styles.quickActionText}>AI Refine</Text>
          </Pressable>
          
          <Pressable style={styles.quickActionBtn} onPress={() => Alert.alert("Camera Module Ready.")}>
            <View style={styles.actionIconWrapper}><Ionicons name="camera" size={20} color="#FF9F1C" /></View>
            <Text style={styles.quickActionText}>Scan Intake</Text>
          </Pressable>
          
          <Pressable style={styles.quickActionBtn} onPress={() => Alert.alert("System Analytics Access Verified.")}>
            <View style={styles.actionIconWrapper}><Ionicons name="stats-chart" size={20} color="#FF4D94" /></View>
            <Text style={styles.quickActionText}>Diagnostics</Text>
          </Pressable>
        </View>

      </ScrollView>

      {/* OVERLAY TACTICAL READOUT MODAL */}
      <Modal visible={showMealModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowMealModal(false)} />
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            {selectedMeal && (
              <>
                <View style={styles.modalImageContainer}>
                  <Image source={{ uri: selectedMeal.image }} style={styles.modalImage} />
                  <View style={styles.modalImageTag}>
                    <Text style={styles.modalImageTagText}>{selectedMeal.kcal} KCAL</Text>
                  </View>
                </View>
                
                <Text style={styles.modalTitle}>{selectedMeal.title}</Text>
                <Text style={styles.modalPeriod}>{selectedMeal.period} // ARCHIVE TIMESTAMPS: {selectedMeal.time}</Text>
                
                <View style={styles.modalMacrosContainer}>
                  <Text style={styles.modalSectionSub}>MACRONUTRIENT SPEC SHEET</Text>
                  <View style={styles.modalMacroGrid}>
                    <View style={styles.modalMacroNode}><Text style={styles.mGridLabel}>PRO</Text><Text style={styles.mGridVal}>{selectedMeal.macros.p}g</Text></View>
                    <View style={styles.modalMacroNode}><Text style={styles.mGridLabel}>CARB</Text><Text style={styles.mGridVal}>{selectedMeal.macros.c}g</Text></View>
                    <View style={styles.modalMacroNode}><Text style={styles.mGridLabel}>FAT</Text><Text style={styles.mGridVal}>{selectedMeal.macros.f}g</Text></View>
                  </View>
                  <Text style={styles.modalMicroText}>MICROS: {selectedMeal.micros}</Text>
                </View>

                <View style={styles.notesBox}>
                  <Ionicons name="document-text-outline" size={16} color="#8E9492" />
                  <Text style={styles.modalNotes}>{selectedMeal.notes}</Text>
                </View>

                <View style={styles.modalActions}>
                  <Pressable style={styles.modalCancel} onPress={() => setShowMealModal(false)}>
                    <Text style={styles.modalCancelText}>DISMISS</Text>
                  </Pressable>
                  
                  <Pressable 
                    style={[styles.modalLogButton, selectedMeal.status === 'logged' && styles.modalLogButtonActive]} 
                    onPress={() => toggleMealStatus(selectedMeal.id)}
                  >
                    <Text style={styles.modalLogButtonText}>
                      {selectedMeal.status === 'logged' ? 'DE-AUTHORIZE INTENDED' : 'AUTHORIZE intake'}
                    </Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeScreenWrapper>
  );
}

const styles = StyleSheet.create({
  masterWrapper: {
    flex: 1,
    backgroundColor: '#030405',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  systemStatusText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#4cddbb',
    letterSpacing: 1,
    marginTop: 2,
    opacity: 0.8,
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  xpBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  xpText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(76, 221, 187, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radialContainer: {
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 24,
  },
  radialRingOuter: {
    width: width * 0.48,
    height: width * 0.48,
    borderRadius: (width * 0.48) / 2,
    borderWidth: 1,
    borderColor: 'rgba(76, 221, 187, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  radialOrbInner: {
    width: width * 0.40,
    height: width * 0.40,
    borderRadius: (width * 0.40) / 2,
    backgroundColor: '#0C0F0E',
    borderWidth: 2,
    borderColor: '#4cddbb',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    shadowColor: '#4cddbb',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  peripheralOrbit1: {
    position: 'absolute',
    width: width * 0.54,
    height: width * 0.54,
    borderRadius: (width * 0.54) / 2,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  peripheralOrbit2: {
    position: 'absolute',
    width: width * 0.60,
    height: width * 0.60,
    borderRadius: (width * 0.60) / 2,
    borderWidth: 1,
    borderColor: 'rgba(76, 221, 187, 0.05)',
  },
  remainingValue: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  remainingLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#8E9492',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  quickStreakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#4cddbb',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 12,
  },
  quickStreakText: {
    color: '#030405',
    fontSize: 9,
    fontWeight: '900',
  },
  macroPillRow: {
    width: '100%',
    marginTop: 32,
    gap: 12,
  },
  macroOrbMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  orbMetricLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#8E9492',
    width: 48,
    letterSpacing: 0.5,
  },
  progressBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 3,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  orbMetricValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  orbMetricTarget: {
    fontSize: 11,
    color: '#646866',
    fontWeight: '500',
  },
  aiInsightChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(76, 221, 187, 0.05)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(76, 221, 187, 0.15)',
    width: '100%',
  },
  sparkleDot: {
    backgroundColor: '#4cddbb',
    padding: 4,
    borderRadius: 6,
  },
  aiInsightText: {
    color: '#4cddbb',
    fontSize: 12,
    fontWeight: '700',
    maxWidth: '80%',
  },
  dayStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 28,
  },
  dayNode: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.03)',
  },
  dayNodeActive: {
    borderColor: '#4cddbb',
    backgroundColor: 'rgba(76, 221, 187, 0.1)',
  },
  dayNodeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#646866',
  },
  dayNodeTextActive: {
    color: '#4cddbb',
  },
  activeDayPulseDot: {
    position: 'absolute',
    bottom: -4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4cddbb',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '900',
    color: '#8E9492',
    letterSpacing: 2,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  indexCounter: {
    color: '#646866',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  carouselScroll: {
    paddingLeft: 24,
    paddingRight: 40,
    gap: 16,
    paddingBottom: 32,
  },
  focusMealCard: {
    width: width * 0.84,
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 24,
    padding: 18,
    height: 300,
    opacity: 0.4,
  },
  focusMealCardActive: {
    opacity: 1,
    backgroundColor: 'rgba(12, 15, 14, 0.95)',
    borderColor: 'rgba(76, 221, 187, 0.4)',
    shadowColor: '#4cddbb',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardPeriodText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  cardTimeText: {
    color: '#8E9492',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  statusPillLogged: {
    backgroundColor: 'rgba(76, 221, 187, 0.15)',
  },
  statusPillSkipped: {
    backgroundColor: 'rgba(255, 77, 148, 0.15)',
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#8E9492',
    letterSpacing: 0.5,
  },
  statusPillTextLogged: {
    color: '#4cddbb',
  },
  statusPillTextSkipped: {
    color: '#FF4D94',
  },
  cardImageWrapper: {
    height: 134,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
  },
  mealHeroImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlayGlass: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(3, 4, 5, 0.85)',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  imageFoodTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  imageFoodMacros: {
    color: '#4cddbb',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  cardActionStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardKcalValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  cardKcalLabel: {
    fontSize: 9,
    color: '#8E9492',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  actionButtonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pillActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#4cddbb',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  pillActionButtonLogged: {
    backgroundColor: '#8E9492',
  },
  pillActionText: {
    color: '#030405',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    marginTop: 12,
  },
  quickActionBtn: {
    alignItems: 'center',
    gap: 8,
  },
  actionIconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionText: {
    color: '#8E9492',
    fontSize: 11,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 4, 5, 0.96)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0C0F0E',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 44,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalImageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalImageTag: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: '#030405',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  modalImageTagText: {
    color: '#4cddbb',
    fontSize: 12,
    fontWeight: '900',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFF',
  },
  modalPeriod: {
    color: '#8E9492',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 4,
    marginBottom: 24,
  },
  modalSectionSub: {
    color: '#646866',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 12,
  },
  modalMacrosContainer: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    marginBottom: 16,
  },
  modalMacroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalMacroNode: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  mGridLabel: {
    color: '#8E9492',
    fontSize: 10,
    fontWeight: '800',
  },
  mGridVal: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  modalMicroText: {
    color: '#4cddbb',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    paddingTop: 10,
  },
  notesBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.01)',
    padding: 14,
    borderRadius: 12,
    marginBottom: 28,
  },
  modalNotes: {
    color: '#B0B5B3',
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancel: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#8E9492',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  modalLogButton: {
    flex: 2,
    backgroundColor: '#4cddbb',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  modalLogButtonActive: {
    backgroundColor: '#FF4D94',
  },
  modalLogButtonText: {
    color: '#030405',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.5,
  },
});