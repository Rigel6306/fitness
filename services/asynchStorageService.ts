import AsyncStorage from "@react-native-async-storage/async-storage"

export const getAsyncStorageData = async (key?: string) => {
    try {
        const data = await AsyncStorage.getItem(key)
        if (data) {
            return JSON.parse(data)
        }
        return null
    } catch (err) {
        console.error("Error retrieving from AsyncStorage:", err)
        return null
    }
}

export const setAsyncStorageData = async (key: string, value: any) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value))
        return true
    } catch (err) {
        console.error("Error setting AsyncStorage:", err)
        return false
    }
}

// Immediate save - use for critical data like workout completion
export const saveWorkoutDataImmediately = async (key: string, data: any) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(data))
        console.log("Data saved immediately:", key)
        return true
    } catch (err) {
        console.error("Error saving workout data immediately:", err)
        return false
    }
}

let debounceTimer: NodeJS.Timeout | null = null

export const updateAsyncStorageOnDebounce = async (key: string, data: any) => {
    if (debounceTimer) clearTimeout(debounceTimer)
    
    debounceTimer = setTimeout(async () => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(data))
            console.log("Debounced data saved:", key)
            debounceTimer = null
        } catch (err) {
            console.error("Error at debounce asyncStorage:", err)
            debounceTimer = null
        }
    }, 3000)
}

export const updateAsyncStorage = async (key: string, data: any) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(data))
        return true
    } catch (err) {
        console.error("Error at UpdateAsyncStorage:", err)
        return false
    }
}