import { useCallback, useEffect, useMemo, useState } from "react";
import { View, FlatList, Text, Platform } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {
  databases,
  DB_ID,
  TASK_COLLECTION,
  COMPLETIONS_COLLECTION,
} from "../appwrite";
import { useAuth } from "../contexts/AuthContext";
import { Query } from "appwrite";
import TaskItem from "../components/TaskItem";
import { styles, colors, spacing, scale } from "../styles";
import { MaterialIcons } from "@expo/vector-icons";
import { RectButton } from "react-native-gesture-handler";

type Task = {
  $id: string;
  title: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  userId: string;
};

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const sortTasks = useCallback((docs: any[]): Task[] => {
    const weight: Record<string, number> = { high: 0, medium: 1, low: 2 };

    return (docs ?? [])
      .slice()
      .sort((a: any, b: any) => {
        const pa = weight[String(a.priority)] ?? 99;
        const pb = weight[String(b.priority)] ?? 99;
        if (pa !== pb) return pa - pb;
        return String(a.dueDate).localeCompare(String(b.dueDate));
      });
  }, []);

  const load = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const taskRes: any = await databases.listDocuments(DB_ID, TASK_COLLECTION, [
        Query.equal("userId", user.$id),
        Query.orderAsc("dueDate"),
        Query.limit(1000),
      ]);

      const compRes: any = await databases.listDocuments(
        DB_ID,
        COMPLETIONS_COLLECTION,
        [Query.equal("userId", user.$id), Query.limit(1000)]
      );

      const taskDocs = taskRes?.documents ?? [];
      const compDocs = compRes?.documents ?? [];

      const completedSet = new Set<string>(compDocs.map((c: any) => String(c.taskId)));

      const activeTasks = taskDocs.filter((t: any) => !completedSet.has(String(t.$id)));

      setTasks(sortTasks(activeTasks));
    } catch (err) {
      console.log("[HOME] LOAD ERROR:", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [user, sortTasks]);

  useEffect(() => {
    load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const headerSubtitle = useMemo(() => {
    const n = tasks.length;
    return `${n} task${n !== 1 ? "s" : ""} waiting for you`;
  }, [tasks.length]);

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: insets.top || spacing.md }}
      edges={["top", "left", "right"]}
    >
      <View
        style={[
          styles.container,
          {
            paddingTop: spacing.md,
            paddingBottom: Math.max(spacing.xl, insets.bottom + spacing.lg),
          },
        ]}
      >
        <View style={{ marginBottom: spacing.md }}>
          <Text style={styles.title}>Today’s Tasks</Text>
          <Text style={styles.subtitle}>{headerSubtitle}</Text>
        </View>

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.$id}
          onRefresh={load}
          refreshing={loading}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              refresh={load}
              onOpen={() => navigation.navigate("TaskDetails", { taskId: item.$id })}
            />
          )}
          ListEmptyComponent={
            <View style={{ marginTop: spacing.xl }}>
              <Text style={[styles.subtitle, { textAlign: "center" }]}>
                No tasks yet
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  color: colors.textSecondary,
                  marginTop: 8,
                }}
              >
                Tap the + button to add your first task
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 120 }}
        />

        <RectButton
          onPress={() => navigation.navigate("Add Task")}
          style={{
            position: "absolute",
            bottom: 88,
            right: 24,
            backgroundColor: colors.primary,
            width: scale(60),
            height: scale(60),
            borderRadius: scale(30),
            justifyContent: "center",
            alignItems: "center",
            ...Platform.select({
              ios: {
                shadowColor: "#000",
                shadowOpacity: 0.25,
                shadowOffset: { width: 0, height: 4 },
                shadowRadius: 10,
              },
              android: { elevation: 7 },
              default: {},
            }),
          }}
        >
          <MaterialIcons name="add" size={32} color="#fff" />
        </RectButton>
      </View>
    </SafeAreaView>
  );
}

