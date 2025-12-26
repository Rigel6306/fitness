
import CustomAlert from '@/components/ui/alertCopy'
import { registerUser } from '@/db/user'
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  ActivityIndicator,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'

const { height, width } = Dimensions.get('window')
const router = useRouter()
const SignUp = () => {


  const [isLoading, setIsloading] = useState(false)
  const [alertTitle,setAlertTitle] = useState('')
  const [alertMessage,setAlertMessage] = useState('')
  const [showErrorAlert,setShowErrorAlert]= useState(false)
  const [showSuccessAlert,setShowSuccessAlert] = useState(false)
    
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

    // Validate user inputs
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
  
    // Mark touched fields
    const allTouched = Object.keys(touched).reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {})
    setTouched(allTouched)

    // Validate all fields
    const newErrors = {}
    Object.keys(userInfo).forEach(key => {
      newErrors[key] = validateField(key, userInfo[key])
    })
    setErrors(newErrors)

    // Form Error Checking
    const hasErrors = Object.values(newErrors).some(error => error !== '')

    if (hasErrors) {
      setAlertTitle('Incomplete Form')
      setAlertMessage('Please fill in all required fields correctly.')
      setShowErrorAlert(true)
      
    } else {
      setIsloading(true)
      registerUser(userInfo.email,
        userInfo.password,
        userInfo.name,
        parseInt(userInfo.age),
        parseInt(userInfo.height),
        parseInt(userInfo.weight),
        userInfo.gender)
        .then(res => {
          setIsloading(false)
          setAlertTitle('Greetings')
          setAlertMessage('Account has been Created Successfully')
          setShowSuccessAlert(true)
          
         }).catch(err => {
          setIsloading(false)
          setAlertTitle('Something is Wrong!')
          setAlertMessage(err.message)
          setShowErrorAlert(true)
          
        })

    }
  }

  return (
    <LinearGradient
      colors={['#0f0c29', '#302b63', '#24243e']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Start your fitness journey today!</Text>
            </View>
            {/* Name */}
            <View style={styles.formCard}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Full Name <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  placeholder='Moda Tharindu'
                  style={[styles.input, errors.name && styles.inputError]}
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={userInfo.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                  onBlur={() => handleBlur('name')}
                  returnKeyType="next"
                />
                {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
              </View>

              {/* Age */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Age <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  placeholder='25'
                  keyboardType='numeric'
                  style={[styles.input, errors.age && styles.inputError]}
                  value={userInfo.age}
                  onChangeText={(value) => handleInputChange('age', value)}
                  onBlur={() => handleBlur('age')}
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  returnKeyType="next"
                />
                {errors.age ? <Text style={styles.errorText}>{errors.age}</Text> : null}
              </View>

              {/* Height */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Height (cm) <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  placeholder='175'
                  keyboardType='numeric'
                  style={[styles.input, errors.height && styles.inputError]}
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={userInfo.height}
                  onChangeText={(value) => handleInputChange('height', value)}
                  onBlur={() => handleBlur('height')}
                  returnKeyType="next"
                />
                {errors.height ? <Text style={styles.errorText}>{errors.height}</Text> : null}
              </View>

              {/* Weight */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Weight (kg) <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  placeholder='70'
                  keyboardType='numeric'
                  style={[styles.input, errors.weight && styles.inputError]}
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={userInfo.weight}
                  onChangeText={(value) => handleInputChange('weight', value)}
                  onBlur={() => handleBlur('weight')}
                  returnKeyType="next"
                />
                {errors.weight ? <Text style={styles.errorText}>{errors.weight}</Text> : null}
              </View>

              {/* Gender */}
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
                      colors={userInfo.gender === 'Male' ? ['#FF416C', '#FF4B2B'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
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
                      colors={userInfo.gender === 'Female' ? ['#FF416C', '#FF4B2B'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
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

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Email <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  placeholder='john@example.com'
                  keyboardType='email-address'
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={userInfo.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  onBlur={() => handleBlur('email')}
                  autoCapitalize="none"
                  returnKeyType="next"
                />
                {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Password <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  placeholder='••••••••'
                  secureTextEntry
                  style={[styles.input, errors.password && styles.inputError]}
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={userInfo.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  onBlur={() => handleBlur('password')}
                  returnKeyType="done"
                />
                {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
              </View>

              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={handleSubmit}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#FF416C', '#FF4B2B']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.buttonText}>Create Account</Text>
                </LinearGradient>
              </TouchableOpacity>

              <Text style={styles.requiredNote}>
                <Text style={styles.required}>*</Text> Required fields
              </Text>
            </View>
          
            <View style={{ height: 50 }} />


          </View>

        </ScrollView>
 
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
      </KeyboardAvoidingView>

       {isLoading && (
              <View style={styles.loadingOverlay}>
                <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="light" />
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#667eea" />
                  <Text style={styles.loadingText}>Creating your account...</Text>
                </View>
              </View>
            )}

    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  formCard: {
    width: width * 0.9,

    borderRadius: 25,
    paddingHorizontal: 25,
    paddingVertical: 30,
    marginTop: 10,

    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,

  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 5,
  },
  required: {
    color: '#FF416C',
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: Platform.OS === 'ios' ? 16 : 14,
    paddingHorizontal: 20,
    borderRadius: 15,
    color: "#fff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: '#FF416C',
    backgroundColor: 'rgba(255, 65, 108, 0.1)',
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
  },
  genderButtonInner: {
    paddingVertical: Platform.OS === 'ios' ? 16 : 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderSelected: {
    shadowColor: '#FF416C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 5,
  },
  genderError: {
    borderWidth: 1,
    borderColor: '#FF416C',
  },
  genderText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    fontWeight: '600',
  },
  genderTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  buttonContainer: {
    marginTop: 30,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#FF416C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonGradient: {
    paddingVertical: Platform.OS === 'ios' ? 18 : 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  requiredNote: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
  },
    loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(111, 108, 108, 0.8)',
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
})

export default SignUp