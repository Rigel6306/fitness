import { useUserDataContext } from '@/hooks/useContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  LayoutChangeEvent,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Polygon, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');

// ─── Types ────────────────────────────────────────────────────────────────────

type LocalWeightData = {
  startWeight: string;
  currentWeight: string;
  targetWeight: string;
  weightLoss: boolean;
  updatedOn: string;
  height: string;
  weeklyDelta: string;
};

type BMICategory = {
  label: string;
  color: string;
  range: string;
  desc: string;
};

type PaceTier = {
  label: 'GENTLE' | 'MODERATE' | 'AGGRESSIVE';
  color: string;
};

// Tab order: 0=overview, 1=forecast, 2=edit
type Tab = 'overview' | 'forecast' | 'edit';
const TABS: Tab[] = ['overview', 'forecast', 'edit'];
const TAB_LABELS: Record<Tab, string> = {
  overview: 'OVERVIEW',
  forecast: 'FORECAST',
  edit: 'UPDATE',
};

// ─── Constants ────────────────────────────────────────────────────────────────

const BMI_CATEGORIES: BMICategory[] = [
  { label: 'UNDERWEIGHT', color: '#5c8aff', range: '< 18.5',     desc: 'Below healthy range' },
  { label: 'NORMAL',      color: '#0affca', range: '18.5–24.9', desc: 'Within healthy range' },
  { label: 'OVERWEIGHT',  color: '#f4ac38', range: '25–29.9',   desc: 'Above healthy range' },
  { label: 'OBESE',       color: '#ff5c5c', range: '≥ 30',      desc: 'Well above healthy range' },
];

const ACCENT  = '#0affca';
const PURPLE  = '#7c5cfc';
const AMBER   = '#f5a623';
const RED     = '#ff5c5c';
const CARD_BG = 'rgba(255,255,255,0.03)';
const BORDER  = 'rgba(255,255,255,0.06)';
const DIM     = 'rgba(255,255,255,0.35)';
const MID     = 'rgba(255,255,255,0.6)';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const calcBMI = (weightKg: number, heightCm: number): number => {
  if (!weightKg || !heightCm || heightCm <= 0) return 0;
  const hm = heightCm / 100;
  return weightKg / (hm * hm);
};

const getBMICategory = (bmi: number): BMICategory => {
  if (bmi < 18.5) return BMI_CATEGORIES[0];
  if (bmi < 25)   return BMI_CATEGORIES[1];
  if (bmi < 30)   return BMI_CATEGORIES[2];
  return BMI_CATEGORIES[3];
};

const calcProgress = (start: number, current: number, target: number, weightLoss: boolean): number => {
  if (![start, current, target].every(Number.isFinite)) return 0;
  const total = weightLoss ? start - target : target - start;
  const done  = weightLoss ? start - current : current - start;
  if (total <= 0) return 0;
  return Math.min(Math.max((done / total) * 100, 0), 100);
};

const calcWeeksToGoal = (current: number, target: number, pace: number, weightLoss: boolean): number | null => {
  if (!pace || pace <= 0) return null;
  const remaining = weightLoss ? current - target : target - current;
  if (remaining <= 0) return 0;
  return remaining / pace;
};

const addWeeks = (weeks: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + Math.round(weeks * 7));
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Classifies a weekly kg pace into Gentle / Moderate / Aggressive, with the
// thresholds sitting halfway between the reference paces shown in the
// "PACE REFERENCE" list (0.25 / 0.5 / 1.0 kg per week).
const getPaceTier = (pace: number): PaceTier | null => {
  if (!pace || pace <= 0) return null;
  if (pace <= 0.375) return { label: 'GENTLE', color: ACCENT };
  if (pace <= 0.75)  return { label: 'MODERATE', color: PURPLE };
  return { label: 'AGGRESSIVE', color: AMBER };
};

// ─── BMI Arc Gauge ────────────────────────────────────────────────────────────

