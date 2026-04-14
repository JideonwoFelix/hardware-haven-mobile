import { useLocalSearchParams, Stack } from 'expo-router';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { MOCK_POSTS } from '../../constants/data';

export default function PostDetail() {
  const { id } = useLocalSearchParams();
  const post = MOCK_POSTS.find((p) => p.id === id);

  if (!post) return <Text>Post not found</Text>;

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: 'Details', headerBackTitle: 'Back' }} />
      <Image source={{ uri: post.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.price}>{post.price}</Text>
        <Text style={styles.description}>{post.description}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: { width: '100%', height: 250 },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  price: { fontSize: 20, color: 'green', marginVertical: 10 },
  description: { fontSize: 16, lineHeight: 24, color: '#444' }
});