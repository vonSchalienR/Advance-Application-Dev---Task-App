import { useState } from "react";
import { View, TouchableOpacity, Alert, Platform } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { TextInput, Button, Text, Card, Menu } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { databases, DB_ID, TASK_COLLECTION } from "../appwrite";
import { ID } from "appwrite";
import { useAuth } from "../contexts/AuthContext";
import { styles, colors, spacing, radius, scale } from "../styles";
import { MaterialIcons } from "@expo/vector-icons";
import { useThemeContext } from "../contexts/ThemeContext";

type Priority = "low" | "medium" | "high";

export default function AddTaskScreen({ navigation }: any) {
  const { user } = useAuth();
  const { theme } = useThemeContext();
  const insets = useSafeAreaInsets();

  if (!user) return null;

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [priority, setPriority] = useState<Priority>("low");

  const [priorityMenuVisible, setPriorityMenuVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formatDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const onSelectPriority = (p: Priority) => {
    setPriority(p);
    setPriorityMenuVisible(false);
  };

  const onPickDate = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDueDate(selectedDate);
  };

  const add = async () => {
    if (!title.trim()) {
      Alert.alert("Validation", "Task title is required");
      return;
    }

    try {
      await databases.createDocument(DB_ID, TASK_COLLECTION, ID.unique(), {
        title: title.trim(),
        dueDate: formatDate(dueDate),
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
          {/* TITLE */}
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
                    textTransform: "capitalize",
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

          {/* DUE DATE PICKER */}
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.85}
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderColor: colors.border,
              padding: spacing.md,
              borderRadius: radius.lg,
              backgroundColor: theme.colors.card,
              marginTop: spacing.md,
            }}
          >
            <MaterialIcons
              name="calendar-today"
              size={22}
              color={theme.colors.primary}
            />
            <Text
              style={{ marginLeft: 10, color: theme.colors.text, fontSize: 16 }}
            >
              Due date: {formatDate(dueDate)}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onPickDate}
            />
          )}

          <View style={{ flexDirection: "row", gap: 10, marginTop: spacing.md }}>
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
          </View>

          {/* SAVE */}
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