const BMI_MIN = 14;
const BMI_MAX = 40;
const GR        = 60;   // gauge radius
const GCX       = 100;
const GCY       = 98;
const GS        = 8;    // band stroke width
const GAP       = 2.6;  // gap (deg) between segmented zone bands
const NEEDLE_LEN = GR - 10;
const NEEDLE_W   = 7;
function bmiToAngle(bmi: number): number {
  const c = Math.min(Math.max(bmi, BMI_MIN), BMI_MAX);
  return ((c - BMI_MIN) / (BMI_MAX - BMI_MIN)) * 180;
}

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 180) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arc(cx: number, cy: number, r: number, a1: number, a2: number) {
  const s = polar(cx, cy, r, a1);
  const e = polar(cx, cy, r, a2);
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${a2 - a1 > 180 ? 1 : 0} 1 ${e.x} ${e.y}`;
}

// Builds a tapered needle/arrowhead silhouette: a point at `tipLen` along
// `angleDeg`, widening to `baseWidth` right at the pivot.
function needleShape(cx: number, cy: number, angleDeg: number, tipLen: number, baseWidth: number): string {
  const rad = ((angleDeg - 180) * Math.PI) / 180;
  const dx = Math.cos(rad);
  const dy = Math.sin(rad);
  const px = -dy;
  const py = dx;
  const tip = { x: cx + dx * tipLen, y: cy + dy * tipLen };
  const halfW = baseWidth / 2;
  const baseL = { x: cx + px * halfW, y: cy + py * halfW };
  const baseR = { x: cx - px * halfW, y: cy - py * halfW };
  return `${tip.x},${tip.y} ${baseL.x},${baseL.y} ${baseR.x},${baseR.y}`;
}

const BMIGauge = ({ bmi, category }: { bmi: number; category: BMICategory }) => {
  const hasData = bmi > 0;
  const angle   = hasData ? bmiToAngle(bmi) : 90; // neutral, upright placeholder position
  const uEnd    = bmiToAngle(18.5);
  const nEnd    = bmiToAngle(25);
  const oEnd    = bmiToAngle(30);

  const needleColor = hasData ? category.color : 'rgba(255,255,255,0.22)';
  const needleOpacity = hasData ? 1 : 0.4;
 
  const needlePts = needleShape(GCX, GCY, angle, NEEDLE_LEN, NEEDLE_W);

  const minLabel = polar(GCX, GCY, GR + 17, 3);
  const maxLabel = polar(GCX, GCY, GR + 17, 177);

  return (
    <Svg width={200} height={120} viewBox="0 0 200 120">
      {/* background track */}
      <Path d={arc(GCX, GCY, GR, 0, 180)} stroke="rgba(255,255,255,0.05)" strokeWidth={GS + 5} fill="none" strokeLinecap="round" />

      {/* segmented zone bands, each capped + gapped for a cleaner, modern look */}
      <Path d={arc(GCX, GCY, GR, 0 + GAP, uEnd - GAP)} stroke="#5c8aff" strokeWidth={GS} fill="none" strokeLinecap="round" />
      <Path d={arc(GCX, GCY, GR, uEnd + GAP, nEnd - GAP)} stroke={ACCENT} strokeWidth={GS} fill="none" strokeLinecap="round" />
      <Path d={arc(GCX, GCY, GR, nEnd + GAP, oEnd - GAP)} stroke={AMBER} strokeWidth={GS} fill="none" strokeLinecap="round" />
      <Path d={arc(GCX, GCY, GR, oEnd + GAP, 180 - GAP)} stroke={RED} strokeWidth={GS} fill="none" strokeLinecap="round" />

      {/* scale end labels */}
      <SvgText x={minLabel.x} y={minLabel.y + 3} textAnchor="middle" fill={DIM} fontSize={8} fontWeight="700">
        {BMI_MIN}
      </SvgText>
      <SvgText x={maxLabel.x} y={maxLabel.y + 3} textAnchor="middle" fill={DIM} fontSize={8} fontWeight="700">
        {BMI_MAX}
      </SvgText>

      {/* needle: counterweight tail + tapered arrowhead + pivot */}
    
      <Polygon points={needlePts} fill={needleColor} opacity={needleOpacity} />
      <Circle cx={GCX} cy={GCY} r={7.5} fill="#0c0c12" stroke={needleColor} strokeWidth={2.5} opacity={needleOpacity} />
      <Circle cx={GCX} cy={GCY} r={2.5} fill={needleColor} opacity={needleOpacity} />

      <SvgText x={GCX} y={GCY - 22} textAnchor="middle" fill="#ffffff" fontSize={27} fontWeight="800">
        {hasData ? bmi.toFixed(1) : ''}
      </SvgText>
  
    </Svg>
  );
};

// ─── Compact Input ────────────────────────────────────────────────────────────

const Field = ({
  label, icon, placeholder, value, onChangeText, unit,
}: {
  label: string; icon: string; placeholder: string;
  value: string; onChangeText: (v: string) => void; unit?: string;
}) => (
  <View style={sc.field}>
    <Text style={sc.fieldLabel}>{label}</Text>
    <View style={sc.fieldRow}>
      <MaterialCommunityIcons name={icon as any} size={15} color="rgba(255,255,255,0.25)" style={{ marginRight: 8 }} />
      <TextInput
        style={sc.fieldInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType="decimal-pad"
        placeholderTextColor="rgba(255,255,255,0.15)"
      />
      {unit && <Text style={sc.fieldUnit}>{unit}</Text>}
    </View>
  </View>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const WeightTargetModal = ({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (v: boolean) => void;
}) => {
  const { weightData, setWeightData } = useUserDataContext();

  // ── Tab state — single source of truth ─────────────────────────────────────
  // activeTab drives both the indicator animation AND which content shows.
  // We reset to 'overview' (index 0) every time the modal opens.
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const tabAnim  = useRef(new Animated.Value(0)).current;

  // The indicator's width/position is measured from the tab bar's actual
  // rendered layout (not derived from screen width + guessed margins), so it
  // always lines up exactly with each tab button — no drift on the last tab,
  // no off-center label inside the highlight.
  const [tabBarWidth, setTabBarWidth] = useState(width - 42); // sensible first-paint estimate, corrected on layout
  const TAB_W = tabBarWidth > 0 ? (tabBarWidth - 2) / 3 : 0; // -2 = the 1px border on each side

  const onTabBarLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (Math.abs(w - tabBarWidth) > 0.5) setTabBarWidth(w);
  };

  const switchTab = (tab: Tab) => {
    const idx = TABS.indexOf(tab);
    setActiveTab(tab);
    Animated.spring(tabAnim, {
      toValue: idx,
      useNativeDriver: false,
      tension: 90,
      friction: 14,
    }).start();
  };

  // ── Local form state ────────────────────────────────────────────────────────
  const [local, setLocal] = useState<LocalWeightData>({
    startWeight: '', currentWeight: '', targetWeight: '',
    weightLoss: true, updatedOn: '', height: '', weeklyDelta: '',
  });

  // On open: sync from context AND reset tab to overview with instant indicator snap
  useEffect(() => {
    if (isModalOpen) {
      setLocal({
        startWeight:   String(weightData.startWeight   ?? ''),
        currentWeight: String(weightData.currentWeight ?? ''),
        targetWeight:  String(weightData.targetWeight  ?? ''),
        weightLoss:    Boolean(weightData.weightLoss),
        updatedOn:     weightData.updatedOn ?? '',
        height:        String(weightData.height        ?? ''),
        weeklyDelta:   String(weightData.weeklyDelta   ?? ''),
      });
      // Instantly reset indicator to index 0 without animation
      tabAnim.setValue(0);
      setActiveTab('overview');
    }
  }, [isModalOpen]);

  // ── Actions ─────────────────────────────────────────────────────────────────

  const dismiss = () => {
    // Reset local state back to saved values before closing
    setLocal({
      startWeight:   String(weightData.startWeight   ?? ''),
      currentWeight: String(weightData.currentWeight ?? ''),
      targetWeight:  String(weightData.targetWeight  ?? ''),
      weightLoss:    Boolean(weightData.weightLoss),
      updatedOn:     weightData.updatedOn ?? '',
      height:        String(weightData.height        ?? ''),
      weeklyDelta:   String(weightData.weeklyDelta   ?? ''),
    });
    setIsModalOpen(false);
  };

  // Save to context then navigate to overview — do NOT close modal
  const persist = (finalWeightLoss: boolean) => {
    setWeightData({
      startWeight:   Number(local.startWeight),
      currentWeight: Number(local.currentWeight),
      targetWeight:  Number(local.targetWeight),
      weightLoss:    finalWeightLoss,
      updatedOn:     new Date().toISOString().split('T')[0],
      height:        Number(local.height),
      weeklyDelta:   Number(local.weeklyDelta),
    });
    switchTab('overview'); // Go to overview, keep modal open
  };

  const handleSave = () => {
    const start   = Number(local.startWeight);
    const current = Number(local.currentWeight);
    const target  = Number(local.targetWeight);
    const { weightLoss } = local;

    if ([start, current, target].some((v) => isNaN(v) || v <= 0)) {
      Alert.alert('Invalid Input', 'Start, current and target weights must be positive numbers.');
      return;
    }

    const numLoss = start > target;
    const numGain = target > start;

    if (weightLoss && !numLoss) {
      Alert.alert('Goal Mismatch', 'Target is not below start weight for a loss goal.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Switch to Gain', onPress: () => persist(false) },
        { text: 'Save Anyway', onPress: () => persist(true) },
      ]);
      return;
    }
    if (!weightLoss && !numGain) {
      Alert.alert('Goal Mismatch', 'Target is not above start weight for a gain goal.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Switch to Lose', onPress: () => persist(true) },
        { text: 'Save Anyway', onPress: () => persist(false) },
      ]);
      return;
    }
    if (weightLoss ? current <= target : current >= target) {
      Alert.alert('🎯 Goal Reached!', 'Your current weight is already at or past your target.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Save', onPress: () => persist(weightLoss) },
      ]);
      return;
    }
    persist(weightLoss);
  };

  // ── Derived values ──────────────────────────────────────────────────────────

  const start   = Number(local.startWeight);
  const current = Number(local.currentWeight);
  const target  = Number(local.targetWeight);
  const height  = Number(local.height);
  const pace    = Number(local.weeklyDelta);

  const progress  = calcProgress(start, current, target, local.weightLoss);
  const bmi       = calcBMI(current, height);
  const targetBMI = calcBMI(target, height);
  const bmiCat    = getBMICategory(bmi);
  const weeksLeft = calcWeeksToGoal(current, target, pace, local.weightLoss);
  const estDate   = weeksLeft != null && weeksLeft > 0 ? addWeeks(weeksLeft) : null;
  const totalDiff = Math.abs(start - target);
  const achieved  = Math.abs(start - current);
  const remaining = Math.abs(current - target);
  const paceTier  = getPaceTier(pace);
  const bmiDelta  = targetBMI > 0 && bmi > 0 ? targetBMI - bmi : 0;

  const indicatorLeft = tabAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [4, TAB_W + 4, TAB_W * 2 + 4],
  });

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <Modal
      visible={isModalOpen}
      animationType="slide"
      presentationStyle="pageSheet"
      transparent={false}
      onRequestClose={dismiss}
    >
      <View style={sc.root}>
        <SafeAreaView style={sc.safe} edges={['top', 'bottom']}>
          <KeyboardAvoidingView style={sc.kav} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

            {/* Drag handle */}
            <View style={sc.dragRow}>
              <View style={sc.dragBar} />
            </View>

            {/* Header */}
            <View style={sc.header}>
              <View>
                <Text style={sc.eyebrow}>BODY METRICS</Text>
                <Text style={sc.title}>WEIGHT TRACKER</Text>
              </View>
              <Pressable onPress={dismiss} style={({ pressed }) => [sc.closeBtn, pressed && { opacity: 0.5 }]}>
                <Ionicons name="close" size={17} color="#ffffff" />
              </Pressable>
            </View>

            {/* Tab bar */}
            <View style={sc.tabBar} onLayout={onTabBarLayout}>
              <Animated.View style={[sc.tabIndicator, { left: indicatorLeft, width: Math.max(TAB_W - 8, 0) }]} />
              {TABS.map((tab) => (
                <Pressable key={tab} style={sc.tabBtn} onPress={() => switchTab(tab)}>
                  <Text style={[sc.tabText, activeTab === tab && sc.tabTextActive]} numberOfLines={1}>
                    {TAB_LABELS[tab]}
                  </Text>
                </Pressable>
              ))}
            </View>

            <ScrollView
              contentContainerStyle={sc.scroll}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >

              {/* ── OVERVIEW ────────────────────────────────────────────── */}
              {activeTab === 'overview' && (
                <View style={sc.section}>

                  {/* BMI Card */}
                  <View style={sc.card}>
                    <Text style={sc.eyebrowSm}>BODY MASS INDEX</Text>
                    <View style={sc.bmiRow}>
                      <BMIGauge bmi={bmi} category={bmiCat} />
                      <View style={sc.bmiRight}>
                        <View style={[sc.catChip, { borderColor: bmiCat.color + '55', backgroundColor: bmiCat.color + '15' }]}>
                          <View style={[sc.catDot, { backgroundColor: bmiCat.color }]} />
                          <Text style={[sc.catText, { color: bmiCat.color }]}>{bmiCat.label}</Text>
                        </View>

                        {bmi > 0 ? (
                          <View style={sc.bmiDescBlock}>
                            <Text style={sc.bmiDesc}>{bmiCat.desc}</Text>
                            <Text style={sc.bmiRangeText}>{bmiCat.range} kg/m²</Text>
                          </View>
                        ) : (
                          <Text style={sc.bmiHint}>Enter height &{'\n'}weight to calculate</Text>
                        )}

                        {height > 0 && targetBMI > 0 && bmi > 0 && (
                          <View style={sc.targetBmiBox}>
                            <View>
                              <Text style={sc.targetBmiLabel}>TARGET BMI</Text>
                              <Text style={[sc.targetBmiVal, { color: getBMICategory(targetBMI).color }]}>
                                {targetBMI.toFixed(1)}
                              </Text>
                            </View>
                            <View style={sc.bmiDeltaPill}>
                              <Ionicons
                                name={bmiDelta < 0 ? 'arrow-down' : bmiDelta > 0 ? 'arrow-up' : 'remove'}
                                size={11}
                                color={bmiDelta < 0 ? ACCENT : bmiDelta > 0 ? PURPLE : DIM}
                              />
                              <Text style={[sc.bmiDeltaText, { color: bmiDelta < 0 ? ACCENT : bmiDelta > 0 ? PURPLE : DIM }]}>
                                {Math.abs(bmiDelta).toFixed(1)}
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>
                    </View>
                    {/* Zone legend */}
                    <View style={sc.zones}>
                      {BMI_CATEGORIES.map((z) => (
                        <View key={z.label} style={sc.zonePill}>
                          <View style={[sc.zoneDot, { backgroundColor: z.color }]} />
                          <Text style={sc.zoneText}>{z.label}</Text>
                          <Text style={sc.zoneRange}>{z.range}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Progress Card */}
                  <View style={sc.card}>
                    <View style={sc.rowBetween}>
                      <Text style={sc.eyebrowSm}>GOAL PROGRESS</Text>
                      <View style={[sc.badge, { backgroundColor: local.weightLoss ? ACCENT + '18' : PURPLE + '22' }]}>
                        <Ionicons
                          name={local.weightLoss ? 'trending-down-outline' : 'trending-up-outline'}
                          size={11} color={local.weightLoss ? ACCENT : PURPLE}
                        />
                        <Text style={[sc.badgeText, { color: local.weightLoss ? ACCENT : PURPLE }]}>
                          {local.weightLoss ? 'LOSING' : 'GAINING'}
                        </Text>
                      </View>
                    </View>

                    <View style={sc.pctRow}>
                      <Text style={sc.pctBig}>{progress.toFixed(1)}<Text style={sc.pctSmall}>%</Text></Text>
                      <Text style={sc.pctSub}>of goal completed</Text>
                    </View>

                    <View style={sc.bar}>
                      <View style={[sc.barFill, { width: `${progress}%` }]} />
                    </View>

                    {/* Weight triplet */}
                    <View style={sc.triplet}>
                      {[
                        { label: 'START', val: local.startWeight, accent: '#ffffff' },
                        { label: 'NOW',   val: local.currentWeight, accent: ACCENT },
                        { label: 'GOAL',  val: local.targetWeight, accent: '#ffffff' },
                      ].map((item, i) => (
                        <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', flex: i === 1 ? 1.1 : 1 }}>
                          {i > 0 && <View style={sc.tripletDiv} />}
                          <View style={sc.tripletItem}>
                            <Text style={sc.tripletLabel}>{item.label}</Text>
                            <Text style={[sc.tripletVal, { color: item.accent }]}>
                              {item.val || '—'}
                            </Text>
                            {!!item.val && <Text style={sc.tripletUnit}>kg</Text>}
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Stat row */}
                  <View style={sc.statsRow}>
                    {[
                      { label: 'CHANGED', val: start && current ? `${achieved.toFixed(1)} kg` : '—', color: ACCENT },
                      { label: 'LEFT',    val: current && target ? `${remaining.toFixed(1)} kg` : '—', color: AMBER },
                      { label: 'GOAL',    val: start && target ? `${totalDiff.toFixed(1)} kg` : '—', color: '#ffffff' },
                    ].map((s) => (
                      <View key={s.label} style={sc.statPill}>
                        <Text style={sc.statLabel}>{s.label}</Text>
                        <Text style={[sc.statVal, { color: s.color }]}>{s.val}</Text>
                      </View>
                    ))}
                  </View>

                  {local.updatedOn ? (
                    <Text style={sc.lastUpdated}>LAST UPDATED · {local.updatedOn}</Text>
                  ) : null}
                </View>
              )}

              {/* ── FORECAST ────────────────────────────────────────────── */}
              {activeTab === 'forecast' && (
                <View style={sc.section}>

                  {/* ETA Hero */}
                  <View style={[sc.card, sc.forecastHero]}>
                    <View style={sc.forecastIconWrap}>
                      <MaterialCommunityIcons name="calendar-check-outline" size={22} color={PURPLE} />
                    </View>

                    {paceTier ? (
                      <View style={sc.paceHeaderRow}>
                        <Text style={sc.eyebrowSm}>ESTIMATED GOAL DATE</Text>
                        <View style={[sc.paceTierChip, { borderColor: paceTier.color + '55', backgroundColor: paceTier.color + '15' }]}>
                          <View style={[sc.paceTierDot, { backgroundColor: paceTier.color }]} />
                          <Text style={[sc.paceTierChipText, { color: paceTier.color }]}>{paceTier.label} PACE</Text>
                        </View>
                      </View>
                    ) : (
                      <Text style={sc.eyebrowSm}>ESTIMATED GOAL DATE</Text>
                    )}

                    {estDate ? (
                      <>
                        <Text style={sc.etaDate}>{estDate}</Text>
                        <Text style={sc.etaSub}>
                          ~{weeksLeft != null ? Math.round(weeksLeft) : '—'} weeks · {pace} kg/week
                        </Text>
                      </>
                    ) : (
                      <Text style={sc.etaEmpty}>
                        Set your weekly pace{'\n'}in the Update tab to see your ETA
                      </Text>
                    )}
                  </View>

                  {/* Milestones */}
                  {pace > 0 && current > 0 && target > 0 && (
                    <View style={sc.card}>
                      <Text style={sc.eyebrowSm}>MILESTONE CHECKPOINTS</Text>
                      {[25, 50, 75, 100].map((pct, i) => {
                        const mw = local.weightLoss
                          ? start - (totalDiff * pct) / 100
                          : start + (totalDiff * pct) / 100;
                        const wks = calcWeeksToGoal(start, mw, pace, local.weightLoss);
                        const reached = progress >= pct;
                        return (
                          <View key={pct} style={[sc.msRow, i === 3 && { borderBottomWidth: 0 }]}>
                            <View style={[sc.msDot, reached && sc.msDotDone]} />
                            <View style={{ flex: 1 }}>
                              <Text style={sc.msPct}>{pct}% milestone</Text>
                              <Text style={[sc.msWeight, reached && { color: ACCENT }]}>
                                {mw.toFixed(1)} kg
                              </Text>
                            </View>
                            <Text style={[sc.msDate, reached && { color: ACCENT }]}>
                              {reached ? '✓ DONE' : wks != null ? addWeeks(wks) : '—'}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  )}

                  {/* Health tip */}
                  <View style={[sc.card, sc.tipCard]}>
                    <View style={sc.tipHeader}>
                      <MaterialCommunityIcons name="lightbulb-on-outline" size={16} color={AMBER} />
                      <Text style={sc.tipTitle}>HEALTH INSIGHT</Text>
                    </View>
                    <Text style={sc.tipBody}>
                      {bmi <= 0
                        ? 'Enter your height and weight in the Update tab for a personalised insight.'
                        : bmi < 18.5
                        ? 'Your BMI is below the healthy range. Focus on a calorie surplus with protein-rich foods and progressive strength training.'
                        : bmi < 25
                        ? 'Your BMI is in the healthy range. Maintain it with balanced nutrition and consistent exercise.'
                        : bmi < 30
                        ? 'Your BMI is in the overweight range. A modest deficit of 300–500 kcal/day supports safe, sustainable loss.'
                        : 'Your BMI is in the obese range. Consider speaking with a healthcare professional for a personalised plan.'}
                    </Text>
                  </View>

                  {/* Pace reference */}
                  <View style={sc.card}>
                    <Text style={sc.eyebrowSm}>PACE REFERENCE</Text>
                    {[
                      { key: 'GENTLE',     label: 'Gentle',     sub: '0.25 kg / week', wks: remaining / 0.25, color: ACCENT },
                      { key: 'MODERATE',   label: 'Moderate',   sub: '0.5 kg / week',  wks: remaining / 0.5,  color: PURPLE },
                      { key: 'AGGRESSIVE', label: 'Aggressive', sub: '1.0 kg / week',  wks: remaining / 1.0,  color: AMBER },
                    ].map((row, i) => {
                      const isYours = paceTier?.label === row.key;
                      return (
                        <View key={row.label} style={[sc.paceRow, i === 2 && { borderBottomWidth: 0 }, isYours && sc.paceRowActive]}>
                          <View style={[sc.paceDot, { backgroundColor: row.color }]} />
                          <View style={{ flex: 1 }}>
                            <View style={sc.paceLabelRow}>
                              <Text style={sc.paceLabel}>{row.label}</Text>
                              {isYours && (
                                <View style={[sc.yourPaceTag, { backgroundColor: row.color + '22' }]}>
                                  <Text style={[sc.yourPaceTagText, { color: row.color }]}>YOURS</Text>
                                </View>
                              )}
                            </View>
                            <Text style={sc.paceSub}>{row.sub}</Text>
                          </View>
                          <Text style={[sc.paceWks, { color: row.color }]}>
                            {remaining > 0 ? `~${Math.round(row.wks)} wks` : '—'}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* ── UPDATE ──────────────────────────────────────────────── */}
              {activeTab === 'edit' && (
                <View style={sc.section}>

                  {/* Goal Type */}
                  <View style={sc.card}>
                    <Text style={sc.eyebrowSm}>GOAL TYPE</Text>
                    <View style={sc.modeRow}>
                      <Pressable
                        style={[sc.modeBtn, local.weightLoss && { backgroundColor: ACCENT + '18', borderColor: ACCENT + '55' }]}
                        onPress={() => setLocal((p) => ({ ...p, weightLoss: true }))}
                      >
                        <Ionicons
                          name="trending-down-outline" size={18}
                          color={local.weightLoss ? ACCENT : 'rgba(255,255,255,0.3)'}
                        />
                        <View>
                          <Text style={[sc.modePrimary, local.weightLoss && { color: ACCENT }]}>LOSE WEIGHT</Text>
                          <Text style={sc.modeSub}>Calorie deficit</Text>
                        </View>
                        {local.weightLoss && (
                          <View style={[sc.modeCheck, { backgroundColor: ACCENT }]}>
                            <Ionicons name="checkmark" size={10} color="#030305" />
                          </View>
                        )}
                      </Pressable>
                      <Pressable
                        style={[sc.modeBtn, !local.weightLoss && { backgroundColor: PURPLE + '18', borderColor: PURPLE + '55' }]}
                        onPress={() => setLocal((p) => ({ ...p, weightLoss: false }))}
                      >
                        <Ionicons
                          name="trending-up-outline" size={18}
                          color={!local.weightLoss ? PURPLE : 'rgba(255,255,255,0.3)'}
                        />
                        <View>
                          <Text style={[sc.modePrimary, !local.weightLoss && { color: PURPLE }]}>GAIN WEIGHT</Text>
                          <Text style={sc.modeSub}>Calorie surplus</Text>
                        </View>
                        {!local.weightLoss && (
                          <View style={[sc.modeCheck, { backgroundColor: PURPLE }]}>
                            <Ionicons name="checkmark" size={10} color="#030305" />
                          </View>
                        )}
                      </Pressable>
                    </View>
                  </View>

                  {/* Measurements — 2×2 grid */}
                  <View style={sc.card}>
                    <Text style={sc.eyebrowSm}>MEASUREMENTS</Text>
                    <View style={sc.fieldGrid}>
                      <Field label="HEIGHT" icon="human-male-height" placeholder="e.g. 175" value={local.height} onChangeText={(v) => setLocal((p) => ({ ...p, height: v }))} unit="cm" />
                      <Field label="START WEIGHT" icon="flag-outline" placeholder="e.g. 85" value={local.startWeight} onChangeText={(v) => setLocal((p) => ({ ...p, startWeight: v }))} unit="kg" />
                      <Field label="CURRENT WEIGHT" icon="weight" placeholder="e.g. 78" value={local.currentWeight} onChangeText={(v) => setLocal((p) => ({ ...p, currentWeight: v }))} unit="kg" />
                      <Field label="TARGET WEIGHT" icon="bullseye-arrow" placeholder="e.g. 72" value={local.targetWeight} onChangeText={(v) => setLocal((p) => ({ ...p, targetWeight: v }))} unit="kg" />
                    </View>
                  </View>

                  {/* Weekly pace */}
                  <View style={sc.card}>
                    <View style={sc.rowBetween}>
                      <Text style={sc.eyebrowSm}>WEEKLY PACE</Text>
                      {paceTier && (
                        <View style={[sc.paceTierChip, { borderColor: paceTier.color + '55', backgroundColor: paceTier.color + '15' }]}>
                          <View style={[sc.paceTierDot, { backgroundColor: paceTier.color }]} />
                          <Text style={[sc.paceTierChipText, { color: paceTier.color }]}>{paceTier.label}</Text>
                        </View>
                      )}
                    </View>
                    <Field
                      label="KG PER WEEK"
                      icon="speedometer-medium"
                      placeholder="e.g. 0.5"
                      value={local.weeklyDelta}
                      onChangeText={(v) => setLocal((p) => ({ ...p, weeklyDelta: v }))}
                      unit="kg/wk"
                    />
                    <Text style={sc.hint}>
                      {paceTier?.label === 'AGGRESSIVE'
                        ? 'This is an aggressive pace — 0.25–0.5 kg/week is generally safer and more sustainable.'
                        : 'Recommended: 0.25 – 0.5 kg/week for safe, sustainable progress.'}
                    </Text>
                  </View>

                  {/* Actions — inside card, matching the section style */}
                  <View style={sc.card}>
                    <View style={sc.actionRow}>
                      <Pressable
                        onPress={dismiss}
                        style={({ pressed }) => [sc.actBtn, sc.actDismiss, pressed && { opacity: 0.6 }]}
                      >
                        <Text style={sc.actDismissText}>CANCEL</Text>
                      </Pressable>
                      <Pressable
                        onPress={handleSave}
                        style={({ pressed }) => [sc.actBtn, sc.actSave, pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] }]}
                      >
                        <MaterialCommunityIcons name="content-save-check-outline" size={16} color="#030305" />
                        <Text style={sc.actSaveText}>SAVE & VIEW</Text>
                      </Pressable>
                    </View>
                    <Text style={sc.actionHint}>Saves and returns to overview</Text>
                  </View>

                </View>
              )}

            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

// ─── Stylesheet ────────────────────────────────────────────────────────────────

const sc = StyleSheet.create({
  root:  { flex: 1, backgroundColor: '#030305' },
  safe:  { flex: 1 },
  kav:   { flex: 1 },

  dragRow: { alignItems: 'center', paddingVertical: 10 },
  dragBar: { width: 36, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.16)' },

  header: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingBottom: 14,
  },
  eyebrow: { color: DIM, fontSize: 10, fontWeight: '700', letterSpacing: 2, marginBottom: 1 },
  title:   { fontFamily: 'Bebas', color: '#ffffff', fontSize: 26, letterSpacing: 2 },
  closeBtn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center', justifyContent: 'center', marginTop: 4,
  },

  // Tab bar
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 20, marginBottom: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12, borderWidth: 1, borderColor: BORDER,
    height: 40, position: 'relative',
  },
  tabIndicator: {
    position: 'absolute', top: 4, bottom: 4,
    borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.09)',
  },
  tabBtn:      { flex: 1, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  tabText:     { color: DIM, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  tabTextActive: { color: '#ffffff' },

  // Scroll + section
  scroll:   { paddingHorizontal: 16, paddingBottom: 40, paddingTop: 2 },
  section:  { gap: 10 },

  // Card
  card: {
    backgroundColor: CARD_BG, borderRadius: 18,
    borderWidth: 1, borderColor: BORDER, padding: 16,
  },
  eyebrowSm: { color: DIM, fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 12 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },

  // BMI
  bmiRow:   { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  bmiRight: { flex: 1, paddingLeft: 12, gap: 9 },
  catChip:  {
    flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start',
    borderWidth: 1, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 4,
  },
  catDot:   { width: 5, height: 5, borderRadius: 3 },
  catText:  { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  bmiHint:  { color: DIM, fontSize: 11, lineHeight: 16 },
  bmiDescBlock:   { gap: 2 },
  bmiDesc:        { color: MID, fontSize: 12, fontWeight: '700' },
  bmiRangeText:   { color: DIM, fontSize: 11 },
  targetBmiBox: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: 4, paddingTop: 9, borderTopWidth: 1, borderTopColor: BORDER,
  },
  targetBmiLabel: { color: DIM, fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  targetBmiVal:   { fontSize: 15, fontWeight: '800', marginTop: 1 },
  bmiDeltaPill: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 8,
    paddingHorizontal: 7, paddingVertical: 4,
  },
  bmiDeltaText: { fontSize: 11, fontWeight: '800' },
  zones:    { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  zonePill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 },
  zoneDot:  { width: 5, height: 5, borderRadius: 3 },
  zoneText: { color: MID, fontSize: 9, fontWeight: '700', letterSpacing: 0.4 },
  zoneRange:{ color: DIM, fontSize: 9 },

  // Progress
  badge:     { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  badgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  pctRow:    { alignItems: 'center', marginBottom: 10 },
  pctBig:    { color: '#ffffff', fontSize: 44, fontFamily: 'Bebas', letterSpacing: 1, lineHeight: 48 },
  pctSmall:  { fontSize: 20, color: DIM },
  pctSub:    { color: DIM, fontSize: 11, fontWeight: '600', marginTop: -2 },
  bar:       { height: 5, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden', marginBottom: 16 },
  barFill:   { height: '100%', backgroundColor: ACCENT, borderRadius: 3 },

  triplet:     { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: 12 },
  tripletDiv:  { width: 1, height: 32, backgroundColor: BORDER, marginHorizontal: 4 },
  tripletItem: { flex: 1, alignItems: 'center', gap: 1 },
  tripletLabel:{ color: DIM, fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  tripletVal:  { color: '#ffffff', fontSize: 17, fontWeight: '800' },
  tripletUnit: { color: DIM, fontSize: 10, fontWeight: '600' },

  statsRow:  { flexDirection: 'row', gap: 8 },
  statPill:  { flex: 1, backgroundColor: CARD_BG, borderRadius: 14, borderWidth: 1, borderColor: BORDER, paddingVertical: 12, alignItems: 'center', gap: 4 },
  statLabel: { color: DIM, fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  statVal:   { fontSize: 15, fontWeight: '800' },
  lastUpdated: { color: DIM, fontSize: 10, fontWeight: '700', letterSpacing: 1, textAlign: 'center' },

  // Forecast
  forecastHero:    { alignItems: 'center', paddingVertical: 8, gap: 6 },
  forecastIconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: PURPLE + '18', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  paceHeaderRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, width: '100%', marginBottom: -2,
  },
  paceTierChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4,
  },
  paceTierDot:      { width: 5, height: 5, borderRadius: 3 },
  paceTierChipText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.6 },
  etaDate:  { color: '#ffffff', fontFamily: 'Bebas', fontSize: 30, letterSpacing: 1 },
  etaSub:   { color: MID, fontSize: 12, fontWeight: '600' },
  etaEmpty: { color: DIM, fontSize: 13, textAlign: 'center', lineHeight: 20, marginTop: 4 },

  msRow:    { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: BORDER },
  msDot:    { width: 9, height: 9, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: BORDER },
  msDotDone:{ backgroundColor: ACCENT, borderColor: ACCENT },
  msPct:    { color: DIM, fontSize: 10, fontWeight: '700', letterSpacing: 0.8 },
  msWeight: { color: '#ffffff', fontSize: 14, fontWeight: '800', marginTop: 1 },
  msDate:   { color: MID, fontSize: 11, fontWeight: '600' },

  tipCard:   { borderColor: AMBER + '22', backgroundColor: AMBER + '08' },
  tipHeader: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 9 },
  tipTitle:  { color: AMBER, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  tipBody:   { color: MID, fontSize: 12, lineHeight: 19 },

  paceRow:  { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: BORDER },
  paceRowActive: { backgroundColor: 'rgba(255,255,255,0.035)', borderRadius: 10, marginHorizontal: -8, paddingHorizontal: 8 },
  paceDot:  { width: 7, height: 7, borderRadius: 4 },
  paceLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  paceLabel:{ color: '#ffffff', fontSize: 12, fontWeight: '700' },
  paceSub:  { color: DIM, fontSize: 10, marginTop: 1 },
  paceWks:  { fontSize: 13, fontWeight: '800' },
  yourPaceTag: { paddingHorizontal: 5, paddingVertical: 1.5, borderRadius: 4 },
  yourPaceTagText: { fontSize: 8, fontWeight: '800', letterSpacing: 0.5 },

  // Update tab
  modeRow: { flexDirection: 'row', gap: 10 },
  modeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: BORDER,
    paddingVertical: 12, paddingHorizontal: 12, borderRadius: 14, position: 'relative',
  },
  modePrimary: { color: MID, fontSize: 12, fontWeight: '800', letterSpacing: 0.4 },
  modeSub:     { color: DIM, fontSize: 10, marginTop: 1 },
  modeCheck:   {
    position: 'absolute', top: 8, right: 8,
    width: 16, height: 16, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },

  // 2×2 field grid
  fieldGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  field:     { width: '48%' },
  fieldLabel:{ color: DIM, fontSize: 9, fontWeight: '800', letterSpacing: 1.2, marginBottom: 6 },
  fieldRow:  {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)', borderRadius: 10, height: 44, paddingHorizontal: 10,
  },
  fieldInput:{ flex: 1, color: '#ffffff', fontSize: 14, fontWeight: '700', height: '100%' },
  fieldUnit: { color: DIM, fontSize: 10, fontWeight: '700' },
  hint:      { color: DIM, fontSize: 10, lineHeight: 15, marginTop: 10 },

  // Actions (inside card)
  actionRow:    { flexDirection: 'row', gap: 10 },
  actBtn:       { height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 7 },
  actDismiss:   { flex: 1, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'transparent' },
  actSave:      { flex: 1.8, backgroundColor: ACCENT },
  actDismissText: { color: DIM, fontWeight: '700', fontSize: 12, letterSpacing: 1 },
  actSaveText:    { color: '#030305', fontFamily: 'Bebas', fontSize: 15, letterSpacing: 1 },
  actionHint:   { color: DIM, fontSize: 9, textAlign: 'center', marginTop: 10, letterSpacing: 0.5 },
});

export default WeightTargetModal;