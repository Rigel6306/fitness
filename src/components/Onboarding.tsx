import { Colors } from '@/constants/Colors';
import { Feather, FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('screen');

const { background, textPimary, textSecondary, primaryBackground, cardBackground } = Colors;

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: {
    name: string;
    type: 'MaterialCommunityIcons' | 'MaterialIcons' | 'FontAwesome5' | 'Feather';
  };
  backgroundColor: string;
}

const onboardingData: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Welcome to FitLife',
    subtitle: 'Your Personal Fitness Coach',
    description: 'Transform your body and mind with personalized workout plans, meal guidance, and real-time progress tracking.',
    icon: { name: 'dumbbell', type: 'MaterialCommunityIcons' },
    backgroundColor: 'rgba(58, 64, 62, 0.3)',
  },
  {
    id: '2',
    title: 'Smart Workouts',
    subtitle: 'Tailored to Your Level',
    description: 'Whether you\'re a beginner or advanced, get workouts designed specifically for your fitness level and goals.',
    icon: { name: 'directions-run', type: 'MaterialIcons' },
    backgroundColor: 'rgba(37, 25, 57, 0.3)',
  },
  {
    id: '3',
    title: 'Nutrition Made Easy',
    subtitle: 'Customized Meal Plans',
    description: 'Stay on track with personalized nutrition plans that fit your lifestyle and fitness goals.',
    icon: { name: 'restaurant', type: 'MaterialIcons' },
    backgroundColor: 'rgba(58, 64, 62, 0.3)',
  },
  {
    id: '4',
    title: 'Track Your Progress',
    subtitle: 'Visualize Your Growth',
    description: 'Monitor your achievements with detailed analytics, charts, and milestone celebrations.',
    icon: { name: 'trending-up', type: 'Feather' },
    backgroundColor: 'rgba(37, 25, 57, 0.3)',
  },
  {
    id: '5',
    title: 'Join Challenges',
    subtitle: 'Compete & Win Rewards',
    description: 'Participate in exciting fitness challenges and compete with other members for amazing rewards.',
    icon: { name: 'trophy', type: 'MaterialCommunityIcons' },
    backgroundColor: 'rgba(58, 64, 62, 0.3)',
  },
];

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleScrollEnd = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentIndex(currentIndex);
  };

  const goToNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      onComplete();
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    }
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => {
    let IconComponent: any = MaterialCommunityIcons;
    
    switch (item.icon.type) {
      case 'MaterialIcons':
        IconComponent = MaterialIcons;
        break;
      case 'FontAwesome5':
        IconComponent = FontAwesome5;
        break;
      case 'Feather':
        IconComponent = Feather;
        break;
      default:
        IconComponent = MaterialCommunityIcons;
    }

    return (
      <View style={[styles.slide, { width }]}>
        <LinearGradient
          colors={[background, primaryBackground]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.slideContainer}
        >
          <View style={styles.iconContainer}>
            <View style={[styles.iconWrapper, { backgroundColor: item.backgroundColor }]}>
              <IconComponent name={item.icon.name} size={80} color={textPimary} />
            </View>
          </View>

          <View style={styles.contentContainer}>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        </LinearGradient>
      </View>
    );
  };

  const animatedDotStyle = (index: number) => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    const dotWidth = scrollX.interpolate({
      inputRange,
      outputRange: [8, 32, 8],
      extrapolate: 'clamp',
    });
    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.5, 1, 0.5],
      extrapolate: 'clamp',
    });

    return { width: dotWidth, opacity };
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        scrollEnabled
        scrollEventThrottle={16}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScrollEnd}
        showsHorizontalScrollIndicator={false}
        scrollToOverflowEnabled={false}
      />

      {/* Indicator Dots */}
      <View style={styles.indicatorContainer}>
        {onboardingData.map((_, index) => (
          <Animated.View
            key={index}
            style={[styles.dot, animatedDotStyle(index)]}
          />
        ))}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
          onPress={goToPrevious}
          disabled={currentIndex === 0}
        >
          <MaterialIcons
            name="arrow-back-ios"
            size={24}
            color={currentIndex === 0 ? textSecondary : textPimary}
          />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.primaryButtonPressed,
          ]}
          onPress={goToNext}
        >
          <Text style={styles.primaryButtonText}>
            {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <MaterialIcons
            name={
              currentIndex === onboardingData.length - 1
                ? 'arrow-forward-ios'
                : 'arrow-forward-ios'
            }
            size={20}
            color="#fff"
            style={styles.buttonIcon}
          />
        </Pressable>

        <Pressable
          style={[styles.navButton, styles.skipButton]}
          onPress={onComplete}
        >
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      {/* Progress indicator text */}
      <View style={styles.progressTextContainer}>
        <Text style={styles.progressText}>
          {currentIndex + 1} of {onboardingData.length}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background,
  },
  slide: {
    height: height * 0.75,
    justifyContent: 'flex-start',
  },
  slideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  iconContainer: {
    marginBottom: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: cardBackground,
  },
  contentContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  subtitle: {
    fontSize: 14,
    color: textSecondary,
    fontFamily: 'FiraSansRegular',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Bebas',
    color: textPimary,
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 1,
  },
  description: {
    fontSize: 16,
    color: textSecondary,
    fontFamily: 'FiraSansRegular',
    textAlign: 'center',
    lineHeight: 24,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  primaryButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  primaryButtonPressed: {
    opacity: 0.8,
    backgroundColor: textSecondary,
  },
  primaryButtonText: {
    color: background,
    fontSize: 16,
    fontFamily: 'Bebas',
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  skipButton: {
    borderColor: textSecondary,
  },
  skipText: {
    color: textSecondary,
    fontSize: 14,
    fontFamily: 'FiraSansRegular',
  },
  progressTextContainer: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  progressText: {
    color: textSecondary,
    fontSize: 12,
    fontFamily: 'FiraSansRegular',
  },
});

export default Onboarding;
