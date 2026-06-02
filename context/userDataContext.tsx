import { syncDailyAnalyticalData } from "@/services/analyticsService";
import React, { createContext, useEffect, useState } from "react";
export interface ExerciseRecord {
  id: string | number;
  name: string;
  reps: (string | number)[];
  isComplete: boolean;
  completedAt?: string;
}

export interface DailyAnalyticalData {
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

export const userDataContext:React.Context<any> = createContext(null)

const UserDataContextWrapper = ({children}: {children: React.ReactNode})=>{

    const [weightData,setWeightData] = useState({
        startWeight:85,
        currentWeight:84,
        targetWeight:75,
        weightLoss:false,
        updatedOn:'2026-01-03'
    })

    const [userData, setUserData] = useState()
  
    useEffect(()=>{
        if(userData?.id){
      syncDailyAnalyticalData(userData.id)
        }
  
    },[userData])
    
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


    return(

        <userDataContext.Provider value={{weightData,setWeightData,userData,setUserData,analyticalData,setAnalyticalData}}>
                    {
                        children
                    }
        </userDataContext.Provider>
    )

}

export default UserDataContextWrapper