import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, 
  TextInput, ActivityIndicator, Alert, ScrollView, Image, StyleSheet, Platform 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/context/AuthContext';
import { PackageSearch, Plus, List, Camera, Image as ImageIcon, X, Save } from 'lucide-react-native';
import PostCard from '@/components/PostCard'; 
import { Post } from '@/types';

export default function CatalogScreen() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<'view' | 'add'>('view');
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const initialForm = {
    title: '',
    category: 'Hardware',
    price: '',
    location: 'Banex Plaza',
    description: ''
  };
  const [form, setForm] = useState(initialForm);

  const fetchMyPosts = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/posts`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      const json = await response.json();
      if (response.ok) setMyPosts(json.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (activeTab === 'view') fetchMyPosts(); }, [activeTab]);

  const pickImage = async (useCamera: boolean) => {
    const permissionResult = useCamera 
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "We need access to your camera/gallery to upload photos.");
      return;
    }

    const result = useCamera 
      ? await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.7 })
      : await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.7 });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAddPost = async () => {
    // 1. Client-side guard
    if (!form.title || !form.price || !image) {
      return Alert.alert("Missing Info", "Please provide a title, price, and a photo.");
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('price', form.price);
    formData.append('category', form.category);
    formData.append('location', form.location);
    formData.append('description', form.description);

    const uriParts = image.split('.');
    const fileType = uriParts[uriParts.length - 1];
    formData.append('image', {
      uri: image,
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    } as any);

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success ✨", "Hardware listed successfully.");
        setForm(initialForm);
        setImage(null);
        setActiveTab('view');
      } else if (response.status === 422) {
        // 2. Handle Laravel Validation Errors
        // Laravel returns errors as: { errors: { title: ["Too short"], price: ["Must be numeric"] } }
        const errorMessages = Object.values(result.errors || {}).flat().join('\n');
        Alert.alert("Validation Error", errorMessages || "Please check your inputs.");
      } else {
        // 3. Handle Other Errors (401, 404, 500)
        Alert.alert("Error", result.message || "Something went wrong on our end.");
      }
    } catch (e) {
      // 4. Handle Network Failures
      Alert.alert("Network Error", "Unable to connect to the server. Please check your internet.");
      console.error("Upload Error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Premium Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          onPress={() => setActiveTab('view')}
          style={[styles.tabItem, activeTab === 'view' && styles.activeTabBorder]}
        >
          <List size={20} color={activeTab === 'view' ? '#f97316' : '#64748b'} />
          <Text style={[styles.tabText, activeTab === 'view' ? styles.activeTabText : styles.inactiveTabText]}>My Items</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setActiveTab('add')}
          style={[styles.tabItem, activeTab === 'add' && styles.activeTabBorder]}
        >
          <Plus size={20} color={activeTab === 'add' ? '#f97316' : '#64748b'} />
          <Text style={[styles.tabText, activeTab === 'add' ? styles.activeTabText : styles.inactiveTabText]}>Add New</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'view' ? (
        <FlatList
          data={myPosts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <PostCard post={item} />}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <PackageSearch size={64} color="#cbd5e1" strokeWidth={1} />
              <Text style={styles.emptyText}>Your shop inventory is empty.</Text>
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <ScrollView style={styles.formScroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.label}>Hardware Photo</Text>
          
          {image ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: image }} style={styles.previewImage} />
              <TouchableOpacity 
                onPress={() => setImage(null)}
                style={styles.removeImageBtn}
              >
                <X size={20} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.pickerRow}>
              <TouchableOpacity onPress={() => pickImage(true)} style={styles.pickerBox}>
                <Camera size={28} color="#64748b" />
                <Text style={styles.pickerText}>Snap Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => pickImage(false)} style={styles.pickerBox}>
                <ImageIcon size={28} color="#64748b" />
                <Text style={styles.pickerText}>Gallery</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.label}>Item Details</Text>
          <TextInput 
            style={styles.input}
            placeholder="Title (e.g. Dell Latitude 7490)" 
            placeholderTextColor="#94a3b8"
            value={form.title}
            onChangeText={(v) => setForm({...form, title: v})}
          />

          <View style={styles.inputRow}>
            <TextInput 
              style={[styles.input, { flex: 1, marginRight: 12 }]}
              placeholder="Price (₦)" 
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              value={form.price}
              onChangeText={(v) => setForm({...form, price: v})}
            />
            <TextInput 
              style={[styles.input, { flex: 1 }]}
              placeholder="Category" 
              placeholderTextColor="#94a3b8"
              value={form.category}
              onChangeText={(v) => setForm({...form, category: v})}
            />
          </View>

          <TextInput 
            style={styles.input}
            placeholder="Location" 
            placeholderTextColor="#94a3b8"
            value={form.location}
            onChangeText={(v) => setForm({...form, location: v})}
          />

          <TextInput 
            style={[styles.input, styles.textArea]}
            placeholder="Describe the condition, specs, and any warranty..." 
            placeholderTextColor="#94a3b8"
            multiline
            textAlignVertical="top"
            value={form.description}
            onChangeText={(v) => setForm({...form, description: v})}
          />

          <TouchableOpacity 
            onPress={handleAddPost}
            disabled={loading}
            style={[styles.submitBtn, loading && { opacity: 0.7 }]}
          >
            {loading ? <ActivityIndicator color="white" /> : (
              <View style={styles.submitBtnContent}>
                <Save size={20} color="white" />
                <Text style={styles.submitBtnText}>List Hardware</Text>
              </View>
            )}
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 40,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  activeTabBorder: {
    borderBottomWidth: 2,
    borderBottomColor: '#f97316',
  },
  tabText: {
    fontWeight: '600',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#f97316',
  },
  inactiveTabText: {
    color: '#64748b',
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
    paddingHorizontal: 40,
  },
  emptyText: {
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
  },
  formScroll: {
    padding: 20,
  },
  label: {
    color: '#1e293b',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  imagePreviewContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  removeImageBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 20,
  },
  pickerRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  pickerBox: {
    flex: 1,
    backgroundColor: '#e2e8f0',
    height: 120,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#cbd5e1',
    borderStyle: 'dashed',
    marginHorizontal: 4,
  },
  pickerText: {
    color: '#64748b',
    marginTop: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 16,
    color: '#0f172a',
  },
  inputRow: {
    flexDirection: 'row',
  },
  textArea: {
    height: 120,
  },
  submitBtn: {
    backgroundColor: '#f97316',
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    // Shadow for iOS
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // Shadow for Android
    elevation: 8,
  },
  submitBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
  },
});