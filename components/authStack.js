import { Stack, useRootNavigationState, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { auth } from "../services/firebase";
const AuthStack = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
const router = useRouter();
const navigationState = useRootNavigationState()
  useEffect(() => {
    const onAuthChanged = (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    };
    const subscriber = auth.onAuthStateChanged(onAuthChanged);
    return subscriber;
  }, [initializing]);

// useEffect(() => {
//     if (!initializing && navigationState?.key) {
//       user
//         ? router.replace("/(tabs)")
//         : router.replace("/");
//     }
//   }, [initializing, navigationState?.key, user]);

  return (
 
    <Stack screenOptions={{headerShown:false}}> 
        {
          //  user ? (
           
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          
          // ) : (
           
          //     <Stack.Screen name="index" options={{ headerShown: false }} />
           
          // )
       }
    </Stack>
   

  );
};

export default AuthStack;
