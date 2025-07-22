import { useRef, useState } from "react";
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Button,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Feather } from "@expo/vector-icons";

export default function CameraModal({ visible, onCapture, onCancel }) {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState("back");

  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        // console.log("Captured URI:", photo.uri); // optional
        onCapture();
      } catch (error) {
        console.error("Error taking picture:", error);
      }
    }
  };

  if (!permission) return null;

  if (!permission.granted) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={styles.container}>
          {/* Camera fills background */}
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFill} // full-screen
            facing={facing}
            mode="picture"
          />

          {/* Cancel Button */}
          <TouchableOpacity
            onPress={onCancel}
            className="absolute top-10 right-5 bg-white rounded-full p-2"
          >
            <Feather name="x" size={28} color="black" />
          </TouchableOpacity>

          {/* Shutter Button */}
          <View style={styles.shutterContainer}>
            <Pressable onPress={handleCapture} style={styles.shutterBtn}>
              <View style={styles.shutterBtnInner} />
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          mode="picture"
        />
        {/* Cancel Button */}
        <TouchableOpacity
          onPress={onCancel}
          className="absolute top-10 right-5 bg-white rounded-full p-2"
        >
          <Feather name="x" size={28} color="black" />
        </TouchableOpacity>

        {/* Capture Button */}
        <View style={styles.shutterContainer}>
          <Pressable onPress={handleCapture} style={styles.shutterBtn}>
            <View style={styles.shutterBtnInner} />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  cancel: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },
  shutterContainer: {
    position: "absolute",
    bottom: 44,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 85,
    height: 85,
    borderRadius: 42.5,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: "#000000cc",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  permissionText: {
    color: "white",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
});
