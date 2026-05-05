import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LucideIcon, Settings, User, ShieldCheck, Briefcase, LogOut, ChevronRight } from 'lucide-react-native';
import { useAuth } from "@/context/AuthContext";
import { useState } from 'react';
import { useRouter } from 'expo-router';
import UpdateProfileModal from '@/components/update-profile-modal';

interface MenuOptionProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  onPress?: () => void;
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout, token, updateUser } = useAuth(); // Get user from context
  const [isUpdating, setIsUpdating] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  

  const MenuOption = ({ icon: Icon, title, subtitle, onPress }: MenuOptionProps) => (
    <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.menuIconContainer}>
        <Icon size={20} color="#FF5722" />
      </View>
      <View style={styles.menuTextContainer}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <ChevronRight size={18} color="#cbd5e1" />
    </TouchableOpacity>
  );

  // Function to initials (e.g., Felix Jideonwo -> FJ)
  const getInitials = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '??';
  };

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: user.name, // In a real edit page, these would be from a local useState form
          email: user.email,
          shop_name: "Updated Shop Name" 
        })
      });

      const data = await response.json();
      if (response.ok) {
        updateUser(data.user); // Update global state
        Alert.alert("Success", "Profile Updated");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarPlaceholder}>{getInitials(user?.name)}</Text>
        </View>
        
        {/* Real Dynamic Data */}
        <Text style={styles.userName}>{user?.name || 'Technician'}</Text>
        <Text style={styles.userRole}>{user?.shop_name || 'Independent Tech'}</Text>
        
        <View style={styles.badge}>
          <ShieldCheck size={14} color="#16a34a" />
          <Text style={styles.badgeText}>Verified {user?.role || 'User'}</Text>
        </View>
      </View>

      {/* Rest of your UI... */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionLabel}>Business Management</Text>
        
        {/* UPDATE THIS LINE */}
        <MenuOption 
          icon={User} 
          title="Personal Details" 
          subtitle="Edit your name and shop"
          onPress={() => setModalVisible(true)} 
        />
        
        <MenuOption icon={Briefcase} title="Shop Settings" />
        <MenuOption icon={Settings} title="App Preferences" />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <LogOut size={20} color="#ef4444" />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      <UpdateProfileModal isVisible={isModalVisible} onClose={() => setModalVisible(false)} updateUser={handleUpdateProfile} user={user} token={token} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { alignItems: 'center', paddingVertical: 30, backgroundColor: '#fff' },
  avatarContainer: { 
    width: 80, height: 80, borderRadius: 40, 
    backgroundColor: '#FF5722', justifyContent: 'center', alignItems: 'center',
    marginBottom: 15, elevation: 4, shadowColor: '#FF5722', shadowOpacity: 0.3, shadowRadius: 10
  },
  avatarPlaceholder: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  userName: { fontSize: 22, fontWeight: '800', color: '#0f172a' },
  userRole: { fontSize: 14, color: '#64748b', marginTop: 4 },
  badge: { 
    flexDirection: 'row', alignItems: 'center', gap: 4, 
    backgroundColor: '#f0fdf4', paddingHorizontal: 10, paddingVertical: 4, 
    borderRadius: 20, marginTop: 12 
  },
  badgeText: { color: '#16a34a', fontSize: 12, fontWeight: '700' },
  statsRow: { flexDirection: 'row', backgroundColor: '#fff', paddingVertical: 20, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  statBox: { flex: 1, alignItems: 'center' },
  statBorder: { borderLeftWidth: 1, borderLeftColor: '#f1f5f9' },
  statNumber: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  statLabel: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  menuSection: { marginTop: 20, paddingHorizontal: 20 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 10, marginLeft: 5 },
  menuItem: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', 
    padding: 15, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: '#f1f5f9' 
  },
  menuIconContainer: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#fff7ed', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  menuTextContainer: { flex: 1 },
  menuTitle: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  menuSubtitle: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  logoutButton: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', 
    gap: 8, marginTop: 40, marginBottom: 60 
  },
  logoutText: { color: '#ef4444', fontWeight: '700', fontSize: 16 },
});