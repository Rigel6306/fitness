
import SafeScreenWrapper from "@/components/SafeScreenWrapper";
import { StyleSheet, Text, View } from "react-native";
const Payments = () => {


  return (
   <View style={styles.container}>
    <SafeScreenWrapper>
   
        <Text>
        Charitha
        </Text>
   
    </SafeScreenWrapper>
       </View>
    );
}
 
const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:'#1234'
  }

})
export default Payments;