import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings, User, ShieldCheck, Briefcase, LogOut, ChevronRight } from 'lucide-react-native';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  const MenuOption = ({ icon: Icon, title, subtitle }) => (
    <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
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

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      {/* 1. Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarPlaceholder}>JF</Text>
        </View>
        <Text style={styles.userName}>Jideonwo Felix</Text>
        <Text style={styles.userRole}>MD, THOTH Technologies</Text>
        <View style={styles.badge}>
          <ShieldCheck size={14} color="#16a34a" />
          <Text style={styles.badgeText}>Verified Technician</Text>
        </View>
      </View>

      {/* 2. Stats Section */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Active Posts</Text>
        </View>
        <View style={[styles.statBox, styles.statBorder]}>
          <Text style={styles.statNumber}>4.9</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>

      {/* 3. Menu Options */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionLabel}>Business Management</Text>
        <MenuOption icon={Briefcase} title="Shop Settings" subtitle="Abuja Branch & Salon" />
        <MenuOption icon={User} title="Personal Details" />
        <MenuOption icon={Settings} title="App Preferences" />
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <LogOut size={20} color="#ef4444" />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
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