import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React from 'react'
import {
    Animated,
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'

const { height, width } = Dimensions.get('window')

   const router = useRouter()
 

 
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
                      onAction()
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

const styles = StyleSheet.create({
  
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

export default CustomAlert