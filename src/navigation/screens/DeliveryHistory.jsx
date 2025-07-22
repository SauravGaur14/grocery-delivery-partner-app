import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { API_BASE_URL } from "../../util/config";
import { useAuth } from "../../context/AuthContext";
import OrderItem from "../../components/OrderItem";

export default function DeliveryHistory({ navigation }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDeliveredOrders();
  }, []);

  const fetchDeliveredOrders = async () => {
    if (!user?.id && !user?._id) return;
    const userId = user.id || user._id;

    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/orders/delivery/${userId}`);

      const delivered = res.data.filter(
        (order) => order.status === "delivered"
      );
      const grouped = groupByDate(delivered);
      setOrders(grouped);
    } catch (err) {
      console.error("Failed to fetch delivery history:", err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDeliveredOrders();
    setRefreshing(false);
  };

  const groupByDate = (orders) => {
    const groups = {};

    orders.forEach((order) => {
      const dateKey = formatDate(order.deliveryDate);
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(order);
    });

    return groups;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="green" />
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {Object.keys(orders).length === 0 ? (
            <Text className="text-gray-600 text-center mt-10">
              No delivered orders yet.
            </Text>
          ) : (
            Object.entries(orders).map(([date, items]) => (
              <View key={date} className="mb-6">
                <Text className="text-lg font-semibold text-gray-700 mb-2">
                  {date}
                </Text>
                {items.map((item) => (
                  <OrderItem
                    key={item._id}
                    item={item}
                    navigateToOrder={(id) => {
                      navigation.navigate("OrderDetail", { orderId: id });
                    }}
                  />
                ))}
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
