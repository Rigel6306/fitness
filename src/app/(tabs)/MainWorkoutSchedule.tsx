'use client'
import CurentScheduleCard from '@/components/mainWorkouts/CurentScheduleCard';
import ScheduleCard from '@/components/mainWorkouts/ScheduleCard';
import WorkoutsListModal from '@/components/mainWorkouts/WorkoutListModal';
import SafeScreenWrapper from '@/components/SafeScreenWrapper';
import TipsCard from '@/components/ui/TipsCard';
import { mainSchedules } from '@/data/data';
import { useUserDataContext } from '@/hooks/useContext';
import { getAsyncStorageData, setAsyncStorageData } from '@/services/asynchStorageService';
import { getScheduleFromUser } from '@/services/workoutService';
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';


const T = {
  bg: '#030405',
  surface1: '#0D1110',
  surface2: '#141918',
  border: 'rgba(255,255,255,0.07)',
  accent: '#4CDDBB',
  accentDim: 'rgba(76,221,187,0.12)',
  accentMid: 'rgba(76,221,187,0.25)',
  textPri: '#FFFFFF',
  textSec: '#7A8480',
  textMuted: '#4A5250',
};

// ─── Types 
type Exercise = { id: number; name: string; reps: (number | string)[] };
type Workouts = { day: number; schedule: Exercise[] };
type ScheduleType = {
  id: string; title: string; frequency: string;
  workoutsCount: number; workouts: Workouts[];
  duration: number; focus: string[];
};

//  Header stats 
const ProgressStats = () => {
  // Animated accent bar — the single motion signature of this screen
  const barAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(barAnim, {
      toValue: 1,
      duration: 900,
      delay: 200,
      useNativeDriver: false,
    }).start();
  }, []);

  const barWidth = barAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '10%'] });

  return (
    <View style={s.statsRow}>
      <View style={s.statBlock}>
        <Text style={s.statValue}>0%</Text>
        <Text style={s.statLabel}>Progress</Text>
        <View style={s.statTrack}>
          <Animated.View style={[s.statFill, { width: barWidth }]} />
        </View>
      </View>

      <View style={s.statDivider} />

      <View style={s.statBlock}>
        <Text style={s.statValue}>0</Text>
        <Text style={s.statLabel}>Days done</Text>
        <View style={s.statTrack}>
          <View style={[s.statFill, { width: '30%' }]} />
        </View>
      </View>

      <View style={s.statDivider} />

      <View style={s.statBlock}>
        <Text style={s.statValue}>30</Text>
        <Text style={s.statLabel}>Days total</Text>
        <View style={s.statTrack}>
          <View style={[s.statFill, { width: '10%', opacity: 0.2 }]} />
        </View>
      </View>
    </View>
  );
};


const SectionHeading = ({
  icon, label, action,
}: {
  icon: React.ReactNode;
  label: string;
  action?: React.ReactNode;
}) => (
  <View style={s.sectionHead}>
    <View style={s.sectionHeadLeft}>
      {icon}
      <Text style={s.sectionTitle}>{label}</Text>
    </View>
    {action}
  </View>
);

