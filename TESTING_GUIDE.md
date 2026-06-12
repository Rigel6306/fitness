# ✅ Analytics Testing Guide

## Test Scenario 1: Single Day Workout Completion

**Steps:**
1. Open the app and navigate to MainWorkoutSchedule
2. Click on "Start Now" or select a day to open WorkoutListModal
3. Mark 3-4 exercises as complete
4. Close the modal and wait ~3 seconds
5. Check AsyncStorage (use React Native debugger)

**Expected Result:**
```
workoutsList_day1 = {
  date: "2026-05-27",
  list: [...exercises with isComplete status],
  analyticalData: {
    date: "2026-05-27",
    dayNumber: 1,
    noOfWorkoutsCompleted: 3,
    totalWorkouts: 5,
    isTotallyCompleted: false,
    completedExercises: [...3 items with name, reps, completedAt],
    endTime: "2026-05-27T14:30:45.123Z"
  }
}

analyticalData_2026-05-27 = {
  date: "2026-05-27",
  dayNumber: 1,
  noOfWorkoutsCompleted: 3,
  totalWorkouts: 5,
  isTotallyCompleted: false,
  completedExercises: [...],
  endTime: "2026-05-27T14:30:45.123Z"
}
```

---

## Test Scenario 2: Complete All Exercises

**Steps:**
1. Open WorkoutListModal
2. Mark ALL exercises as complete
3. Close modal
4. Check AsyncStorage

**Expected Result:**
```
✅ analyticalData_2026-05-27.isTotallyCompleted = true
✅ completedDay_2026-05-27 = {
  date: "2026-05-27",
  dayNumber: 1,
  completed: true,
  timestamp: "2026-05-27T14:35:00Z"
}
```

---

## Test Scenario 3: App Crash Safety

**Steps:**
1. Mark exercises as complete
2. FORCE CLOSE the app (don't just minimize)
3. Reopen app
4. Navigate back to MainWorkoutSchedule

**Expected Result:**
- ✅ Marked exercises should still be completed (data persisted)
- Proof: The modal still shows your completed exercises

---

## Test Scenario 4: Profile Analytics Display

**Steps:**
1. Complete workouts on multiple days (do this test over 3-4 days)
2. Navigate to Profile tab
3. Scroll down to see "Your Stats" section

**Expected Result:**
- ✅ Chart shows last 7 days of data (not hardcoded dates)
- ✅ Shows completed days dynamically
- ✅ Updates every time you revisit

---

## Test Scenario 5: Streak Calculation

**Steps:**
1. Complete Day 1 workouts (mark all as complete)
2. Complete Day 2 workouts (mark all as complete)
3. Skip Day 3
4. Call `calculateStreak()` in console

**Expected Result:**
- ✅ Streak count = 2 (breaks on Day 3)

---

## Data Structure Verification

### Check Storage Keys:
```javascript
// In React Native Debugger console:
AsyncStorage.getAllKeys().then(keys => console.log(keys))

// Look for:
// ✅ analyticalData_2026-05-27
// ✅ workoutsList_day1
// ✅ completedDay_2026-05-27
// ✅ schedule
```

### Check Exercise Details:
```javascript
AsyncStorage.getItem('analyticalData_2026-05-27').then(data => {
  console.log(JSON.parse(data))
})

// Should show:
{
  "completedExercises": [
    {
      "id": "1",
      "name": "Bench Press",
      "reps": [10, 10, 10],
      "isComplete": true,
      "completedAt": "2026-05-27T14:30:45.123Z"
    }
  ]
}
```

---

## 🐛 Common Issues & Fixes

### Issue: Data not persisting after modal close
**Fix:** Check that `saveWorkoutDataImmediately()` is being called
**Debug:** Check console logs for "Modal closed - data saved immediately"

### Issue: Hardcoded dates still showing in Profile
**Fix:** Check that profile.tsx imports are correct and getData uses dynamic dates
**Debug:** Add console.log to see actual dates being queried

### Issue: Streak always returns 0
**Fix:** Ensure completedDay_${date} keys exist for completed days
**Debug:** Check AsyncStorage for completedDay_ keys

### Issue: Exercise details missing in analytics
**Fix:** Verify WorkoutListModal passes analyticalData to AsyncStorage
**Debug:** Log updatedAnalyticalData object before saving

---

## 🔍 Console Logs to Monitor

Add these to your console during testing:

```
✅ Analytical data saved: {...}
✅ Day marked as completed: completedDay_2026-05-27
✅ Data saved immediately: workoutsList_day1
✅ Modal closed - data saved immediately
✅ Completed days retrieved: [...]
✅ Current streak: 2
```

---

## 📊 What Each Function Does

| Function | Purpose | When Called |
|----------|---------|-------------|
| `updateAnalyticalData()` | Saves daily analytics + marks completed day | After workout completion, on modal close |
| `getAnalyticalData()` | Retrieves analytics for date range | Profile page load |
| `getCompletedDays()` | Gets list of completed days | Streak calculation |
| `calculateStreak()` | Counts consecutive completed days | Could be used in profile header |
| `saveWorkoutDataImmediately()` | Saves critical data without delay | On modal close |
| `updateAsyncStorageOnDebounce()` | Delayed save to prevent hammering storage | During workout completion updates |

---

## 🎯 Next Steps

1. ✅ Run through all test scenarios
2. ✅ Verify console logs appear
3. ✅ Check AsyncStorage with debugger
4. ✅ Test on real device (Android/iOS)
5. ✅ Consider adding streak display to profile
6. ✅ Add completion percentage to header

---

## 📝 File Changes Summary

| File | Change | Impact |
|------|--------|--------|
| `userDataContext.tsx` | Enhanced interface with exercise tracking | Better type safety, structured data |
| `analyticsService.ts` | Immediate saves + completed day tracking | More reliable persistence |
| `asynchStorageService.ts` | Added immediate save function | Critical data saves before crashes |
| `WorkoutListModal.tsx` | Saves with exercise details on close | Complete workout history preserved |
| `profile.tsx` | Dynamic date range instead of hardcoded | Shows actual weekly data |
| `ExercisesCard.tsx` | Updated type annotations | Consistency across components |

---

## 🎊 Success Indicators

- ✅ Workout data persists after app close/crash
- ✅ Each exercise marked as complete is tracked
- ✅ Profile shows actual last 7 days (not hardcoded)
- ✅ Completed days trigger analytics storage
- ✅ Streak calculation works accurately
- ✅ No data loss when modal closes
- ✅ Console logs confirm saves are happening
