import React, { useState } from 'react'
import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

const { height, width } = Dimensions.get('screen')

const SignUp = () => {
  const [gender, setGender] = useState(null)

  return (
    <View style={Styles.container}>
      <Text style={Styles.title}>Sign Up</Text>
      <Text style={Styles.subtitle}>Start your fitness journey today!</Text>

      <TextInput 
        placeholder='Full Name'
        style={Styles.input}
        placeholderTextColor="#ddd"
      />
      <TextInput 
        placeholder='Age'
        keyboardType='numeric'
        style={Styles.input}
        placeholderTextColor="#ddd"
      />
      <TextInput 
        placeholder='Height (cm)'
        keyboardType='numeric'
        style={Styles.input}
        placeholderTextColor="#ddd"
      />
      <TextInput 
        placeholder='Weight (kg)'
        keyboardType='numeric'
        style={Styles.input}
        placeholderTextColor="#ddd"
      />

      
      <Text style={Styles.label}>Select Gender</Text>
      <View style={Styles.genderContainer}>
        <TouchableOpacity 
          style={[Styles.genderButton, gender === 'Male' && Styles.genderSelected]} 
          onPress={() => setGender('Male')}
        >
          <Text style={Styles.genderText}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[Styles.genderButton, gender === 'Female' && Styles.genderSelected]} 
          onPress={() => setGender('Female')}
        >
          <Text style={Styles.genderText}>Female</Text>
        </TouchableOpacity>
      </View>

      <TextInput 
        placeholder='Email'
        keyboardType='email-address'
        style={Styles.input}
        placeholderTextColor="#ddd"
      />
      <TextInput 
        placeholder='Password'
        secureTextEntry
        style={Styles.input}
        placeholderTextColor="#ddd"
      />

      <TouchableOpacity style={Styles.button}>
        <Text style={Styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  )
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 20,
  },
  input: {
    textAlign: "center",
    width: width * 0.8,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginVertical: 8,
    padding: 12,
    borderRadius: 25,
    color: "#fff",
    fontSize: 16,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginTop: 15,
    marginBottom: 8,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width * 0.8,
    marginBottom: 15,
  },
  genderButton: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 25,
    alignItems: 'center',
  },
  genderSelected: {
    backgroundColor: '#e63946', // highlight selected
  },
  genderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#e63946',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  }
})

export default SignUp
