import { FontAwesome5 } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
export const icons = {
    index : (props)=><Ionicons name="home" size={24} color={'#737373'} {...props} />,
    plan : (props)=><Ionicons name="code-slash" size={24} color={'#737373'} {...props} />,
    explore : (props)=><FontAwesome5 name="wpexplorer" size={24} color={'#737373'} {...props} />,
    payments: (props)=><MaterialCommunityIcons name="rocket-launch" size={24} color={'#737373'} {...props} />
}

