import React, {
  useState,
  FormEvent,
  ChangeEvent,
  useRef,
  useEffect,
} from 'react';
import { v1 as uuid } from 'uuid';
import './App.scss';

const todos = [
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
const selectedTodoId = todos[1].id;
const editedCount = 0;

function App() {
  const [newTodoInput, setNewTodoInput] = useState<string>('');
  const [editTodoInput, setEditTodoInput] = useState<string>('');
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const editInputRef = useRef<HTMLInputElement>(null);
  const newTodoInputRef = useRef<HTMLInputElement>(null);

  const selectedTodo =
    (selectedTodoId && todos.find((todo) => todo.id === selectedTodoId)) ||
    null;

  const handleTodoFormSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setNewTodoInput('');
    newTodoInputRef.current?.focus();
  };

  const handleTodoInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setNewTodoInput(e.target.value);
  };
  const handleTodoClick = (todoId: string) => {
    console.log(todoId); // TODO check whether event object is passed as todoId
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
    // here, we need to check if the selected todo exists both in the store and in the component
    // because it affects how app's rendered to the screen
    if (!selectedTodoId || !selectedTodo) return;
  };
  const handleDeleteClick = (): void => {
    // If selectedTodoId doesn't exist at the time of clicking 'delete'
    // we don't have to check 'selectedTodo' because it's computed in this component
    // we only care about deleting that todo in the store
    if (!selectedTodoId) return;
  };
  const handleEditFormSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
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
