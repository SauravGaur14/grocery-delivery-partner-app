import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../util/config";

export default function Login() {
  const [step, setStep] = useState(1); // 1: enter phone, 2: enter OTP
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const { login } = useAuth();

  const handleSendOtp = () => {
    if (phone.length === 10) {
      setStep(2);
    } else {
      alert("Enter a valid 10-digit phone number");
    }
  };

  const handleVerifyOtp = () => {
    if (otp === "1234") {
      login(phone);
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-2xl font-bold text-center mb-6">Login</Text>

      {step === 1 ? (
        <>
          <Text className="text-gray-700 mb-2">Phone Number</Text>
          <TextInput
            className="border border-gray-300 rounded-md px-4 py-2 mb-4"
            keyboardType="phone-pad"
            maxLength={10}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your number"
          />
          <Pressable
            onPress={handleSendOtp}
            className="bg-blue-500 rounded-md py-3"
          >
            <Text className="text-white text-center font-semibold">
              Send OTP
            </Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text className="text-gray-700 mb-2">Enter OTP</Text>
          <TextInput
            className="border border-gray-300 rounded-md px-4 py-2 mb-4"
            keyboardType="number-pad"
            maxLength={4}
            value={otp}
            onChangeText={setOtp}
            placeholder="1234"
          />
          <Pressable
            onPress={handleVerifyOtp}
            className="bg-green-500 rounded-md py-3"
          >
            <Text className="text-white text-center font-semibold">
              Verify & Login
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
