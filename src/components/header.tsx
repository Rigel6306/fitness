import { Colors } from '@/constants/Colors';
import { useUserDataContext } from '@/hooks/useContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { cardBackground, textPimary, textSecondary } = Colors;

const Header = () => {
  const { userData } = useUserDataContext();

  return (
    <View style={styles.container}>
      
      {/* LEFT: Admin User Identification Profile Group */}
      <View style={styles.profileGroup}>
        {/* Placeholder Avatar Icon matching high-end dashboards */}
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>
            {userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
        
        <View style={styles.metaTextColumn}>
          <Text style={styles.greetingText}>WELCOME BACK</Text>
          <Text style={styles.userNameText}>{userData?.name || 'User'}</Text>
        </View>
      </View>

      {/* RIGHT: Admin System Utility Controls */}
      <View style={styles.controlsGroup}>
        {/* System Settings Action Target */}
        <TouchableOpacity style={styles.iconActionButton} activeOpacity={0.7}>
          <Ionicons name="settings-outline" size={20} color="#ffffff" />
        </TouchableOpacity>
        
        {/* System Notifications Action Target with active structural indicator badge */}
        <TouchableOpacity style={styles.iconActionButton} activeOpacity={0.7}>
          <Ionicons name="notifications-outline" size={20} color="#ffffff" />
          <View style={styles.activeNotificationBadge} />
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 64, // Precise industry standard layout height for dashboard header rows
    backgroundColor: '#1e1e2484', // Swapped out dirty #131313 for a clean Windows Admin Charcoal
    paddingHorizontal: 16,
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 16, // Low border radius matching your geometric flat tiles style
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)', // Crisp layout border line separating panel depths
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  profileGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 36, // Geometric admin avatar frame styling
    backgroundColor: '#218d9547', // Windows 10 default primary identification core color
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  metaTextColumn: {
    justifyContent: 'center',
  },
  greetingText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8a8a93', // Muted secondary text
    letterSpacing: 1,
  },
  userNameText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 1,
  },
  controlsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconActionButton: {
    width: 36,
    height: 36,
    borderRadius: 36,
    backgroundColor: 'rgba(38, 181, 133, 0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  activeNotificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff3b30', // Urgent metric indicator mark
    borderWidth: 1.5,
    borderColor: '#1e1e24', // Prevents bleeding with matching container background color
  },
});

export default Header;