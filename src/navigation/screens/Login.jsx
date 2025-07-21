import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../util/config";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { login } = useAuth();

  const handleLogin = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setMessage("Please enter your password.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}/auth/delivery/login`, {
        email,
        password,
      });
      const { user } = res.data;
      setMessage("");
      login(user);
    } catch (err) {
      setLoading(false);
      setMessage(err.response?.data?.error || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-3xl font-bold text-center mb-2 text-green-800">
        Grocery Delivery
      </Text>
      <Text className="text-base text-center text-gray-700 mb-6">
        Login with your registered email and password
      </Text>

      {message !== "" && (
        <Text className="text-center mb-4 text-red-700">{message}</Text>
      )}

      <TextInput
        className="border border-gray-300 rounded-md px-4 py-3 mb-4 text-base"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        editable={!loading}
      />

      <TextInput
        className="border border-gray-300 rounded-md px-4 py-3 mb-6 text-base"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        editable={!loading}
      />

      <Pressable
        onPress={handleLogin}
        disabled={loading}
        className={`rounded-full py-3 ${
          loading ? "bg-gray-300" : "bg-green-600"
        }`}
      >
        <Text className="text-white text-center font-semibold text-base">
          {loading ? "Logging in..." : "Login"}
        </Text>
      </Pressable>
    </View>
  );
}
