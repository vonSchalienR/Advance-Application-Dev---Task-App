import { useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useAuth } from "../contexts/AuthContext";

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      {}
      <Image
        source={require("../../assets/todoicon.png")}  
        style={styles.logo}
        resizeMode="contain"
      />

      {}
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={() => login(email, password)}
        style={styles.button}
        contentStyle={{ height: 50 }}
      >
        Login
      </Button>

      <Text
        style={styles.registerText}
        onPress={() => navigation.navigate("Register")}
      >
        Don't have an account? Register
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: 40,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
  },
  registerText: {
    marginTop: 20,
    textAlign: "center",
    color: "#ff7058",
    textDecorationLine: "underline",
  },
});