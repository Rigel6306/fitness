import { useContext } from "react";
import { TabContext } from "../context/tabContext";
export const useTabContext = ()=>{
    const context = useContext(TabContext)
    if(!context){
        throw Error("Context must be used inside an Authorization Provider")
    }

    return context
}