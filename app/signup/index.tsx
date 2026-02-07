<<<<<<< HEAD
import { Colors } from '@/constants/Colors';
=======
import PackageCard from '@/components/ui/PackageCard';
import { Colors } from '@/constants/Colors';
import { registerUser } from '@/db/user';
import { getAllDocs } from '@/services/userService';
>>>>>>> recoverd-branch
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
<<<<<<< HEAD
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
=======

import React, { useCallback, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';

const { textPimary, textSecondary } = Colors;

interface userInfoInterface {
  membershipNumber: number | undefined;
  package: { id?: string; name?: string } | undefined;
  fullName: string | undefined;
  age: number | undefined;
  contactNumber: string | undefined;
  height: number | undefined;
  weight: number | undefined;
  gender: string | undefined;
  email: string | undefined;
  password: string | undefined;
  confirmedPwd: string | undefined;
}

interface PackageSelectionModalProps {
  isVisible: boolean;
  onClose: () => void;
  packageList: any[];
  selected: { id?: string; name?: string };
  handleSelect: (data: any) => void;
}

const PkgSelectionModal: React.FC<PackageSelectionModalProps> = ({
  isVisible,
  onClose,
  packageList,
  selected,
  handleSelect
}) => {
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        {packageList?.map((pkg) => (
          <PackageCard
            id={pkg.id}
            onClose={onClose}
            isSelected={selected.name === pkg.name}
            handleSelect={handleSelect}
            key={pkg.id}
            name={pkg.name}
            description={pkg.description}
            price={pkg.price}
            icons={pkg.icons}
          />
        ))}
      </View>
    </Modal>
  );
};

