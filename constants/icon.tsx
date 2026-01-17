import { FontAwesome5 } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { JSX } from 'react';
export const icons = {
    index : (props:any):JSX.Element=><Ionicons name="home" size={24} color={'#737373'} {...props} />,
    plan : (props:any):JSX.Element=><Ionicons name="code-slash" size={24} color={'#737373'} {...props} />,
    explore : (props:any):JSX.Element=><FontAwesome5 name="wpexplorer" size={24} color={'#737373'} {...props} />,
    payments: (props:any):JSX.Element=><MaterialCommunityIcons name="rocket-launch" size={24} color={'#737373'} {...props} />
}

export const packageIcons = {

    workouts:(props?:any):JSX.Element=> <FontAwesome6 name="dumbbell" size={20} color="rgb(44, 92, 139)" {...props} />,
    treadmill:(props?:any) :JSX.Element=> <FontAwesome6 name="person-walking" size={24} color="rgb(27, 109, 109)" {...props} />,
    zumba:(props?:any) :JSX.Element=> <MaterialCommunityIcons name="human-female-dance" size={28} color="rgb(89, 39, 117)" {...props} />
}