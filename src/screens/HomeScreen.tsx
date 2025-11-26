import { useEffect, useState } from "react";
import { View, FlatList, Text } from "react-native";
import { databases, DB_ID, TASK_COLLECTION } from "../appwrite";
import { useAuth } from "../contexts/AuthContext";
import { Query } from "appwrite";
import TaskItem from "../components/TaskItem";

type Task = {
  $id: string;
  title: string;
  dueDate: string;
  priority?: string;
  userId: string;
};

export default function HomeScreen() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);

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
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <TaskItem task={item} refresh={load} />
        )}
        ListEmptyComponent={
          <Text style={{ marginTop: 20 }}>No tasks for today.</Text>
        }
      />
    </View>
  );
}
