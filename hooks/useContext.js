import { ChallangeContext } from "@/context/challengeContext";
import { useContext } from "react";
import { TabContext } from "../context/tabContext";


export const useTabContext = () => {
    const context = useContext(TabContext)
    if (!context) {
        throw Error("Context must be used inside an Authorization Provider")
    }
    return context
}

export const useChallangeContext = () => {

    const context = useContext(ChallangeContext)
    if (!context) {
        throw Error("Context must be used inside an Authorization Provider")
    }
    return context

}