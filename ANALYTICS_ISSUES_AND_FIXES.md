# 🔍 Fitness App - Analytics & Workout Data Issues & Fixes

## 📋 Current State Analysis

### ✅ What's Working
- Basic async storage save/retrieve
- Debounced updates (3s delay)
- Date-based key generation
- Workout list state management

### ❌ What's Broken

---

## Issue #1: Incomplete Analytical Data Structure
**File:** `context/userDataContext.tsx`

**Current State:**
```tsx
const [analyticalData,setAnalyticalData] = useState({
    date: new Date().toISOString().split('T')[0],
    isUpdated: false,
    noOfWorkoutsCompleted: 0,      // ← Only counts completed workouts
    isTotallyCompleted: false       // ← Boolean only
});
```

**Problem:**
- Missing detailed exercise information
- No individual exercise status tracking
- Can't generate workout history reports
- No data about reps/sets completed

**Impact:** Analytics page can't show detailed workout breakdown

---

## Issue #2: No Per-Exercise Tracking
**Files:** `components/mainWorkouts/WorkoutListModal.tsx`, `services/analyticsService.ts`

**Current Code (WorkoutListModal.tsx, lines 70-90):**
```tsx
const updatedAnalyticalData = {
    ...analyticalData,
    noOfWorkoutsCompleted: completionCount,
    isTotallyCompleted: allCompleted
}

setAnalyticalData(updatedAnalyticalData)
updateAnalyticalData(updatedAnalyticalData)  // Only saves count, not details
```

**Problem:**
- Saves only the count, not the actual completed exercises
- Lost data: which exercises, reps, sets
- Can't replay workout history

**Impact:** Can't show detailed analytics per exercise

---

## Issue #3: Inconsistent Storage Keys & No Linking
**Files:** `MainWorkoutSchedule.tsx`, `WorkoutListModal.tsx`, `analyticsService.ts`

**Storage Keys Used:**
- Workout data: `workoutsList_day${day}` - stores exercise list with completion status
- Analytical data: `analyticalData_${date}` - stores only completion count

**Problem:**
- Two separate storage systems don't reference each other
- Retrieving analytics doesn't include actual workout data
- Can't reconstruct a day's workout from analytics

**Example Flow Issue:**
```
User completes workout on May 27
↓
Saves: workoutsList_day1 = {date: "2026-05-27", list: [{...exercises}]}
↓
Saves: analyticalData_2026-05-27 = {noOfWorkoutsCompleted: 5, isTotallyCompleted: true}
↓
Later: Profile page retrieves analyticalData_2026-05-27
↓
Problem: No reference to workoutsList_day1, so can't show which exercises!
```

---

## Issue #4: Data Not Persisted on Modal Close
**File:** `components/mainWorkouts/WorkoutListModal.tsx`

**Current Code:**
```tsx
const updateWorkoutsList = (id: string) => {
    // ... updates state
    setWorkoutsList(completedWorkoutsList)  // ← Updates state only
    updateAnalyticalData(updatedAnalyticalData)  // ← Queues save with 3s delay
    updateAsyncStorageOnDebounce(dayKey, completedWorkoutsList)  // ← Also delayed
}
```

**Problem:**
- Modal can close before 3s debounce completes
- App can crash/close before debounce saves
- User loses workout progress

**Impact:** Unreliable data persistence

---

## Issue #5: No Historical Day Completion Tracking
**Context:** `userDataContext.tsx`

**Missing:**
- Record of which days were completed
- Streak calculation data
- Weekly/monthly summaries

**Current issue:**
```tsx
// Each day overwrites:
analyticalData_2026-05-27 = { noOfWorkoutsCompleted: 5 }
analyticalData_2026-05-28 = { noOfWorkoutsCompleted: 3 }  // Yesterday is lost
```

---

## Issue #6: Profile Page Query Issue
**File:** `app/(tabs)/profile.tsx`, lines 31-43

