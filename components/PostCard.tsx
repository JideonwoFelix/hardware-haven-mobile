import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { MapPin, User } from 'lucide-react-native';
import { Post } from '../constants/data';

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link href={{ pathname: "/post/[id]", params: { id: post.id } }} asChild>
      <Pressable style={styles.card}>
        <Image source={{ uri: post.image }} style={styles.image} />
        
        <View style={styles.content}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{post.category}</Text>
          </View>
          
          <Text style={styles.title} numberOfLines={2}>{post.title}</Text>
          
          {post.price && <Text style={styles.price}>{post.price}</Text>}

          <View style={styles.footer}>
            <View style={styles.row}>
              <MapPin size={14} color="#666" />
              <Text style={styles.footerText}>{post.location}</Text>
            </View>
            <View style={styles.row}>
              <User size={14} color="#666" />
              <Text style={styles.footerText}>{post.author}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    // Android Shadow
    elevation: 3,
    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: { width: '100%', height: 160 },
  content: { padding: 12 },
  badge: { 
    backgroundColor: '#E3F2FD', 
    alignSelf: 'flex-start', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 4,
    marginBottom: 8 
  },
  badgeText: { color: '#1976D2', fontSize: 12, fontWeight: 'bold' },
  title: { fontSize: 18, fontWeight: '600', color: '#1A1A1A', marginBottom: 4 },
  price: { fontSize: 16, fontWeight: '700', color: '#2E7D32', marginBottom: 8 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, borderTopWidth: 0.5, borderTopColor: '#EEE', paddingTop: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  footerText: { fontSize: 12, color: '#666' },
});