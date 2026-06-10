import PkgSelectionModal from '@/components/ui/pkgSelectionModal';
import { Colors } from '@/constants/Colors';
import { registerUser } from '@/db/user';
import { getAllDocs } from '@/services/userService';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCallback, useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
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
    const fetchPackages = async () => {
      const packageData = await getAllDocs('package');
      setGymPackages(packageData);
    };
    fetchPackages();
  }, []);

  const isFieldValid = (field: keyof userInfoInterface) => {
    try {
      validationSchema.validateSyncAt(field, userInfo);
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleValues = (fieldName: keyof userInfoInterface, value: string | number) => {
    setErr(false);
    setUserInfo((prev) => ({ ...prev, [fieldName]: value }));
    setErrList((prev) => ({ ...prev, [fieldName]: false }));
  };

  const handleSubmit = async () => {
    try {
      await validationSchema.validate(userInfo, { abortEarly: false });
      try {
        const registeredUser = await registerUser(userInfo);
        console.log("Signup Success", registeredUser);
      } catch(err) {
        console.log('User Registration Error at signup', err);
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
    package: Yup.object().required("Please select a package"),
    fullName: Yup.string().min(4, "must contain 4 characters").required("Full name is Required"),
    age: Yup.number()
      .min(12, "you are too young, go to pre-school first 🤣")
      .max(100, "Dead men tells no tales, you have lived too long 🫠")
      .required("Age is required"),
    contactNumber: Yup.string()
      .matches(/^[0-9]{10}$/, "Contact number must be 10 digits")
      .required("Contact number is required"),
    height: Yup.number()
      .min(54.6, "Shortest person ever recorded was 54.6, You just made a world Record ❤️")
      .max(272, 'max recorded height for a man is 272 CM, You just made history 🤣')
      .required("Height is required"),
    weight: Yup.number()
      .typeError("Weight must be numeric")
      .min(35, "Eat well and come back, your weight is too low")
      .max(200, 'Ahh, you sneaky liar, give me the real weight 🤷‍♂️')
      .required("Weight is required"),
    gender: Yup.string()
      .oneOf(["male", "female"], "Gender must be selected")
      .required("Ah, i get it, gender is complicated Right?"),
    email: Yup.string().email('Invalid Email Format').required("E-Mail is Required"),
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
        
        {/* Header Section */}
        <View style={styles.heading}>
          <View style={styles.headingTextContainer}>
            <FontAwesome5 name="dumbbell" size={28} color="#0affca" />
            <Text style={styles.headingText}>CREATE ACCOUNT</Text>
          </View>
          <Text style={styles.headingSubText}>START YOUR FITNESS JOURNEY TODAY !</Text>
        </View>

        <KeyboardAvoidingView
          style={styles.keybAvdView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 45}
        >
          <ScrollView
            style={styles.contentBody}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onScrollBeginDrag={Keyboard.dismiss} // <-- Instantly dismisses keyboard on drag without freezing touch event lifecycle
          >
            {/* Membership Input */}
            <View style={styles.itemContainer}>
              <Text style={styles.inputTextHeading}>MEMBERSHIP NUMBER</Text>
              <View style={[
                styles.inputContainer,
                isFieldValid('membershipNumber') && styles.validInput,
                errList.membershipNumber && styles.invalidInput
              ]}>
                <FontAwesome5 name="id-card" size={18} color="rgba(255,255,255,0.4)" />
                <TextInput
                  keyboardType='numeric'
                  value={userInfo.membershipNumber?.toString()}
                  onChangeText={(value) => handleValues('membershipNumber', value)}
                  style={styles.inputField}
                  placeholder='54321'
                  placeholderTextColor="rgba(255,255,255,0.2)"
                />
              </View>
            </View>

            {/* Package Selector */}
            <View style={styles.itemContainer}>
              <Text style={styles.inputTextHeading}>SELECT PACKAGE</Text>
              <Pressable
                onPress={() => {
                  Keyboard.dismiss();
                  setIsModalOpen(true);
                }}
                style={({ pressed }) => [
                  pressed && { opacity: 0.7 },
                  styles.inputContainer,
                  isFieldValid('package') && styles.validInput,
                  errList.package && styles.invalidInput,
                  { paddingVertical: 14 }
                ]}
              >
                <MaterialCommunityIcons name="package" size={20} color="rgba(255,255,255,0.4)" />
                <Text style={[
                  styles.pickerText, 
                  selected.name ? { color: '#0affca' } : { color: 'rgba(255,255,255,0.4)' }
                ]}>
                  {selected.name ? selected.name.toUpperCase() : "CHOOSE YOUR PLAN"}
                </Text>
              </Pressable>
            </View>

            {/* Full Name Input */}
            <View style={styles.itemContainer}>
              <Text style={styles.inputTextHeading}>FULL NAME</Text>
              <View style={[
                styles.inputContainer,
                isFieldValid('fullName') && styles.validInput,
                errList.fullName && styles.invalidInput
              ]}>
                <AntDesign name="user" size={18} color="rgba(255,255,255,0.4)" />
                <TextInput
                  value={userInfo.fullName}
                  onChangeText={(value) => handleValues('fullName', value)}
                  style={styles.inputField}
                  placeholder='ALBERT EINSTEIN'
                  placeholderTextColor="rgba(255,255,255,0.2)"
                />
              </View>
            </View>

            {/* Age & Contact Row */}
            <View style={styles.rowWrapper}>
              <View style={[styles.itemContainer, { flex: 1 }]}>
                <Text style={styles.inputTextHeading}>AGE</Text>
                <View style={[
                  styles.rowInputContainer,
                  isFieldValid('age') && styles.validInput,
                  errList.age && styles.invalidInput
                ]}>
                  <Ionicons name="calendar-number" size={18} color="rgba(255,255,255,0.4)" />
                  <TextInput
                    keyboardType='numeric'
                    value={userInfo.age?.toString()}
                    onChangeText={(value) => handleValues('age', value)}
                    style={styles.inputField}
                    placeholder='21'
                    placeholderTextColor="rgba(255,255,255,0.2)"
                  />
                </View>
              </View>
              <View style={[styles.itemContainer, { flex: 2 }]}>
                <Text style={styles.inputTextHeading}>CONTACT NUMBER</Text>
                <View style={[
                  styles.rowInputContainer,
                  isFieldValid('contactNumber') && styles.validInput,
                  errList.contactNumber && styles.invalidInput
                ]}>
                  <Feather name="smartphone" size={18} color="rgba(255,255,255,0.4)" />
                  <TextInput
                    value={userInfo.contactNumber}
                    keyboardType='numeric'
                    onChangeText={(value) => handleValues('contactNumber', value)}
                    style={styles.inputField}
                    placeholder='0771234567'
                    placeholderTextColor="rgba(255,255,255,0.2)"
                  />
                </View>
              </View>
            </View>

            {/* Height & Weight Row */}
            <View style={styles.rowWrapper}>
              <View style={[styles.itemContainer, { flex: 1 }]}>
                <Text style={styles.inputTextHeading}>HEIGHT (CM)</Text>
                <View style={[
                  styles.rowInputContainer,
                  isFieldValid('height') && styles.validInput,
                  errList.height && styles.invalidInput
                ]}>
                  <MaterialCommunityIcons name="human-male-height" size={18} color="rgba(255,255,255,0.4)" />
                  <TextInput
                    keyboardType='numeric'
                    value={userInfo.height?.toString()}
                    onChangeText={(value) => handleValues('height', value)}
                    style={styles.inputField}
                    placeholder='160'
                    placeholderTextColor="rgba(255,255,255,0.2)"
                  />
                </View>
              </View>
              <View style={[styles.itemContainer, { flex: 1 }]}>
                <Text style={styles.inputTextHeading}>WEIGHT (KG)</Text>
                <View style={[
                  styles.rowInputContainer,
                  isFieldValid('weight') && styles.validInput,
                  errList.weight && styles.invalidInput
                ]}>
                  <MaterialCommunityIcons name="weight" size={18} color="rgba(255,255,255,0.4)" />
                  <TextInput
                    keyboardType='numeric'
                    value={userInfo.weight?.toString()}
                    onChangeText={(value) => handleValues('weight', value)}
                    style={styles.inputField}
                    placeholder='75'
                    placeholderTextColor="rgba(255,255,255,0.2)"
                  />
                </View>
              </View>
            </View>

            {/* Gender Selection */}
            <View style={styles.itemContainer}>
              <Text style={styles.inputTextHeading}>GENDER</Text>
              <View style={styles.genderRowContainer}>
                <Pressable
                  onPress={() => {
                    Keyboard.dismiss();
                    handleValues('gender', 'male');
                  }}
                  style={({ pressed }) => [
                    pressed && { opacity: 0.7 },
                    styles.genderBtn,
                    userInfo.gender === 'male' && styles.genderBtnActiveMale
                  ]}
                >
                  <Fontisto name="male" size={16} color={userInfo.gender === 'male' ? '#ffffff' : "rgba(255,255,255,0.3)"} />
                  <Text style={[styles.genderBtnText, userInfo.gender === 'male' && { color: '#ffffff' }]}>MALE</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    Keyboard.dismiss();
                    handleValues('gender', 'female');
                  }}
                  style={({ pressed }) => [
                    pressed && { opacity: 0.7 },
                    styles.genderBtn,
                    userInfo.gender === 'female' && styles.genderBtnActiveFemale
                  ]}
                >
                  <Fontisto name="female" size={16} color={userInfo.gender === 'female' ? '#ffffff' : "rgba(255,255,255,0.3)"} />
                  <Text style={[styles.genderBtnText, userInfo.gender === 'female' && { color: '#ffffff' }]}>FEMALE</Text>
                </Pressable>
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.itemContainer}>
              <Text style={styles.inputTextHeading}>E-MAIL ADDRESS</Text>
              <View style={[
                styles.inputContainer,
                isFieldValid('email') && styles.validInput,
                errList.email && styles.invalidInput
              ]}>
                <MaterialCommunityIcons name="email-variant" size={18} color="rgba(255,255,255,0.4)" />
                <TextInput
                  value={userInfo.email}
                  onChangeText={(value) => handleValues('email', value)}
                  style={styles.inputField}
                  placeholder='SOMEONE@SOMEWHERE.COM'
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Passwords Row */}
            <View style={styles.rowWrapper}>
              <View style={[styles.itemContainer, { flex: 1 }]}>
                <Text style={styles.inputTextHeading}>PASSWORD</Text>
                <View style={[
                  styles.rowInputContainer,
                  isFieldValid('password') && styles.validInput,
                  errList.password && styles.invalidInput
                ]}>
                  <FontAwesome5 name="lock" size={14} color="rgba(255,255,255,0.4)" />
                  <TextInput
                    secureTextEntry
                    value={userInfo.password}
                    onChangeText={(value) => handleValues('password', value)}
                    style={styles.inputField}
                    placeholder='*********'
                    placeholderTextColor="rgba(255,255,255,0.2)"
                  />
                </View>
              </View>

              <View style={[styles.itemContainer, { flex: 1 }]}>
                <Text style={styles.inputTextHeading}>CONFIRM PASSWORD</Text>
                <View style={[
                  styles.rowInputContainer,
                  isFieldValid('confirmedPwd') && styles.validInput,
                  errList.confirmedPwd && styles.invalidInput
                ]}>
                  <FontAwesome5 name="lock" size={14} color="rgba(255,255,255,0.4)" />
                  <TextInput
                    secureTextEntry
                    value={userInfo.confirmedPwd}
                    onChangeText={(value) => handleValues('confirmedPwd', value)}
                    style={styles.inputField}
                    placeholder='*********'
                    placeholderTextColor="rgba(255,255,255,0.2)"
                  />
                </View>
              </View>
            </View>

            <View style={styles.spacer} />
          </ScrollView>
        </KeyboardAvoidingView>

        {err && <Text style={styles.errorMsg}>{err.toString().toUpperCase()}</Text>}

        {/* Action Button Section */}
        <View style={styles.signupBtnContainer}>
          <Pressable
            onPress={handleSubmit}
            style={({ pressed }) => [pressed && { opacity: 0.8 }, styles.signupBtn]}
          >
            <Text style={styles.signUpBtntext}>CREATE ACCOUNT</Text>
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
  },
  heading: {
    paddingHorizontal: 24,
    paddingTop: 15,
    paddingBottom: 5,
  },
  headingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
  },
  headingText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.5,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  headingSubText: {
    paddingVertical: 6,
    color: 'rgba(255,255,255,0.3)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  keybAvdView: {
    flex: 1,
  },
  contentBody: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  scrollContent: {
    paddingVertical: 20,
  },
  itemContainer: {
    marginBottom: 14,
  },
  rowWrapper: {
    flexDirection: 'row', 
    gap: 12, 
    paddingHorizontal: 16,
  },
  inputContainer: {
    marginHorizontal: 16,
    marginTop: 6,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  rowInputContainer: {
    marginTop: 6,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputTextHeading: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 1.5,
    paddingStart: 18,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  inputField: {
    color: 'rgba(255, 255, 255, 0.59)',
    flex: 1,
    fontWeight: '700',
    paddingVertical: 14,
    paddingHorizontal: 10,
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  pickerText: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  validInput: {
    borderColor: 'rgba(10, 255, 202, 0.4)',
    backgroundColor: 'rgba(10, 255, 202, 0.02)',
  },
  invalidInput: {
    borderColor: 'rgba(239, 68, 68, 0.4)',
    backgroundColor: 'rgba(239, 68, 68, 0.03)',
  },
  genderRowContainer: {
    flexDirection: 'row', 
    paddingHorizontal: 16, 
    marginTop: 6, 
    gap: 12,
  },
  genderBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    flex: 1,
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    gap: 8,
  },
  genderBtnActiveMale: {
    backgroundColor: 'rgba(32, 74, 130, 0.3)',
    borderColor: 'rgba(52, 120, 210, 0.6)',
  },
  genderBtnActiveFemale: {
    backgroundColor: 'rgba(111, 58, 155, 0.3)',
    borderColor: 'rgba(170, 90, 230, 0.6)',
  },
  genderBtnText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  signupBtnContainer: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 20 : 30,
  },
  signupBtn: {
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  errorMsg: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    padding: 12,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 0.5,
    textAlign: 'center',
    color: "rgb(240, 100, 100)",
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  signUpBtntext: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  spacer: {
    height: 20,
  },
});

export default SignUp;