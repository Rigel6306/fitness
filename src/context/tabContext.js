import { createContext, useState } from "react";
export const TabContext  = createContext()

export const TabContextComp = ({children}) => {

    const [isTabOpen, setIsTabOpen] = useState(true);
    
   return (
        <TabContext.Provider value={{isTabOpen,setIsTabOpen}} >
            {children}
        </TabContext.Provider>
   )
 }
 

