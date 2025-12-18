import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export const REMINDER_CATEGORY_ID = "task-reminder";
export const COMPLETE_ACTION_ID = "complete-task";
export const SNOOZE_ACTION_ID = "snooze-10";

// Request permission and register categories/channels once.
export async function ensureNotificationSetup() {
  const perms = await Notifications.requestPermissionsAsync();
  if (perms.status !== "granted") {
    throw new Error("Notifications permission not granted");
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("tasks", {
      name: "Task reminders",
      importance: Notifications.AndroidImportance.HIGH,
      sound: "default",
    });
  }

  await Notifications.setNotificationCategoryAsync(REMINDER_CATEGORY_ID, [
    {
      identifier: COMPLETE_ACTION_ID,
      buttonTitle: "Mark complete",
    },
    {
      identifier: SNOOZE_ACTION_ID,
      buttonTitle: "Snooze 10 min",
    },
  ]);
}

const toDueDateTime = (dueDate: string) => {
  // Default to 9:00 AM local time on the due date.
  const target = new Date(`${dueDate}T09:00:00`);
  if (Number.isNaN(target.getTime())) return null;
  const soonest = Date.now() + 60 * 1000; // at least 1 minute from now
  return target.getTime() < soonest ? new Date(soonest) : target;
};

export type ReminderPayload = {
  taskId: string;
  userId: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
};

export async function scheduleTaskReminder(payload: ReminderPayload) {
  const { taskId, userId, title, dueDate } = payload;
  const triggerDate = toDueDateTime(dueDate);
  if (!triggerDate) return null;

  return Notifications.scheduleNotificationAsync({
    content: {
      title: "Task due",
      body: title,
      sound: "default",
      data: { taskId, userId, title, dueDate },
      categoryIdentifier: REMINDER_CATEGORY_ID,
    },
    trigger: triggerDate,
  });
}

export async function scheduleSnoozeReminder(payload: ReminderPayload, minutes = 10) {
  const trigger = new Date(Date.now() + minutes * 60 * 1000);
  return Notifications.scheduleNotificationAsync({
    content: {
      title: "Snoozed task",
      body: payload.title,
      sound: "default",
      data: payload,
      categoryIdentifier: REMINDER_CATEGORY_ID,
    },
    trigger,
  });
}
