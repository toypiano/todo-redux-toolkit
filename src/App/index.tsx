import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  FormEvent,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  createTodoActionCreator,
  editTodoActionCreator,
  toggleTodoActionCreator,
  deleteTodoActionCreator,
  selectTodoActionCreator,
} from '../redux-original';
import { State } from '../type';
import './App.scss';

function App() {
  const dispatch = useDispatch();
  const todos = useSelector((state: State) => state.todos);
  const selectedTodoId = useSelector((state: State) => state.selectedTodo);
  const editedCount = useSelector((state: State) => state.counter);
  const [newTodoInput, setNewTodoInput] = useState<string>('');
  const [editTodoInput, setEditTodoInput] = useState<string>('');

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  // To focus the edit input upon edit button click
  const editInput = useRef<HTMLInputElement>(null);
  const todoInput = useRef<HTMLInputElement>(null);

  const selectedTodo =
    (selectedTodoId && todos.find((todo) => todo.id === selectedTodoId)) ||
    null;

  const handleNewInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setNewTodoInput(e.target.value);
  };

  const handleEditInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEditTodoInput(e.target.value);
  };

  const handleTodoFormSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!newTodoInput.length) return;
    dispatch(createTodoActionCreator({ desc: newTodoInput }));
    setNewTodoInput('');
    todoInput.current?.focus();
  };

  const handleTodoClick = (todoId: string) => (): void => {
    dispatch(selectTodoActionCreator({ id: todoId }));
  };

  const handleEditClick = (): void => {
    if (!selectedTodo) return;
    // init value with prev description value
    setEditTodoInput(selectedTodo.desc);
    setIsEditMode(true);
  };

  const handleToggleClick = (): void => {
    if (!selectedTodoId || !selectedTodo) return;
    dispatch(
      toggleTodoActionCreator({
        id: selectedTodoId,
        isComplete: selectedTodo.isComplete,
      })
    );
  };

  const handleDeleteClick = (): void => {
    if (!selectedTodoId) return;
    dispatch(deleteTodoActionCreator({ id: selectedTodoId }));
  };

  const handleEditFormSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!editTodoInput.length || !selectedTodoId) {
      handleCancelEditClick();
      return;
    }

    dispatch(
      editTodoActionCreator({
        id: selectedTodoId,
        desc: editTodoInput,
      })
    );
    setIsEditMode(false);
    setEditTodoInput('');
  };

  const handleCancelEditClick = (): void => {
    setIsEditMode(false);
    setEditTodoInput(''); // clear
  };

  useEffect(() => {}, []);
  // Focus edit input when in editMode
  useEffect(() => {
    if (isEditMode) {
      editInput.current?.focus();
    }
  });

  return (
    <div className="App">
      <div className="App__header-container">
        <div className="App__header">
          <div className="App__header__title">
            <h1>Todo!</h1>
            <p>feat. Redux Toolkit</p>
          </div>
          <form onSubmit={handleTodoFormSubmit}>
            <label className="sr-only" htmlFor="new-todo">
              Add new
            </label>
            <input
              ref={todoInput}
              onChange={handleNewInputChange}
              id="new-todo"
              value={newTodoInput}
              autoFocus={true}
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
              onClick={handleTodoClick(todo.id)}
              className={`${todo.isComplete ? 'complete' : ''} ${
                todo.id === selectedTodoId ? 'active' : ''
              }`}
            >
              <span className="list-number sr-only">{i + 1}</span> {todo.desc}
            </li>
          ))}
        </ul>
        <div className="App__todo-info">
          <h2>Selected Todo</h2>
          {selectedTodo === null ? (
            <span className="empty-state">No Todo Selected</span>
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
                ref={editInput}
                onChange={handleEditInputChange}
                value={editTodoInput}
              />
              <button>Update</button>
              <button type="button" onClick={handleCancelEditClick}>
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
