import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";

import Home from "./screens/Home";
import Profile from "./screens/Profile";
import OrderDetail from "./screens/OrderDetail";
import Login from "./screens/Login";
import { useAuth } from "../context/AuthContext";
import DeliveryHistory from "./screens/DeliveryHistory";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#268976",
        tabBarIcon: ({ color, size }) => {
          let iconName =
            route.name === "Home" ? "home-outline" : "person-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

export function Navigation({ theme, linking, onReady }) {
  const { user } = useAuth();

  return (
    <NavigationContainer theme={theme} linking={linking} onReady={onReady}>
      <Stack.Navigator>
        {!user ? (
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Tabs"
              component={BottomTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="OrderDetail"
              component={OrderDetail}
              options={{ title: "Order Details" }} 
            />
            <Stack.Screen
              name="DeliveryHistory"
              component={DeliveryHistory}
              options={{ title: "Delivery History" }} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
