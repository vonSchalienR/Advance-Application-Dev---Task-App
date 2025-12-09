import { useEffect, useState } from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { databases, DB_ID, TASK_COLLECTION } from "../appwrite";
import { useAuth } from "../contexts/AuthContext";
import { Query } from "appwrite";
import TaskItem from "../components/TaskItem";
import { styles, colors, spacing, scale } from "../styles";
import { MaterialIcons } from "@expo/vector-icons";

type Task = {
  $id: string;
  title: string;
  dueDate: string;
  priority: string;
  userId: string;
};

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const insets = useSafeAreaInsets();

  const load = async () => {
    if (!user) return;

    const res: any = await databases.listDocuments(DB_ID, TASK_COLLECTION, [
      Query.equal("userId", user.$id),
    ]);

    setTasks(res.documents ?? []);
  };

  useEffect(() => {
    load();
  }, [user]);

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: insets.top || spacing.md }}
      edges={["top", "left", "right"]}
    >
      <View
        style={[
          styles.container,
          { paddingBottom: Math.max(spacing.md, insets.bottom) },
        ]}
      >
        {/* HEADER */}
        <Text style={styles.title}>Today’s Tasks</Text>
        <Text style={styles.subtitle}>
          {tasks.length} task{tasks.length !== 1 ? "s" : ""} waiting for you
        </Text>

        {/* LIST */}
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => <TaskItem task={item} refresh={load} />}
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
          contentContainerStyle={{ paddingBottom: 80 }}
        />

        {/* FLOATING ADD BUTTON */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Add Task")}
          style={{
            position: "absolute",
            bottom: 30,
            right: 30,
            backgroundColor: colors.primary,
            width: scale(60),
            height: scale(60),
            borderRadius: scale(30),
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000",
            shadowOpacity: 0.3,
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <MaterialIcons name="add" size={32} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
