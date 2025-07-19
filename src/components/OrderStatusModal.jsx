import { useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";

const statuses = ["Out for Delivery", "Delivered", "Return"];

export default function OrderStatusModal({
  visible,
  onClose,
  onUpdate,
  currentStatus,
}) {
  const [selected, setSelected] = useState(currentStatus);

  const handleSelect = (status) => {
    setSelected(status);
  };

  const handleUpdate = () => {
    onUpdate(selected);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/40 justify-end">
          <TouchableWithoutFeedback>
            <View className="bg-white rounded-t-2xl p-5 max-h-[60%]">
              <View className="w-14 h-1.5 bg-gray-300 rounded-full self-center mb-4" />
              <Text className="text-lg font-semibold mb-4 text-center text-gray-800">
                Update Order Status
              </Text>

              {statuses.map((status) => (
                <Pressable
                  key={status}
                  onPress={() => handleSelect(status)}
                  className="flex-row items-center mb-4"
                >
                  <View
                    className={`w-5 h-5 rounded-full border-2 mr-3 ${
                      selected === status
                        ? "border-green-700"
                        : "border-gray-400"
                    } justify-center items-center`}
                  >
                    {selected === status && (
                      <View className="w-2 h-2 rounded-full bg-green-700" />
                    )}
                  </View>
                  <Text className="text-base text-gray-800">{status}</Text>
                </Pressable>
              ))}

              <Pressable
                onPress={handleUpdate}
                className="mt-4 bg-green-700 py-3 rounded-full"
              >
                <Text className="text-center text-white font-bold">
                  Update Status
                </Text>
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
