import { View } from "react-native";
import { Text, Button, Card, Switch } from "react-native-paper";
import { useAuth } from "../contexts/AuthContext";
import { useThemeContext } from "../contexts/ThemeContext";
import { styles, colors, spacing, radius } from "../styles";



export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { toggleTheme, isDark } = useThemeContext();

  if (!user) return null;

  const initial = user.email?.[0]?.toUpperCase() ?? "U";
  const { theme } = useThemeContext();


  return (
    <View style={[styles.container, { padding: spacing.lg }]}>
      <Text style={styles.title}>Profile</Text>

      {/* USER CARD */}
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

        {/* THEME SWITCH */}
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

        {/* STATISTICS */}
        <View style={{ marginTop: spacing.md }}>
          <Text style={styles.subtitle}>Statistics</Text>

          <View style={[styles.rowBetween, { marginBottom: spacing.sm }]}>
            <Text style={styles.paragraph}>Completed tasks</Text>
            <Text style={{ fontWeight: "600" }}>—</Text>
          </View>

          <View style={[styles.rowBetween, { marginBottom: spacing.sm }]}>
            <Text style={styles.paragraph}>Active tasks</Text>
            <Text style={{ fontWeight: "600" }}>—</Text>
          </View>
        </View>

        {/* LOGOUT BUTTON */}
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
