import React, { useState, FormEvent, ChangeEvent } from 'react';
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

function App() {
  const selectedTodo = todos[1];
  const editedCount = 0;
  const [isEditMode, setIdEditMode] = useState<boolean>(false);

  const handleTodoFormSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
  };
  const handleTodoInputChange = (e: ChangeEvent<HTMLInputElement>): void => {};
  const handleTodoClick = (todoId: string) => {
    console.log(todoId); // TODO check whether event object is passed as todoId
  };
  const handleEditClick = (): void => {};
  const handleToggleClick = (): void => {};
  const handleDeleteClick = (): void => {};
  const handleEditFormSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
  };
  const handleEditInputChange = (e: ChangeEvent<HTMLInputElement>): void => {};
  const handleCancelEditClick = (): void => {};

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
              type="text"
              id="new-todo"
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
              onClick={handleTodoClick.bind(null, todo.id)}
              className={`${todo.isComplete ? 'complete' : ''}`}
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
              <input onChange={handleEditInputChange} />
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
