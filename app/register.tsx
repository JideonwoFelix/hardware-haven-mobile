import { Link } from "expo-router";
import React, { useState } from 'react';
import { 
    View, Text, StyleSheet, TextInput, TouchableOpacity, 
    ScrollView, Alert, Image, ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import { User, Mail, Lock, Store } from 'lucide-react-native';

export default function RegisterScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        shop_name: '',
    });

    const handleRegister = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ ...form, device_name: 'Xiaomi 13C' }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert("Success", "Account created! Now please sign in.");
                router.replace('/login');
            } else if (response.status === 422) {
                // Parse Laravel validation errors
                const firstError = data.errors ? Object.values(data.errors)[0][0] : data.message;
                Alert.alert("Invalid Input", firstError);
            } else {
                Alert.alert("Error", data.message || "Something went wrong.");
                console.error(data.message);
            }
        } catch (error) {
            Alert.alert("Connection Error", "Please check your internet.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.inner}>
                <View style={styles.header}>
                    <Image source={require('../assets/images/icon.png')} style={styles.logo} />
                    <Text style={styles.title}>Join Haven</Text>
                    <Text style={styles.subtitle}>Create your technician profile</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <User size={20} color="#94a3b8" />
                        <TextInput placeholder="Full Name" placeholderTextColor={"#64748b"} style={styles.input} onChangeText={(v) => setForm({...form, name: v})} />
                    </View>

                    <View style={styles.inputGroup}>
                        <Mail size={20} color="#94a3b8" />
                        <TextInput placeholder="Email" placeholderTextColor={"#64748b"} style={styles.input} autoCapitalize="none" onChangeText={(v) => setForm({...form, email: v})} />
                    </View>

                    <View style={styles.inputGroup}>
                        <Store size={20} color="#94a3b8" />
                        <TextInput placeholder="Shop Name (Optional)" style={styles.input} onChangeText={(v) => setForm({...form, shop_name: v})} />
                    </View>

                    <View style={styles.inputGroup}>
                        <Lock size={20} color="#94a3b8" />
                        <TextInput placeholder="Password" placeholderTextColor={"#64748b"} style={styles.input} secureTextEntry onChangeText={(v) => setForm({...form, password: v})} />
                    </View>

                    <View style={styles.inputGroup}>
                        <Lock size={20} color="#94a3b8" />
                        <TextInput placeholder="Confirm Password" placeholderTextColor={"#64748b"} style={styles.input} secureTextEntry onChangeText={(v) => setForm({...form, password_confirmation: v})} />
                    </View>

                    <TouchableOpacity style={styles.btn} onPress={handleRegister} disabled={loading}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Register Account</Text>}
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <Link href="/login" asChild>
                        <TouchableOpacity>
                            <Text style={styles.linkText}>Login</Text>
                        </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    inner: { flex: 1, justifyContent: "center" },
    content: { padding: 30, paddingTop: 60 },
    header: { alignItems: 'center', marginBottom: 30 },
    logo: { width: 70, height: 70, marginBottom: 15 },
    title: { fontSize: 26, fontWeight: '800', color: '#0f172a' },
    subtitle: { color: '#64748b' },
    form: { gap: 12 },
    inputGroup: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', paddingHorizontal: 15, borderRadius: 15, borderWidth: 1, borderColor: '#e2e8f0', height: 58 },
    input: { flex: 1, marginLeft: 10, fontSize: 16, color: "#000" },
    btn: { backgroundColor: '#FF5722', height: 58, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
    btnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
    footer: { flexDirection: "row", justifyContent: "center", marginTop: 30 },
    footerText: { color: "#64748b" },
    linkText: { color: "#FF5722", fontWeight: "700" },
});