const SignUp = () => {
  const [userInfo, setUserInfo] = useState<userInfoInterface>({
    membershipNumber: undefined,
    package: undefined,
    fullName: undefined,
    age: undefined,
    contactNumber: undefined,
    height: undefined,
    weight: undefined,
    gender: undefined,
    email: undefined,
    password: undefined,
    confirmedPwd: undefined
  });

  const [errList, setErrList] = useState({
    membershipNumber: false,
    package: false,
    fullName: false,
    age: false,
    contactNumber: false,
    height: false,
    weight: false,
    gender: false,
    email: false,
    password: false,
    confirmedPwd: false
  });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [err, setErr] = useState<string | boolean>(false);
  const [gymPackages, setGymPackages] = useState<any[]>([]);
  const [selected, setSelected] = useState<{ id?: string; name?: string }>({
    id: undefined,
    name: undefined
  });

  const handleSelect = useCallback((data: any) => {
    setSelected(data);
    setUserInfo((prev) => ({ ...prev, ['package']: data }));
    setErrList((prev) => ({ ...prev, ['package']: false }));
  }, []);

  useEffect(() => {
    const fetchPakacges = async () => {
      const packageData = await getAllDocs('package');
      setGymPackages(packageData);
    };
    fetchPakacges();
  }, []);

  const isFieldValid = (filed: keyof userInfoInterface) => {
    try {
      validationSchema.validateSyncAt(filed, userInfo);
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleValues = (filedName: keyof userInfoInterface, value: string | number) => {
    setErr(false);
    setUserInfo((prev) => ({ ...prev, [filedName]: value }));
    setErrList((prev) => ({ ...prev, [filedName]: false }));
  };

  const handleSubmit = async () => {
    try {
      const valiedSchema = await validationSchema.validate(userInfo, { abortEarly: false });
      console.log('form is Valid,', userInfo)

      try {
        const registerdUser = await registerUser(userInfo)
        console.log("Signup Success", registerUser)
      }
      catch(err){

        console.log('User Registration Error at signup', err)

      }
      

    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setErr(err.inner[0].message);
        err.inner.forEach((item) => {
          setErrList((prev) => ({ ...prev, [item.path as keyof typeof errList]: true }));
        });
      }
    }
  };

  const validationSchema = Yup.object().shape({
    membershipNumber: Yup.string()
      .min(4, "must have 4 numbers, Check your membership card again")
      .max(4, "oops, you got an extra number, Check your membership card again")
      .required("Membership is Required"),

    package: Yup.object()
      .required("Please select a package"),


    fullName: Yup.string()
      .min(4, "must contain 4 numbers")
      .required("Full name is Required"),

    age: Yup.number()
      .min(12, "you are too young, go to pre-school first 🤣")
      .max(100, "Dead men tells no tails, you have lived too long 🫠")
      .required("Age is required"),

    contactNumber: Yup.string()
      .matches(/^[0-9]{10}$/, "Contact number must be 10 digits")
      .required("Contact number is required"),

    height: Yup.number()
      .min(54.6, "Shortest person ever recorded was 54.6, You just made a guness world Record ❤️")
      .max(272, 'max recorded hight for a man is 272 CM, You just made history 🤣')
      .required("Height is required"),

    weight: Yup.number()
      .typeError("Weight must be numeric")
      .min(35, "Eat well and come back, your weight is too low")
      .max(200, 'Ahh, you sneaky lier, give me the real weight 🤷‍♂️')
      .required("Weight is required"),

    gender: Yup.string()
      .oneOf(["male", "female"], "Gender must be selected")
      .required("Ah, i get it, gender is complecated Right?"),

    email: Yup.string()
      .email('Invalid Email Format')
      .required("E-Mail is Required"),

    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .matches(/[A-Z]/, "Must include an uppercase letter")
      .matches(/[0-9]/, "Must include a number")
      .matches(/[^a-zA-Z0-9]/, "Must include a symbol")
      .required("Password is Required"),

    confirmedPwd: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm Password is Required")
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.heading}>
          <View style={styles.headingTextContainer}>
            <FontAwesome5 name="dumbbell" size={34} color={textPimary} />
            <Text style={styles.headingText}>Create Your Account</Text>
          </View>
          <Text style={styles.headingSubText}>Start Your Fitness Journey Today !</Text>
        </View>

        <KeyboardAvoidingView
          style={styles.keybAvdView}
          behavior={Platform.OS === 'ios' ? "padding" : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -20}
        >
          <ScrollView
            style={styles.contentBody}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Input Form Section */}
            <View style={styles.itemContainer}>
              <Text style={styles.inputTextHeading}>Membership Number</Text>
              <View style={[
                styles.inputContainer,
                isFieldValid('membershipNumber') && styles.validInput,
                errList.membershipNumber && styles.ivalidInput
              ]}>
                <FontAwesome5 name="id-card" size={24} color={textPimary} />
                <TextInput
                  keyboardType='numeric'
                  value={userInfo.membershipNumber?.toString()}
                  onChangeText={(value) => handleValues('membershipNumber', value)}
                  style={styles.inputFiled}
                  placeholder='54321'
                />
              </View>
            </View>

            <View style={styles.itemContainer}>
              <Text style={styles.inputTextHeading}>Select Package</Text>
              <Pressable
                onPress={() => setIsModalOpen(true)}
                style={
                  ({ pressed }) =>
                    [
                      pressed && { opacity: 0.5 },
                      styles.inputContainer,
                      { padding: 10 },
                      isFieldValid('package') && styles.validInput,
                      errList.package && styles.ivalidInput
                    ]}
              >


                <MaterialCommunityIcons name="package" size={24} color={textPimary} />
                <Text style={{ textAlign: 'center', fontWeight: 'bold', flex: 1 }}>
                  {selected.name || "Select Package"}
                </Text>


              </Pressable>
            </View>

            <View style={styles.itemContainer}>
              <Text style={styles.inputTextHeading}>Full Name</Text>
              <View style={[
                styles.inputContainer,
                isFieldValid('fullName') && styles.validInput,
                errList.fullName && styles.ivalidInput
              ]}>
                <AntDesign name="user" size={24} color="white" />
                <TextInput
                  value={userInfo.fullName}
                  onChangeText={(value) => handleValues('fullName', value)}
                  style={styles.inputFiled}
                  placeholder='Albert Einstine'
                />
              </View>
            </View>

            {/* Personal Information Section  */}
            <View style={{ flexDirection: 'row' }}>
              <View style={[styles.itemContainer, { flex: 1 }]}>
                <Text style={styles.inputTextHeading}>Age</Text>
                <View style={[
                  styles.inputContainer,
                  isFieldValid('age') && styles.validInput,
                  errList.age && styles.ivalidInput
                ]}>
                  <Ionicons name="calendar-number" size={24} color={textPimary} />
                  <TextInput
                    keyboardType='numeric'
                    value={userInfo.age?.toString()}
                    onChangeText={(value) => handleValues('age', value)}
                    style={styles.inputFiled}
                    placeholder='21'
                  />
                </View>
              </View>
              <View style={[styles.itemContainer, { flex: 3 }]}>
                <Text style={styles.inputTextHeading}>Contact Number</Text>
                <View style={[
                  styles.inputContainer,
                  isFieldValid('contactNumber') && styles.validInput,
                  errList.contactNumber && styles.ivalidInput
                ]}>
                  <Feather name="smartphone" size={24} color={textPimary} />
                  <TextInput
                    value={userInfo.contactNumber}
                    keyboardType='numeric'
                    onChangeText={(value) => handleValues('contactNumber', value)}
                    style={styles.inputFiled}
                    placeholder='0771234567'
                  />
                </View>
              </View>
            </View>

            {/* Height and Weight Section  */}
            <View style={{ flexDirection: 'row' }}>
              <View style={[styles.itemContainer, { flex: 1 }]}>
                <Text style={styles.inputTextHeading}>Height (CM)</Text>
                <View style={[
                  styles.inputContainer,
                  isFieldValid('height') && styles.validInput,
                  errList.height && styles.ivalidInput
                ]}>
                  <MaterialCommunityIcons name="human-male-height" size={24} color={textPimary} />
                  <TextInput
                    keyboardType='numeric'
                    value={userInfo.height?.toString()}
                    onChangeText={(value) => handleValues('height', value)}
                    style={styles.inputFiled}
                    placeholder='160'
                  />
                </View>
              </View>
              <View style={[styles.itemContainer, { flex: 1 }]}>
                <Text style={styles.inputTextHeading}>Weight (KG)</Text>
                <View style={[
                  styles.inputContainer,
                  isFieldValid('weight') && styles.validInput,
                  errList.weight && styles.ivalidInput
                ]}>
                  <MaterialCommunityIcons name="weight" size={24} color={textPimary} />
                  <TextInput
                    keyboardType='numeric'
                    value={userInfo.weight?.toString()}
                    onChangeText={(value) => handleValues('weight', value)}
                    style={styles.inputFiled}
                    placeholder='75'
                  />
                </View>
              </View>
            </View>

            {/* Gender Selection Section */}
            <View style={[styles.itemContainer]}>
              <Text style={styles.inputTextHeading}>Gender</Text>
              <View style={{ flexDirection: 'row', padding: 10, gap: 10 }}>
                <Pressable
                  onPress={() => handleValues('gender', 'male')}
                  style={({ pressed }) => [
                    pressed && { opacity: 0.5 },
                    styles.genderBtn,
                    userInfo.gender === 'male' && { backgroundColor: 'rgb(32, 74, 130)' }
                  ]}
                >
                  <Fontisto name="male" size={24} color={"rgb(49, 86, 125)"} />
                  <Text style={styles.inputTextHeading}>Male</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleValues('gender', 'female')}
                  style={({ pressed }) => [
                    pressed && { opacity: 0.5 },
                    styles.genderBtn,
                    userInfo.gender === 'female' && { backgroundColor: 'rgb(111, 58, 155)' }
                  ]}
                >
                  <Fontisto name="female" size={24} color={"rgb(52, 17, 68)"} />
                  <Text style={styles.inputTextHeading}>Female</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.itemContainer}>
              <Text style={styles.inputTextHeading}>E-Mail </Text>
              <View style={[
                styles.inputContainer,
                isFieldValid('email') && styles.validInput,
                errList.email && styles.ivalidInput
              ]}>
                <MaterialCommunityIcons name="email-variant" size={24} color={textPimary} />
                <TextInput
                  value={userInfo.email}
                  onChangeText={(value) => handleValues('email', value)}
                  style={styles.inputFiled}
                  placeholder='someone@somewhere.com'
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <View style={[styles.itemContainer, { flex: 1 }]}>
                <Text style={styles.inputTextHeading}>Password</Text>
                <View style={[
                  styles.inputContainer,
                  isFieldValid('password') && styles.validInput,
                  errList.password && styles.ivalidInput
                ]}>
                  <FontAwesome5 name="lock" size={24} color={textPimary} />
                  <TextInput
                    secureTextEntry
                    value={userInfo.password}
                    onChangeText={(value) => handleValues('password', value)}
                    style={styles.inputFiled}
                    placeholder='*********'
                  />
                </View>
              </View>

              <View style={[styles.itemContainer, { flex: 1 }]}>
                <Text style={styles.inputTextHeading}>Confirm Password</Text>
                <View style={[
                  styles.inputContainer,
                  isFieldValid('confirmedPwd') && styles.validInput,
                  errList.confirmedPwd && styles.ivalidInput
                ]}>
                  <FontAwesome5 name="lock" size={24} color={textPimary} />
                  <TextInput
                    secureTextEntry
                    value={userInfo.confirmedPwd}
                    onChangeText={(value) => handleValues('confirmedPwd', value)}
                    style={styles.inputFiled}
                    placeholder='*********'
                  />
                </View>
              </View>
            </View>

            <View style={styles.spacer} />
          </ScrollView>
        </KeyboardAvoidingView>

        {err && <Text style={styles.errorMsg}>{err}</Text>}

        <View style={styles.signupBtnContianer}

        >
          <Pressable

            onPress={handleSubmit}
            style={({ pressed }) => [pressed && { opacity: 0.5 }, styles.signupBtn]}
          >
            <Text style={styles.signUpBtntext}>Create Account</Text>
          </Pressable>
        </View>
      </View>

      {gymPackages && (
        <PkgSelectionModal
          isVisible={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          packageList={gymPackages}
          selected={selected}
          handleSelect={handleSelect}
        />
      )}
    </SafeAreaView>
  );
};
>>>>>>> recoverd-branch

