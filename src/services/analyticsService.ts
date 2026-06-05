
import AsyncStorage from "@react-native-async-storage/async-storage"
import { updateAnalyticalDataToDb } from "./userService"
export const updateAnalyticalData = async (analyticalData: any) => {
    try {
        const todayKey = `analyticalData_${analyticalData.date}`
        const dayKey = `completedDay_${analyticalData.date}`

        // Save analytical data immediately
        await AsyncStorage.setItem(todayKey, JSON.stringify(analyticalData))

        console.log("Analytical data saved:", analyticalData)

        // Mark day as completed if all workouts done
        if (analyticalData.isTotallyCompleted) {
            await AsyncStorage.setItem(dayKey, JSON.stringify({
                date: analyticalData.date,
                dayNumber: analyticalData.dayNumber,
                completed: true,
                timestamp: new Date().toISOString()
            }))
            console.log("Day marked as completed:", dayKey)
        }
    }
    catch (err) {
        console.error("Error updating analytical data:", err)
    }
}

export const getAnalyticalData = async (startDate: Date, endDate: Date) => {
    const formatDate = (date: Date) => date.toISOString().split('T')[0]

    const generateKeysForRange = (startDate: Date, endDate: Date) => {
        const keys = []
        let current = new Date(startDate)

        while (current <= endDate) {
            keys.push(`analyticalData_${formatDate(current)}`)
            current.setDate(current.getDate() + 1)
        }

        return keys
    }

    const keyList = generateKeysForRange(startDate, endDate);
    const values = await AsyncStorage.multiGet(keyList)

    const structuredList = keyList.map((key, index) => {
        const value = values[index][1]
        const date = (key.split('_'))[1]

        return {
            date: date,
            data: value ? JSON.parse(value) : null
        }
    })
    console.log("Structured list at Analytical services", structuredList)
    return structuredList
}

// Get completed days for streak calculation
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

    console.log("Completed days retrieved:", completedDays)
    return completedDays
}

// Get streak count
export const calculateStreak = async () => {
    try {
        const today = new Date()
        const keys: string[] = []
        let current = new Date(today)
        current.setDate(current.getDate() - 30) // Check last 30 days

        const endDate = new Date(today)

        let streak = 0
        let checkDate = new Date(today)

        // Count backwards from today
        for (let i = 0; i < 30; i++) {
            const dateStr = checkDate.toISOString().split('T')[0]
            const dayKey = `completedDay_${dateStr}`
            const result = await AsyncStorage.getItem(dayKey)

            if (result) {
                streak++
                checkDate.setDate(checkDate.getDate() - 1)
            } else {
                break // Streak broken
            }
        }

        console.log("Current streak:", streak)
        return streak
    } catch (err) {
        console.error("Error calculating streak:", err)
        return 0
    }
}


export const syncDailyAnalyticalData = async (userId: string) => {

    try {

        const today = new Date()
        today.setDate(today.getDate() - 1)
        const dateStr = today.toISOString().split("T")[0]

        const todayKey = `analyticalData_${dateStr}`
        const syncedKey = `syncedDay_${dateStr}`

        const alreadySynced = await AsyncStorage.getItem(syncedKey)
        if (alreadySynced) {
            console.log(`day ${dateStr} is Already Synced to database`)
            return
        }
        const localData = await AsyncStorage.getItem(todayKey)
        if (!localData) {
            console.log("Local Data Not Found")
            return
        }
        console.log("Local Data", localData)
        const parsed = JSON.parse(localData)
        await updateAnalyticalDataToDb(userId, dateStr, parsed)
        await AsyncStorage.setItem(syncedKey, "true")
    }
    catch (err) {
        console.log("Error Syncing Analytical Data", err)
    }

}