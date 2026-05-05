import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Alert, ActivityIndicator, Modal, Pressable, KeyboardAvoidingView, Platform 
} from 'react-native';
import { Save, User, Mail, Briefcase, X } from 'lucide-react-native';

interface UpdateProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
  user: any;
  token: string | null;
  updateUser: (data: any) => Promise<void>;
}

export default function UpdateProfileModal({ isVisible, onClose, user, token, updateUser }: UpdateProfileModalProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    shop_name: '',
  });

  // Reset form when modal opens with fresh user data
  useEffect(() => {
    if (isVisible && user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        shop_name: user.shop_name || '',
      });
    }
  }, [isVisible, user]);

  const handleUpdate = async () => {
    if (!form.name || !form.email) return Alert.alert("Error", "Name and Email are required");

    setLoading(true);
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (response.ok) {
        await updateUser(data.user);
        Alert.alert("Success ✨", "Profile updated successfully");
        onClose(); // Close modal on success
      } else {
        Alert.alert("Error", data.message || "Failed to update profile");
      }
    } catch (e) {
      Alert.alert("Connection Error", "Check your internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      {/* Dark Overlay */}
      <Pressable style={styles.overlay} onPress={onClose}>
        
        {/* Prevent clicks on the white box from closing the modal */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContent}
        >
          <Pressable style={{width: '100%'}}>
            <View style={styles.handle} />
            
            <View style={styles.modalHeader}>
              <Text style={styles.title}>Edit Profile</Text>
              <TouchableOpacity onPress={onClose}>
                <X size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputContainer}>
                <User size={20} color="#94a3b8" style={styles.icon} />
                <TextInput 
                  style={styles.input} 
                  value={form.name} 
                  onChangeText={(v) => setForm({...form, name: v})}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputContainer}>
                <Mail size={20} color="#94a3b8" style={styles.icon} />
                <TextInput 
                  style={styles.input} 
                  value={form.email} 
                  keyboardType="email-address"
                  onChangeText={(v) => setForm({...form, email: v})}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Shop Name</Text>
              <View style={styles.inputContainer}>
                <Briefcase size={20} color="#94a3b8" style={styles.icon} />
                <TextInput 
                  style={styles.input} 
                  value={form.shop_name} 
                  onChangeText={(v) => setForm({...form, shop_name: v})}
                />
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.saveButton, loading && { opacity: 0.7 }]} 
              onPress={handleUpdate}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : (
                <>
                  <Save size={20} color="#fff" />
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </>
              )}
            </TouchableOpacity>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
    justifyContent: 'flex-end', // Aligns modal to bottom
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 25,
    paddingBottom: 40,
    alignItems: 'center',
    width: '100%',
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  title: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  inputGroup: { marginBottom: 20, width: '100%' },
  label: { fontSize: 14, fontWeight: '600', color: '#64748b', marginBottom: 8 },
  inputContainer: { 
    flexDirection: 'row', alignItems: 'center', 
    backgroundColor: '#f8fafc', borderRadius: 12, 
    borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 15 
  },
  icon: { marginRight: 10 },
  input: { flex: 1, height: 50, color: '#0f172a', fontSize: 16 },
  saveButton: { 
    backgroundColor: '#FF5722', height: 55, borderRadius: 15, 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    marginTop: 10, width: '100%'
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' }
});