//  Main screen 
const MainWorkoutSchedule = () => {
  const [modalVisible, setModelVisible] = useState(false);
  const [selectedDaySchedule, setSelectedDaySchedule] = useState<Workouts | null>(null);
  const [schedule, setSchedule] = useState<ScheduleType | null>();
  const [workoutList, setWorkoutList] = useState<any>();
  const today = new Date().toISOString().split('T')[0];
  const { userData } = useUserDataContext();

  // ── data hydration ──────────────────────────────────────────────────────────
  useEffect(() => {
    const loadData = async () => {
      const storedSchedule = await getAsyncStorageData('schedule');
      if (storedSchedule) {
        const storedWorkouts = await getAsyncStorageData('workoutsList');
        setSchedule(storedSchedule);
        if (storedWorkouts?.date === today) {
          setWorkoutList(storedWorkouts);
        } else {
          const baseList = storedWorkouts?.list
            ?? storedSchedule.workouts?.[0]?.schedule
            ?? [];
          const fresh = { date: today, list: baseList.map((i: any) => ({ ...i, isComplete: false })) };
          setWorkoutList(fresh);
          await setAsyncStorageData('workoutsList', fresh);
        }
      } else {
        const dbSchedule = await getScheduleFromUser(userData.id);
        setSchedule(dbSchedule);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadDayWorkouts = async () => {
      if (!selectedDaySchedule?.schedule) return;
      const dayKey = `workoutsList_day${selectedDaySchedule.day}`;
      const stored = await getAsyncStorageData(dayKey);
      if (stored?.date === today) {
        setWorkoutList(stored);
      } else {
        const fresh = {
          date: today,
          list: selectedDaySchedule.schedule.map(i => ({ ...i, isComplete: false })),
        };
        setWorkoutList(fresh);
        await setAsyncStorageData(dayKey, fresh);
      }
    };
    loadDayWorkouts();
  }, [selectedDaySchedule]);

  useEffect(() => {
    const initFirst = async () => {
      if (schedule?.workouts?.length && !selectedDaySchedule) {
        setSelectedDaySchedule(schedule.workouts[0]);
        await setAsyncStorageData('schedule', schedule);
      }
    };
    initFirst();
  }, [schedule]);


  return (
    <View style={s.root}>
      <SafeScreenWrapper>
        {/* ── Header ── */}
        <View style={s.header}>
          <Text style={s.eyebrow}>3-Month Plan</Text>
          <Text style={s.headerTitle}>Your Schedule</Text>
          <ProgressStats />
        </View>

        {/* ── Body ── */}
        <ScrollView
          style={s.body}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scrollContent}
        >
          {/* Training Progression */}
          <View style={s.section}>
            <SectionHeading
              icon={<Octicons name="stack" size={14} color={T.accent} />}
              label="Training Progression"
            />
            <Text style={s.sectionMeta}>
              Complete each block to unlock the next phase
            </Text>
            {schedule && (
              <ScheduleCard
                index={0}
                frequency={schedule.frequency}
                duration={schedule.duration}
                title={schedule.title}
                dayCount={schedule.workouts.length}
                workoutsCount={schedule.workoutsCount}
              />
            )}
          </View>

          {/* Current Schedule */}
          <View style={s.section}>
            <SectionHeading
              icon={<Ionicons name="calendar-sharp" size={14} color={T.accent} />}
              label="Weekly Breakdown"
              action={
                <Pressable
                  style={({ pressed }) => [s.pill, pressed && s.pillPressed]}
                  onPress={() => console.log('Pressed')}
                >
                  <Text style={s.pillText}>Start Now</Text>
                </Pressable>
              }
            />

            {/* Focus tags */}
            <View style={s.tagRow}>
              {mainSchedules[2].focus.map((item, i) => (
                <View key={i} style={s.tag}>
                  <Text style={s.tagText}>{item}</Text>
                </View>
              ))}
            </View>

            {/* Day cards */}
            {schedule?.workouts.map((workout, i) => (
              <CurentScheduleCard
                key={i}
                setModalVisible={setModelVisible}
                selectedDaySchedule={setSelectedDaySchedule}
                workout={workout}
              />
            ))}
          </View>

          <TipsCard />
        </ScrollView>
      </SafeScreenWrapper>

      {workoutList && selectedDaySchedule && (
        <WorkoutsListModal
          setWorkoutsList={setWorkoutList}
          workoutsList={workoutList}
          modalVisible={modalVisible}
          setModalVisible={setModelVisible}
          selectedDaySchedule={selectedDaySchedule}
        />
      )}
    </View>
  );
};


const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: T.bg,
  },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: T.accent,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: T.textPri,
    letterSpacing: -0.6,
    marginBottom: 16,
  },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.surface1,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: T.border,
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: T.textPri,
    letterSpacing: -0.4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: T.textSec,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  statTrack: {
    width: '60%',
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 99,
    overflow: 'hidden',
  },
  statFill: {
    height: '100%',
    backgroundColor: T.accent,
    borderRadius: 99,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: T.border,
  },

  // Body
  body: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 28,
    paddingBottom: 80,
    gap: 32,
  },

  // Sections
  section: {
    paddingHorizontal: 20,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sectionHeadLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: T.textPri,
    letterSpacing: -0.2,
  },
  sectionMeta: {
    fontSize: 13,
    color: T.textSec,
    lineHeight: 19,
    marginBottom: 16,
    marginTop: 2,
  },

  // Pill CTA
  pill: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    backgroundColor: T.accentDim,
    borderWidth: 1,
    borderColor: T.accentMid,
    borderRadius: 99,
  },
  pillPressed: {
    opacity: 0.65,
  },
  pillText: {
    color: T.accent,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.2,
  },

  // Focus tags
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    marginBottom: 20,
  },
  tag: {
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 10,
    backgroundColor: T.surface2,
    borderWidth: 1,
    borderColor: T.border,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: T.textSec,
  },
});

export default MainWorkoutSchedule;
