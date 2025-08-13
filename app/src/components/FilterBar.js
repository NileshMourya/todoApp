import React, { memo } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { COLORS } from "../styles/theme";

const tabs = [
  { key: "ALL", label: "All" },
  { key: "ACTIVE", label: "Active" },
  { key: "DONE", label: "Done" },
];

const FilterBar = memo(function FilterBar({ value, onChange }) {
  return (
    <View style={styles.row}>
      {tabs.map((t) => (
        <TouchableOpacity
          key={t.key}
          style={[styles.chip, value === t.key && styles.active]}
          onPress={() => onChange(t.key)}
        >
          <Text style={[styles.text, value === t.key && styles.textActive]}>
            {t.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
});

export default FilterBar;

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
