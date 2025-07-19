import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../util/config";
import axios from "axios";

export default function Login() {
  const [step, setStep] = useState(1); // 1: email input, 2: OTP input
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { login } = useAuth();

  const handleSendOtp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/auth/delivery/login`, { email });
      setMessage("");
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) {
      setMessage("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}/auth/delivery/verify-otp`, {
        email,
        otp,
      });
      const { token, user } = res.data;
      setMessage("");
      login(token, user);
    } catch (err) {
      setMessage(err.response?.data?.error || "Invalid or expired OTP.");
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
        {step === 1
          ? `Login with your registered email`
          : `We've sent an OTP to ${email}`}
      </Text>

      {/* Message */}
      {message !== "" && (
        <Text className={`text-center mb-4  text-red-700`}>{message}</Text>
      )}

      {step === 1 ? (
        <>
          <TextInput
            className="border border-gray-300 rounded-md px-4 py-3 mb-4 text-base"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            editable={!loading}
          />
          <Pressable
            onPress={handleSendOtp}
            className={`rounded-full py-3 ${
              loading ? "bg-gray-300" : "bg-green-600"
            }`}
            disabled={loading}
          >
            <Text className="text-white text-center font-semibold text-base">
              {loading ? "Sending OTP..." : "Send OTP"}
            </Text>
          </Pressable>
        </>
      ) : (
        <>
          <TextInput
            className="border border-gray-300 rounded-md px-4 py-3 mb-4 text-base tracking-widest text-center"
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
            placeholder="Enter 6-digit OTP"
            editable={!loading}
          />
          <Pressable
            onPress={handleVerifyOtp}
            disabled={otp.length < 6 || loading}
            className={`rounded-full py-3 ${
              loading || otp.length < 6 ? "bg-gray-300" : "bg-green-600"
            }`}
          >
            <Text className="text-white text-center font-semibold text-base">
              {loading ? "Verifying..." : "Verify"}
            </Text>
          </Pressable>

          {/* Optionally allow user to go back */}
          <Pressable
            onPress={() => {
              setStep(1);
              setOtp("");
            }}
            className="mt-4"
          >
            <Text className="text-center text-blue-500 underline text-sm">
              Change email?
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
