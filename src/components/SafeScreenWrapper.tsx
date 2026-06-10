
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const SafeScreenWrapper = ({children}:{children:any}) => {
  return (
    <SafeAreaView style={[styles.container]}>
    
     <StatusBar backgroundColor="black" /> 
        {children}
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
container:{
    flex:1,
    backgroundColor:'rgba(17, 34, 51, 0)'
  
   
}

})

export default SafeScreenWrapper