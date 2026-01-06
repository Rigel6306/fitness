import TabBar from '@/components/tabbar';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { TabContextComp } from '@/context/tabContext';
import UserDataContextWrapper from '@/context/userDataContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {

  const colorScheme = useColorScheme();

  return (

      <UserDataContextWrapper>
            <TabContextComp>
      <Tabs tabBar={(props) => <TabBar {...props} />}>

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
          name="explore"
          options={{

            title: 'Explore',
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
       </TabContextComp>
      </UserDataContextWrapper>
   
  );
}
