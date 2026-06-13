
import { ChallangeContextWrapper } from '@/context/challengeContext';
import UserDataContextWrapper from '@/context/userDataContext';
import { useFonts } from 'expo-font';
import { DarkTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import AuthStack from "../components/authStack";
SplashScreen.preventAutoHideAsync();
const _layout = () => {

  const [loaded, error] = useFonts({
    'Protest': require('../../assets/fonts/Protest.ttf'),
    'playwrite': require('../../assets/fonts/Playwrite.ttf'),
    'Marmeled': require('../../assets/fonts/Marmeled.ttf'),
    'Pw': require('../../assets/fonts/Pw.ttf'),
    'FiraSansRegular': require('../../assets/fonts/FiraSansRegular.ttf'),
    'Bebas': require('../../assets/fonts/Bebas.ttf')
  });

 const blurTargetRef = useRef<View | null>(null);
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return (
      <ThemeProvider value={DarkTheme}>

     
        <UserDataContextWrapper>
          <ChallangeContextWrapper>
            <AuthStack />
          </ChallangeContextWrapper>
        </UserDataContextWrapper>
   </ThemeProvider>
  );
};

export default _layout;
