import TabBar from '@/components/tabbar';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { TabContextComp } from '@/context/tabContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, Tabs, ThemeProvider } from 'expo-router';

export default function TabLayout() {

  const colorScheme = useColorScheme();

  return (

 
    <TabContextComp>
      <ThemeProvider value={DarkTheme}>
      <Tabs  tabBar={(props) => <TabBar {...props} />}>

        <Tabs.Screen
          name="index"
          
          options={{
            headerShown: false,
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
          }}
        />

        <Tabs.Screen
          name="payments"
          options={{
            title: 'Payments',
            headerShown: false,
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
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
          name="MealPlan"
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
      </ThemeProvider>
       </TabContextComp>
     
   
  );
}
