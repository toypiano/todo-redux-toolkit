import { Todo } from './type.d';
import { v1 as uuid } from 'uuid';
import logger from 'redux-logger';

import {
  createSlice,
  PayloadAction,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';

const todosInitialState: Todo[] = [
  {
    id: uuid(),
    desc: 'Learn React',
    isComplete: true,
  },
  {
    id: uuid(),
    desc: 'Learn TypeScript',
    isComplete: false,
  },
  {
    id: uuid(),
    desc: 'Learn RTK',
    isComplete: false,
  },
];

const todosSlice = createSlice({
  name: 'todos',
  initialState: todosInitialState, // initial state now mandatory!
  reducers: {
    create: {
      reducer: (
        state,
        {
          payload,
        }: PayloadAction<{ desc: string; id: string; isComplete: boolean }>
      ) => {
        state.push(payload);
      },
      // If you have any side effects in creating action, do it inside prepare function.
      // prepare fn gets original payload and returns updated payload
      prepare: ({ desc }: { desc: string }) => ({
        payload: {
          id: uuid(),
          desc,
          isComplete: false,
        },
      }),
    },
    edit: (state, { payload }: PayloadAction<{ id: string; desc: string }>) => {
      const todo = state.find((todo) => todo.id === payload.id);
      if (todo) {
        todo.desc = payload.desc;
      }
    },
    toggle: (state, { payload }: PayloadAction<{ id: string }>) => {
      const todo = state.find((todo) => todo.id === payload.id);
      if (todo) {
        todo.isComplete = !todo.isComplete;
      }
    },
    remove: (state, { payload }: PayloadAction<{ id: string }>) => {
      const index = state.findIndex((todo) => todo.id === payload.id);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
  },
});

const selectedTodoIdSlice = createSlice({
  name: 'selectedTodoId',
  initialState: null as string | null, // default: null, and typecast into possible types
  reducers: {
    select: (state, { payload }: PayloadAction<{ id: string }>) => {
      // you CANNOT directly MUTATE STATE!
      // state = id;

      // instead, return the new state (you can either mutate | return state)
      return payload.id;
    },
  },
});

const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {},
  // receive action defined in other reducers here
  extraReducers: {
    [todosSlice.actions.create.type]: (state) => state + 1,
    [todosSlice.actions.edit.type]: (state) => state + 1,
    [todosSlice.actions.toggle.type]: (state) => state + 1,
    [todosSlice.actions.remove.type]: (state) => state + 1,
  },
});

// Destructure action creators from slice and
// copy into the names that are used in the React component.
export const {
  create: createTodo,
  toggle: toggleTodo,
  edit: editTodo,
  remove: deleteTodo,
} = todosSlice.actions;

export const { select: selectTodo } = selectedTodoIdSlice.actions;

const reducer = {
  todos: todosSlice.reducer,
  selectedTodoId: selectedTodoIdSlice.reducer,
  counter: counterSlice.reducer,
};

// If you need to include non-default middlewares (thunk, ... ), do this:
const middleware = [...getDefaultMiddleware(), logger];

export default configureStore({
  reducer,
  middleware,
  // turn off devTools for production
  devTools: process.env.NODE_ENV !== 'production',
});
