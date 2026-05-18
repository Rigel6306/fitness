import { getSchedule } from "@/services/workoutService"
import React, { createContext, useEffect, useState } from "react"

export const userDataContext:React.Context<any> = createContext(null)
const UserDataContextWrapper = ({children}: {children: React.ReactNode})=>{

    const [weightData,setWeightData] = useState({
        startWeight:85,
        currentWeight:84,
        targetWeight:75,
        weightLoss:false,
        updatedOn:'2026-01-03'
    })

    const [userData, setUserData] = useState('empty uid')

    useEffect(()=>{
            getSchedule()
    },[])

    const [analyticalData,setAnalyticalData] = useState({
        date:new Date().toISOString().split('T')[0],
        isUpdated:false,
        noOfWorkoutsCompleted:0,
        isTotallyCompleted:false
    });

    return(

        <userDataContext.Provider value={{weightData,setWeightData,userData,setUserData,analyticalData,setAnalyticalData}}>
                    {
                        children
                    }
        </userDataContext.Provider>
    )

}

export default UserDataContextWrapper