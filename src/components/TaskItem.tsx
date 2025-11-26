import { View, Text } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import {
  databases,
  DB_ID,
  TASK_COLLECTION,
  COMPLETIONS_COLLECTION,
} from "../appwrite";
import { Button } from "react-native-paper";


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
  const del = async () => {
    await databases.deleteDocument(DB_ID, TASK_COLLECTION, task.$id);
    refresh();
  };

  const complete = async () => {
    await databases.createDocument(
      DB_ID,
      COMPLETIONS_COLLECTION,
      "unique()",
      {
        taskId: task.$id,
        completedAt: new Date().toISOString(),
      }
    );
    refresh();
  };

  return (
    <Swipeable
      renderLeftActions={() => (
        <Button mode="contained" onPress={complete}>
          Done
        </Button>
      )}
      renderRightActions={() => (
        <Button mode="contained" onPress={del}>
          Delete
        </Button>
      )}
    >
      <View style={{ padding: 16, borderBottomWidth: 1 }}>
        <Text>{task.title}</Text>
        <Text>Due: {task.dueDate}</Text>
      </View>
    </Swipeable>
  );
}
