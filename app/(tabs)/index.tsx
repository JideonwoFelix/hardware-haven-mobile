import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TextInput, 
  TouchableOpacity, ActivityIndicator, RefreshControl 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, MapPin, Bell, CloudOff } from 'lucide-react-native';
import PostCard from '../../components/PostCard';
import { Post } from '@/types';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  
  // 1. State Management
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  // 2. The API Call
  const fetchPosts = async () => {
    try {
      setError(false);
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      // console.log(apiUrl);
      const response = await fetch(`${apiUrl}/posts`);
      const json = await response.json();
      
      // Laravel API Resources wrap data in a 'data' key
      setPosts(json.data); 
    } catch (err) {
      console.error("API Fetch Error:", err);
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  return (
    <View style={[styles.container, { backgroundColor: '#f8fafc' }]}>
      {/* Header */}
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
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#94a3b8" style={styles.searchIcon} />
        <TextInput 
          placeholder="Search hardware or technicians..." 
          style={styles.searchInput}
          placeholderTextColor="#94a3b8"
          cursorColor="#FF5722"
        />
      </View>

      {/* 3. Conditional Rendering (Loading/Error/List) */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FF5722" />
          <Text style={styles.infoText}>Fetching Abuja Catalog...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <CloudOff size={48} color="#cbd5e1" />
          <Text style={styles.errorText}>Couldn&apos;t connect to server</Text>
          <TouchableOpacity onPress={fetchPosts} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <PostCard post={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF5722" />
          }
          ListHeaderComponent={() => (
            <View style={styles.categoryContainer}>
              <Text style={styles.sectionTitle}>Featured in Abuja</Text>
            </View>
          )}
          ListEmptyComponent={() => (
            <View style={styles.center}>
              <Text style={styles.infoText}>No hardware listed yet.</Text>
            </View>
          )}
        />
      )}
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
    backgroundColor: '#fff',
  },
  greeting: { fontSize: 22, fontWeight: '800', color: '#0f172a', letterSpacing: -0.5 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  locationText: { fontSize: 13, color: '#64748b', fontWeight: '500' },
  iconButton: { backgroundColor: '#f1f5f9', padding: 10, borderRadius: 12, position: 'relative' },
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#1e293b' },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginBottom: 15 },
  categoryContainer: { marginTop: 5 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  infoText: { marginTop: 10, color: '#64748b', fontSize: 14 },
  errorText: { marginTop: 10, color: '#ef4444', fontWeight: '600' },
  retryButton: { marginTop: 20, backgroundColor: '#FF5722', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  retryText: { color: '#fff', fontWeight: '700' }
});