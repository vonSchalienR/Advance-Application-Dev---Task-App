import { StyleSheet, Platform, Dimensions } from "react-native";


const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BASE_WIDTH = 375; 
export const scale = (size: number) => (SCREEN_WIDTH / BASE_WIDTH) * size;

export const colors = {
  primary: "#5A67D8",
  primaryDark: "#4C51BF",
  background: "#F7F8FA",
  cardBackground: "#FFFFFF",
  textPrimary: "#1A202C",
  textSecondary: "#718096",
  border: "#E2E8F0",
  success: "#48BB78",
  warning: "#ED8936",
  danger: "#E53E3E",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
  xl: 30,
};

export const styles = StyleSheet.create({


 container: {
  flex: 1,
  padding: Platform.OS === "ios" ? 20 : 16,
},


  centeredContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },


  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: spacing.md,
    color: colors.textPrimary,
  },

  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },

  paragraph: {
    fontSize: 16,
    color: colors.textPrimary,
  },

  smallText: {
    fontSize: 14,
    color: colors.textSecondary,
  },

  textCenter: {
    textAlign: "center",
  },


  card: {
    backgroundColor: colors.cardBackground,
    padding: spacing.md,
    borderRadius: radius.lg,
    marginVertical: spacing.sm,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },

  elevatedCard: {
    backgroundColor: colors.cardBackground,
    padding: spacing.lg,
    borderRadius: radius.xl,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },


  input: {
    marginBottom: spacing.md,
  },

  roundedInput: {
    borderRadius: radius.lg,
    backgroundColor: "#fff",
    padding: spacing.sm,
    marginBottom: spacing.md,
  },


  primaryButton: {
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
  },

  dangerButton: {
    marginTop: spacing.md,
    backgroundColor: colors.danger,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },


  mtSm: { marginTop: spacing.sm },
  mtMd: { marginTop: spacing.md },
  mtLg: { marginTop: spacing.lg },

  mbSm: { marginBottom: spacing.sm },
  mbMd: { marginBottom: spacing.md },
  mbLg: { marginBottom: spacing.lg },


  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignSelf: "center",
    marginBottom: spacing.lg,
  },


  taskContainer: {
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.cardBackground,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },

  priorityTag: {
    marginTop: spacing.sm,
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    alignSelf: "flex-start",
  },


  fadeIn: {
    opacity: 0,
  },
});
