import React, { useState } from 'react';
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
  const [isEditMode, setIdEditMode] = useState<boolean>(false);

  return (
    <div className="App">
      <div className="App__header-container">
        <div className="App__header">
          <div className="App__header__title">
            <h1>Todo!</h1>
            <p>feat. Redux Toolkit</p>
          </div>
          <form>
            <label htmlFor="new-todo" className="sr-only">
              Add new
            </label>
            <input type="text" id="new-todo" autoFocus={true} />
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
                <button>Edit</button>
                <button>Toggle</button>
                <button>Delete</button>
              </div>
            </>
          ) : (
            <form>
              <label htmlFor="edit-todo" className="sr-only">
                Edit
              </label>
              <input type="text" />
              <button>Update</button>
              <button type="button">Cancel</button>
            </form>
          )}
        </div>
      </div>
      <footer className="App__counter">
        <p>Todos Updated Count: {0}</p>
      </footer>
    </div>
  );
}

export default App;
