import React, { useEffect, useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Feather } from "@expo/vector-icons";

export default function QrScannerModal({ visible, onClose, onScanned }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (visible) {
      requestPermission(); // trigger permission on modal open
      setScanned(false); // reset scanning state
    }
  }, [visible]);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    try {
      const parsed = JSON.parse(data);
      if (parsed?._id) {
        onScanned(parsed._id);
      } else {
        alert("Invalid QR Code");
        onClose();
      }
    } catch (e) {
      alert("Invalid QR Code");
      onClose();
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black">
        {permission?.status === null ? (
          <Text className="text-white text-center mt-20">
            Requesting camera permission...
          </Text>
        ) : permission?.status !== "granted" ? (
          <Text className="text-white text-center mt-20">
            No access to camera
          </Text>
        ) : (
          <View className="flex-1">
            <CameraView
              style={{ flex: 1 }}
              barcodeScannerSettings={{
                barcodeTypes: ["qr"],
              }}
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            />

            {/* Overlay Frame + Text */}
            <View className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center">
              <Text className="text-white mb-10 text-2xl">Scan QR Code</Text>
              {/* Corner Frame Container */}
              <View className="w-64 h-64 relative">
                {/* Top Left */}
                <View className="absolute top-0 left-0 w-6 h-1 bg-white" />
                <View className="absolute top-0 left-0 w-1 h-6 bg-white" />

                {/* Top Right */}
                <View className="absolute top-0 right-0 w-6 h-1 bg-white" />
                <View className="absolute top-0 right-0 w-1 h-6 bg-white" />

                {/* Bottom Left */}
                <View className="absolute bottom-0 left-0 w-6 h-1 bg-white" />
                <View className="absolute bottom-0 left-0 w-1 h-6 bg-white" />

                {/* Bottom Right */}
                <View className="absolute bottom-0 right-0 w-6 h-1 bg-white" />
                <View className="absolute bottom-0 right-0 w-1 h-6 bg-white" />
              </View>
            </View>
          </View>
        )}

        <TouchableOpacity
          onPress={onClose}
          className="absolute top-14 right-5 bg-white rounded-full p-2"
        >
          <Feather name="x" size={28} color="black" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
