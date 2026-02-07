import SafeScreenWrapper from '@/components/SafeScreenWrapper';
import { Colors } from '@/constants/Colors';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
 const {height,width} = Dimensions.get('screen')

 const {textPimary,textSecondary,background,cardBackgroundSecondary} = Colors
const Profile = () => {


 

  return ( 

<SafeScreenWrapper>
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headingContent}>
          <View style={styles.profileAvatar}>
            <Text style={{fontWeight:'bold',color:textPimary}}>AJ</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text>Alex</Text>
            <View>
              <Text>Premium</Text>
            </View>
            <Text>Member Since 2023</Text>

          </View>
        </View>
      </View>
      <View style={styles.scrollSection}>

      
      <ScrollView  >

      </ScrollView>
       </View>
    </View>
</SafeScreenWrapper>
   );
}

const styles = StyleSheet.create({
  container:{ 
      flex:1,
      maxHeight:height,
      height:height

  },
  header:{
    flex:1
  },
  scrollSection:{
    flex:5,
    backgroundColor:"#123"
  },
  headingContent:{
    flexDirection:'row',
    backgroundColor:'gray',
    gap:10,
    margin:10,
    padding:10,
    borderRadius:20

  },
  profileAvatar:{
    padding:10,
    width:70,
    height:70,

    backgroundColor:"#123",
    borderRadius:100,
    alignItems:'center',
    justifyContent:'center',

  },
  infoContainer:{

  }

})
 
export default Profile;