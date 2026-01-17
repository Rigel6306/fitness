
import { Colors } from '@/constants/Colors';
import { useUserDataContext } from '@/hooks/useContext';
import { getAllDocs } from '@/services/userService';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import { packageIcons } from '@/constants/icon';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
const { textPimary, textSecondary, background, secondaryBackground, primaryBackground, cardBackground, cardBackgroundSecondary } = Colors
interface PackageSelectionModalProps {
  isVisible: boolean
  onClose: () => void
}


interface packageCardProps {
  name: string,
  description: string,
  price: number,
  icons:any[]
}

type IconKey = keyof typeof packageIcons;
const PackageCard: React.FC<packageCardProps> = ({ name, description, price,icons }) => {

  return (
    <Pressable style={({ pressed }) => [pressed && { opacity: 0.5 }]}>
    <View style={styles.packageCardContainer}>
      <View style={styles.pkgHeading}>
        <Text style={{color:textPimary, fontSize:15,fontWeight:'bold'}}>{name}</Text>
        <Text style={{color:'rgb(39, 132, 82)', fontSize:15,fontWeight:'bold'}}>Rs:{price}</Text>
      </View>
      <Text style={{marginTop:10, marginBottom:10,fontWeight:'bold',color:textSecondary}}>{description}</Text>

      <View style={styles.iconsContainer}>

        {
          icons.map((Icon:any,i:number)=>(
         React.cloneElement(packageIcons[Icon as IconKey](), { key: i })
         
            )
          
          )
        }
       
      </View>
      
    </View>
    </Pressable>
  )

}

const PackageSelectionModal: React.FC<PackageSelectionModalProps> = ({ isVisible, onClose }) => {

  const {userData} =useUserDataContext()

  const [gymPackages,setGymPackages] = useState<any[]>([])

  useEffect(()=>{

    const fetchPakacges = async ()=>{

    const packageData = await  getAllDocs('package')
    setGymPackages(packageData)

    }
    fetchPakacges()
    console.log(gymPackages)
  },[])
  

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >

      <View style={styles.container}>
        <View style={styles.heading}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={styles.headingText} >Packages</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close-circle" size={34} color={textPimary}/>
            </Pressable>
          </View>

          <Text style={styles.curentPackageText}>Current Package</Text>
          <View style={styles.currentPackageContainer}>
            <Text style={{ color: textPimary, fontSize: 17, fontWeight: 'bold' }}>Workouts Only</Text>
            <Text style={{ color: "rgba(185, 91, 33, 1)", fontSize: 17, fontWeight: 'bold' }}>Rs. {userData.package.price}</Text>
          </View>
        </View>

        <View style={styles.contentBody}>
          <View>
          </View>

        <Text style={{margin:10,padding:10,fontSize:22,fontWeight:'bold',color:textPimary}}>Available Packages</Text>
          <ScrollView style={styles.scrollContainer}>

            {
              gymPackages?.map((pkg) => (<PackageCard key={pkg.id} name={pkg.name} description={pkg.description} price={pkg.price} icons={pkg.icons} />))
            }

          </ScrollView>

          <View style={styles.actionBtnsContainer} >
            <Pressable onPress={onClose} style={styles.cancleBtn}>
              <Text style={styles.actionBtnText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.confirmBtn}>
              <Text style={styles.actionBtnText}>Confirm Change</Text>
            </Pressable>
          </View>
        </View>
      </View>

    </Modal>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  heading: {
    flex: 1,
    borderRadius: 20,
    padding: 10,
    backgroundColor: "rgb(13, 13, 14)",
    marginBottom: 10,
  },
  headingText: {
    color: textPimary,
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: 10

  },
  curentPackageText: {
    margin: 10,
    fontSize: 20,
    color: textSecondary
  },
  currentPackageContainer: {
    margin: 10,
    backgroundColor:'rgba(42, 44, 46, 0.52)',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center'

  },
  contentBody: {
    flex: 4,
    backgroundColor: "rgb(13, 13, 14)",
    borderRadius: 20,
  },
  scrollContainer: {
    margin:10,
    flex:1,
  },
  packageCardContainer: {
    backgroundColor: "rgb(38, 42, 46)",
    padding: 10,
    margin: 10,
    flex: 1,
    borderRadius: 10,
  
  },
  pkgHeading:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',

  },
  iconsContainer:{

    flexDirection:'row',
    alignItems:'center',
    gap:10,
    
  },


  actionBtnsContainer: {
    margin: 10,
    padding:10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: 10,
  },
  cancleBtn: {
    flex: 1,
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',

  },
  confirmBtn: {
    flex: 1,
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionBtnText: {
    fontWeight: 'bold',
    fontSize: 15
  }

})

export default PackageSelectionModal