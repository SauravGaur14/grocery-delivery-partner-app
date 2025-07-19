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

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/${orderId}`
        );
        setOrder(res.data);
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

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
        <View className="mt-6">
          <Text className="text-2xl font-bold mb-4 text-green-700">
            Customer Details
          </Text>
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-gray-800 font-semibold">Customer Name:</Text>
            <View className="flex-row items-center space-x-2">
              <Text className="text-gray-600">{order.user?.name}</Text>
            </View>
          </View>

          {order.user?.addresses?.length > 0 && (
            <View className="flex-row justify-between my-2">
              <Text className="text-gray-800 font-semibold">Address:</Text>
              <Pressable
                onPress={() => {
                  const defaultAddr = order.user.addresses.find(
                    (a) => a.isDefault
                  );
                  if (
                    defaultAddr?.coordinates?.lat &&
                    defaultAddr?.coordinates?.lng
                  ) {
                    const { lat, lng } = defaultAddr.coordinates;
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
                    Linking.openURL(url);
                  }
                }}
                className="justify-end space-x-2 bg-green-600 flex-row items-center gap-x-2 p-2 rounded-full max-w-[70%]"
              >
                <FontAwesome5 name="directions" size={18} color="white" />
                <Text className="text-white text-sm truncate">
                  {order.user.addresses.find((a) => a.isDefault)?.landmark}..
                </Text>
              </Pressable>
            </View>
          )}

          {/* Call Customer Button */}
          <View className="mt-3 flex-row items-center justify-between border-b border-gray-200 pb-2">
            <Text className="text-gray-800 font-semibold">
              Contact Customer
            </Text>
            <Pressable
              onPress={() => Linking.openURL(`tel:${order.user?.phone}`)}
              className="bg-green-600 flex-row items-center gap-x-2 p-2 rounded-full w-20"
            >
              <Ionicons
                name="call-outline"
                size={16}
                color="white"
                className="mr-1"
              />
              <Text className="text-white font-medium ml-1">Call</Text>
            </Pressable>
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
        <View className="mt-6">
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

        <OrderStatusModal
          visible={showStatusModal}
          onClose={() => setShowStatusModal(false)}
          onUpdate={(newStatus) => {
            setOrder({ ...order, status: newStatus });
            // Optionally make PUT /api/orders/:id/status API call here
          }}
          currentStatus={order.status}
        />
      </ScrollView>
      <Pressable
        onPress={() => setShowStatusModal(true)}
        className="mt-2 mb-4 bg-green-600 text-xl text-center py-4 items-center rounded-full absolute bottom-10 w-40 self-center"
      >
        <Text className="text-white font-medium">Update Status</Text>
      </Pressable>
    </SafeAreaView>
  );
}
