import { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from storage on app start
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("Failed to load auth state", err);
      } finally {
        setLoading(false);
      }
    };

    loadAuthState();
  }, []);

  // Login and persist data
  const login = async (user) => {
    setUser(user);

    try {
      await AsyncStorage.setItem("user", JSON.stringify(user));
    } catch (err) {
      console.error("Failed to save auth state", err);
    }
  };

  // Logout and clear data
  const logout = async () => {
    setUser(null);

    try {
      await AsyncStorage.removeItem("user");
    } catch (err) {
      console.error("Failed to clear auth state", err);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
