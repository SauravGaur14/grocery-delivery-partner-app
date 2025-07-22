import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Linking } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

import axios from "axios";
import { API_BASE_URL } from "../../util/config";

import { SafeAreaView } from "react-native-safe-area-context";
import OrderStatusModal from "../../components/OrderStatusModal";
import EarningsModal from "../../components/EarningsModal";
import CameraModal from "../../components/CameraModal";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function OrderDetail() {
  const route = useRoute();
  const navigation = useNavigation();

  const { orderId } = route.params;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showEarningsModal, setShowEarningsModal] = useState(false);
  const [earnedAmount, setEarnedAmount] = useState(0);

  const [showCamera, setShowCamera] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);

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

  const statusUpdateHandler = (newStatus) => {
    if (newStatus.toLowerCase() === "delivered") {
      // Open camera before updating

      setPendingStatus(newStatus);
      setShowCamera(true);
    } else {
      // Immediate update for other statuses
      performStatusUpdate(newStatus);
    }
  };

  const performStatusUpdate = async (statusToUpdate) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/orders/${order._id}/status`,
        {
          status: statusToUpdate,
        }
      );
      setOrder(res.data);
      if (statusToUpdate.toLowerCase() === "delivered") {
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
        <Text className="text-3xl font-semibold mb-8">Order Details</Text>

        {/* Order Summary */}
        <View className="pt-3">
          <Text className="text-2xl font-bold mb-4 text-green-700">
            Summary
          </Text>
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-gray-800 font-semibold">Order ID:</Text>
            <Text className="text-gray-600 mb-2">{order._id}</Text>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-gray-800 font-semibold">Status:</Text>
            <Text className="text-blue-800 font-semibold mb-2 capitalize">
              {order.status}
            </Text>
          </View>
        </View>

        {/* Customer Details
        <View className="mt-6">
          <Text className="text-2xl font-bold mb-4 text-green-700">
            Customer Info
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
        </View> */}

        {/* Items List */}
        <View className="w-full mt-6 pt-3 border-t border-gray-200">
          <Text className="text-2xl font-semibold mb-4 text-green-700">
            Items
          </Text>
          {order.items.map((item, index) => (
            <View
              key={index}
              className="mb-4 w-full flex-row items-center justify-between"
            >
              <Text className="font-semibold text-gray-800">
                {item.product?.name || "Product"}
              </Text>
              <Text className="text-gray-700">Qty: {item.qty}</Text>
              {/* <View>
                <Text className="font-semibold text-gray-800">
                  {item.product?.name || "Product"}
                </Text>
                <Text className="text-gray-700">Price: ₹{item.price}</Text>
              </View> */}

              {/* <View>
                <Text className="text-gray-700">Qty: {item.qty}</Text>
                <Text className="text-gray-700">
                  Subtotal: ₹{item.price * item.qty}
                </Text>
                268976
              </View> */}
            </View>
          ))}
        </View>

        {/* Payment Summary */}
        <View className="mt-4 pt-3 border-t border-gray-200">
          <Text className="text-2xl font-semibold text-green-700 mb-3">
            Payment Summary
          </Text>

          <View className="flex-row items-center justify-between">
            <Text className="text-gray-800 font-semibold mb-4">
              Amount Payable:
            </Text>
            <Text className="text-gray-700">₹{order.finalAmount}</Text>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="font-semibold text-gray-800">Payment Mode:</Text>
            <Text className="text-gray-700">{order.paymentMethod}</Text>
          </View>
        </View>

        {/* Customer Details */}
        <View className="mt-6 mb-3 pt-3 border-t border-gray-200">
          <Text className="text-2xl font-bold mb-4 text-green-700">
            Customer Info
          </Text>
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-gray-800 font-semibold">Name:</Text>
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

        {/* Customer contact and address */}
        {order.status !== "delivered" && (
          <View className="">
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
                className="justify-between space-x-2 bg-gray-700 flex-row items-center gap-x-2 py-3 px-4 rounded-full w-[55%]"
              >
                <FontAwesome5 name="directions" size={20} color="white" />
                <Text
                  className="text-white text-sm max-w-36"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {order?.deliveryAddress?.landmark || "No Address"}
                </Text>
              </Pressable>

              {/* Call Customer Button */}
              <Pressable
                onPress={() => Linking.openURL(`tel:${order.user?.phone}`)}
                className="flex-row bg-gray-700 items-center justify-between py-3 px-4 rounded-full w-[42%]"
              >
                <MaterialIcons name="call-end" size={20} color="white" />
                <Text className="text-white">Call Customer</Text>
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
          onClose={() => {
            setShowEarningsModal(false);
            navigation.navigate("Tabs", {
              screen: "Home",
            });
          }}
          amount={earnedAmount}
        />
      </ScrollView>
      {order.status !== "delivered" && (
        <Pressable
          onPress={() => setShowStatusModal(true)}
          className="mt-2 mb-4 bg-green-600 text-xl text-center py-4 items-center rounded-full absolute bottom-5 w-40 self-center"
        >
          <Text className="text-white font-medium">Update Status</Text>
        </Pressable>
      )}
      <CameraModal
        visible={showCamera}
        onCancel={() => {
          setShowCamera(false);
          setPendingStatus(null);
        }}
        onCapture={() => {
          setShowCamera(false);
          if (pendingStatus) {
            performStatusUpdate(pendingStatus);
            setPendingStatus(null); // reset after use
          }
        }}
      />
    </SafeAreaView>
  );
}
