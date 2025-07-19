import { Assets as NavigationAssets } from "@react-navigation/elements";
import { Asset } from "expo-asset";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar, useColorScheme } from "react-native";
import { Navigation } from "./navigation";
import { AuthProvider } from "./context/AuthContext";

Asset.loadAsync([
  ...NavigationAssets,
  require("./assets/newspaper.png"),
  require("./assets/bell.png"),
]);

SplashScreen.preventAutoHideAsync();

export function App() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <Navigation
        linking={{
          enabled: "auto",
          prefixes: [
            // Change the scheme to match your app's scheme defined in app.json
            "helloworld://",
          ],
        }}
        onReady={() => {
          SplashScreen.hideAsync();
        }}
      />
    </AuthProvider>
  );
}
