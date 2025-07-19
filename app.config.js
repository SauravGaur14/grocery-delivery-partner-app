import "dotenv/config";
export default {
  expo: {
    name: "grocery-delivery-partner",
    slug: "grocery-delivery-partner",
    version: "1.0.0",
    extra: {
      API_BASE_URL: process.env.API_BASE_URL,
    },
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    scheme: "grocerydeliverypartner",
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.satya164.reactnavigationtemplate",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.satya164.reactnavigationtemplate",
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro",
    },
    plugins: [
      "expo-asset",
      [
        "expo-splash-screen",
        {
          backgroundColor: "#ffffff",
          image: "./assets/splash-icon.png",
        },
      ],
      "react-native-edge-to-edge",
    ],
  },
};
