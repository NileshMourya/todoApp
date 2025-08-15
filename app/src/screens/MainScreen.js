import React, {
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  fetchTodos,
  selectVisibleTodos,
  selectCounts,
  setFilter,
  setSort,
  toggleTodo,
  deleteTodo,
  editTodo,
} from "../store/todosSlice";
import TodoItem from "../components/TodoItem";
import FilterBar from "../components/FilterBar";
import SortBar from "../components/SortBar";
import { COLORS, SPACING } from "../styles/theme";
import LottieView from "lottie-react-native";
import DeleteAnimation from "@/assets/delete.json";

export default function MainScreen({ navigation }) {
  const dispatch = useDispatch();
  const todos = useSelector(selectVisibleTodos, shallowEqual);
  const { total, done } = useSelector(selectCounts, shallowEqual);
  const status = useSelector((s) => s.todos.status);
  const error = useSelector((s) => s.todos.error);
  const currentFilter = useSelector((s) => s.todos.filter);
  const currentSort = useSelector((s) => s.todos.sort);
  const [loading, setLoading] = useState(false);

  const flatListRef = useRef();

  useEffect(() => {
    if (status === "idle") dispatch(fetchTodos());
  }, [status, dispatch]);

  const onToggle = useCallback((id) => dispatch(toggleTodo(id)), [dispatch]);

  const onDelete = useCallback(
    (id) => {
      Alert.alert("Delete", "Are you sure you want to delete this TODO?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setLoading(true);
            dispatch(deleteTodo(id));
            setTimeout(() => {
              setLoading(false);
            }, 2000);
          },
        },
      ]);
    },
    [dispatch]
  );
  const onEdit = useCallback(
    (id, title) => dispatch(editTodo({ id, title })),
    [dispatch]
  );

  const keyExtractor = useCallback((item) => item.id, []);

  const header = useMemo(
    () => (
      <>
        <Text style={styles.countText}>TODOs</Text>
        <View style={styles.headerRow}>
          <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
            <Text style={styles.countText}>Total: {total}</Text>
            <Text style={styles.countText}>Done: {done}</Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate("AddTodo")}
            accessibilityLabel="Add TODO"
          >
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>
      </>
    ),
    [total, done, navigation]
  );

  // TRIGGER WHEN API WILL LOAD
  if (status === "loading") {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.white} />
        <Text style={styles.loadingText}>Loading todos…</Text>
      </View>
    );
  }

  // TRIGGER WHEN API FAILD
  if (status === "failed") {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load: {error}</Text>
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={() => dispatch(fetchTodos())}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {header}
      <ScrollView horizontal={true}>
        <View style={styles.controlsRow}>
          <FilterBar
            value={currentFilter}
            onChange={(f) => dispatch(setFilter(f))}
          />
          <SortBar value={currentSort} onChange={(s) => dispatch(setSort(s))} />
        </View>
      </ScrollView>

      <View style={styles.divider}></View>

      {/* REANDER LIST OF TODOS */}
      <FlatList
        data={todos}
        keyExtractor={keyExtractor}
        contentContainerStyle={{
          paddingVertical: SPACING.m,
          position: "relative",
        }}
        ItemSeparatorComponent={() => <View style={{ height: SPACING.s }} />}
        initialScrollIndex={10}
        renderItem={({ item }) => (
          <TodoItem // TODO COMPONENTS
            item={item}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        )}
        removeClippedSubviews
        initialNumToRender={12}
        windowSize={7}
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
            });
          }, 500);
        }}
        ref={flatListRef}
      />
      {loading && (
        <View style={styles.animationContainer}>
          <LottieView
            source={DeleteAnimation} // Path to your animation
            autoPlay={true}
            loop={true}
            style={styles.animation} // Added style with dimensions
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: SPACING.m, backgroundColor: COLORS.black },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.m,
  },
  countText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  addBtn: {
    backgroundColor: COLORS.white,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  addBtnText: { color: COLORS.black, fontWeight: "600" },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: SPACING.s,
    gap: 8,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.black,
  },
  loadingText: { color: COLORS.white, marginTop: 10 },
  errorText: {
    color: COLORS.white,
    marginBottom: 12,
    textAlign: "center",
    paddingHorizontal: 24,
  },
  retryBtn: {
    borderWidth: 1,
    borderColor: COLORS.white,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  retryText: { color: COLORS.white },
  divider: {
    backgroundColor: "white",
    elevation: 2,
    width: "100%",
    height: 1,
    marginTop: 15,
  },
  animationContainer: {
    position: "absolute",
    top: "30%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  animation: {
    width: 250,
    height: 250,
  },
});
