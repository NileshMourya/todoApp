import React, { useState, memo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { COLORS, SPACING } from "../styles/theme";

// Memoized to avoid re-render unless props change
const TodoItem = memo(function TodoItem({ item, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(item.title);

  const handleSave = useCallback(() => {
    const trimmed = value.trim();
    if (trimmed && trimmed !== item.title) onEdit(item.id, trimmed);
    setEditing(false);
  }, [value, item.id, item.title, onEdit]);

  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => onToggle(item.id)}
        accessibilityLabel="Toggle complete"
      >
        <View
          style={[styles.checkInner, item.completed && styles.checkFilled]}
        />
      </TouchableOpacity>

      <View style={{ flex: 1 }}>
        {editing ? (
          <TextInput
            value={value}
            onChangeText={setValue}
            style={styles.input}
            autoFocus
            onSubmitEditing={handleSave}
            onBlur={handleSave}
            placeholderTextColor="#777"
          />
        ) : (
          <TouchableOpacity
            onLongPress={() => setEditing(true)}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.title, item.completed && styles.titleDone]}
              numberOfLines={2}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
        <Text style={styles.meta}>
          Created: {new Date(item.created_at).toLocaleString()} · Updated:{" "}
          {new Date(item.updated_at).toLocaleString()}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => onDelete(item.id)}
        accessibilityLabel="Delete TODO"
      >
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
});

export default TodoItem;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.m,
    marginHorizontal: SPACING.s,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.white,
    marginRight: SPACING.m,
    alignItems: "center",
    justifyContent: "center",
  },
  checkInner: { width: 12, height: 12, borderRadius: 3 },
  checkFilled: { backgroundColor: COLORS.white },
  title: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Poppins-Regular",
  },
  titleDone: { textDecorationLine: "line-through", opacity: 0.6 },
  meta: {
    color: "#9e9e9e",
    fontSize: 12,
    marginTop: 6,
    fontFamily: "Poppins-Regular",
  },
  deleteBtn: { marginLeft: SPACING.s, padding: 4 },
  deleteText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "Poppins-Regular",
  },
  input: {
    color: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.white,
    paddingVertical: 4,
  },
});
