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
      setOrders(delivered);
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

  // Pass navigation to OrderItem for navigation
  const renderItem = (item) => (
    <OrderItem
      key={item._id}
      item={item}
      navigateToOrder={(id) => {
        navigation.navigate("OrderDetail", { orderId: id });
      }}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-white px-4 pt-4">
      <Text className="text-xl font-bold text-gray-800 mb-4">
        Delivery History
      </Text>

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
          {orders.length === 0 ? (
            <Text className="text-gray-600 text-center mt-10">
              No delivered orders yet.
            </Text>
          ) : (
            orders.map(renderItem)
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
