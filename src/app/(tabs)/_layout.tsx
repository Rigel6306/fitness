import TabBar from '@/components/tabbar';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { TabContextComp } from '@/context/tabContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, Tabs, ThemeProvider } from 'expo-router';

export default function TabLayout() {

  const colorScheme = useColorScheme();

  return (

  <ThemeProvider value={DarkTheme}>
   
    <TabContextComp>
     
      <Tabs screenOptions={{headerShown:false,freezeOnBlur:true,sceneStyle:{backgroundColor:'black',}}}   tabBar={(props) => <TabBar {...props}  />}>

        <Tabs.Screen
          name="index"
          
          options={{
            freezeOnBlur: true,
            
            headerShown: false,
            title: 'Home',
            
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
          }}
        />

        <Tabs.Screen
          name="payments"
          options={{
            freezeOnBlur: true,

            title: 'Payments',
            headerShown: false,
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            freezeOnBlur: true,

              headerShown: false,
            title: 'Profile',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
          }}
        />

        <Tabs.Screen
          name="ChallengeDetails"
          options={{
            href: null,
            headerShown: false,
          }}

        />

      
          <Tabs.Screen
          name="MainWorkoutSchedule"
          options={{
            href: null,
            headerShown: false,
          }}
        />


      </Tabs>

       </TabContextComp>
        </ThemeProvider>


   
  );
}
