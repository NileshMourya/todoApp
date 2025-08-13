import React, { memo } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { COLORS } from "../styles/theme";

const opts = [
  { key: "RECENT", label: "Most Recent" },
  { key: "ID", label: "By ID" },
];

const SortBar = memo(function SortBar({ value, onChange }) {
  return (
    <View style={styles.row}>
      {opts.map((o) => (
        <TouchableOpacity
          key={o.key}
          style={[styles.chip, value === o.key && styles.active]}
          onPress={() => onChange(o.key)}
        >
          <Text style={[styles.text, value === o.key && styles.textActive]}>
            {o.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
});

export default SortBar;

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    height: 35,
  },
  active: { backgroundColor: COLORS.white },
  text: { color: COLORS.white },
  textActive: { color: COLORS.black, fontWeight: "700" },
});
