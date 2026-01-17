import { createContext, useState } from "react"

export const userDataContext:React.Context<any> = createContext(null)

const UserDataContextWrapper = ({children})=>{

    const [weightData,setWeightData] = useState({
        startWeight:85,
        currentWeight:84,
        targetWeight:75,
        weightLoss:false,
        updatedOn:'2026-01-03'
    })

    const [userData, setUserData] = useState('empty uid')

   

    return(

        <userDataContext.Provider value={{weightData,setWeightData,userData,setUserData}}>
                    {
                        children
                    }
        </userDataContext.Provider>
    )

}

export default UserDataContextWrapper