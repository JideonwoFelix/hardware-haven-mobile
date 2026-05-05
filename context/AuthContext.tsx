import { Platform } from 'react-native';
import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

interface AuthContextType {
  user: any;
  token: string | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved token on app startup
useEffect(() => {
  async function loadStorageData() {
    console.log('🔵 AuthContext: loadStorageData started');
    try {
      let savedToken, savedUser;

      if (Platform.OS === 'web') {
        savedToken = localStorage.getItem('userToken');
        savedUser = localStorage.getItem('userData');
      } else {
        console.log('🔵 AuthContext: reading SecureStore...');
        savedToken = await SecureStore.getItemAsync('userToken');
        console.log('🔵 AuthContext: savedToken =', savedToken);
        savedUser = await SecureStore.getItemAsync('userData');
        console.log('🔵 AuthContext: savedUser =', savedUser);
      }

      if (savedToken) {
        setToken(savedToken);
        setUser(savedUser ? JSON.parse(savedUser) : null);
      }
    } catch (error) {
      console.error('🔴 AuthContext ERROR:', error);
    } finally {
      console.log('🟢 AuthContext: setIsLoading(false)');
      setIsLoading(false);
    }
  }
  loadStorageData();
}, []);

  const login = async (email: string, pass: string) => {
    console.log(process.env.EXPO_PUBLIC_API_URL);
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email, 
        password: pass, 
        device_name: 'Mobile App' 
      }),
    });

    const data = await response.json();
    if (response.ok) {
      setToken(data.token);
      setUser(data.user);
      await SecureStore.setItemAsync('userToken', data.token);
      await SecureStore.setItemAsync('userData', JSON.stringify(data.user));
    } else {
      throw new Error(data.message);
    }
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await SecureStore.deleteItemAsync('userToken');
    await SecureStore.deleteItemAsync('userData');
  };

  const updateUser = async (updatedUser: any) => {
    setUser(updatedUser);
    await SecureStore.setItemAsync('userData', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);