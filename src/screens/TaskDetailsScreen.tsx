import { useEffect, useState } from "react";
import { View, Alert } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, Card, Button } from "react-native-paper";
import { databases, DB_ID, TASK_COLLECTION } from "../appwrite";
import { styles, spacing, radius } from "../styles";
import { useThemeContext } from "../contexts/ThemeContext";

type Task = {
  $id: string;
  title: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  userId: string;
};

export default function TaskDetailsScreen({ route, navigation }: any) {
  const { taskId } = route.params;
  const { theme } = useThemeContext();
  const insets = useSafeAreaInsets();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res: any = await databases.getDocument(DB_ID, TASK_COLLECTION, taskId);
      setTask(res as Task);
    } catch (err: any) {
      console.error("LOAD TASK DETAILS ERROR:", err);
      Alert.alert("Error", err?.message ?? "Failed to load task details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [taskId]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: insets.top || spacing.md,
      }}
      edges={["top", "left", "right"]}
    >
      <View style={[styles.container, { padding: spacing.lg }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Task Details
        </Text>

        <Card
          style={{
            marginTop: spacing.md,
            padding: spacing.lg,
            borderRadius: radius.xl,
            backgroundColor: theme.colors.card,
          }}
        >
          {loading && (
            <Text style={{ color: theme.colors.text }}>Loading…</Text>
          )}

          {!loading && !task && (
            <Text style={{ color: theme.colors.text }}>
              Task not found.
            </Text>
          )}

          {!loading && task && (
            <>
              <Text style={{ fontSize: 20, fontWeight: "700", color: theme.colors.text }}>
                {task.title}
              </Text>

              <Text style={{ marginTop: spacing.md, color: theme.colors.text }}>
                Due date: {task.dueDate}
              </Text>

              <Text style={{ marginTop: 6, color: theme.colors.text }}>
                Priority: {task.priority}
              </Text>

              <Text style={{ marginTop: 6, color: theme.colors.text }}>
                taskId: {task.$id}
              </Text>
            </>
          )}
        </Card>

        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={{ marginTop: spacing.lg }}
        >
          Back
        </Button>
      </View>
    </SafeAreaView>
  );
}

