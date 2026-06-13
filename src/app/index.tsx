import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Link, useNavigation } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  Dimensions,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useUserDataContext } from '../hooks/useContext';
import { auth } from "../services/firebase";

const { width } = Dimensions.get('window');

const Login = () => {
  const { userData, setUserData } = useUserDataContext();
  const navigator = useNavigation();

  const [userCredentials, setUserCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);

  const signIn = async () => {
    setError(null);
    if (!userCredentials.email || !userCredentials.password) {
      setError("PLEASE ENTER BOTH EMAIL AND PASSWORD.");
      return;
    }

    try {
      const response = await signInWithEmailAndPassword(
        auth,
        userCredentials.email.trim(),
        userCredentials.password
      );
      
      setUserCredentials({
        email: '',
        password: '',
      });
      
      const user = response.user;
      setUserData(user.uid);
      
      // Navigate to main tabs platform layout
      navigator.navigate("(tabs)");
    } catch (err) {
      console.log(err);
      setError("LOGIN ERROR. PLEASE CHECK YOUR CREDENTIALS AND RETRY.");
    }
  };

  const handlePress = () => {
    Keyboard.dismiss();
    signIn();
  };

  const handleValues = (property: 'email' | 'password', value: string) => {
    setError(null);
    setUserCredentials((prev) => ({ ...prev, [property]: value }));
  };

  return (
    <ImageBackground
      style={styles.imageBackground}
      source={require("../../assets/images/cardsImg/card2.jpg")}
      blurRadius={Platform.OS === 'ios' ? 8 : 4} // Ambient structural backdrop soften blur
    >
      {/* Translucent black tint cover layer */}
      <View style={styles.darkOverlay} />

      <SafeAreaView style={styles.viewportContainer}>
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          
        >
          <ScrollView
            style={styles.scrollCanvas}
            contentContainerStyle={styles.scrollContent}
            bounces={false}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onScrollBeginDrag={Keyboard.dismiss}
          >
            
            {/* Top Identity Block */}
            <View style={styles.brandContainer}>
             
              <Text style={styles.brandTitle}>WELCOME BACK</Text>
              <Text style={styles.brandSubtitle}>LET'S BEGIN THE HARD WORK</Text>
            </View>

            {/* Central Glassmorphic Console Panel */}
            <View style={styles.consoleCard}>
              
              {/* Email Control Block */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>E-MAIL ADDRESS</Text>
                <View style={styles.inputWrapper}>
                  <MaterialCommunityIcons name="email-outline" size={20} color="rgba(255, 255, 255, 0.4)" />
                  <TextInput
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="ENTER YOUR E-MAIL"
                    placeholderTextColor="rgba(255, 255, 255, 0.2)"
                    style={styles.textInput}
                    value={userCredentials.email || ''}
                    onChangeText={(value) => handleValues("email", value)}
                  />
                </View>
              </View>

              {/* Password Control Block */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>PASSWORD</Text>
                <View style={styles.inputWrapper}>
                  <MaterialCommunityIcons name="lock-outline" size={20} color="rgba(255, 255, 255, 0.4)" />
                  <TextInput
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="ENTER YOUR PASSWORD"
                    placeholderTextColor="rgba(255, 255, 255, 0.2)"
                    style={styles.textInput}
                    value={userCredentials.password || ''}
                    onChangeText={(value) => handleValues("password", value)}
                  />
                </View>
              </View>

              {/* Console Action Execution Button */}
              <Pressable
                onPress={handlePress}
                style={({ pressed }) => [pressed && { opacity: 0.85 }, styles.primaryButton]}
              >
                <Text style={styles.primaryButtonText}>SIGN IN</Text>
              </Pressable>

              {/* Handled Terminal Feedback Message Block */}
              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* Horizontal Split Rule separator line */}
              <View style={styles.dividerLine} />

              {/* System Navigation Anchors Row */}
              <View style={styles.actionLinksRow}>
                <Link href={"forgetPassword"} asChild>
                  <Pressable style={({ pressed }) => [pressed && { opacity: 0.6 }, styles.secondaryAnchor]}>
                    <Text style={styles.anchorText}>FORGOT PASSWORD</Text>
                  </Pressable>
                </Link>

                <Link href={"/signup"} asChild>
                  <Pressable style={({ pressed }) => [pressed && { opacity: 0.6 }, styles.secondaryAnchor]}>
                    <Text style={[styles.anchorText, { color: '#0affca' }]}>SIGN UP</Text>
                  </Pressable>
                </Link>
              </View>

            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  darkOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.01)',
  },
  viewportContainer: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollCanvas: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
 
  brandTitle: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  brandSubtitle: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 6,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  consoleCard: {
    width: '100%',
    backgroundColor: 'rgba(8, 8, 8, 0.81)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    color: 'rgb(255, 255, 255)',
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 1.5,
    paddingLeft: 4,
    marginBottom: 6,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.34)',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
  },
  textInput: {
    flex: 1,
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
    paddingLeft: 12,
    height: '100%',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  primaryButton: {
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  errorContainer: {
    marginTop: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    borderRadius: 10,
    padding: 12,
  },
  errorText: {
    color: 'rgb(240, 100, 100)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  dividerLine: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: 24,
  },
  actionLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  secondaryAnchor: {
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  anchorText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
});

export default Login;