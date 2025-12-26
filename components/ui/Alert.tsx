import { registerUser } from '@/db/user'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  Alert,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Animated,
  StatusBar,
  ActivityIndicator
} from 'react-native'
import { BlurView } from 'expo-blur'

const { height, width } = Dimensions.get('window')

const SignUp = () => {
  const router = useRouter()
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
    name: '',
    age: '',
    height: '',
    weight: '',
    gender: '',
  })

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    name: '',
    age: '',
    height: '',
    weight: '',
    gender: '',
  })

  const [touched, setTouched] = useState({
    email: false,
    password: false,
    name: false,
    age: false,
    height: false,
    weight: false,
    gender: false,
  })

  const [loading, setLoading] = useState(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertTitle, setAlertTitle] = useState('')

  const scrollY = new Animated.Value(0)
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [height * 0.3, 100],
    extrapolate: 'clamp',
  })

  const validateField = (fieldName, value) => {
    let error = ''

    switch (fieldName) {
      case 'email':
        if (!value.trim()) {
          error = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = 'Please enter a valid email'
        }
        break

      case 'password':
        if (!value.trim()) {
          error = 'Password is required'
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters'
        }
        break

      case 'name':
        if (!value.trim()) {
          error = 'Full name is required'
        } else if (value.trim().length < 2) {
          error = 'Please enter your full name'
        }
        break

      case 'age':
        if (!value.trim()) {
          error = 'Age is required'
        } else if (isNaN(value) || parseInt(value) <= 0 || parseInt(value) > 70) {
          error = 'Please enter a valid age (1-70)'
        }
        break

      case 'height':
        if (!value.trim()) {
          error = 'Height is required'
        } else if (isNaN(value) || parseInt(value) <= 0 || parseInt(value) > 300) {
          error = 'Please enter a valid height (1-300 cm)'
        }
        break

      case 'weight':
        if (!value.trim()) {
          error = 'Weight is required'
        } else if (isNaN(value) || parseInt(value) <= 0 || parseInt(value) > 300) {
          error = 'Please enter a valid weight (1-300 kg)'
        }
        break

      case 'gender':
        if (!value.trim()) {
          error = 'Please select your gender'
        }
        break

      default:
        break
    }

    return error
  }

  const handleInputChange = (fieldName: string, value: number | string) => {
    setUserInfo(prev => ({ ...prev, [fieldName]: value }))

    if (touched[fieldName]) {
      const error = validateField(fieldName, value)
      setErrors(prev => ({ ...prev, [fieldName]: error }))
    }
  }

  const handleBlur = (fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }))
    const error = validateField(fieldName, userInfo[fieldName])
    setErrors(prev => ({ ...prev, [fieldName]: error }))
  }

  const handleSubmit = async () => {
    Keyboard.dismiss()

    const allTouched = Object.keys(touched).reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {})
    setTouched(allTouched)

    const newErrors = {}
    Object.keys(userInfo).forEach(key => {
      newErrors[key] = validateField(key, userInfo[key])
    })
    setErrors(newErrors)

    const hasErrors = Object.values(newErrors).some(error => error !== '')

    if (hasErrors) {
      showCustomAlert('Incomplete Form', 'Please fill in all required fields correctly.')
      return
    }

    setLoading(true)
    
    try {
      const res = await registerUser(
        userInfo.email,
        userInfo.password,
        userInfo.name,
        parseInt(userInfo.age),
        parseInt(userInfo.height),
        parseInt(userInfo.weight),
        userInfo.gender
      )
      
      setLoading(false)
      showSuccessAlertCustom('Success!', res)
    } catch (err) {
      setLoading(false)
      showErrorAlertCustom('Registration Failed', err)
    }
  }

  const showCustomAlert = (title: string, message: string) => {
    setAlertTitle(title)
    setAlertMessage(message)
    setShowErrorAlert(true)
  }

  const showSuccessAlertCustom = (title: string, message: string) => {
    setAlertTitle(title)
    setAlertMessage(message)
    setShowSuccessAlert(true)
  }

  const showErrorAlertCustom = (title: string, message: string) => {
    setAlertTitle(title)
    setAlertMessage(message)
    setShowErrorAlert(true)
  }

  const CustomAlert = ({ type, visible, title, message, onClose, onAction }) => (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.alertOverlay}>
        <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="dark" />
        
        <Animated.View style={styles.alertContainer}>
          <LinearGradient
            colors={type === 'success' ? ['#667eea', '#764ba2'] : ['#FF416C', '#FF4B2B']}
            style={styles.alertHeader}
          >
            <View style={styles.alertIconContainer}>
              {type === 'success' ? (
                <Ionicons name="checkmark-circle" size={60} color="#FFF" />
              ) : (
                <Ionicons name="alert-circle" size={60} color="#FFF" />
              )}
            </View>
          </LinearGradient>

          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>{title}</Text>
            <Text style={styles.alertMessage}>{message}</Text>
            
            <View style={styles.alertActions}>
              {type === 'success' ? (
                <>
                  <TouchableOpacity 
                    style={styles.alertButtonSecondary}
                    onPress={() => {
                      onClose()
                      router.replace('/')
                    }}
                  >
                    <Text style={styles.alertButtonSecondaryText}>Continue to Home</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.alertButtonPrimary}
                    onPress={() => {
                      onClose()
                      router.replace('/')
                    }}
                  >
                    <LinearGradient
                      colors={['#667eea', '#764ba2']}
                      style={StyleSheet.absoluteFill}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    />
                    <Text style={styles.alertButtonPrimaryText}>Get Started</Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFF" />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity 
                    style={styles.alertButtonSecondary}
                    onPress={onClose}
                  >
                    <Text style={styles.alertButtonSecondaryText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.alertButtonPrimary}
                    onPress={() => {
                      onClose()
                      // Retry logic if needed
                    }}
                  >
                    <LinearGradient
                      colors={['#FF416C', '#FF4B2B']}
                      style={StyleSheet.absoluteFill}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    />
                    <Text style={styles.alertButtonPrimaryText}>Try Again</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header with Gradient */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <LinearGradient
          colors={['rgba(102, 126, 234, 0.9)', 'rgba(118, 75, 162, 0.8)']}
          style={StyleSheet.absoluteFill}
        />
        
        <BlurView intensity={80} style={styles.blurHeader} tint="dark">
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Create Account</Text>
            <Text style={styles.headerSubtitle}>Start your fitness journey today!</Text>
          </View>
        </BlurView>
      </Animated.View>

      {/* Main Content */}
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <LinearGradient
          colors={['#b2939337', '#bbff3d7b', '#6bcb786b','#4d96ff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.contentWrapper}
        >
          <View style={styles.content}>
            <View style={styles.formCard}>
              {/* Name Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Full Name <Text style={styles.required}>*</Text>
                </Text>
                <View style={[styles.inputContainer, errors.name && styles.inputError]}>
                  <Ionicons name="person-outline" size={20} color="#667eea" style={styles.inputIcon} />
                  <TextInput
                    placeholder='John Doe'
                    style={styles.input}
                    placeholderTextColor="rgba(102, 102, 102, 0.6)"
                    value={userInfo.name}
                    onChangeText={(value) => handleInputChange('name', value)}
                    onBlur={() => handleBlur('name')}
                    returnKeyType="next"
                  />
                </View>
                {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
              </View>

              {/* Age Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Age <Text style={styles.required}>*</Text>
                </Text>
                <View style={[styles.inputContainer, errors.age && styles.inputError]}>
                  <Ionicons name="calendar-outline" size={20} color="#667eea" style={styles.inputIcon} />
                  <TextInput
                    placeholder='25'
                    keyboardType='numeric'
                    style={styles.input}
                    value={userInfo.age}
                    onChangeText={(value) => handleInputChange('age', value)}
                    onBlur={() => handleBlur('age')}
                    placeholderTextColor="rgba(102, 102, 102, 0.6)"
                    returnKeyType="next"
                  />
                </View>
                {errors.age ? <Text style={styles.errorText}>{errors.age}</Text> : null}
              </View>

              {/* Height Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Height (cm) <Text style={styles.required}>*</Text>
                </Text>
                <View style={[styles.inputContainer, errors.height && styles.inputError]}>
                  <Ionicons name="resize-outline" size={20} color="#667eea" style={styles.inputIcon} />
                  <TextInput
                    placeholder='175'
                    keyboardType='numeric'
                    style={styles.input}
                    placeholderTextColor="rgba(102, 102, 102, 0.6)"
                    value={userInfo.height}
                    onChangeText={(value) => handleInputChange('height', value)}
                    onBlur={() => handleBlur('height')}
                    returnKeyType="next"
                  />
                </View>
                {errors.height ? <Text style={styles.errorText}>{errors.height}</Text> : null}
              </View>

              {/* Weight Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Weight (kg) <Text style={styles.required}>*</Text>
                </Text>
                <View style={[styles.inputContainer, errors.weight && styles.inputError]}>
                  <Ionicons name="speedometer-outline" size={20} color="#667eea" style={styles.inputIcon} />
                  <TextInput
                    placeholder='70'
                    keyboardType='numeric'
                    style={styles.input}
                    placeholderTextColor="rgba(102, 102, 102, 0.6)"
                    value={userInfo.weight}
                    onChangeText={(value) => handleInputChange('weight', value)}
                    onBlur={() => handleBlur('weight')}
                    returnKeyType="next"
                  />
                </View>
                {errors.weight ? <Text style={styles.errorText}>{errors.weight}</Text> : null}
              </View>

              {/* Gender Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Gender <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.genderContainer}>
                  <TouchableOpacity
                    style={[
                      styles.genderButton,
                      userInfo.gender === 'Male' && styles.genderSelected,
                      errors.gender && styles.genderError
                    ]}
                    onPress={() => {
                      handleInputChange('gender', 'Male')
                      setErrors(prev => ({ ...prev, gender: '' }))
                    }}
                  >
                    <LinearGradient
                      colors={userInfo.gender === 'Male' ? ['#667eea', '#764ba2'] : ['#FFF', '#FFF']}
                      style={styles.genderButtonInner}
                    >
                      <Text style={[
                        styles.genderText,
                        userInfo.gender === 'Male' && styles.genderTextSelected
                      ]}>Male</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.genderButton,
                      userInfo.gender === 'Female' && styles.genderSelected,
                      errors.gender && styles.genderError
                    ]}
                    onPress={() => {
                      handleInputChange('gender', 'Female')
                      setErrors(prev => ({ ...prev, gender: '' }))
                    }}
                  >
                    <LinearGradient
                      colors={userInfo.gender === 'Female' ? ['#667eea', '#764ba2'] : ['#FFF', '#FFF']}
                      style={styles.genderButtonInner}
                    >
                      <Text style={[
                        styles.genderText,
                        userInfo.gender === 'Female' && styles.genderTextSelected
                      ]}>Female</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
                {errors.gender ? <Text style={styles.errorText}>{errors.gender}</Text> : null}
              </View>

              {/* Email Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Email <Text style={styles.required}>*</Text>
                </Text>
                <View style={[styles.inputContainer, errors.email && styles.inputError]}>
                  <Ionicons name="mail-outline" size={20} color="#667eea" style={styles.inputIcon} />
                  <TextInput
                    placeholder='john@example.com'
                    keyboardType='email-address'
                    style={styles.input}
                    placeholderTextColor="rgba(102, 102, 102, 0.6)"
                    value={userInfo.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                    onBlur={() => handleBlur('email')}
                    autoCapitalize="none"
                    returnKeyType="next"
                  />
                </View>
                {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
              </View>

              {/* Password Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Password <Text style={styles.required}>*</Text>
                </Text>
                <View style={[styles.inputContainer, errors.password && styles.inputError]}>
                  <Ionicons name="lock-closed-outline" size={20} color="#667eea" style={styles.inputIcon} />
                  <TextInput
                    placeholder='••••••••'
                    secureTextEntry
                    style={styles.input}
                    placeholderTextColor="rgba(102, 102, 102, 0.6)"
                    value={userInfo.password}
                    onChangeText={(value) => handleInputChange('password', value)}
                    onBlur={() => handleBlur('password')}
                    returnKeyType="done"
                  />
                </View>
                {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
              </View>

              {/* Submit Button with Loading */}
              <TouchableOpacity
                style={[styles.buttonContainer, loading && styles.buttonDisabled]}
                onPress={handleSubmit}
                activeOpacity={0.9}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <>
                      <Ionicons name="checkmark-circle" size={24} color="#FFF" />
                      <Text style={styles.buttonText}>Create Account</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <Text style={styles.requiredNote}>
                <Text style={styles.required}>*</Text> Required fields
              </Text>

              {/* Loading Overlay */}
              {loading && (
                <View style={styles.loadingOverlay}>
                  <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="light" />
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#667eea" />
                    <Text style={styles.loadingText}>Creating your account...</Text>
                  </View>
                </View>
              )}
            </View>

            <View style={{ height: 50 }} />
          </View>
        </LinearGradient>
      </Animated.ScrollView>

      {/* Success Alert Modal */}
      <CustomAlert
        type="success"
        visible={showSuccessAlert}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setShowSuccessAlert(false)}
        onAction={() => router.replace('/')}
      />

      {/* Error Alert Modal */}
      <CustomAlert
        type="error"
        visible={showErrorAlert}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setShowErrorAlert(false)}
        onAction={() => {}}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: 'hidden',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  blurHeader: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
  scrollContent: {
    paddingTop: height * 0.3,
  },
  contentWrapper: {
    minHeight: height * 0.7,
  },
  content: {
    padding: 20,
  },
  formCard: {
    backgroundColor: '#FFF',
    borderRadius: 25,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 15,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginLeft: 5,
  },
  required: {
    color: '#FF416C',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  inputError: {
    borderColor: '#FF416C',
    backgroundColor: 'rgba(255, 65, 108, 0.05)',
  },
  inputIcon: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  input: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 16 : 14,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: '#FF416C',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
    fontWeight: '500',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  genderButton: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  genderSelected: {
    shadowColor: '#667eea',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  genderError: {
    borderWidth: 1,
    borderColor: '#FF416C',
  },
  genderButtonInner: {
    paddingVertical: Platform.OS === 'ios' ? 16 : 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  genderText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  genderTextSelected: {
    color: '#FFF',
    fontWeight: '700',
  },
  buttonContainer: {
    marginTop: 10,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  buttonDisabled: {
    opacity: 0.8,
  },
  buttonGradient: {
    paddingVertical: Platform.OS === 'ios' ? 18 : 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  requiredNote: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    padding: 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  // Alert Styles
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  alertContainer: {
    width: width * 0.85,
    backgroundColor: '#FFF',
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
  },
  alertHeader: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertContent: {
    padding: 30,
  },
  alertTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  alertMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
  },
  alertActions: {
    gap: 12,
  },
  alertButtonPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 15,
    overflow: 'hidden',
  },
  alertButtonPrimaryText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  alertButtonSecondary: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  alertButtonSecondaryText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
})

export default SignUp