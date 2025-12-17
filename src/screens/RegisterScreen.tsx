import { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { TextInput, Button, Text, Card } from "react-native-paper";
import { useAuth } from "../contexts/AuthContext";
import { useThemeContext } from "../contexts/ThemeContext";
import { styles, colors, spacing, radius } from "../styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function RegisterScreen({ navigation }: any) {
  const { signup } = useAuth();
  const { theme } = useThemeContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onRegister = async () => {
    try {
      await signup(email, password);
      navigation.navigate("Login");
    } catch (err: any) {
      alert(err.message || "Registration failed");
    }
  };

  return (
    <View style={[styles.container, { justifyContent: "center" }]}>
      {/* HERO TITLE */}
      <Text
        style={[
          styles.title,
          {
            textAlign: "center",
            marginBottom: spacing.lg,
            color: theme.colors.text,
          },
        ]}
      >
        Create Account
      </Text>
      <Text
        style={{
          textAlign: "center",
          color: theme.colors.text,
          marginBottom: spacing.lg,
        }}
      >
        Join us and start tracking your tasks
      </Text>

      {/* REGISTER CARD */}
      <Card style={[styles.elevatedCard, { padding: spacing.lg }]}>
        {/* Email */}
        <TextInput
          mode="outlined"
          label="Email"
          value={email}
          onChangeText={setEmail}
          left={<TextInput.Icon icon="email" />}
          style={{ marginBottom: spacing.md }}
        />

        {/* Password */}
        <TextInput
          mode="outlined"
          label="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          left={<TextInput.Icon icon="lock" />}
        />

        {/* REGISTER BUTTON */}
        <Button
          mode="contained"
          onPress={onRegister}
          style={{
            marginTop: spacing.lg,
            padding: spacing.sm,
            borderRadius: radius.lg,
          }}
        >
          Register
        </Button>

        {/* NAVIGATE BACK TO LOGIN */}
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text
            style={{
              marginTop: spacing.lg,
              textAlign: "center",
              color: colors.primary,
              fontWeight: "600",
            }}
          >
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </Card>
    </View>
  );
}
