import { useLocalSearchParams, Stack } from 'expo-router';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import { useState, useEffect } from 'react';
import { MapPin, Phone, MessageCircle, Share2, ShieldCheck } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Post } from '../../types';

export default function PostDetail() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const apiUrl = process.env.EXPO_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/posts/${id}`);
        const json = await response.json();
        setPost(json.data);
      } catch (error) {
        console.error("Error fetching detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetail();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF5722" />
      </View>
    );
  }

  if (!post) return <View style={styles.center}><Text>Hardware not found</Text></View>;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        title: post.category, 
        headerRight: () => <TouchableOpacity><Share2 size={20} color="#1e293b" /></TouchableOpacity> 
      }} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: post.image }} style={styles.image} />
        
        <View style={styles.content}>
          {/* 1. Header Info */}
          <View style={styles.headerRow}>
            <Text style={styles.price}>{post.price}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{post.category}</Text>
            </View>
          </View>

          <Text style={styles.title}>{post.title}</Text>

          <View style={styles.locationRow}>
            <MapPin size={16} color="#64748b" />
            <Text style={styles.locationText}>{post.location}, Abuja</Text>
          </View>

          <View style={styles.divider} />

          {/* 2. Technician / Shop Card */}
          <View style={styles.techCard}>
            <View style={styles.techInfo}>
              <Text style={styles.techName}>{post.technician.name}</Text>
              <Text style={styles.shopName}>{post.technician.shop}</Text>
            </View>
            <ShieldCheck size={24} color="#16a34a" />
          </View>

          <View style={styles.divider} />

          {/* 3. Description */}
          <Text style={styles.sectionLabel}>Description</Text>
          <Text style={styles.description}>{post.description}</Text>
          
          <View style={{ height: 100 }} /> 
        </View>
      </ScrollView>

      {/* 4. Fixed Action Bar */}
      <View style={[styles.actionBar, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity 
          style={styles.callButton} 
          onPress={() => Linking.openURL('tel:0800000000')}>
          <Phone size={20} color="#1e293b" />
          <Text style={styles.callText}>Call</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.chatButton}
          onPress={() => Linking.openURL(`https://wa.me/234800000000?text=Hi, I am interested in the ${post.title}`)}>
          <MessageCircle size={20} color="#fff" />
          <Text style={styles.chatText}>WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: 320 },
  content: { padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  price: { fontSize: 28, fontWeight: '800', color: '#16a34a' },
  badge: { backgroundColor: '#fff7ed', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  badgeText: { color: '#FF5722', fontWeight: 'bold', fontSize: 12 },
  title: { fontSize: 22, fontWeight: '700', color: '#0f172a', marginBottom: 8 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 20 },
  locationText: { color: '#64748b', fontSize: 14 },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 20 },
  techCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 12
  },
  techInfo: {
    flex: 1, // Ensures the text container takes up available space
    justifyContent: 'center',
  },
  techName: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  shopName: { fontSize: 13, color: '#64748b' },
  sectionLabel: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 10 },
  description: { fontSize: 16, lineHeight: 24, color: '#334155' },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 20,
    gap: 15,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    elevation: 10,
  },
  callButton: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8, 
    height: 54, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#e2e8f0' 
  },
  callText: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  chatButton: { 
    flex: 2, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8, 
    height: 54, 
    borderRadius: 12, 
    backgroundColor: '#FF5722' 
  },
  chatText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});