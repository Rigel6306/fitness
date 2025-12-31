import AsyncStorage from "@react-native-async-storage/async-storage"


export const getAsyncStorageData = async(key,setData)=>{
    console.log("Geting Data")
    const data = await AsyncStorage.getItem(key)
    const parsedData =  await JSON.parse( data)
    console.log("retrive Completed")
    console.log('Parsed',parsedData)
    if(parsedData){ 
        setData(parsedData)
        return true
    }
    else return false
}

export const setAsyncStorageData = async (key,value)=>{
    console.log("Seting Data")
    AsyncStorage.setItem(key,JSON.stringify(value))
}