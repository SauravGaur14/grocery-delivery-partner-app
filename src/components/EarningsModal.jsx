import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, Modal, Text, TouchableOpacity } from "react-native";
import SuccessImage from "../../assets/images/person.jpg";

const EarningsModal = ({ visible, onClose, amount }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        className="absolute top-0 left-0 right-0 -bottom-1 bg-black/40 justify-end items-end z-50"
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          className="w-full bg-[#FEF9FF] rounded-2xl p-6 py-10 items-center relative"
          onPress={(e) => e.stopPropagation()}
        >
          <Image
            source={require("../../assets/images/person.jpg")}
            className="w-64 h-64 mb-5"
            resizeMode="cover"
          />
          <Text className="text-3xl font-bold mb-2 text-center">
            Delivery Completed!
          </Text>
          <Text className="text-lg text-gray-500 text-center">
            You earned ₹{amount} for this delivery.
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default EarningsModal;
