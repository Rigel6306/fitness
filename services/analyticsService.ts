
import { getAsyncStorageData, updateAsyncStorageOnDebounce } from "./asynchStorageService"

export const updateAnalyticalData = async (analyticalData) => {

    try {
        const todayKey = `analyticalData_${new Date().toISOString().split('T')[0]}`

        const existingAnalyticalData = await getAsyncStorageData(todayKey)

        if (existingAnalyticalData) {
            console.log("Existing analytical Data : ", existingAnalyticalData)
            const updatedData = {

                ...analyticalData
            }

            updateAsyncStorageOnDebounce(todayKey, updatedData)
            console.log("Updated Data, :", updatedData)
        }
        else {
            updateAsyncStorageOnDebounce(todayKey, analyticalData)
            console.log("New Value for today :", analyticalData)
        }


    }
    catch (err) {

        console.log("Error updating values to the AsyncStorage")

    }



}