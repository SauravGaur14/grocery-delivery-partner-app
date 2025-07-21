// import { useState, useEffect } from "react";
// import { Modal, View, Text, TouchableOpacity } from "react-native";
// import { BarCodeScanner } from "expo-barcode-scanner";
// import { Feather } from "@expo/vector-icons";

import { Feather } from "@expo/vector-icons";
import { View, Text, Modal, TouchableOpacity } from "react-native";

// export default function QrScannerModal({ visible, onClose, onScanned }) {
//   const [hasPermission, setHasPermission] = useState(null);
//   const [scanned, setScanned] = useState(false);

//   useEffect(() => {
//     const getPermission = async () => {
//       const { status } = await BarCodeScanner.requestPermissionsAsync();
//       setHasPermission(status === "granted");
//     };
//     if (visible) {
//       getPermission();
//       setScanned(false); // reset scanner state when modal opens
//     }
//   }, [visible]);

//   const handleBarCodeScanned = ({ data }) => {
//     setScanned(true);
//     try {
//       const parsed = JSON.parse(data);
//       if (parsed?._id) {
//         onScanned(parsed._id);
//       } else {
//         alert("Invalid QR Code");
//         onClose();
//       }
//     } catch (e) {
//       alert("Invalid QR Code");
//       onClose();
//     }
//   };

//   if (!visible) return null;

//   return (
//     <Modal visible={visible} transparent animationType="slide">
//       <View className="flex-1 bg-black">
//         {hasPermission === null ? (
//           <Text className="text-white text-center mt-20">
//             Requesting camera permission...
//           </Text>
//         ) : !hasPermission ? (
//           <Text className="text-white text-center mt-20">
//             No access to camera
//           </Text>
//         ) : (
//           <BarCodeScanner
//             onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
//             style={{ flex: 1 }}
//           />
//         )}

//         {/* Close Button */}
//         <TouchableOpacity
//           onPress={onClose}
//           className="absolute top-14 right-5 bg-white rounded-full p-2"
//         >
//           <Feather name="x" size={28} color="black" />
//         </TouchableOpacity>
//       </View>
//     </Modal>
//   );
// }
export default function QrScannerModal({ visible, onClose, onScanned }) {
  return (
    <Modal visible={visible} animationType="slide">
      <View className="flex-1">
        {/* Close Button */}
        <TouchableOpacity
          onPress={onClose}
          className="absolute top-14 right-5 bg-gray-200 rounded-full p-2"
        >
          <Feather name="x" size={28} color="black" />
        </TouchableOpacity>
        <Text>Qr Scanner</Text>
      </View>
    </Modal>
  );
}
