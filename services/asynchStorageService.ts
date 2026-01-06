import AsyncStorage from "@react-native-async-storage/async-storage"



export const getAsyncStorageData = async (key?: string) => {
    const data = await AsyncStorage.getItem(key)
    const parsedData = await JSON.parse(data)
    if (parsedData) {

        return parsedData
    }
    else return false
}

export const setAsyncStorageData = async (key: string, value) => {
    AsyncStorage.setItem(key, JSON.stringify(value))
}
 let debounceTimer
export const updateAsyncStorageOnDebounce = async (key:string, data) => {
    console.log("Debouncer Fired")
   
    console.log(debounceTimer)
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(async () => {
console.log('Timer Fired')
        try {
            await AsyncStorage.setItem(key, JSON.stringify(data))
        } catch (err) {
            console.log("error at debounce AsyncStorage", err)
        }
    }, 3000)
}

export const updateAsyncStorage = async (key:string, data) => {
    try {
        AsyncStorage.setItem(key, JSON.stringify(data))
    } catch (err) {
        console.log("Error at UpdateAsyncStorage-", err)
    }
}