```tsx
const getData = async () => {
    const data = await getAnalyticalData(
        new Date("2026-05-20"),    // ← Hardcoded!
        new Date("2026-05-27")     // ← Hardcoded!
    )
    setChartData([...data]);
}
```

**Problem:**
- Shows only one specific week
- Doesn't update dynamically
- Hardcoded dates are hardcoded to the past

---

## 🔧 SOLUTIONS

### Solution #1: Enhanced Analytical Data Structure

**Update `context/userDataContext.tsx`:**
```tsx
interface ExerciseRecord {
  id: string;
  name: string;
  reps: (string | number)[];
  isComplete: boolean;
  completedAt?: string;
}

interface DailyAnalyticalData {
  date: string;
  dayNumber: number;
  noOfWorkoutsCompleted: number;
  totalWorkouts: number;
  isTotallyCompleted: boolean;
  completedExercises: ExerciseRecord[];
  durationMinutes: number;
  caloriesBurned: number;
  startTime?: string;
  endTime?: string;
}

// In state:
const [analyticalData, setAnalyticalData] = useState<DailyAnalyticalData>({
    date: new Date().toISOString().split('T')[0],
    dayNumber: 0,
    noOfWorkoutsCompleted: 0,
    totalWorkouts: 0,
    isTotallyCompleted: false,
    completedExercises: [],
    durationMinutes: 0,
    caloriesBurned: 0,
    startTime: undefined,
    endTime: undefined
});
```

---

### Solution #2: Fix Workout Completion Tracking

**Update `components/mainWorkouts/WorkoutListModal.tsx`:**

Replace the `updateWorkoutsList` function with:
```tsx
const updateWorkoutsList = (id: string) => {
    const updatedList = workoutsList.list.map((item) => {
      if (item.id === id) {
        return { ...item, isComplete: !item.isComplete }
      }
      return item
    })

    let completionCount = 0;
    const completedExercises: ExerciseRecord[] = [];
    
    updatedList.forEach((item) => {
      if (item.isComplete) {
        completionCount++;
        completedExercises.push({
          id: item.id,
          name: item.name,
          reps: item.reps,
          isComplete: true,
          completedAt: new Date().toISOString()
        });
      }
    })
    
    const allCompleted = updatedList.every(ex => ex.isComplete)

    const updatedAnalyticalData = {
      ...analyticalData,
      date: today,
      dayNumber: selectedDaySchedule?.day || 1,
      noOfWorkoutsCompleted: completionCount,
      totalWorkouts: updatedList.length,
      isTotallyCompleted: allCompleted,
      completedExercises: completedExercises,
      endTime: new Date().toISOString()
    }

    setAnalyticalData(updatedAnalyticalData)
    updateAnalyticalData(updatedAnalyticalData)

    const dayKey = `workoutsList_day${selectedDaySchedule?.day || 1}`
    const completedWorkoutsList = { 
      date: today, 
      list: updatedList,
      analyticalData: updatedAnalyticalData  // ← Link analytical data
    }

    updateAsyncStorageOnDebounce(dayKey, completedWorkoutsList)
    setWorkoutsList(completedWorkoutsList)
}
```

---

### Solution #3: Unified Storage Approach

**Update `services/asynchStorageService.ts`:**

```tsx
// Add this function for immediate saves when needed
export const saveWorkoutDataImmediately = async (key: string, data: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data))
      return true
    } catch (err) {
      console.error("Error saving workout data:", err)
      return false
    }
}

// Update debounce to be more reliable
let debounceTimer: NodeJS.Timeout | null = null

export const updateAsyncStorageOnDebounce = async (key: string, data: any) => {
    if (debounceTimer) clearTimeout(debounceTimer)
    
    debounceTimer = setTimeout(async () => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(data))
            debounceTimer = null
        } catch (err) {
            console.error("Error at debounce asyncStorage:", err)
        }
    }, 3000)
}
```

**Update `services/analyticsService.ts`:**

