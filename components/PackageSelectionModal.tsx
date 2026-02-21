
import { Colors } from '@/constants/Colors';
import { useUserDataContext } from '@/hooks/useContext';
import { db } from '@/services/firebase';
import { getAllDocs, updateDocument } from '@/services/userService';
import Ionicons from '@expo/vector-icons/Ionicons';
import { doc } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
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


import PackageCard from './ui/PackageCard';

const PackageSelectionModal: React.FC<PackageSelectionModalProps> = ({ isVisible, onClose }) => {
const [updatedPackage,setUpdatedPackageName] = useState <{name?:string,price?:string}>({});
  const { userData } = useUserDataContext()
  const [selected, setSelected] = useState<{ id?: string; name?: string ,price?:string}>({})
  const [gymPackages, setGymPackages] = useState<any[]>([])

  const handleSelect = useCallback((data: any) => {
    setSelected(data)
  }, [])

  useEffect(() => {
    const fetchPakacges = async () => {
      const packageData = await getAllDocs('package')
      setGymPackages(packageData)
    }
    fetchPakacges()
  }, [])

 

const handleSaveChanges = async () => {
  setUpdatedPackageName({name:selected.name,price:selected.price})

  try {
    // Build a proper DocumentReference
    const packageRef = doc(db, "package", selected.id||'');

    const newData = {
      ...userData,
      packageRef, // <-- this is now a DocumentReference
    };

    await updateDocument(userData.id, newData, "users");
   
  } catch (err) {
    console.log("Error updating user:", err);
  }
};


  return ( 

  <Modal
    visible={isVisible}
    animationType="slide"
    transparent={true}
    onRequestClose={onClose}
  >

  {
    !userData.package?<View><Text>Loading</Text></View>:
 

    <View style={styles.container}>
      <View style={styles.heading}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={styles.headingText} >Packages</Text>
          <Pressable onPress={onClose}>
            <Ionicons name="close-circle" size={34} color={textPimary} />
          </Pressable>
        </View>

        <Text style={styles.curentPackageText}>Current Package</Text>
        <View style={styles.currentPackageContainer}>
          <Text style={{ color: textPimary, fontSize: 17, fontWeight: 'bold' }}>{updatedPackage.name?updatedPackage.name:userData.package.name}</Text>
          <Text style={{ color: "rgba(185, 91, 33, 1)", fontSize: 17, fontWeight: 'bold' }}>Rs. {updatedPackage.price?updatedPackage.price:userData.package.price} Per Month</Text>
        </View>
      </View>

      <View style={styles.contentBody}>
        <View>
        </View>

        <Text style={{ margin: 10, padding: 10, fontSize: 22, fontWeight: 'bold', color: textPimary }}>Available Packages</Text>
        <ScrollView style={styles.scrollContainer}>

          {
            gymPackages?.map((pkg) => (<PackageCard id={pkg.id} isSelected={selected.name === pkg.name} handleSelect={handleSelect} key={pkg.id} name={pkg.name} description={pkg.description} price={pkg.price} icons={pkg.icons} />))
          }

        </ScrollView>

        <View style={styles.actionBtnsContainer} >
          <Pressable onPress={onClose} style={styles.cancleBtn}>
            <Text style={styles.actionBtnText}>Cancel</Text>
          </Pressable>
          <Pressable style={styles.confirmBtn} onPress={handleSaveChanges}>
            <Text style={styles.actionBtnText}>Confirm Change</Text>
          </Pressable>
        </View>
      </View>
    </View>
     }

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
    padding: 8,
    margin:8,
    backgroundColor: "rgba(30, 30, 30, 0.75)",
    marginBottom: 8,
  },
  headingText: {
    color: textPimary,
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8

  },
  curentPackageText: {
    marginTop:20,
    margin: 8,
    fontSize: 16,
    color: textSecondary
  },
  currentPackageContainer: {
    margin: 8,
    backgroundColor: "rgb(36, 36, 49)",
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',

  },
  contentBody: {
    flex: 3,
    backgroundColor: "rgba(30, 30, 30, 0.75)",
    borderRadius: 20,
    margin:8,
  },
  scrollContainer: {
    margin: 8,
    flex: 1,
  },

  actionBtnsContainer: {
    margin: 8,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
     marginHorizontal:10,
    gap: 8,
  },

  cancleBtn: {
    flex: 1,
    backgroundColor: 'gray',
    padding: 8,
    borderRadius: 8,
     
    alignItems: 'center',

  },
  confirmBtn: {
    flex: 1,
    backgroundColor: 'rgb(255, 250, 250)',
    padding: 8,
    borderRadius: 8,
   
    alignItems: 'center',

  },
  actionBtnText: {
    color:textSecondary,
    fontWeight: 'bold',
    fontSize: 16
  }

})

export default PackageSelectionModal