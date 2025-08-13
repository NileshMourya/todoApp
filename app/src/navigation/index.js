import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainScreen from "../screens/MainScreen";
import AddTodoScreen from "../screens/AddTodoScreen";
import { COLORS } from "../styles/theme";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.black },
        headerTintColor: COLORS.white,
        contentStyle: { backgroundColor: COLORS.black },
      }}
    >
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{ title: "TODOs", headerShown: false }}
      />
      <Stack.Screen
        name="AddTodo"
        component={AddTodoScreen}
        options={{ title: "Add TODO", headerShown: false }}
      />
    </Stack.Navigator>
  );
}
