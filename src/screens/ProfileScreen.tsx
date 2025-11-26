import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useAuth } from "../contexts/AuthContext";
import { useThemeContext } from "../contexts/ThemeContext";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { toggleTheme, isDark } = useThemeContext();

  return (
    <View style={{ padding: 20 }}>
      <Text>User ID: {user?.$id}</Text>
      <Button onPress={toggleTheme}>Toggle Theme ({isDark ? "Dark" : "Light"})</Button>
      <Button onPress={logout} mode="contained" style={{ marginTop: 20 }}>
        Logout
      </Button>
    </View>
  );
}
