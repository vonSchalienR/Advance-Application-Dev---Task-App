import { useMemo, useState } from "react";
import { View, Text, Platform, Alert } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { RectButton } from "react-native-gesture-handler";
import {
  databases,
  DB_ID,
  TASK_COLLECTION,
  COMPLETIONS_COLLECTION,
} from "../appwrite";
import { Button } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useThemeContext } from "../contexts/ThemeContext";
import { colors, spacing, radius } from "../styles";

type Task = {
  $id: string;
  title: string;
  dueDate: string;
  priority?: "low" | "medium" | "high";
  userId?: string;
};

type Props = {
  task: Task;
  refresh: () => void;
  onOpen?: () => void; 
};

export default function TaskItem({ task, refresh, onOpen }: Props) {
  const { theme, isDark } = useThemeContext();
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const priorityColor = useMemo(
    () =>
      ({
        low: "#48BB78",
        medium: "#ED8936",
        high: "#E53E3E",
      } as const),
    []
  );

  const badgeColor =
    (task.priority && priorityColor[task.priority]) || colors.primary;

  const del = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await databases.deleteDocument(DB_ID, TASK_COLLECTION, task.$id);
      refresh();
    } catch (e: any) {
      console.log("[TASK] delete error RAW:", e);
      console.log("[TASK] delete error JSON:", JSON.stringify(e, null, 2));
      console.log("[TASK] delete error response:", e?.response);
      Alert.alert(
        "Error",
        e?.message ?? e?.response?.message ?? "Failed to delete task"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const complete = async () => {
    if (isCompleting) return;

    console.log("[TASK] complete pressed", {
      taskId: task.$id,
      userId: task.userId,
    });

    if (!task.userId) {
      Alert.alert("Error", "Missing userId on task (cannot mark completed).");
      return;
    }

    setIsCompleting(true);
    try {
      const completedAt = new Date().toISOString().slice(0, 10);


      const completionId = `${task.$id.slice(0, 18)}_${task.userId.slice(0, 17)}`;

      await databases.createDocument(
        DB_ID,
        COMPLETIONS_COLLECTION,
        completionId,
        {
          taskId: task.$id,
          completedAt,
          userId: task.userId,
        }
      );

      refresh();
    } catch (e: any) {
      console.log("[TASK] complete error RAW:", e);
      console.log("[TASK] complete error JSON:", JSON.stringify(e, null, 2));
      console.log("[TASK] complete error response:", e?.response);

      const msg = e?.message ?? e?.response?.message ?? "";

      if (String(msg).toLowerCase().includes("already exists")) {
        Alert.alert("Info", "This task is already marked as completed.");
        refresh();
      } else {
        Alert.alert("Error", msg || "Failed to mark as completed");
      }
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <Swipeable
      renderLeftActions={() => (
        <View style={{ justifyContent: "center", paddingHorizontal: spacing.md }}>
          <Button
            icon="check-circle"
            mode="contained"
            buttonColor={colors.success}
            onPress={complete}
            disabled={isCompleting || isDeleting}
            loading={isCompleting}
          >
            Done
          </Button>
        </View>
      )}
      renderRightActions={() => (
        <View style={{ justifyContent: "center", paddingHorizontal: spacing.md }}>
          <Button
            icon="delete"
            mode="contained"
            buttonColor={colors.danger}
            onPress={del}
            disabled={isDeleting || isCompleting}
            loading={isDeleting}
          >
            Delete
          </Button>
        </View>
      )}
    >

      <RectButton
        onPress={onOpen}
        enabled={!!onOpen && !isCompleting && !isDeleting}
        style={{ borderRadius: radius.lg }}
      >
        <View
          style={{
            padding: spacing.md,
            marginHorizontal: 2,
            marginVertical: 6,
            borderRadius: radius.lg,
            backgroundColor: theme.colors.card,
            borderWidth: 1,
            borderColor: isDark ? theme.colors.border : "rgba(0,0,0,0.05)",
            ...Platform.select({
              ios: {
                shadowColor: "#000",
                shadowOpacity: isDark ? 0.25 : 0.1,
                shadowOffset: { width: 0, height: 4 },
                shadowRadius: 10,
              },
              android: { elevation: 3 },
              default: {},
            }),
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>

            <RectButton
              onPress={complete}
              enabled={!isCompleting && !isDeleting}
              style={{
                opacity: isCompleting || isDeleting ? 0.6 : 1,
                borderRadius: 14,
                marginRight: spacing.md,
              }}
            >
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                  backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#EEF2FF",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MaterialIcons
                  name="check-circle"
                  size={22}
                  color={theme.colors.primary}
                />
              </View>
            </RectButton>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "800",
                  color: theme.colors.text,
                }}
                numberOfLines={1}
              >
                {task.title}
              </Text>

              <View
                style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}
              >
                <MaterialIcons
                  name="calendar-today"
                  size={14}
                  color={theme.colors.border}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={{ color: theme.colors.text, opacity: 0.75, fontSize: 13 }}
                >
                  Due {task.dueDate}
                </Text>
              </View>
            </View>

            {/* Priority badge */}
            {task.priority ? (
              <View
                style={{
                  paddingHorizontal: spacing.sm,
                  paddingVertical: 6,
                  borderRadius: radius.md,
                  backgroundColor: `${badgeColor}22`,
                  borderWidth: 1,
                  borderColor: badgeColor,
                  marginLeft: spacing.sm,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "800",
                    color: badgeColor,
                    textTransform: "capitalize",
                  }}
                >
                  {task.priority}
                </Text>
              </View>
            ) : null}

            <RectButton
              onPress={del}
              enabled={!isDeleting && !isCompleting}
              style={{
                marginLeft: spacing.sm,
                width: 36,
                height: 36,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(0,0,0,0.04)",
                opacity: isDeleting || isCompleting ? 0.6 : 1,
              }}
            >
              <MaterialIcons
                name="delete-outline"
                size={20}
                color={colors.danger}
              />
            </RectButton>
          </View>
        </View>
      </RectButton>
    </Swipeable>
  );
}
