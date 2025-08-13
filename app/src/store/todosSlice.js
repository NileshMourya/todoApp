import {
  createSlice,
  createAsyncThunk,
  nanoid,
  createSelector,
} from "@reduxjs/toolkit";
import { nowISO } from "../utils/date";

export const fetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos"); // API CALL
  const data = await res.json();
  const iso = nowISO();
  return data.map((t) => ({
    id: String(t.id),
    title: t.title,
    completed: Boolean(t.completed),
    created_at: iso, // CREATED AT AND UPDATED AT FOR TRACKING
    updated_at: iso,
  }));
});

const initialState = {
  items: [],
  status: "idle",
  error: null,
  filter: "ALL",
  sort: "RECENT",
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: {
      reducer(state, action) {
        state.items.unshift(action.payload);
      },
      prepare(title) {
        const iso = nowISO();
        return {
          payload: {
            id: nanoid(),
            title: title.trim(),
            completed: false,
            created_at: iso,
            updated_at: iso,
          },
        };
      },
    },
    toggleTodo(state, action) {
      const id = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        item.completed = !item.completed;
        item.updated_at = nowISO();
      }
    },
    deleteTodo(state, action) {
      const id = action.payload;
      state.items = state.items.filter((i) => i.id !== id);
    },
    editTodo(state, action) {
      const { id, title } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        item.title = title.trim();
        item.updated_at = nowISO();
      }
    },
    setFilter(state, action) {
      state.filter = action.payload;
    },
    setSort(state, action) {
      state.sort = action.payload;
    },
    clearAll(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = "succeeded";
        const existingIds = new Set(state.items.map((i) => i.id));
        const merged = [...state.items];
        action.payload.forEach((i) => {
          if (!existingIds.has(i.id)) merged.push(i);
        });
        state.items = merged;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error?.message || "Failed to fetch todos";
      });
  },
});

export const {
  addTodo,
  toggleTodo,
  deleteTodo,
  editTodo,
  setFilter,
  setSort,
  clearAll,
} = todosSlice.actions;

const selectTodosState = (state) => state.todos;
export const selectCounts = createSelector([selectTodosState], (todos) => {
  const total = todos.items.length;
  const done = todos.items.filter((t) => t.completed).length;
  return { total, done };
});

export const selectVisibleTodos = createSelector(
  [selectTodosState],
  (todos) => {
    let list = todos.items;
    if (todos.filter === "ACTIVE") list = list.filter((t) => !t.completed);
    if (todos.filter === "DONE") list = list.filter((t) => t.completed);

    if (todos.sort === "RECENT") {
      list = [...list].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    } else if (todos.sort === "ID") {
      list = [...list].sort((a, b) => Number(a.id) - Number(b.id));
    }
    return list;
  }
);

export default todosSlice.reducer;
