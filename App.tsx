import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./src/contexts/AuthContext";
import { ThemeProvider, useThemeContext } from "./src/contexts/ThemeContext";
import AuthStack from "./src/navigation/AuthStack";
import { Provider as PaperProvider } from "react-native-paper";

function RootNavigation() {
  const { theme } = useThemeContext();

  return (
    <NavigationContainer theme={theme}>
      <AuthStack />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PaperProvider>
        <AuthProvider>
          <RootNavigation />
        </AuthProvider>
      </PaperProvider>
    </ThemeProvider>
  );
}
