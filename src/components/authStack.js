import { getUser } from "@/services/userService";
import { Stack, useRootNavigationState, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useUserDataContext } from "../hooks/useContext";
import { auth } from "../services/firebase";
import InitializingLoader from "./ui/initilizingLoader";



const AuthStack = () => {
  const [initializing, setInitializing] = useState(true);
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const { userData, setUserData } = useUserDataContext();
  const [firebaseUser, setFirebaseUser] = useState(null);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setFirebaseUser(user);

      if (user) {
        (async () => {
          try {
            console.log("User ID", user.uid)
            const fetchedData = await getUser(user.uid);
            console.log("fetched Data",fetchedData )
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
      <InitializingLoader />
    );
  }


  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'rgb(0,0,0)' } }}>
      <Stack.Screen name="index" options={{
        contentStyle: { backgroundColor: 'rgb(0,0,0)' },
        animation: 'none',
        headerShown: false
      }}
      
      />

      <Stack.Screen name="meal/index." options={{
         contentStyle: { backgroundColor: 'rgb(0,0,0)' },
        animation: 'none',
        headerShown: false,
        detachPreviousScreen: false,
      }} />

      <Stack.Screen name="(tabs)" options={{
         contentStyle: { backgroundColor: 'rgb(0,0,0)' },
        animation: 'none',
        headerShown: false
      }} />
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