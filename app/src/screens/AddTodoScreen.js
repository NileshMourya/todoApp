import React, { useState, useCallback } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useDispatch } from "react-redux";
import { addTodo } from "../store/todosSlice";
import { COLORS, SPACING } from "../styles/theme";

export default function AddTodoScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const dispatch = useDispatch();

  const onAdd = useCallback(() => {
    const trimmed = title.trim();
    if (!trimmed) return;
    dispatch(addTodo(trimmed));
    navigation.goBack();
  }, [title, dispatch, navigation]);

  return (
    <>
      <Text style={styles.headerText}>Add Todo</Text>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        {/* INPUT TEXT CONTAINER FOR ADDING TODOS */}
        <View style={styles.card}>
          <TextInput
            placeholder="What needs to be done?"
            placeholderTextColor="#888"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={onAdd}
          />
          <TouchableOpacity
            style={styles.btn}
            onPress={onAdd}
            accessibilityLabel="Add TODO"
          >
            <Text style={styles.btnText}>Add</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    padding: SPACING.m,
    justifyContent: "center",
  },
  card: {
    backgroundColor: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.m,
  },
  input: {
    color: COLORS.white,
    fontSize: 16,
    marginBottom: SPACING.m,
    fontFamily: "Poppins-Regular",
  },
  btn: {
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: COLORS.black, fontWeight: "700" },
  headerText: {
    color: "white",
    padding: 5,
    fontSize: 15,
    fontFamily: "Poppins-Regular",
  },
});
