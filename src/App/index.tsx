import React, {
  useState,
  FormEvent,
  ChangeEvent,
  useRef,
  useEffect,
} from 'react';

// import redux hooks - useSelector gives you the piece of state
import { useSelector, useDispatch } from 'react-redux';
// import action creators
import {
  createTodo,
  selectTodo,
  toggleTodo,
  editTodo,
  deleteTodo,
} from '../redux-original';
import { State } from '../type';
import './App.scss';

function App() {
  // input binding with local state
  const [newTodoInput, setNewTodoInput] = useState<string>('');
  const [editTodoInput, setEditTodoInput] = useState<string>('');
  // edit mode switch
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  // ref for focusing inputs
  const editInputRef = useRef<HTMLInputElement>(null);
  const newTodoInputRef = useRef<HTMLInputElement>(null);

  // Use pieces of state from Redux store
  const todos = useSelector((state: State) => state.todos);
  const selectedTodoId = useSelector((state: State) => state.selectedTodoId);
  // you can rename the variable as you see fit!
  const editedCount = useSelector((state: State) => state.counter);

  const dispatch = useDispatch();

  const selectedTodo =
    (selectedTodoId && todos.find((todo) => todo.id === selectedTodoId)) ||
    null;

  const handleTodoFormSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!newTodoInput.length) return;
    dispatch(createTodo({ desc: newTodoInput }));
    setNewTodoInput('');
    newTodoInputRef.current?.focus();
  };

  const handleTodoInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setNewTodoInput(e.target.value);
  };
  const handleTodoClick = (todoId: string): void => {
    dispatch(selectTodo({ id: todoId }));
  };
  const handleEditClick = (): void => {
    // if no todo selected, do nothing
    if (!selectedTodo) return;
    // initialize with selected todo.
    setEditTodoInput(selectedTodo.desc);
    setIsEditMode(true);
    // you can't focus ref in here before editInput will mount in next render
    // after editMode is turned on.
  };
  // focus edit input when edit mode is turned on
  useEffect(() => {
    if (isEditMode) {
      // this will run after the editInput gets mounted
      editInputRef.current?.focus();
    }
  }, [isEditMode]);

  const handleToggleClick = (): void => {
    // type guard needed for the ones you're passing into the action creator
    if (!selectedTodoId) return;
    dispatch(toggleTodo({ id: selectedTodoId }));
  };
  const handleDeleteClick = (): void => {
    if (!selectedTodoId) return;
    dispatch(deleteTodo({ id: selectedTodoId }));
  };
  const handleEditFormSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!editTodoInput.length || !selectedTodoId) {
      handleCancelEditClick();
      return;
    }
    dispatch(editTodo({ id: selectedTodoId, desc: editTodoInput }));
    // Even though these are exactly what 'handleCancelEditClick' does,
    // it's semantically different group of actions, so we're imperatively telling what to do.
    setIsEditMode(false);
    setEditTodoInput('');
  };
  const handleEditInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEditTodoInput(e.target.value);
  };
  const handleCancelEditClick = (): void => {
    setIsEditMode(false);
    // clear edit todo input
    setEditTodoInput('');
  };

  return (
    <div className="App">
      <div className="App__header-container">
        <div className="App__header">
          <div className="App__header__title">
            <h1>Todo!</h1>
            <p>feat. Redux Toolkit</p>
          </div>
          <form onSubmit={handleTodoFormSubmit}>
            <label htmlFor="new-todo" className="sr-only">
              Add new
            </label>
            <input
              onChange={handleTodoInputChange}
              value={newTodoInput}
              type="text"
              id="new-todo"
              autoFocus={true}
              ref={newTodoInputRef}
            />
            <button>Create</button>
          </form>
        </div>
      </div>
      <div className="App__body">
        <ul className="App__list">
          <h2 className="sr-only">My Todos</h2>
          {todos.map((todo, i) => (
            <li
              key={todo.id}
              onClick={handleTodoClick.bind(null, todo.id)}
              className={`${todo.isComplete ? 'complete' : ''} ${
                todo.id === selectedTodoId ? 'active' : ''
              }`}
            >
              <span className="list-number sr-only">{i + 1}</span>
              {todo.desc}
            </li>
          ))}
        </ul>
        <div className="App__todo-info">
          <h2>Selected Todo</h2>
          {selectedTodo === null ? (
            <div className="empty-state">No Todo Selected</div>
          ) : !isEditMode ? (
            <>
              <span
                className={`todo-desc ${
                  selectedTodo.isComplete ? 'complete' : ''
                }`}
              >
                {selectedTodo.desc}
              </span>
              <div className="todo-actions">
                <button onClick={handleEditClick}>Edit</button>
                <button onClick={handleToggleClick}>Toggle</button>
                <button onClick={handleDeleteClick}>Delete</button>
              </div>
            </>
          ) : (
            <form onSubmit={handleEditFormSubmit}>
              <label htmlFor="edit-todo" className="sr-only">
                Edit
              </label>
              <input
                ref={editInputRef}
                onChange={handleEditInputChange}
                value={editTodoInput}
              />
              <button>Update</button>
              <button onClick={handleCancelEditClick} type="button">
                Cancel
              </button>
            </form>
          )}
        </div>
      </div>
      <footer className="App__counter">
        <p>Todos Updated Count: {editedCount}</p>
      </footer>
    </div>
  );
}

export default App;
