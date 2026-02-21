import SafeScreenWrapper from '@/components/SafeScreenWrapper';
import { Colors } from '@/constants/Colors';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
const { height, width } = Dimensions.get('screen')
const { textPimary, textSecondary, background, cardBackgroundSecondary } = Colors
const Profile = () => {




  return (
    <View style={styles.container}>
    <SafeScreenWrapper>
  
        <View style={styles.header}>
          <View style={styles.headingContent}>
            <View style={styles.profileAvatar}>
              <Text style={{ fontWeight: 'bold', color: textPimary }}>AJ</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={{ fontWeight: 'bold',fontSize:20,color:textPimary }}>Charitha Iravana</Text>
              <View style={styles.packageContainer}>
                <FontAwesome6 name="crown" size={18} color="gold" />
                <Text style={{color:"gold"}}>Premium</Text>
              </View>
              <Text style={{color:textSecondary}}>Member Since 2023</Text>

            </View>
          </View>
        </View>
        <View style={styles.scrollSection}>


          <ScrollView  >

          </ScrollView>
        </View>
     
    </SafeScreenWrapper>
     </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height:height,
    maxHeight:height,
   backgroundColor: "rgb(0, 0, 0)"
  },
  header: {
    flex: 1,
   
  },
  scrollSection: {
    flex: 5,
 
  },
  headingContent: {
    flexDirection: 'row',
    backgroundColor: 'rgb(35, 37, 39)',
    gap: 10,
    margin: 10,
    padding: 10,
    borderRadius: 20

  },
  profileAvatar: {
    padding: 10,
    width: 70,
    height: 70,

    backgroundColor: "#123",
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',

  },
  infoContainer: {
    justifyContent: 'center',
    marginLeft: 20,
  },
  packageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    

  },

})

export default Profile;