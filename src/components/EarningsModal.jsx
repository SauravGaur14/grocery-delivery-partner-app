import { Image, Modal, Text, TouchableOpacity, View } from "react-native";

const EarningsModal = ({ visible, onClose, amount }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="w-full bg-[#FEF9FF] rounded-2xl px-6 py-10 items-center justify-center h-screen">
        <Image
          source={require("../../assets/images/person.jpg")}
          className="w-80 h-80 mb-5"
          resizeMode="cover"
        />
        <Text className="text-xl font-bold mb-2 text-center">
          Delivery Completed!
        </Text>
        <Text className="text-2xl text-gray-800 text-center">
          You earned <Text className="font-semibold">₹{amount} </Text>for this
          delivery!
        </Text>

        <TouchableOpacity
          onPress={onClose}
          className="bg-primary px-10 py-3 rounded-full absolute bottom-10 self-center"
        >
          <Text className="text-white font-semibold text-xl">Continue</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default EarningsModal;
