import { Feather } from "@expo/vector-icons";
import { Text } from "react-native";
import { Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function OrderItem({ item }) {
  const navigation = useNavigation();

  const navigateToOrder = (orderId) => {
    navigation.navigate("OrderDetail", { orderId });
  };
  return (
    <Pressable
      onPress={() => navigateToOrder(item._id)}
      className="bg-gray-100 p-3 rounded-full mb-2"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row gap-x-4">
          <View className="bg-gray-200 w-14 h-14 items-center justify-center rounded-full">
            <Feather name="box" size={24} color="green" />
          </View>
          <View>
            <Text className="font-semibold text-gray-900">
              {item.user?.name || "Unknown"}
            </Text>
            <Text className="text-sm text-gray-800 mt-1">
              Total: ₹{item.finalAmount}
            </Text>
          </View>
        </View>
        <Feather name="chevron-right" size={24} color="#9CA3AF" />
      </View>
    </Pressable>
  );
}
