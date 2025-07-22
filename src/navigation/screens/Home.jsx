import { useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Pressable,
  SectionList,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import axios from "axios";
import { API_BASE_URL } from "../../util/config";
import { useAuth } from "../../context/AuthContext";
import OrderItem from "../../components/OrderItem";
import QrScannerModal from "../../components/QrScannerModal";

import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function Home() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [totalEarnings, setTotalEarnings] = useState(0);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");

  const fetchOrders = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      const now = new Date();

      const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(), // midnight
        0,
        0,
        0,
        0
      );

      const endOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(), // 1 ms before tomorrow
        23,
        59,
        59,
        999
      );

      const res = await axios.get(
        `${API_BASE_URL}/orders/delivery/${user.id}`,
        {
          params: {
            start: startOfDay.toISOString(),
            end: endOfDay.toISOString(),
          },
        }
      );

      setOrders(res.data);

      // Filter delivered orders and sum their deliveryCharge
      const deliveredOrders = res.data.filter(
        (order) => order.status.toLowerCase() === "delivered"
      );
      const totalEarnings = deliveredOrders.reduce((sum, order) => {
        return sum + (order.deliveryCharge || 0);
      }, 0);

      setTotalEarnings(totalEarnings);
      setTotalEarnings(totalEarnings);
    } catch (err) {
      console.error("Failed to fetch today's orders", err);
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  // Custom sort and grouping
  const groupAndSortOrders = () => {
    const statusPriority = {
      "out for delivery": 1,
      packed: 2,
      received: 3,
      return: 4,
      delivered: 5,
    };

    let filteredOrders =
      selectedFilter === "All"
        ? orders
        : orders.filter(
            (o) => o.status?.toLowerCase() === selectedFilter.toLowerCase()
          );

    const groups = {};

    for (const order of filteredOrders) {
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

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#268976" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white px-5 py-3">
      {/* Analytics Header */}
      <View className="mb-6">
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
              <Feather name="shopping-bag" size={20} color="#268976" />
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
                {totalEarnings}
              </Text>
            </View>
            <Text className="text-base text-gray-500">Earnings</Text>
          </View>
        </View>
      </View>

      <Text className="text-3xl font-semibold text-gray-800 mb-2">Orders</Text>

      <>
        <View className="flex-row flex-wrap gap-2 mb-2">
          {[
            "All",
            "out for delivery",
            "received",
            "packed",
            "return",
            "delivered",
          ].map((status) => (
            <Pressable
              key={status}
              onPress={() => setSelectedFilter(status)}
              className={`px-4 py-2 rounded-full border ${
                selectedFilter === status
                  ? "bg-primary border-primary"
                  : "bg-gray-100 border-gray-300"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  selectedFilter === status ? "text-white" : "text-gray-700"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        <SectionList
          sections={groupedSections}
          onRefresh={fetchOrders}
          refreshing={refreshing}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          renderSectionHeader={({ section: { title } }) => (
            <Text className="text-lg font-bold mt-4 mb-2 text-gray-700 capitalize">
              {title}
            </Text>
          )}
          renderItem={({ item }) => <OrderItem item={item} />}
          ListEmptyComponent={
            <View className="items-center mt-10">
              <Text className="text-gray-500">No orders found for today.</Text>
            </View>
          }
        />
      </>
      <Pressable
        onPress={() => setShowScanner(true)}
        className="absolute bottom-6 right-6 bg-[#268976] p-4 rounded-full shadow"
      >
        <MaterialIcons name="qr-code-scanner" size={24} color="white" />
      </Pressable>
      <QrScannerModal
        visible={showScanner}
        onClose={() => setShowScanner(false)}
        onScanned={(orderId) => {
          setShowScanner(false);
          navigation.navigate("OrderDetail", { orderId });
        }}
      />
    </SafeAreaView>
  );
}
