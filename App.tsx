import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LogBox } from "react-native";
import { useEffect } from "react";
import * as Notifications from "expo-notifications";

LogBox.ignoreLogs(["Invalid prop `index` supplied to `React.Fragment`"]);
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import { ThemeProvider, useThemeContext } from "./src/contexts/ThemeContext";
import AuthStack from "./src/navigation/AuthStack";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  COMPLETE_ACTION_ID,
  SNOOZE_ACTION_ID,
  ensureNotificationSetup,
  scheduleSnoozeReminder,
  ReminderPayload,
} from "./src/notifications";
import { databases, DB_ID, COMPLETIONS_COLLECTION } from "./src/appwrite";

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

function NotificationEffects() {
  const { user } = useAuth();

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }, []);

  useEffect(() => {
    let sub: Notifications.Subscription | undefined;

    const bootstrap = async () => {
      try {
        await ensureNotificationSetup();
      } catch (err) {
        console.warn("[Notifications] setup failed", err);
        return;
      }

      sub = Notifications.addNotificationResponseReceivedListener(
        async (response) => {
          const data = response.notification.request.content
            .data as ReminderPayload;

          const taskId = data?.taskId;
          const userId = data?.userId;

          if (!taskId || !userId) return;

          if (response.actionIdentifier === COMPLETE_ACTION_ID) {
            if (!user || user.$id !== userId) return;

            try {
              const completedAt = new Date().toISOString().slice(0, 10);
              const completionId = `${taskId.slice(0, 18)}_${userId.slice(
                0,
                17
              )}`;

              await databases.createDocument(
                DB_ID,
                COMPLETIONS_COLLECTION,
                completionId,
                {
                  taskId,
                  userId,
                  completedAt,
                }
              );
            } catch (err) {
              console.warn("[Notifications] complete failed", err);
            }
          }

          if (response.actionIdentifier === SNOOZE_ACTION_ID) {
            try {
              await scheduleSnoozeReminder(data, 10);
            } catch (err) {
              console.warn("[Notifications] snooze failed", err);
            }
          }
        }
      );
    };

    bootstrap();

    return () => {
      sub?.remove();
    };
  }, [user]);

  return null;
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <PaperProvider>
            <AuthProvider>
              <NotificationEffects />
              <RootNavigation />
            </AuthProvider>
          </PaperProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
