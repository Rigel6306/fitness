import { Link, useNavigation } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useUserDataContext } from '../hooks/useContext';
import { auth } from "../services/firebase";
const { width, height } = Dimensions.get('screen')
const Login = () => {

  const {userId,setUserId} = useUserDataContext()
  const navigator = useNavigation();
  // const [initializing, setInitializing] = useState(true);
  // const [user, setUser] = useState();
  const [userCredentials, setUserCredentials] = useState({
    email: null,
    password: null,
  });

  // const onAuthChanged = user=>{
  //   setUser(user)
  //   if (initializing) setInitializing(false);
  // }
  // useEffect(()=>{
  //   const subscriber = auth.onAuthStateChanged(onAuthChanged);
  //   return subscriber;
  // },[])

  // if(!initializing&&user) navigator.navigate('(tabs)')

  // useFocusEffect(
  //   React.useCallback(() => {
  //     const onBackPress = () => {
  //       Alert.alert(
  //         'About to Exit',
  //         'Are you sure you want to exit?',
  //         [
  //           {
  //             text: 'Cancel',
  //             onPress: () => null,
  //             style: 'cancel',
  //           },
  //           { text: 'YES', onPress: () =>BackHandler.exitApp()},
  //         ]
  //       );
  //       return true;
  //     };

  //     BackHandler.addEventListener('hardwareBackPress', onBackPress);


  //   }, [])
  // );



  const [error, setError] = useState(null);

  const signIn = async () => {

    setError(null)

    try {

      const userData = await signInWithEmailAndPassword(
        auth,
        userCredentials.email,
        userCredentials.password
      )
      setUserCredentials({
        email: null,
        password: null,
      })
      const user = userData.user
      setUserId(user.uid)
      navigator.navigate("(tabs)");
    } catch (err) {
      console.log(err);
      setError("Login Error, Please Check Your Email And Password and Retry");
    }



  };
  const handlePress = () => {
    // navigator.navigate("(tabs)");
    signIn();
  };

  const handelValues = (property, value) => {
    setError(null)
    setUserCredentials(() => ({ ...userCredentials, [property]: value }));
  };

  return (
    <ImageBackground
      style={style.image}
      source={require("../assets/images/bckimg5.jpg")}
    >
      <View style={style.container}>
        <View style={style.loginContainer}>
          <Text style={style.header}>Welcome Back</Text>
          <TextInput
            keyboardType="email-address"
            placeholder="Enter Your E-Mail Address"
            style={style.input}
            value={userCredentials.email}
            onChangeText={(value) => {
              handelValues("email", value);
            }}
          />
          <TextInput
            placeholder="Enter Your Password"
            secureTextEntry={true}
            style={style.input}
            value={userCredentials.password}
            onChangeText={(value) => {
              handelValues("password", value);
            }}
          />

          <TouchableOpacity onPress={handlePress} style={style.submit}>
            <Text>Log In</Text>
          </TouchableOpacity>

          {error && <Text style={style.errTxt}>Please check your Email or Password and try again</Text>}
          <View style={style.optionContaier}>
            <Link href={"forgetPassword"} asChild>
              <TouchableOpacity style={style.optionBtn}>
                <Text>Forgot Password</Text>
              </TouchableOpacity>
            </Link>

            <Link href={"signup"} asChild>
              <TouchableOpacity
                style={style.optionBtn}
              >
                <Text>SignUp</Text>
              </TouchableOpacity>
            </Link>
          </View>

        </View>

      </View>

      {/* <Button title="Press" onPress={handlePress}> </Button> */}
    </ImageBackground>
  );
};
const style = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    textAlign: "center",
    fontSize: 25,
  },
  image: {
    height: "100%",
    width: "100%",
    flex: 1,
    resizeMode: "cover",
  },
  loginContainer: {
    flex: 1,
    alignItems: "center",
    width: width - 10,
    maxHeight: 400,
    backgroundColor: "rgba(248, 245, 246, 0.69)",
    padding: 10,
    borderRadius: 25,
    shadowColor: "green",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },
  input: {
    textAlign: "center",
    width: 100,
    backgroundColor: "rgba(136, 190, 231, 0.8)",
    width: 300,
    margin: 10,
    padding: 10,
    borderRadius: 35,
  },
  submit: {
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    height: 40,
    backgroundColor: "rgba(136, 231, 162, 0.8)",
    borderRadius: 10,
    margin: 10,
  },
  optionContaier: {
    flex: 1,
    marginTop: 30,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 140,
  },
  optionBtn: {
    margin: 10,
    padding: 10,
    backgroundColor: 'rgba(160, 173, 168, 0.33)',
    borderRadius: 15,
    maxWidth: 200,
    alignItems: 'center',
    height: 40,
  },
  errTxt: {
    fontFamily: 'Protest',
    color: 'crimson'
  }
});

export default Login;
