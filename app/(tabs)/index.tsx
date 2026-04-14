import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, MapPin, Bell } from 'lucide-react-native';
import { MOCK_POSTS } from '../../constants/data';
import PostCard from '../../components/PostCard';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: '#f8fafc' }]}>
      {/* 1. Custom Premium Header with Dynamic Safe Area Padding */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View>
          <Text style={styles.greeting}>Hardware Haven</Text>
          <View style={styles.locationRow}>
            <MapPin size={14} color="#FF5722" />
            <Text style={styles.locationText}>Abuja, Nigeria</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
          <Bell size={22} color="#1e293b" />
          {/* Optional: Small notification dot to look more "active" */}
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {/* 2. Simple Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#94a3b8" style={styles.searchIcon} />
        <TextInput 
          placeholder="Search hardware or technicians..." 
          style={styles.searchInput}
          placeholderTextColor="#94a3b8"
          cursorColor="#FF5722" // Premium touch: match the orange
        />
      </View>

      {/* 3. The Feed */}
      <FlatList
        data={MOCK_POSTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View style={styles.categoryContainer}>
            <Text style={styles.sectionTitle}>Featured in Abuja</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#fff', // Solid white header looks premium against gray background
  },
  greeting: { fontSize: 22, fontWeight: '800', color: '#0f172a', letterSpacing: -0.5 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  locationText: { fontSize: 13, color: '#64748b', fontWeight: '500' },
  iconButton: { 
    backgroundColor: '#f1f5f9', 
    padding: 10, 
    borderRadius: 12, 
    position: 'relative' 
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5722',
    borderWidth: 2,
    borderColor: '#f1f5f9',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 15,
    height: 52,
    // Subtle shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#1e293b' },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginBottom: 15 },
  categoryContainer: { marginTop: 5 },
});