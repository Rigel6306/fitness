import { packageIcons } from "@/constants/icon";
import React from "react";

import { Colors } from "@/constants/Colors";
import { Pressable, StyleSheet, Text, View } from "react-native";
interface packageCardProps {
  id: string,
  name: string,
  description: string,
  price: number,
  icons: any[],
  isSelected: boolean,
  handleSelect: (data: any) => void,
  onClose?:()=>void
}

const {textSecondary,textPimary} = Colors
type IconKey = keyof typeof packageIcons;
const PackageCard: React.FC<packageCardProps> = React.memo(({ isSelected, handleSelect,onClose, name, description, price, icons, id }) => {

  return (
    <Pressable
    
      onPress={() => { 
        
        handleSelect({ name, id })
        onClose?onClose():null
      }}
      style={({ pressed }) => [pressed && { opacity: 0.5 },{flex:1,}]}>
      <View style={[styles.packageCardContainer, { backgroundColor: isSelected ? 'gray' : "rgb(38, 42, 46)" }]}>
        <View style={styles.pkgHeading}>
          <Text style={{ color: textPimary, fontSize: 15, fontWeight: 'bold' }}>{name}</Text>
          <Text style={{ color: 'rgb(39, 132, 82)', fontSize: 15, fontWeight: 'bold' }}>Rs:{price}</Text>
        </View>
        <Text style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold', color: textSecondary }}>{description}</Text>

        <View style={styles.iconsContainer}>

          {
            icons.map((Icon: any, i: number) => (
              React.cloneElement(packageIcons[Icon as IconKey]({}), { key: i })

            )

            )
          }

        </View>

      </View>
    </Pressable>
  )

}
)

const styles = StyleSheet.create({

     packageCardContainer: {
    backgroundColor: "rgb(38, 42, 46)",
    padding: 10,
    margin: 10,
    flex: 1,
    borderRadius: 10,

  },
  pkgHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

  },


    iconsContainer: {

    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,

  },


})

export default PackageCard