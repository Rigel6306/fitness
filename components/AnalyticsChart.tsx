
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import {
    ContributionGraph,
    LineChart
} from "react-native-chart-kit";

import { Colors } from "../constants/Colors";

const {textPimary,textSecondary} = Colors
const chartConfig = {
        backgroundGradientFrom:"#346758",
        backgroundGradientFromOpacity: 1,
        backgroundGradientTo: "#438ad1",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 1,
        decimalPlaces: 0,
        useShadowColorFromDataset: true // optional
    };


export const LineChartComp =  ({chartData}) => {


    

    console.log("At chart Comp",chartData)

  

    const dataSet = chartData.map(item=>(item.data?item.data.noOfWorkoutsCompleted:0))

    console.log("Data Set: ",dataSet)
    console.log("Data set",dataSet)
    return (

        <View style={styles.chartContainer}>
            <Text style={styles.heading}>
                Analytics
            </Text>
            <LineChart

                chartConfig ={chartConfig}
                data={{
                    labels: chartData.map((item)=>item.date.split('-')[2]),
                    datasets: [
                        {
                            data: dataSet
                        }
                    ]
                }}
                width={Dimensions.get("window").width-20} // from react-native
                height={200}
                
                // yAxisLabel="$"
                // yAxisSuffix="k"
                 // optional, defaults to 1
               
                bezier
                style={{
                   
                    borderRadius: 16
                }}
            />

            

        </View>
    );
}




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
    { date: "2017-02-06", count: 2 },
    { date: "2017-02-07", count: 3 },
   
    // ⚠️ Invalid date "2017-02-30" removed (Feb has max 28/29 days)
  ];

  return (
    <View style={styles.chartContainer}>
      <ContributionGraph
        values={commitsData}
        endDate={new Date("2017-02-27")}
        numDays={60}
        width={Dimensions.get('screen').width-20}
        height={220}
        gutterSize={5}
        showOutOfRangeDays={true}
        chartConfig={{
          backgroundColor: "#32c3b7d8",
          backgroundGradientFrom: "#993e3e",
          backgroundGradientTo: "#308288",
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        style={{borderRadius:20}}
       
      />
    </View>
  );
};




const styles = StyleSheet.create({

    chartContainer:{
        margin:10,
        
    },
    heading:{
         textAlign: 'left',
    marginBottom: 10,
    marginLeft: 8,
    fontSize: 20,
    fontWeight: 'bold',
    color: textPimary
        
    }

})

