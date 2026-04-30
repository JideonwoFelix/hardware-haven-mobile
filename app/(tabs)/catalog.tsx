import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  TextInput, ActivityIndicator, Alert, ScrollView 
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { PackageSearch, Plus, List, Save, Trash2 } from 'lucide-react-native';
import PostCard from '@/components/PostCard'; // Reuse your existing card
import { Post } from '@/types';

export default function CatalogScreen() {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'view' | 'add'>('view');
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  // Form State for Adding Post
  const [form, setForm] = useState({
    title: '',
    category: 'Laptop',
    price: '',
    location: 'Banex Plaza',
    description: ''
  });

  // 1. Fetch Technician's specific posts
  const fetchMyPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/posts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log(response);
      const json = await response.json();
      setMyPosts(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (activeTab === 'view') fetchMyPosts(); }, [activeTab]);

  // 2. Handle Add Post
  const handleAddPost = async () => {
    if (!form.title || !form.price) return Alert.alert("Required", "Title and Price are mandatory.");

    setLoading(true);
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/posts`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        Alert.alert("Success", "Hardware listed in Hardware Haven!");
        setActiveTab('view');
        setForm({ title: '', category: 'Laptop', price: '', location: 'Banex Plaza', description: '' });
      }
    } catch (e) {
      Alert.alert("Error", "Could not save post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'view' && styles.activeTab]} 
          onPress={() => setActiveTab('view')}
        >
          <List size={20} color={activeTab === 'view' ? '#FF5722' : '#64748b'} />
          <Text style={[styles.tabText, activeTab === 'view' && styles.activeTabText]}>My Items</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'add' && styles.activeTab]} 
          onPress={() => setActiveTab('add')}
        >
          <Plus size={20} color={activeTab === 'add' ? '#FF5722' : '#64748b'} />
          <Text style={[styles.tabText, activeTab === 'add' && styles.activeTabText]}>Add New</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'view' ? (
        loading ? (
          <ActivityIndicator style={{ marginTop: 50 }} color="#FF5722" />
        ) : (
          <FlatList
            data={myPosts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <PostCard post={item} />}
            ListEmptyComponent={() => (
              <View style={styles.empty}>
                <PackageSearch size={48} color="#cbd5e1" />
                <Text style={styles.emptyText}>You haven&apos;t listed any items yet.</Text>
              </View>
            )}
            contentContainerStyle={{ padding: 20 }}
          />
        )
      ) : (
        <ScrollView contentContainerStyle={styles.formContent}>
          <Text style={styles.label}>Hardware Title</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g. Clean MacBook Pro M1" 
            onChangeText={(v) => setForm({...form, title: v})}
          />

          <Text style={styles.label}>Price (₦)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="500000" 
            keyboardType="numeric"
            onChangeText={(v) => setForm({...form, price: v})}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput 
            style={[styles.input, { height: 100 }]} 
            placeholder="Details about condition, warranty, etc." 
            multiline
            onChangeText={(v) => setForm({...form, description: v})}
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleAddPost} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : (
              <>
                <Save size={20} color="#fff" />
                <Text style={styles.submitBtnText}>Post to Marketplace</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  tabBar: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, gap: 8 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#FF5722' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
  activeTabText: { color: '#FF5722' },
  empty: { alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 10, color: '#94a3b8' },
  formContent: { padding: 20 },
  label: { fontSize: 14, fontWeight: '700', color: '#1e293b', marginBottom: 8, marginTop: 15 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 15, fontSize: 16 },
  submitBtn: { 
    backgroundColor: '#FF5722', 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 18, 
    borderRadius: 15, 
    marginTop: 30, 
    gap: 10 
  },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' }
});