import { useState } from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { TextInput, Button, Text, Card, Menu } from "react-native-paper";
import { databases, DB_ID, TASK_COLLECTION } from "../appwrite";
import { ID } from "appwrite";
import { useAuth } from "../contexts/AuthContext";
import { styles, colors, spacing, radius, scale } from "../styles";
import { MaterialIcons } from "@expo/vector-icons";
import { useThemeContext } from "../contexts/ThemeContext";

export default function AddTaskScreen({ navigation }: any) {
  const { user } = useAuth();
  const { theme } = useThemeContext();
  const insets = useSafeAreaInsets();

  if (!user) return null;

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
  const [priorityMenuVisible, setPriorityMenuVisible] = useState(false);

  const add = async () => {
    if (!title.trim()) {
      Alert.alert("Validation", "Task title is required");
      return;
    }

    try {
      console.log("Using DB_ID:", DB_ID);
      console.log("Using TASK_COLLECTION:", TASK_COLLECTION);

      await databases.createDocument(DB_ID, TASK_COLLECTION, ID.unique(), {
        title: title.trim(),
        dueDate: dueDate.toISOString().split("T")[0],
        priority,
        userId: user.$id,
      });

      navigation.goBack();
    } catch (err: any) {
      console.log("CREATE TASK ERROR RAW:", err);
      console.log("CREATE TASK ERROR JSON:", JSON.stringify(err, null, 2));
      console.log("CREATE TASK ERROR response:", err?.response);

      Alert.alert(
        "Error",
        err?.message ?? err?.response?.message ?? "Failed to create task"
      );
    }
  }; 

  const onSelectPriority = (p: "low" | "medium" | "high") => {
    setPriority(p);
    setPriorityMenuVisible(false);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: insets.top || spacing.md,
      }}
      edges={["top", "left", "right"]}
    >
      <View
        style={[
          styles.container,
          {
            padding: spacing.lg,
            paddingBottom: Math.max(spacing.lg, insets.bottom + spacing.md),
          },
        ]}
      >
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Create New Task
        </Text>

        <Card
          style={[
            styles.elevatedCard,
            {
              padding: spacing.lg,
              backgroundColor: theme.colors.card,
            },
          ]}
        >
          <TextInput
            mode="outlined"
            label="Task Title"
            value={title}
            onChangeText={setTitle}
            style={{ marginBottom: spacing.md }}
            left={<TextInput.Icon icon="format-title" />}
          />

          {/* PRIORITY PICKER */}
          <Menu
            visible={priorityMenuVisible}
            onDismiss={() => setPriorityMenuVisible(false)}
            anchor={
              <TouchableOpacity
                onPress={() => setPriorityMenuVisible(true)}
                activeOpacity={0.85}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: colors.border,
                  padding: spacing.md,
                  borderRadius: radius.lg,
                  backgroundColor: theme.colors.card,
                }}
              >
                <MaterialIcons
                  name="flag"
                  size={22}
                  color={theme.colors.primary}
                />
                <Text
                  style={{
                    marginLeft: 10,
                    color: theme.colors.text,
                    fontSize: 16,
                  }}
                >
                  Priority: {priority}
                </Text>
              </TouchableOpacity>
            }
          >
            <Menu.Item title="Low" onPress={() => onSelectPriority("low")} />
            <Menu.Item
              title="Medium"
              onPress={() => onSelectPriority("medium")}
            />
            <Menu.Item title="High" onPress={() => onSelectPriority("high")} />
          </Menu>

          {/* DUE DATE (simple) */}
          <View style={{ marginTop: spacing.md }}>
            <Text style={{ marginBottom: 8, color: theme.colors.text, fontSize: 16 }}>
              Due date: {dueDate.toISOString().split("T")[0]}
            </Text>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <Button
                mode="outlined"
                onPress={() => setDueDate(new Date())}
                style={{ flex: 1 }}
              >
                Today
              </Button>

              <Button
                mode="outlined"
                onPress={() => {
                  const d = new Date();
                  d.setDate(d.getDate() + 1);
                  setDueDate(d);
                }}
                style={{ flex: 1 }}
              >
                Tomorrow
              </Button>

              <Button
                mode="outlined"
                onPress={() => {
                  const d = new Date();
                  d.setDate(d.getDate() + 7);
                  setDueDate(d);
                }}
                style={{ flex: 1 }}
              >
                +7 days
              </Button>
            </View>
          </View>


          <Button
            mode="contained"
            onPress={add}
            style={{
              marginTop: spacing.lg,
              paddingVertical: scale(spacing.sm),
              borderRadius: radius.lg,
              backgroundColor: theme.colors.primary,
            }}
          >
            Save Task
          </Button>
        </Card>
      </View>
    </SafeAreaView>
  );
}

