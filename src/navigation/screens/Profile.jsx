import { Feather } from "@expo/vector-icons";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { useUser } from "../../src/context/UserContext";

export default function ProfileScreen() {
  // const { user, logout } = useUser();
  const user = {
    name: "Sam",
    email: "sam@gmail.com",
    phone: "1234567890",
  };
  const logout = () => {};
  return (
    <SafeAreaView className="flex-1 bg-white px-5">
      <ScrollView>
        {/* Personal Info Section */}
        <View className="mb-10">
          <Text className="text-xl font-semibold text-gray-800 mb-4">
            Personal Info
          </Text>
          {InfoRow("user", user?.name)}
          {InfoRow("phone", user?.phone)}
          {InfoRow("mail", user?.email)}
        </View>

        {/* Orders & Wishlist */}
        <View className="mb-10">
          <Text className="text-xl font-semibold text-gray-800 mb-3">
            Your Activity
          </Text>

          {NavRow("shopping-bag", "Order History", () => {})}
          {NavRow("heart", "Wishlist", () => {})}
        </View>

        {/* Static Options */}
        <View className="space-y-3">
          <Text className="text-xl font-semibold text-gray-800 mb-3">
            Account & Support
          </Text>
          {NavRow("help-circle", "Support", () => {})}
          {NavRow("info", "About Us", () => {})}
          {NavRow("log-out", "Logout", logout)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow(icon, label) {
  return (
    <View key={icon} className="flex-row items-center mb-3">
      <View className="bg-gray-100 w-10 h-10 items-center justify-center rounded-full">
        <Feather name={icon} size={18} color="green" />
      </View>
      <Text className="text-lg text-gray-800 font-medium ml-3">{label}</Text>
    </View>
  );
}

function NavRow(icon, label, onPress) {
  return (
    <TouchableOpacity
      onPress={onPress}
      key={label}
      className="flex-row items-center justify-between py-3 rounded-xl"
    >
      <View className="flex-row items-center space-x-2">
        <View className="bg-gray-100 w-10 h-10 items-center justify-center rounded-full">
          <Feather name={icon} size={20} color="green" />
        </View>
        <Text className="text-base text-gray-700 ml-3">{label}</Text>
      </View>
      <Feather name="chevron-right" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
}
