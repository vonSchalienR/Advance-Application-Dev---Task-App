import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LogBox } from "react-native";

LogBox.ignoreLogs([
  "Invalid prop `index` supplied to `React.Fragment`",
]);
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./src/contexts/AuthContext";
import { ThemeProvider, useThemeContext } from "./src/contexts/ThemeContext";
import AuthStack from "./src/navigation/AuthStack";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

function RootNavigation() {
  const { theme } = useThemeContext();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer theme={theme}>
        <AuthStack />
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <PaperProvider>
            <AuthProvider>
              <RootNavigation />
            </AuthProvider>
          </PaperProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

