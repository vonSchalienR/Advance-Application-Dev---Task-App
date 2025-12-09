import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import AddTaskScreen from "../screens/AddTaskScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { MaterialIcons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: "#ff7058",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 12,
          borderRadius: 18,
          backgroundColor: "#fff",
          elevation: 6,
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          marginBottom: 2,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Add Task"
        component={AddTaskScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name="add-circle-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
