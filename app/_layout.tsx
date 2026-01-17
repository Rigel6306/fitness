
import UserDataContextWrapper from '@/context/userDataContext';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";
import AuthStack from "../components/authStack";
SplashScreen.preventAutoHideAsync();
const _layout = () => {

  const [loaded, error] = useFonts({
    'Protest': require('../assets/fonts/Protest.ttf'),
    'playwrite': require('../assets/fonts/Playwrite.ttf'),
    'Marmeled': require('../assets/fonts/Marmeled.ttf'),
    'Pw': require('../assets/fonts/Pw.ttf'),
    'FiraSansRegular':require('../assets/fonts/FiraSansRegular.ttf'),
    'Bebas':require('../assets/fonts/Bebas.ttf')
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <UserDataContextWrapper>
     <AuthStack/>
    </UserDataContextWrapper>
  );
};

export default _layout;
