import { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { TextInput, Button, Text, Card } from "react-native-paper";
import { useAuth } from "../contexts/AuthContext";
import { styles, colors, spacing, radius } from "../styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = async () => {
    try {
      await login(email, password);
    } catch (err: any) {
      alert(err.message || "Login failed");
    }
  };

  return (
    <View style={[styles.container, { justifyContent: "center" }]}>
      
      {/* HERO TITLE */}
      <Text style={[styles.title, { textAlign: "center", marginBottom: spacing.lg }]}>
        Welcome Back
      </Text>
      <Text
        style={{
          textAlign: "center",
          color: colors.textSecondary,
          marginBottom: spacing.lg,
        }}
      >
        Login to continue managing your tasks
      </Text>

      {/* LOGIN CARD */}
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
          value={password}
          secureTextEntry
          onChangeText={setPassword}
          left={<TextInput.Icon icon="lock" />}
        />

        {/* LOGIN BUTTON */}
        <Button
          mode="contained"
          onPress={onLogin}
          style={{
            marginTop: spacing.lg,
            padding: spacing.sm,
            borderRadius: radius.lg,
          }}
        >
          Login
        </Button>

        {/* NAVIGATE TO REGISTER */}
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text
            style={{
              marginTop: spacing.lg,
              textAlign: "center",
              color: colors.primary,
              fontWeight: "600",
            }}
          >
            Don't have an account? Register
          </Text>
        </TouchableOpacity>
      </Card>
    </View>
  );
}
