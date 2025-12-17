import { useEffect, useState, useCallback } from "react";
import { View, Alert, Image } from "react-native";
import { Text, Button, Card, Switch } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { Query } from "appwrite";

import { useAuth } from "../contexts/AuthContext";
import { useThemeContext } from "../contexts/ThemeContext";
import { styles, colors, spacing, radius } from "../styles";
import {
  databases,
  DB_ID,
  TASK_COLLECTION,
  COMPLETIONS_COLLECTION,
} from "../appwrite";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { toggleTheme, isDark, theme } = useThemeContext();

  const [activeCount, setActiveCount] = useState<number | null>(null);
  const [completedCount, setCompletedCount] = useState<number | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);


  const [imageUri, setImageUri] = useState<string | null>(null);

  if (!user) return null;

  const initial = user.email?.[0]?.toUpperCase() ?? "U";


  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Gallery access is needed");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };


  const loadStats = useCallback(async () => {
    if (!user?.$id) return;

    setLoadingStats(true);
    try {
      const tasksRes: any = await databases.listDocuments(
        DB_ID,
        TASK_COLLECTION,
        [Query.equal("userId", user.$id), Query.limit(1000)]
      );

      const compsRes: any = await databases.listDocuments(
        DB_ID,
        COMPLETIONS_COLLECTION,
        [Query.equal("userId", user.$id), Query.limit(1000)]
      );

      const tasks = tasksRes?.documents ?? [];
      const completions = compsRes?.documents ?? [];

      const completedSet = new Set<string>(
        completions.map((c: any) => String(c.taskId))
      );

      const active = tasks.filter(
        (t: any) => !completedSet.has(String(t.$id))
      ).length;

      setCompletedCount(completedSet.size);
      setActiveCount(active);
    } catch (e: any) {
      console.log("[PROFILE] stats error:", e);
      setActiveCount(null);
      setCompletedCount(null);

      Alert.alert(
        "Error",
        e?.message ?? "Failed to load statistics"
      );
    } finally {
      setLoadingStats(false);
    }
  }, [user?.$id]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return (
    <View style={[styles.container, { padding: spacing.lg }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Profile
      </Text>

      <Card
        style={[styles.elevatedCard, { backgroundColor: theme.colors.card }]}
      >

        <View style={{ alignItems: "center", marginBottom: spacing.lg }}>
          <Image
            source={
              imageUri
                ? { uri: imageUri }
                : require("../../assets/default-avatar.jpg")
            }
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              marginBottom: spacing.sm,
            }}
          />

          <Button
            mode="outlined"
            onPress={pickImage}
            style={{ marginBottom: spacing.md }}
          >
            Change profile picture
          </Button>

          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              color: theme.colors.text,
            }}
          >
            {user.email}
          </Text>

          <Text style={{ color: theme.colors.text, marginTop: 4 }}>
            Logged in user
          </Text>
        </View>


        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: spacing.md,
          }}
        >
          <Text style={{ fontSize: 16, color: theme.colors.text }}>
            Dark Mode
          </Text>
          <Switch value={isDark} onValueChange={toggleTheme} />
        </View>

        <View style={{ marginTop: spacing.md }}>
          <Text style={[styles.subtitle, { color: theme.colors.text }]}>
            Statistics
          </Text>

          <View style={[styles.rowBetween, { marginBottom: spacing.sm }]}>
            <Text style={[styles.paragraph, { color: theme.colors.text }]}>
              Completed tasks
            </Text>
            <Text style={{ fontWeight: "600", color: theme.colors.text }}>
              {loadingStats ? "…" : completedCount ?? "—"}
            </Text>
          </View>

          <View style={[styles.rowBetween, { marginBottom: spacing.sm }]}>
            <Text style={[styles.paragraph, { color: theme.colors.text }]}>
              Active tasks
            </Text>
            <Text style={{ fontWeight: "600", color: theme.colors.text }}>
              {loadingStats ? "…" : activeCount ?? "—"}
            </Text>
          </View>

          <Button
            mode="outlined"
            onPress={loadStats}
            style={{ marginTop: spacing.sm }}
            disabled={loadingStats}
          >
            Refresh stats
          </Button>
        </View>

        <Button
          mode="contained"
          onPress={logout}
          style={{
            marginTop: spacing.lg,
            backgroundColor: colors.danger,
            paddingVertical: spacing.sm,
            borderRadius: radius.lg,
          }}
        >
          Logout
        </Button>
      </Card>
    </View>
  );
}