import { getUser } from "@/services/userService";
import { Stack, useRootNavigationState, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useUserDataContext } from "../hooks/useContext";
import { auth } from "../services/firebase";
import InitializingLoader from "./ui/initilizingLoader";



const AuthStack = () => {
  const [initializing, setInitializing] = useState(true);
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const { userData, setUserData } = useUserDataContext();
  const [firebaseUser, setFirebaseUser] = useState(null);
  

  const targetRef = useRef<View | null>(null);
  // ✅ Single Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setFirebaseUser(user);

      if (user) {
        (async () => {
          try {
            const fetchedData = await getUser(user.uid);
         
       
            setUserData({ id: user.uid, ...fetchedData });
          } catch (error) {
            console.error("Failed to fetch user database data:", error);
            setUserData(null);
          } finally {
            setInitializing(false);
          }
        })();
      } else {
        setUserData(null);
        setInitializing(false);
      }
    });

    return unsubscribe; // cleanup on unmount
  }, []);

  useEffect(() => {
    if (initializing || !navigationState?.key) return;

    if (firebaseUser && userData) {
      router.replace("/(tabs)");
    } else if (!firebaseUser) {
      router.replace("/");
    }
  }, [initializing, navigationState?.key, firebaseUser, userData]);

  if (initializing || (firebaseUser && !userData)) {
    return (
      <InitializingLoader/>
    );
  }

  // ✅ Stack definition
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
   
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
};

export default AuthStack;

const styles = StyleSheet.create({
 background: {
    flex: 1,
    flexWrap: 'wrap',
    ...StyleSheet.absoluteFill,
  }

})