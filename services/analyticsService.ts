
import AsyncStorage from "@react-native-async-storage/async-storage"
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

export const getAnalyticalData = async (startDate:Date,endDate:Date)=>{

    const formatDate= (date:Date)=> date.toISOString().split('T')[0]
    
    const generateKeysForRange = (startDate:Date,endDate:Date) =>{

        const keys = []
        let current =new Date(startDate)

        while (current<=endDate){

            keys.push(`analyticalData_${formatDate(current)}`)
            current.setDate(current.getDate()+1)
        }

        return keys

    }

    const keyList = generateKeysForRange(startDate,endDate);
    const values = await AsyncStorage.multiGet(keyList)

    const structuredList = keyList.map((key,index)=>{

       const  value = values[index][1]
       const date = (key.split('_'))

       return {
        date:date[1],
        data: value?JSON.parse(value):null
       }
    })

    return structuredList

   

}