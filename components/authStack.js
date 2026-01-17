import { getUser } from "@/services/userService";
import { Stack, useRootNavigationState, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useUserDataContext } from '../hooks/useContext';
import { auth } from "../services/firebase";
const AuthStack = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const router = useRouter();
  const navigationState = useRootNavigationState()
  const { userData, setUserData } = useUserDataContext()
  useEffect(() => {
    const onAuthChanged = async (user) => {
      setUser(user);
      if (user) {
        const userData = await getUser(user.uid)
        setUserData(userData)
      } else setUserData(null)
      if (initializing) setInitializing(false);
    };
    const subscriber = auth.onAuthStateChanged(onAuthChanged);
    return subscriber;
  }, [initializing]);

  useEffect(() => {
    if (!initializing && navigationState?.key) {
      user
        ? router.replace("/(tabs)")
        : router.replace("/");
    }
  }, [initializing, navigationState?.key, user]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {
        user ? (
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        ) : (

          <Stack.Screen name="index" options={{ headerShown: false }} />

        )
      }
    </Stack>


  );
};

export default AuthStack;
