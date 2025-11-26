import { useState } from "react";
import { View } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { databases, DB_ID, TASK_COLLECTION } from "../appwrite";
import { useAuth } from "../contexts/AuthContext";

export default function AddTaskScreen() {
  const { user } = useAuth();

  if (!user) return null;

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("low");

  const add = async () => {
    try {
      await databases.createDocument(DB_ID, TASK_COLLECTION, "unique()", {
        title,
        dueDate,
        priority,
        userId: user.$id,  
      });

      setTitle("");
      setDueDate("");
      setPriority("low");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error creating task");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput label="Title" value={title} onChangeText={setTitle} />
      <TextInput label="Due Date" value={dueDate} onChangeText={setDueDate} />
      <TextInput label="Priority" value={priority} onChangeText={setPriority} />

      <Button mode="contained" onPress={add} style={{ marginTop: 20 }}>
        Add Task
      </Button>
    </View>
  );
}
