import { useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Pressable, SectionList } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import axios from "axios";
import { API_BASE_URL } from "../../util/config";
import { useAuth } from "../../context/AuthContext";

import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function Home() {
  const { user } = useAuth();
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
      packed: 2,
      return: 3,
      delivered: 4,
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
        <View className="flex-row items-center justify-between">
          {/* Pending */}
          <View className="bg-blue-100 p-4 rounded-xl w-[30%] items-center">
            <View className="flex-row items-center justify-center gap-x-2 mb-1">
              <MaterialIcons name="pending-actions" size={20} color="#1D4ED8" />
              <Text className="text-xl font-semibold text-blue-700">
                {orders.filter((o) => o.status === "packed").length}
              </Text>
            </View>
            <Text className="text-base text-gray-500">Pending</Text>
          </View>

          {/* Delivered */}
          <View className="bg-green-100 p-4 rounded-xl w-[30%] items-center">
            <View className="flex-row items-center justify-center gap-x-2 mb-1">
              <Feather name="shopping-bag" size={20} color="#059669" />
              <Text className="text-xl font-semibold text-green-700">
                {orders.filter((o) => o.status === "delivered").length}
              </Text>
            </View>
            <Text className="text-base text-gray-500">Delivered</Text>
          </View>

          {/* Earnings */}
          <View className="bg-yellow-100 p-4 rounded-xl w-[30%] items-center">
            <View className="flex-row items-center justify-center gap-x-1 mb-1">
              <MaterialIcons name="currency-rupee" size={20} color="#CA8A04" />
              <Text className="text-xl font-semibold text-yellow-700">
                {user?.earnings || 0}
              </Text>
            </View>
            <Text className="text-base text-gray-500">Earnings</Text>
          </View>
        </View>
      </View>

      <Text className="text-3xl font-semibold text-gray-800 mb-2">Orders</Text>

      {loading ? (
        <Text className="text-center text-gray-500">Loading...</Text>
      ) : (
        <SectionList
          sections={groupedSections}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          renderSectionHeader={({ section: { title } }) => (
            <Text className="text-lg font-bold mt-4 mb-2 text-gray-700">
              {title}
            </Text>
          )}
          renderItem={({ item }) => (
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
          )}
        />
      )}
    </SafeAreaView>
  );
}