const styles = StyleSheet.create({

  container: {
    paddingTop: 20,
    backgroundColor: 'rgb(0, 0, 0)',
    flex: 1,
    backgroundColor: 'rgb(0, 0, 0)',
  },
<<<<<<< HEAD
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
=======
  contentWrapper: {
    flex: 1,
    paddingTop: 20,
  },
  heading: {
    padding: 10,
  },
  headingTextContainer: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 20,
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
  keybAvdView: {
    flex: 1,
  },
  contentBody: {
    flex: 1,
    margin: 10,
    borderRadius: 15,
    padding: 10,
    backgroundColor: 'rgb(23, 24, 37)',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    marginBottom: 5,
  },
  inputContainer: {
    margin: 10,
    flexDirection: 'row',
    backgroundColor: 'rgba(154, 162, 158, 0.2)',
>>>>>>> recoverd-branch
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
<<<<<<< HEAD
=======
    fontWeight: 'bold',
    paddingVertical: 12,
  },
  validInput: {
    backgroundColor: 'rgba(115, 240, 184, 0.46)'
  },
  ivalidInput: {
    backgroundColor: 'rgba(104, 98, 57, 0.93)'
>>>>>>> recoverd-branch
  },
  genderBtn: {
    backgroundColor: textSecondary,
    flex: 1,
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
<<<<<<< HEAD
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
=======
    borderRadius: 15,
  },
  signupBtnContianer: {
    padding: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 40,
    backgroundColor: 'rgb(0, 0, 0)',
  },
  signupBtn: {
    backgroundColor: "rgb(62, 50, 88)",
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  errorMsg: {
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "rgb(36, 41, 48)",
    padding: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    color: "rgb(176, 108, 48)",
  },
  signUpBtntext: {
    color: textPimary,
    fontWeight: 'bold',
    fontSize: 18,
  },
  spacer: {
    height: 20,
  },
});
>>>>>>> recoverd-branch

export default SignUp;