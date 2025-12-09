import { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { TextInput, Button, Text, Card, Menu } from "react-native-paper";
import { databases, DB_ID, TASK_COLLECTION } from "../appwrite";
import { useAuth } from "../contexts/AuthContext";
import { styles, colors, spacing, radius, scale } from "../styles";
import { MaterialIcons } from "@expo/vector-icons";
import { useThemeContext } from "../contexts/ThemeContext";

export default function AddTaskScreen({ navigation }: any) {
  const { user } = useAuth();
  const { theme, isDark } = useThemeContext();
  const insets = useSafeAreaInsets();
  if (!user) return null;

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [priority, setPriority] = useState("low");
  const [priorityMenuVisible, setPriorityMenuVisible] = useState(false);

  const add = async () => {
    try {
      await databases.createDocument(DB_ID, TASK_COLLECTION, "unique()", {
        title,
        dueDate: dueDate.toISOString().split("T")[0],
        priority,
        userId: user.$id,
      });

      navigation.goBack();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error creating task");
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
            backgroundColor: theme.colors.background, // DARK MODE BACKGROUND
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
              backgroundColor: theme.colors.card, // DARK MODE CARD
            },
          ]}
        >
          {/* Title */}
          <TextInput
            mode="outlined"
            label="Task Title"
            value={title}
            onChangeText={setTitle}
            style={{ marginBottom: spacing.md }}
            left={<TextInput.Icon icon="format-title" />}
            theme={{
              colors: {
                text: theme.colors.text,
                placeholder: theme.colors.border,
              },
            }}
          />

          {/* Date Picker */}
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderColor: colors.border,
              padding: spacing.md,
              borderRadius: radius.lg,
              marginBottom: spacing.md,
              backgroundColor: theme.colors.card, // DARK MODE
            }}
          >
            <MaterialIcons
              name="calendar-today"
              size={22}
              color={theme.colors.primary}
            />
            <Text
              style={{ marginLeft: 10, fontSize: 16, color: theme.colors.text }}
            >
              {dueDate.toISOString().split("T")[0]}
            </Text>
          </TouchableOpacity>

          {/* Priority Picker */}
          <Menu
            visible={priorityMenuVisible}
            onDismiss={() => setPriorityMenuVisible(false)}
            anchor={
              <TouchableOpacity
                onPress={() => setPriorityMenuVisible(true)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: colors.border,
                  padding: spacing.md,
                  borderRadius: radius.lg,
                  backgroundColor: theme.colors.card, // DARK MODE
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
                    fontSize: 16,
                    color: theme.colors.text,
                  }}
                >
                  Priority: {priority}
                </Text>
              </TouchableOpacity>
            }
          >
            <Menu.Item onPress={() => setPriority("low")} title="Low" />
            <Menu.Item onPress={() => setPriority("medium")} title="Medium" />
            <Menu.Item onPress={() => setPriority("high")} title="High" />
          </Menu>

          {/* Save button */}
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
