import React from "react";
import { View, Text, Pressable } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../navigation/AppStack";

type Props = NativeStackScreenProps<AppStackParamList, "TaskDetails">;

export default function TaskDetailsScreen({ route, navigation }: Props) {
  const { taskId } = route.params;

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Task Details</Text>
      <Text>taskId: {taskId}</Text>

      <Pressable onPress={() => navigation.goBack()}>
        <Text style={{ color: "#2563eb" }}>Back</Text>
      </Pressable>
    </View>
  );
}
