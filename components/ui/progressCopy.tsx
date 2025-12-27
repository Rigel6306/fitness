import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import CircularProgress from "react-native-circular-progress-indicator";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface ProgressProps {
  targetValue?: number;
  challengeValue?: number;
  targetMax?: number;
  challengeMax?: number;
}

const Progress: React.FC<ProgressProps> = ({
  targetValue = 100,
  challengeValue = 60,
  targetMax = 200,
  challengeMax = 200,
}) => {
  const overallPercentage = Math.round(((targetValue + challengeValue) / (targetMax + challengeMax)) * 100);

  return (
    <LinearGradient
      colors={['rgba(102, 126, 234, 0.15)', 'rgba(118, 75, 162, 0.08)']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Overall Progress</Text>
        <Text style={styles.headerSubtitle}>Combined performance metrics</Text>
      </View>

      <View style={styles.mainProgressContainer}>
        <CircularProgress
          value={overallPercentage}
          radius={90}
          duration={1800}
          progressValueColor={'#FFF'}
          maxValue={100}
          title={'Overall'}
          titleColor={'rgba(255, 255, 255, 0.7)'}
          titleStyle={{ fontWeight: 'bold', fontSize: 16 }}
          activeStrokeColor={'#667eea'}
          activeStrokeSecondaryColor={'#764ba2'}
          inActiveStrokeColor={'rgba(255, 255, 255, 0.1)'}
          inActiveStrokeOpacity={0.5}
          inActiveStrokeWidth={12}
          activeStrokeWidth={14}
          circleBackgroundColor={'transparent'}
          valueSuffix={'%'}
          showProgressValue={true}
          progressValueStyle={{
            fontSize: 36,
            fontWeight: '800',
            color: '#FFF',
          }}
          progressFormatter={(value: number) => {
            'worklet';
            return Math.round(value);
          }}
          dashedStrokeConfig={{
            count: 50,
            width: 4,
          }}
        />
      </View>

      <View style={styles.detailsRow}>
        <LinearGradient
          colors={['rgba(102, 126, 234, 0.2)', 'rgba(102, 126, 234, 0.1)']}
          style={styles.detailCard}
        >
          <View style={styles.detailHeader}>
            <View style={[styles.detailIcon, { backgroundColor: 'rgba(102, 126, 234, 0.2)' }]}>
              <Ionicons name="flag" size={20} color="#667eea" />
            </View>
            <Text style={styles.detailTitle}>Target</Text>
          </View>
          <Text style={styles.detailMainValue}>{targetValue} KG</Text>
          <Text style={styles.detailSubValue}>of {targetMax} KG</Text>
          <View style={styles.miniProgress}>
            <View style={styles.miniProgressTrack}>
              <View 
                style={[
                  styles.miniProgressFill,
                  { 
                    width: `${(targetValue / targetMax) * 100}%`,
                    backgroundColor: '#667eea'
                  }
                ]}
              />
            </View>
            <Text style={styles.miniProgressText}>
              {Math.round((targetValue / targetMax) * 100)}%
            </Text>
          </View>
        </LinearGradient>

        <LinearGradient
          colors={['rgba(76, 175, 80, 0.2)', 'rgba(76, 175, 80, 0.1)']}
          style={styles.detailCard}
        >
          <View style={styles.detailHeader}>
            <View style={[styles.detailIcon, { backgroundColor: 'rgba(76, 175, 80, 0.2)' }]}>
              <Ionicons name="barbell" size={20} color="#4CAF50" />
            </View>
            <Text style={styles.detailTitle}>Challenge</Text>
          </View>
          <Text style={styles.detailMainValue}>{challengeValue} KG</Text>
          <Text style={styles.detailSubValue}>of {challengeMax} KG</Text>
          <View style={styles.miniProgress}>
            <View style={styles.miniProgressTrack}>
              <View 
                style={[
                  styles.miniProgressFill,
                  { 
                    width: `${(challengeValue / challengeMax) * 100}%`,
                    backgroundColor: '#4CAF50'
                  }
                ]}
              />
            </View>
            <Text style={styles.miniProgressText}>
              {Math.round((challengeValue / challengeMax) * 100)}%
            </Text>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.statsFooter}>
        <View style={styles.statItem}>
          <Ionicons name="trending-up" size={20} color="#4CAF50" />
          <Text style={styles.statLabel}>Weekly Gain</Text>
          <Text style={styles.statValue}>+2.5%</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Ionicons name="calendar" size={20} color="#667eea" />
          <Text style={styles.statLabel}>Days Left</Text>
          <Text style={styles.statValue}>28</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Ionicons name="flame" size={20} color="#FF9800" />
          <Text style={styles.statLabel}>Calories</Text>
          <Text style={styles.statValue}>1,250</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    marginBottom: 24,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  mainProgressContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  detailCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  detailMainValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 2,
  },
  detailSubValue: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 12,
  },
  miniProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniProgressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    marginRight: 10,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  miniProgressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  statsFooter: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 4,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

export default Progress;