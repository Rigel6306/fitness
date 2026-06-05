
import { createContext, useState } from "react";

export const ChallangeContext:React.Context<any> = createContext(null)


export const ChallangeContextWrapper = ({children})=>{


    const [currentChallange,setCurrentChallange] = useState()


    return(
        
        <ChallangeContext.Provider value={{currentChallange, setCurrentChallange}}>
            {children}
        </ChallangeContext.Provider>

    )
}