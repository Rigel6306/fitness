import { Colors } from '@/constants/Colors';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const { textPimary, textSecondary } = Colors
const SignUp = () => {
  return (
    <View style={styles.container}>

      <View style={styles.heading}>
        <View style={styles.headingTextContainer}>
          <FontAwesome5 name="dumbbell" size={34} color={textPimary} />
          <Text style={styles.headingText}>Create Your Account</Text>
        </View>
        <Text style={styles.headingSubText}>Start Your Fitness Journey Today !</Text>
      </View>
      
   <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.contentBody}>
        {/* Input Form Section */}
       
        
      

         <View style={styles.itemContainer}>
          <Text style={styles.inputTextHeading}>Membership Number</Text>
          <View style={styles.inputContainer}>
            <FontAwesome5 name="id-card" size={24} color={textPimary} />
            <TextInput style={styles.inputFiled} placeholder='54321' />
          </View>
        </View>
     
        <View style={styles.itemContainer}>
          <Text style={styles.inputTextHeading}>Full Name</Text>
          <View style={styles.inputContainer}>
            <AntDesign name="user" size={24} color="white" />
            <TextInput style={styles.inputFiled} placeholder='Albert Einstine' />
          </View>
        </View>

        {/* Personal Information Section  */}
        <View style={{ flexDirection: 'row' }}>
          <View style={[styles.itemContainer, { flex: 1 }]}>
            <Text style={styles.inputTextHeading}>Age</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="calendar-number" size={24} color={textPimary} />
              <TextInput style={styles.inputFiled} placeholder='21' />
            </View>
          </View>
          <View style={[styles.itemContainer, { flex: 3 }]}>
            <Text style={styles.inputTextHeading}>Contact Number</Text>
            <View style={styles.inputContainer}>
              <Feather name="smartphone" size={24} color={textPimary} />
              <TextInput style={styles.inputFiled} placeholder='0771234567' />
            </View>
          </View>
        </View>

        {/* Height and Weight Section  */}
        <View style={{ flexDirection: 'row' }}>
          <View style={[styles.itemContainer, { flex: 1 }]}>
            <Text style={styles.inputTextHeading}>Height (CM)</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="human-male-height" size={24} color={textPimary} />
              <TextInput style={styles.inputFiled} placeholder='160' />
            </View>
          </View>
          <View style={[styles.itemContainer, { flex: 1 }]}>
            <Text style={styles.inputTextHeading}>Weight (KG)</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="weight" size={24} color={textPimary} />
              <TextInput style={styles.inputFiled} placeholder='75' />
            </View>
          </View>
        </View>


        {/* Gender Selection Section */}
        <View style={[styles.itemContainer]}>
          <Text style={styles.inputTextHeading}>Gender</Text>
          <View style={{ flexDirection: 'row', padding: 10, gap: 40 }}>
            <Pressable style={({ pressed }) => [pressed && { opacity: 0.5 }, styles.genderBtn]}>
              <Fontisto name="male" size={24} color={textPimary} />
              <Text style={styles.inputTextHeading}>Male</Text>
            </Pressable>
            <Pressable style={({ pressed }) => [pressed && { opacity: 0.5 }, styles.genderBtn]}>
              <Fontisto name="female" size={24} color={textPimary} />
              <Text style={styles.inputTextHeading}>Female</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.inputTextHeading}>E-Mail </Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="email-variant" size={24} color={textPimary} />
            <TextInput style={styles.inputFiled} placeholder='someone@somewhere.com' />
          </View>
        </View>



        <View style={{flexDirection:'row'}}> 
           <View style={[styles.itemContainer,{flex:1}]}>
          <Text style={styles.inputTextHeading}>Password</Text>
          <View style={styles.inputContainer}>
            <FontAwesome5 name="lock" size={24} color={textPimary} />
            <TextInput style={styles.inputFiled} placeholder='*********' />
          </View>
        </View>

         <View style={[styles.itemContainer,{flex:1}]}>
          <Text style={styles.inputTextHeading}>Confirm Password</Text>
          <View style={styles.inputContainer}>
            <FontAwesome5 name="lock" size={24} color={textPimary} />
            <TextInput style={styles.inputFiled} placeholder='*********' />
          </View>
        </View>

        </View>
       


  
   
      </ScrollView>
 </KeyboardAvoidingView>

      <View style={styles.signupBtnContianer}>
        <Pressable style={({pressed})=>[pressed&&{opacity:0.5},styles.signupBtn]} >
          
            <Text style={styles.signUpBtntext}>Create Account</Text>
        </Pressable>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({

  container: {
    paddingTop: 20,
    backgroundColor: 'rgb(0, 0, 0)',
    flex: 1,
  },
  heading: {
    padding: 10,

  },
  headingTextContainer: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 20
  },
  headingText: {
    color: textPimary,
    fontSize: 25,
    fontWeight: 'bold',
  },
  headingSubText: {
    padding: 10,
    color: textSecondary,
    fontSize: 15,
    fontWeight: 'bold',
  },
  contentBody: {
    margin:10,
    borderRadius:15,
    padding: 10,
    backgroundColor:'rgb(23, 24, 37)'

  },
  itemContainer: {
  
   

  },

  inputContainer: {
    margin: 10,
    flexDirection: 'row',
    backgroundColor: textSecondary,
    alignItems: 'center',
    borderRadius: 15,
    paddingStart: 10,
  },
  inputTextHeading: {
    color: textPimary,
    fontWeight: 'bold',
    fontSize: 15,
    paddingStart: 10,
  },
  inputFiled: {
    color: textPimary,
    flex: 1,
  },
  genderBtn: {
    backgroundColor: textSecondary,
    flex: 1,
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15

  },

  signupBtnContianer: {
    flex:1,
    margin:10,
   
    justifyContent:'center',
  },
  signupBtn:{
    backgroundColor:"rgb(43, 22, 32)",
    flex:1,
    padding:10,
    margin:10,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:15,
    
  },
  signUpBtntext:{
    color:textPimary,
    fontWeight:'bold',
    fontSize:20,
  },


})

export default SignUp