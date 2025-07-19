import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import OrderStatusModal from "../../components/OrderStatusModal";
import EarningsModal from "../../components/EarningsModal";

import { Linking } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { API_BASE_URL } from "../../util/config";

export default function OrderDetail() {
  const route = useRoute();
  const { orderId } = route.params;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showEarningsModal, setShowEarningsModal] = useState(false);
  const [earnedAmount, setEarnedAmount] = useState(0);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/orders/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const statusUpdateHandler = async (newStatus) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/orders/${order._id}/status`,
        {
          status: newStatus,
        }
      );
      setOrder(res.data);
      if (newStatus.toLowerCase() === "delivered") {
        setEarnedAmount(res.data.deliveryCharge || 0);
        setShowEarningsModal(true);
      }
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!order) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-red-500 text-lg">Order not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 px-5 py-3 bg-white">
      <ScrollView className="flex-1">
        {/* Order Summary */}
        <View className="border-b border-gray-200 pb-2">
          <Text className="text-2xl font-bold mb-4 text-green-700">
            Order Summary
          </Text>
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-gray-800 font-semibold">Order ID:</Text>
            <Text className="text-gray-600 mb-2">{order._id}</Text>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-gray-800 font-semibold">Status:</Text>
            <Text className="text-blue-600 font-semibold mb-2">
              {order.status}
            </Text>
          </View>
        </View>

        {/* Customer Details */}
        <View className="mt-6 pb-2 border-b border-gray-200">
          <Text className="text-2xl font-bold mb-4 text-green-700">
            Customer Details
          </Text>
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-gray-800 font-semibold">Customer Name:</Text>
            <View className="flex-row items-center space-x-2">
              <Text className="text-gray-600">{order.user?.name}</Text>
            </View>
          </View>

          <View className="flex-row justify-between my-2">
            <Text className="text-gray-800 font-semibold">Address:</Text>
            <Text className="text-gray-600 text-sm truncate">
              {order?.deliveryAddress?.landmark || "No Address"}
            </Text>
          </View>
        </View>

        {/* Items List */}
        <View className="w-full pb-2 border-b border-gray-200 mt-6">
          <Text className="text-2xl font-semibold my-4 text-green-700">
            Items
          </Text>
          {order.items.map((item, index) => (
            <View
              key={index}
              className="mb-4 w-full flex-row items-center justify-between"
            >
              <View>
                <Text className="font-semibold text-gray-800">
                  {item.product?.name || "Product"}
                </Text>
                <Text className="text-gray-700">Price: ₹{item.price}</Text>
              </View>

              <View>
                <Text className="text-gray-700">Qty: {item.qty}</Text>
                <Text className="text-gray-700">
                  Subtotal: ₹{item.price * item.qty}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Payment Summary */}
        <View className="mt-6 pb-2 border-b border-gray-200">
          <Text className="text-2xl font-semibold text-green-700 mb-3">
            Payment Summary
          </Text>

          <Text className="text-xl mt-2">
            Amount Payable: ₹{order.finalAmount}
          </Text>
          <Text className="text-xl mt-1">
            Payment Mode: {order.paymentMethod}
          </Text>
        </View>

        {/* Customer contact and address */}
        {order.status !== "delivered" && (
          <View className="mt-6">
            <Text className="text-2xl font-semibold my-4 text-green-700">
              Delivery Details
            </Text>
            {/* map */}
            <View className="flex-row items-center justify-between ">
              <Pressable
                onPress={() => {
                  const coords = order?.deliveryAddress?.coordinates;
                  if (coords?.lat && coords?.lng) {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;
                    Linking.openURL(url);
                  }
                }}
                className="justify-between space-x-2 bg-green-600 flex-row items-center gap-x-2 p-2 rounded-full  w-[48%]"
              >
                <FontAwesome5 name="directions" size={20} color="white" />
                <Text
                  className="text-white text-sm max-w-32"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {order?.deliveryAddress?.landmark || "No Address"}
                </Text>
              </Pressable>

              {/* Call Customer Button */}
              <Pressable
                onPress={() => Linking.openURL(`tel:${order.user?.phone}`)}
                className="bg-green-600 items-center justify-center rounded-full w-12 h-12"
              >
                <Ionicons
                  name="call-outline"
                  size={20}
                  color="white"
                  className="mr-1"
                />
              </Pressable>
            </View>
          </View>
        )}

        <OrderStatusModal
          visible={showStatusModal}
          onClose={() => setShowStatusModal(false)}
          onUpdate={statusUpdateHandler}
          currentStatus={order.status}
        />
        <EarningsModal
          visible={showEarningsModal}
          onClose={() => setShowEarningsModal(false)}
          amount={earnedAmount}
        />
      </ScrollView>
      {order.status !== "delivered" && (
        <Pressable
          onPress={() => setShowStatusModal(true)}
          className="mt-2 mb-4 bg-green-600 text-xl text-center py-4 items-center rounded-full absolute bottom-10 w-40 self-center"
        >
          <Text className="text-white font-medium">Update Status</Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
}
