import { Todo } from './type.d';
import { v1 as uuid } from 'uuid';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

/* Action Constants - need to create one for each event handler */
const CREATE_TODO = 'CREATE_TODO';
const SELECT_TODO = 'SELECT_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const EDIT_TODO = 'EDIT_TODO';
const DELETE_TODO = 'DELETE_TODO';

/* Action Shapes & Action Creators */
interface CreateTodoAction {
  type: typeof CREATE_TODO;
  payload: Todo;
}

// We are going to pass a "data" object to action creators
// to make the API consistent.
export const createTodo = ({ desc }: { desc: string }): CreateTodoAction => {
  return {
    type: CREATE_TODO,
    payload: {
      id: uuid(),
      desc,
      isComplete: false, // initially false
    },
  };
};

interface SelectTodoAction {
  type: typeof SELECT_TODO;
  payload: {
    id: string;
  };
}
export const selectTodo = ({ id }: { id: string }): SelectTodoAction => {
  return {
    type: SELECT_TODO,
    payload: {
      id,
    },
  };
};

interface ToggleTodoAction {
  type: typeof TOGGLE_TODO;
  payload: { id: string };
}
export const toggleTodo = ({ id }: { id: string }) => {
  return {
    type: TOGGLE_TODO,
    payload: {
      id,
    },
  };
};

interface EditTodoAction {
  type: typeof EDIT_TODO;
  payload: { id: string; desc: string };
}
export const editTodo = ({ id, desc }: { id: string; desc: string }) => {
  return {
    type: EDIT_TODO,
    payload: {
      id,
      desc,
    },
  };
};

interface DeleteTodoAction {
  type: typeof DELETE_TODO;
  payload: {
    id: string;
  };
}
export const deleteTodo = ({ id }: { id: string }): DeleteTodoAction => {
  return {
    type: DELETE_TODO,
    payload: {
      id,
    },
  };
};

/* Reducers */

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

type TodosActionTypes =
  | CreateTodoAction
  | ToggleTodoAction
  | EditTodoAction
  | DeleteTodoAction;

const todosReducer = (
  state: Todo[] = todosInitialState,
  action: TodosActionTypes
) => {
  switch (action.type) {
    case CREATE_TODO: {
      const { payload } = action;
      return [...state, payload];
    }
    case TOGGLE_TODO: {
      const { payload } = action;
      return state.map((todo) =>
        todo.id === payload.id
          ? { ...todo, isComplete: !todo.isComplete }
          : todo
      );
    }
    case EDIT_TODO: {
      const { payload } = action;
      return state.map((todo) =>
        todo.id === payload.id ? { ...todo, desc: payload.desc } : todo
      );
    }
    case DELETE_TODO: {
      const { payload } = action;
      return state.filter((todo) => todo.id !== payload.id);
    }
    default:
      return state;
  }
};

type SelectedTodoIdActionTypes = SelectTodoAction;
const selectedTodoIdReducer = (
  state: string | null = null,
  action: SelectedTodoIdActionTypes
) => {
  switch (action.type) {
    case SELECT_TODO: {
      const { payload } = action;
      return payload.id;
    }
    default:
      return state;
  }
};

// We're re-using todos' action type alias
// type CounterActionTypes = "Don't need!"
const counterReducer = (state: number = 0, action: TodosActionTypes) => {
  switch (action.type) {
    case CREATE_TODO:
    case TOGGLE_TODO:
    case EDIT_TODO:
    case DELETE_TODO:
      return state + 1;
    default:
      return state;
  }
};

const reducers = combineReducers({
  todos: todosReducer,
  selectedTodoId: selectedTodoIdReducer,
  counter: counterReducer,
});

export default createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk, logger))
);
