import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Image,
  Linking,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

import axios from "axios";
import { API_BASE_URL } from "../../util/config";
import imagePlaceholder from "../../../assets/images/imagePlaceholder.png";

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
    <SafeAreaView className="flex-1 px-5 bg-white">
      <View className="flex-[0.85]">
        <ScrollView className="" showsVerticalScrollIndicator={false}>
          {/* Order Summary */}
          <View className="">
            <Text className="text-xl font-bold mb-4 text-primary">Summary</Text>
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-gray-800 font-semibold">Order ID:</Text>
              <Text className="text-gray-600 mb-2">{order._id}</Text>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-gray-800 font-semibold">Status:</Text>
              <Text className="text-blue-500 font-semibold mb-2 capitalize">
                {order.status}
              </Text>
            </View>
          </View>

          {/* Payment Summary */}
          <View className="mt-4 pt-3 border-t border-gray-200">
            <Text className="text-xl font-semibold text-primary mb-3">
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

          {/* Items List */}
          <View className="w-full mt-6 border-t border-gray-200">
            <Text className="text-xl font-semibold mb-4 text-primary">
              Items
            </Text>
            {order.items.map((item, index) => (
              <View
                key={index}
                className="mt-1 py-1 w-full flex-row rounded-lg"
              >
                {/* Product Image Placeholder */}
                <Image
                  source={
                    item.product?.mainImage
                      ? { uri: item.product.mainImage }
                      : imagePlaceholder
                  }
                  className="w-20 h-20 rounded-md mr-4"
                  resizeMode="cover"
                />

                {/* Product Info */}
                <View className="flex-1 justify-between">
                  {/* Product Name */}
                  <Text className="text-black font-semibold text-base mb-1">
                    {item.product?.name || "Product Name"}
                  </Text>

                  {/* Quantity */}
                  <Text className="text-gray-600 text-sm">
                    Quantity:{" "}
                    <Text className="text-black font-medium">{item.qty}</Text>
                  </Text>

                  {/* Price */}
                  <Text className="text-gray-600 text-sm">
                    Price:{" "}
                    <Text className="text-black font-medium">
                      ₹{item.price.toFixed(2)}
                    </Text>
                  </Text>

                  {/* Subtotal */}
                  <Text className="text-gray-600 text-sm">
                    Subtotal:{" "}
                    <Text className="text-black font-medium">
                      ₹{(item.price * item.qty).toFixed(2)}
                    </Text>
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Customer Details */}
          <View className="mt-6 mb-3 pt-3 border-t  border-gray-200">
            <Text className="text-xl font-bold mb-4 text-primary">
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
        </ScrollView>
      </View>
      {order.status !== "delivered" && (
        <View className="px-5 flex-[0.1] absolute bottom-0 left-0 right-0">
          {/* map */}
          <View className="flex-row items-center justify-between mb-2">
            <Pressable
              onPress={() => {
                const coords = order?.deliveryAddress?.coordinates;
                if (coords?.lat && coords?.lng) {
                  const url = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;
                  Linking.openURL(url);
                }
              }}
              className="justify-between space-x-2 bg-primary flex-row items-center gap-x-2 py-3 px-4 rounded-full w-[48%]"
            >
              <FontAwesome5 name="directions" size={20} color="white" />
              <Text
                className="text-white text-sm max-w-36"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Customer Directions
              </Text>
            </Pressable>

            {/* Call Customer Button */}
            <Pressable
              onPress={() => Linking.openURL(`tel:${order.user?.phone}`)}
              className="flex-row bg-primary items-center justify-between py-3 px-4 rounded-full w-[48%]"
            >
              <MaterialIcons name="call-end" size={20} color="white" />
              <Text className="text-white text-sm">Contact Customer</Text>
            </Pressable>
          </View>
          <Pressable
            onPress={() => setShowStatusModal(true)}
            className="mt-2 mb-4 bg-primary text-xl text-center py-4 items-center rounded-full self-center w-full"
          >
            <Text className="text-white font-medium">Update Status</Text>
          </Pressable>
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
            setPendingStatus(null);
          }
        }}
      />
    </SafeAreaView>
  );
}
