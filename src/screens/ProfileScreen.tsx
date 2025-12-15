import { useEffect, useState, useCallback } from "react";
import { View, Alert } from "react-native";
import { Text, Button, Card, Switch } from "react-native-paper";
import { useAuth } from "../contexts/AuthContext";
import { useThemeContext } from "../contexts/ThemeContext";
import { styles, colors, spacing, radius } from "../styles";
import {
  databases,
  DB_ID,
  TASK_COLLECTION,
  COMPLETIONS_COLLECTION,
} from "../appwrite";
import { Query } from "appwrite";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { toggleTheme, isDark, theme } = useThemeContext();

  const [activeCount, setActiveCount] = useState<number | null>(null);
  const [completedCount, setCompletedCount] = useState<number | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  if (!user) return null;

  const initial = user.email?.[0]?.toUpperCase() ?? "U";

  const loadStats = useCallback(async () => {
    if (!user?.$id) return;

    setLoadingStats(true);
    try {

      const tasksRes: any = await databases.listDocuments(DB_ID, TASK_COLLECTION, [
        Query.equal("userId", user.$id),
        Query.limit(1000),
      ]);

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

      const active = tasks.filter((t: any) => !completedSet.has(String(t.$id))).length;

      setCompletedCount(completedSet.size);
      setActiveCount(active);
    } catch (e: any) {
      console.log("[PROFILE] stats error RAW:", e);
      console.log("[PROFILE] stats error JSON:", JSON.stringify(e, null, 2));
      console.log("[PROFILE] stats error response:", e?.response);

      setActiveCount(null);
      setCompletedCount(null);

      Alert.alert(
        "Error",
        e?.message ?? e?.response?.message ?? "Failed to load statistics"
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
      <Text style={styles.title}>Profile</Text>

      <Card style={[styles.elevatedCard, { backgroundColor: theme.colors.card }]}>
        <View style={{ alignItems: "center", marginBottom: spacing.lg }}>
          <View
            style={{
              width: 90,
              height: 90,
              borderRadius: 45,
              backgroundColor: colors.primary,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: spacing.md,
            }}
          >
            <Text style={{ fontSize: 36, color: "#fff", fontWeight: "700" }}>
              {initial}
            </Text>
          </View>

          <Text style={{ fontSize: 20, fontWeight: "600" }}>{user.email}</Text>
          <Text style={{ color: colors.textSecondary, marginTop: 4 }}>
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
          <Text style={{ fontSize: 16 }}>Dark Mode</Text>
          <Switch value={isDark} onValueChange={toggleTheme} />
        </View>

        <View style={{ marginTop: spacing.md }}>
          <Text style={styles.subtitle}>Statistics</Text>

          <View style={[styles.rowBetween, { marginBottom: spacing.sm }]}>
            <Text style={styles.paragraph}>Completed tasks</Text>
            <Text style={{ fontWeight: "600" }}>
              {loadingStats ? "…" : completedCount ?? "—"}
            </Text>
          </View>

          <View style={[styles.rowBetween, { marginBottom: spacing.sm }]}>
            <Text style={styles.paragraph}>Active tasks</Text>
            <Text style={{ fontWeight: "600" }}>
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

