import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ProgressIndicator from './ui/progressIndicator';

const { cardBackgroundSecondary, textPimary } = Colors;

const Progress = () => {
  const targetDetails = [
    { label: 'Daily Goal', value: '20 KG' },
    { label: 'Weekly Progress', value: '65%' },
    { label: 'Monthly Target', value: '400 KG' },
    { label: 'Achievement Rate', value: '85%' },
    { label: 'Best Day', value: '30 KG' },
  ];

  const challengeDetails = [
    { label: 'Exercises Completed', value: '9/10' },
    { label: 'Streak', value: '15 days' },
    { label: 'Calories Burned', value: '2,450' },
    { label: 'Workout Time', value: '5h 30m' },
    { label: 'Difficulty Level', value: 'Advanced' },
  ];

  return (
    <View style={style.container}>
      <Text style={style.progressText}>Performance Metrics</Text>

      <View style={style.progressItemsContainer}>
        <ProgressIndicator
          title={'Target'}
          icon={'flag'}
          value={75}
          mainText={"100 KG"}
          subText={"Of 100 KG"}
          actionColor={'#667eea'}
          gradientArray={['rgba(102, 126, 234, 0.2)', 'rgba(102, 126, 234, 0.1)']}
          details={targetDetails}
        />
          
        <ProgressIndicator
          title={'Challenge'}
          icon={'barbell'}
          value={90}
          mainText={"9 Exercises"}
          subText={"Of 10 Exercises"}
          actionColor={'#894cafff'}
          gradientArray={['rgba(76, 175, 80, 0.2)', 'rgba(76, 175, 80, 0.1)']}
          details={challengeDetails}
        />
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
   
    margin: 10,
 
    borderRadius: 15,
    backgroundColor: 'rgb(0, 0, 0)',
   
  },
  progressContainer: {
   
    gap: 20,
    backgroundColor: 'rgba(81, 111, 142, 1)'
  },
  progressText: {
    textAlign: 'left',
    marginBottom: 10,
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: textPimary
  },
  progressItemsContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
  }
});

export default Progress;