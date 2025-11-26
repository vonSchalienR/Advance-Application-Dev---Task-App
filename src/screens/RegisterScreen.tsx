import { useState } from "react";
import { View } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useAuth } from "../contexts/AuthContext";
import { styles } from "../styles";

export default function RegisterScreen({ navigation }: any) {
  const { signup } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await signup(email, password);
      navigation.navigate("Login");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Registration failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 26, marginBottom: 20, fontWeight: "bold" }}>
        Create Account
      </Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ marginBottom: 15 }}
      />

      <TextInput
        label="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={{ marginBottom: 15 }}
      />

      <Button
        mode="contained"
        onPress={handleRegister}
        style={{ marginTop: 10 }}
      >
        Sign Up
      </Button>

      <Text
        style={{
          marginTop: 20,
          textAlign: "center",
          color: "blue",
        }}
        onPress={() => navigation.navigate("Login")}
      >
        Already have an account? Login
      </Text>
    </View>
  );
}
