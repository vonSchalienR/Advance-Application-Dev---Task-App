import { useState } from "react";
import { View } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useAuth } from "../contexts/AuthContext";

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={{ padding: 20 }}>
      <TextInput label="Email" value={email} onChangeText={setEmail} />
      <TextInput
        label="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ marginTop: 10 }}
      />

      <Button
        mode="contained"
        onPress={() => login(email, password)}
        style={{ marginTop: 20 }}
      >
        Login
      </Button>

      <Text
        style={{ marginTop: 20 }}
        onPress={() => navigation.navigate("Register")}
      >
        Don't have an account? Register
      </Text>
    </View>
  );
}
