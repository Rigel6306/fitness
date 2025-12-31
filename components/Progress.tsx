import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ProgressIndicator from './ui/progressIndicator';
const {cardBackgroundSecondary,textPimary} = Colors
const Progress = () => {
  return (
    <View style={style.container}>




      {/* <View style={style.progressContainer}>
              <Text style={style.progressText}>Target Progress</Text>
                  <CircularProgress
                    value={100}
                    duration={2000}
                    progressValueColor={'#ecf0f1'}
                    maxValue={200}
                    title={'KG'}
                    titleColor={'rgba(233, 125, 53, 1)'}
                    titleStyle={{fontWeight: 'bold'}}
                  />

            </View>

            <View style={style.progressContainer}>
              <Text style={style.progressText}>Challenge Progress</Text>
                  <CircularProgress
                    value={60}
                    duration={2000}
                    progressValueColor={'#ecf0f1'}
                    maxValue={200}
                    title={'KG'}
                    titleColor={'rgba(233, 125, 53, 1)'}
                    titleStyle={{fontWeight: 'bold'}}
                  />
            </View> */}

      <Text style={style.progressText}>Performence Metrics</Text>

      <View style={style.progressItemsContainer}>
        <ProgressIndicator
          title={'Target'}
          icon={'flag'}
          value={75}
          mainText={"100 KG"}
          subText={"Of 100 KG"}
          actionColor={'#667eea'}
          gradientArray={['rgba(102, 126, 234, 0.2)', 'rgba(102, 126, 234, 0.1)']}
          />
          
        <ProgressIndicator
          title={'Challenge'}
          icon={'barbell'}
          value={90}
          mainText={"9 Exercices"}
          subText={"Of 10 Exercices"}
          actionColor={'#894cafff'}
          gradientArray={['rgba(76, 175, 80, 0.2)', 'rgba(76, 175, 80, 0.1)']}
          />
      </View>

    </View>


  )
}
const style = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    marginBottom: 120,
    borderRadius: 15,
    backgroundColor:'rgba(11, 14, 17, 1)',
    padding: 10,
  },
  progressContainer: {
    flex: 1,
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


})
export default Progress