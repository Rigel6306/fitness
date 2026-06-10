import { Dimensions, StyleSheet, View } from 'react-native';
import { ContributionGraph, LineChart } from "react-native-chart-kit";
import { Colors } from "../constants/Colors";

const { textPimary, textSecondary } = Colors;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 💡 CALCULATE PERFECT BOUNDS: Total screen width minus component structural margins
const CHART_PADDING = 24;
const COMPUTED_CHART_WIDTH = SCREEN_WIDTH - CHART_PADDING;

const chartConfig = {
  backgroundColor: '#0f0f16',
  backgroundGradientFrom: '#0f0f16',
  backgroundGradientFromOpacity: 0.85,
  backgroundGradientTo: '#07070a',
  backgroundGradientToOpacity: 1,
  
  // Premium Neon Teal Accent Color System
  color: (opacity = 1) => `rgba(10, 255, 202, ${opacity})`, 
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.4})`,
  strokeWidth: 2,
  barPercentage: 0.7,
  decimalPlaces: 0,
  useShadowColorFromDataset: false,
  
  propsForDots: {
    r: "4",
    strokeWidth: "1.5",
    stroke: "#0affca"
  },
  propsForBackgroundLines: {
    stroke: "rgba(255, 255, 255, 0.03)",
    strokeDasharray: "0", // Solid lines look much cleaner in modern UI
  }
};

export const LineChartComp = ({ chartData }) => {
  if (!chartData || chartData.length === 0) return null;

  const dataSet = chartData.map(item => (item.data ? item.data.noOfWorkoutsCompleted : 0));
  const labels = chartData.map((item) => item.date.split('-')[2]);

  return (
    <View style={styles.chartContainer}>
      <LineChart
        chartConfig={chartConfig}
        withOuterLines={false}
        withInnerLines={true}
        withShadow={true}
        data={{
          labels: labels,
          datasets: [{ data: dataSet }]
        }}
        width={COMPUTED_CHART_WIDTH}
        height={180}
        bezier
        style={styles.chartStyle}
        segments={3} // Keeps the Y-axis clean with fewer lines
      />
    </View>
  );
};

export const ContributionGraphComp = () => {
  const commitsData = [
    { date: "2017-01-01", count: 1 },
    { date: "2017-01-02", count: 2 },
    { date: "2017-01-03", count: 3 },
    { date: "2017-01-04", count: 4 },
    { date: "2017-01-05", count: 5 },
    { date: "2017-01-06", count: 2 },
    { date: "2017-01-07", count: 3 },
    { date: "2017-02-01", count: 1 },
    { date: "2017-02-02", count: 2 },
    { date: "2017-02-03", count: 3 },
    { date: "2017-02-04", count: 4 },
    { date: "2017-02-05", count: 5 },
  ];

  return (
    <View style={styles.chartContainer}>
      <ContributionGraph
        values={commitsData}
        endDate={new Date("2017-02-27")}
        numDays={60}
        width={COMPUTED_CHART_WIDTH}
        height={130}
        gutterSize={4}
        showOutOfRangeDays={false}
        chartConfig={{
          backgroundGradientFrom: "#0f0f16",
          backgroundGradientTo: "#07070a",
          color: (opacity = 1) => `rgba(177, 125, 245, ${opacity})`, // Premium purple grit grid
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.4})`,
        }}
        style={styles.chartStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  chartStyle: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  }
});