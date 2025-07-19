import { View, Text, Pressable, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { API_BASE_URL } from "../../util/config";

export default function Home() {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigateToOrder = (orderId) => {
    navigation.navigate("OrderDetail", { orderId });
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/orders`);
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white px-5 py-3">
      {/* Analytics Header */}
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2 text-gray-900">Analytics</Text>
        <View className="flex-row justify-between">
          <View className="bg-blue-100 p-4 rounded-xl w-[30%]">
            <Text className="text-sm text-gray-500">Pending</Text>
            <Text className="text-xl font-semibold text-blue-700">
              {orders.filter((o) => o.status === "Pending").length}
            </Text>
          </View>
          <View className="bg-green-100 p-4 rounded-xl w-[30%]">
            <Text className="text-sm text-gray-500">Delivered</Text>
            <Text className="text-xl font-semibold text-green-700">
              {orders.filter((o) => o.status === "Delivered").length}
            </Text>
          </View>
          <View className="bg-yellow-100 p-4 rounded-xl w-[30%]">
            <Text className="text-sm text-gray-500">Earnings</Text>
            <Text className="text-xl font-semibold text-yellow-700">
              ₹{orders.reduce((acc, curr) => acc + (curr.finalAmount || 0), 0)}
            </Text>
          </View>
        </View>
      </View>

      <Text className="text-xl font-semibold text-gray-800 mb-2">
        Pending Orders
      </Text>

      {loading ? (
        <Text className="text-center text-gray-500">Loading...</Text>
      ) : (
        <FlatList
          data={orders.filter((o) => o.status === "Pending")}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => navigateToOrder(item._id)}
              className="bg-gray-100 p-4 rounded-lg mb-3"
            >
              <Text className="font-semibold text-gray-900">
                {item.user?.name || "Unknown"}
              </Text>
              {/* <Text className="text-sm text-gray-600">{item.user?.phone}</Text> */}
              <Text className="text-sm text-gray-800 mt-1">
                Total: ₹{item.finalAmount}
              </Text>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}
