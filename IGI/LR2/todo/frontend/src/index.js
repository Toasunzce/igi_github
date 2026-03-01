import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createSlice, createAsyncThunk, configureStore } from '@reduxjs/toolkit';
import { Provider, useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

// ── Redux ──────────────────────────────────────────────────
const fetchTodos = createAsyncThunk('todos/fetch', async () => (await axios.get('/api/todos')).data);
const addTodo   = createAsyncThunk('todos/add',   async (text)     => (await axios.post('/api/todos', { text })).data);
const toggleTodo= createAsyncThunk('todos/toggle',async ({ id, done }) => (await axios.put(`/api/todos/${id}`, { done })).data);
const removeTodo= createAsyncThunk('todos/remove',async (id)       => { await axios.delete(`/api/todos/${id}`); return id; });

const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  extraReducers: (b) => {
    b.addCase(fetchTodos.fulfilled, (_, a) => a.payload);
    b.addCase(addTodo.fulfilled,    (s, a) => { s.push(a.payload); });
    b.addCase(toggleTodo.fulfilled, (s, a) => { const t = s.find(t => t._id === a.payload._id); if (t) t.done = a.payload.done; });
    b.addCase(removeTodo.fulfilled, (s, a) => s.filter(t => t._id !== a.payload));
  },
});

const store = configureStore({ reducer: { todos: todosSlice.reducer } });

// ── App ────────────────────────────────────────────────────
function App() {
  const dispatch = useDispatch();
  const todos = useSelector(s => s.todos);
  const [text, setText] = useState('');

  useEffect(() => { dispatch(fetchTodos()); }, []);

  const handleAdd = () => {
    if (!text.trim()) return;
    dispatch(addTodo(text.trim()));
    setText('');
  };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', fontFamily: 'sans-serif' }}>
      <h1>📝 Todo App</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <input value={text} onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="New task..." style={{ flex: 1, padding: '6px 10px' }} />
        <button onClick={handleAdd}>Add</button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li key={todo._id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <input type="checkbox" checked={todo.done}
              onChange={() => dispatch(toggleTodo({ id: todo._id, done: !todo.done }))} />
            <span style={{ flex: 1, textDecoration: todo.done ? 'line-through' : 'none', color: todo.done ? '#999' : '#000' }}>
              {todo.text}
            </span>
            <button onClick={() => dispatch(removeTodo(todo._id))}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <Provider store={store}><App /></Provider>
);
