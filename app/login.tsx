import { Link } from "expo-router";
import { ArrowRight, Lock, Mail } from "lucide-react-native";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Info", "Please enter your email and password");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      // AuthProvider handles redirect automatically
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.inner}>
        <View style={styles.header}>
          <Image
            source={require("../assets/images/icon.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Hardware Haven</Text>
          <Text style={styles.subtitle}>
            Sign in to your technician account
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <Mail size={20} color="#94a3b8" />
            <TextInput
              placeholder="Email"
              placeholderTextColor={"#64748b"}
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Lock size={20} color="#94a3b8" />
            <TextInput
              placeholder="Password"
              placeholderTextColor={"#64748b"}
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.buttonText}>Sign In</Text>
                <ArrowRight size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>New here? </Text>
          <Link href="/register" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Create Account</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  inner: { flex: 1, padding: 30, justifyContent: "center" },
  header: { alignItems: "center", marginBottom: 40 },
  logo: { width: 80, height: 80, marginBottom: 15 },
  title: { fontSize: 28, fontWeight: "800", color: "#0f172a" },
  subtitle: { color: "#64748b", marginTop: 5 },
  form: { gap: 15 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    height: 60,
  },
  input: { flex: 1, marginLeft: 10, fontSize: 16,  color: "#000" },
  button: {
    backgroundColor: "#FF5722",
    height: 60,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 30 },
  footerText: { color: "#64748b" },
  linkText: { color: "#FF5722", fontWeight: "700" },
});
