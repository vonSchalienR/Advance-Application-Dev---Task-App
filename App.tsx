import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './src/navigation/AuthStack';
import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider, useThemeContext } from './src/contexts/ThemeContext';

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
      <AuthProvider>
        <RootNavigation />
      </AuthProvider>
    </ThemeProvider>
  );
}