```tsx
export const updateAnalyticalData = async (analyticalData: any) => {
    try {
        const todayKey = `analyticalData_${analyticalData.date}`
        const dayKey = `completedDay_${analyticalData.date}`

        // Save analytical data
        await AsyncStorage.setItem(todayKey, JSON.stringify(analyticalData))
        
        // Mark day as completed
        if (analyticalData.isTotallyCompleted) {
            await AsyncStorage.setItem(dayKey, JSON.stringify({
                date: analyticalData.date,
                dayNumber: analyticalData.dayNumber,
                completed: true,
                timestamp: new Date().toISOString()
            }))
        }
        
        console.log("Analytical data saved:", analyticalData)
    } catch (err) {
        console.error("Error updating analytical data:", err)
    }
}

// Add function to get completed days (for streaks)
export const getCompletedDays = async (startDate: Date, endDate: Date) => {
    const formatDate = (date: Date) => date.toISOString().split('T')[0]
    const keys: string[] = []
    let current = new Date(startDate)

    while (current <= endDate) {
        keys.push(`completedDay_${formatDate(current)}`)
        current.setDate(current.getDate() + 1)
    }

    const values = await AsyncStorage.multiGet(keys)
    const completedDays = values
        .filter(([_, value]) => value !== null)
        .map(([key, value]) => JSON.parse(value || '{}'))

    return completedDays
}
```

---

### Solution #4: Ensure Data Persists on Modal Close

**Update `components/mainWorkouts/WorkoutListModal.tsx`:**

```tsx
// Add useEffect to save on modal close
useEffect(() => {
    return () => {
        // Save immediately when modal closes
        if (workoutsList) {
            updateAsyncStorageOnDebounce(
                `workoutsList_day${selectedDaySchedule?.day || 1}`,
                workoutsList
            )
            if (analyticalData.isTotallyCompleted) {
                updateAnalyticalData(analyticalData)
            }
        }
    }
}, [])

// Also add this to close handler
const handleCloseModal = () => {
    // Save immediately before closing
    if (analyticalData.noOfWorkoutsCompleted > 0) {
        updateAnalyticalData(analyticalData)
    }
    setModalVisible(false)
}

// Update Modal component
<Modal
    transparent={true}
    visible={modalVisible}
    animationType='slide'
    onRequestClose={handleCloseModal}  // ← Use custom handler
    statusBarTranslucent={true}
>
```

---

### Solution #5: Fix Profile Page Dynamic Query

**Update `app/(tabs)/profile.tsx`:**

```tsx
useEffect(() => {
    const getData = async () => {
        const today = new Date()
        const lastWeek = new Date(today)
        lastWeek.setDate(today.getDate() - 7)

        const data = await getAnalyticalData(lastWeek, today)
        console.log('Analytical Data at profile:', data)
        setChartData([...data])
    }

    getData()
}, [])
```

---

## 📊 Complete Data Flow Diagram

```
User Marks Exercise Complete
        ↓
ExercisesCard.updateWorkoutsList()
        ↓
UpdateWorkoutsList() updates:
  - workoutsList state
  - analyticalData state (with exercise details)
        ↓
Save to AsyncStorage:
  - workoutsList_day${dayNumber}
  - analyticalData_${date}
  - completedDay_${date} (if fully completed)
        ↓
Modal closes (on user request)
        ↓
Save immediately (not debounced)
        ↓
Profile Page retrieves:
  - analyticalData_${date} (has exercise details)
  - completedDay_${date} (for streaks)
        ↓
Analytics displayed with full workout history
```

---

## ✅ Implementation Checklist

- [ ] Update `userDataContext.tsx` with enhanced interface
- [ ] Update `WorkoutListModal.tsx` with new tracking
- [ ] Update `analyticsService.ts` with immediate saves
- [ ] Update `asynchStorageService.ts` with reliable debounce
- [ ] Update `profile.tsx` with dynamic date range
- [ ] Test workout completion flow
- [ ] Test data persistence on modal close
- [ ] Test analytics retrieval
- [ ] Verify completed days tracking for streaks
