import { ChallangeContext } from '@/context/challengeContext';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Pressable } from 'react-native';

const CustomLink = ({ href, data, children }) => {
  const router = useRouter();
  const context = useContext(ChallangeContext);

  const handlePress = () => {
    if (data && context?.setCurrentChallange) {
      context.setCurrentChallange(data);
    }
    router.push(href);
  };

  return (
    <Pressable onPress={handlePress}>
      {children}
    </Pressable>
  );
};

export default CustomLink;