import { View, Text, Platform } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
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
  priority?: string;
  userId?: string;
};

type Props = {
  task: Task;
  refresh: () => void;
};

export default function TaskItem({ task, refresh }: Props) {
  const { theme, isDark } = useThemeContext();

  const priorityColor = {
    low: "#48BB78",
    medium: "#ED8936",
    high: "#E53E3E",
  } as const;

  const del = async () => {
    await databases.deleteDocument(DB_ID, TASK_COLLECTION, task.$id);
    refresh();
  };

  const complete = async () => {
    await databases.createDocument(DB_ID, COMPLETIONS_COLLECTION, "unique()", {
      taskId: task.$id,
      completedAt: new Date().toISOString(),
    });
    refresh();
  };

  return (
    <Swipeable
      renderLeftActions={() => (
        <View
          style={{
            justifyContent: "center",
            paddingHorizontal: spacing.md,
          }}
        >
          <Button
            icon="check-circle"
            mode="contained"
            buttonColor={colors.success}
            onPress={complete}
          >
            Done
          </Button>
        </View>
      )}
      renderRightActions={() => (
        <View
          style={{
            justifyContent: "center",
            paddingHorizontal: spacing.md,
          }}
        >
          <Button
            icon="delete"
            mode="contained"
            buttonColor={colors.danger}
            onPress={del}
          >
            Delete
          </Button>
        </View>
      )}
    >
      <View
        style={{
          padding: spacing.md,
          marginHorizontal: 2,
          marginVertical: spacing.xs,
          borderRadius: radius.lg,
          backgroundColor: theme.colors.card,
          borderWidth: 1,
          borderColor: isDark ? theme.colors.border : "rgba(0,0,0,0.04)",
          ...Platform.select({
            ios: {
              shadowColor: isDark ? "#000" : "#1A202C",
              shadowOpacity: isDark ? 0.25 : 0.08,
              shadowOffset: { width: 0, height: 4 },
              shadowRadius: 10,
            },
            android: {
              elevation: 3,
            },
            default: {},
          }),
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#EEF2FF",
              justifyContent: "center",
              alignItems: "center",
              marginRight: spacing.md,
            }}
          >
            <MaterialIcons
              name="task-alt"
              size={22}
              color={theme.colors.primary}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: theme.colors.text,
              }}
              numberOfLines={2}
            >
              {task.title}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 6,
              }}
            >
              <MaterialIcons
                name="calendar-today"
                size={14}
                color={theme.colors.border}
                style={{ marginRight: 6 }}
              />
              <Text
                style={{ color: theme.colors.text, opacity: 0.8, fontSize: 13 }}
              >
                Due {task.dueDate}
              </Text>
            </View>
          </View>

          {task.priority ? (
            <View
              style={{
                paddingHorizontal: spacing.sm,
                paddingVertical: 4,
                borderRadius: radius.md,
                backgroundColor: `${
                  priorityColor[task.priority as keyof typeof priorityColor] ||
                  colors.primary
                }22`,
                borderWidth: 1,
                borderColor:
                  priorityColor[task.priority as keyof typeof priorityColor] ||
                  colors.primary,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color:
                    priorityColor[
                      task.priority as keyof typeof priorityColor
                    ] || colors.primary,
                  textTransform: "capitalize",
                }}
              >
                {task.priority}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </Swipeable>
  );
}
