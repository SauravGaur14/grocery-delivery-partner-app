import { View, Text, Pressable, FlatList, SectionList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { API_BASE_URL } from "../../util/config";

export default function Home() {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigateToOrder = (orderId) => {
    navigation.navigate("OrderDetail", { orderId });
  };

  useFocusEffect(
    useCallback(() => {
      const fetchOrders = async () => {
        try {
          setLoading(true);
          const res = await axios.get(`${API_BASE_URL}/orders`);
          setOrders(res.data);
        } catch (err) {
          console.error("Failed to fetch orders", err);
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    }, [])
  );

  // Custom sort and grouping
  const groupAndSortOrders = () => {
    const statusPriority = {
      "out for delivery": 1,
      pending: 2,
      packed: 3,
      return: 4,
      delivered: 5,
    };

    const groups = {};

    for (const order of orders) {
      const status = order.status || "Unknown";
      if (!groups[status]) groups[status] = [];
      groups[status].push(order);
    }

    const sections = Object.keys(groups)
      .sort((a, b) => (statusPriority[a] || 99) - (statusPriority[b] || 99))
      .map((status) => ({
        title: status,
        data: groups[status],
      }));

    return sections;
  };

  const groupedSections = groupAndSortOrders();

  return (
    <SafeAreaView className="flex-1 bg-white px-5 py-3">
      {/* Analytics Header */}
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2 text-gray-900">Analytics</Text>
        <View className="flex-row justify-between">
          <View className="bg-blue-100 p-4 rounded-xl w-[30%]">
            <Text className="text-sm text-gray-500">Pending</Text>
            <Text className="text-xl font-semibold text-blue-700">
              {orders.filter((o) => o.status === "pending").length}
            </Text>
          </View>
          <View className="bg-green-100 p-4 rounded-xl w-[30%]">
            <Text className="text-sm text-gray-500">Delivered</Text>
            <Text className="text-xl font-semibold text-green-700">
              {orders.filter((o) => o.status === "delivered").length}
            </Text>
          </View>
          <View className="bg-yellow-100 p-4 rounded-xl w-[30%]">
            <Text className="text-sm text-gray-500">Earnings</Text>
            <Text className="text-xl font-semibold text-yellow-700">
              ₹
              {orders.reduce(
                (acc, curr) => acc + (curr.deliveryCharge || 0),
                0
              )}
            </Text>
          </View>
        </View>
      </View>

      <Text className="text-3xl font-semibold text-gray-800 mb-2">Orders</Text>

      {loading ? (
        <Text className="text-center text-gray-500">Loading...</Text>
      ) : (
        <SectionList
          sections={groupedSections}
          keyExtractor={(item) => item._id}
          renderSectionHeader={({ section: { title } }) => (
            <Text className="text-lg font-bold mt-4 mb-2 text-gray-700">
              {title}
            </Text>
          )}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => navigateToOrder(item._id)}
              className="bg-gray-100 p-4 rounded-lg mb-2"
            >
              <Text className="font-semibold text-gray-900">
                {item.user?.name || "Unknown"}
              </Text>
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
