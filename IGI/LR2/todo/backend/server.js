const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/todos');

const Todo = mongoose.model('Todo', { text: String, done: Boolean });

app.get('/api/todos', async (req, res) => res.json(await Todo.find()));
app.post('/api/todos', async (req, res) => res.json(await Todo.create({ text: req.body.text, done: false })));
app.put('/api/todos/:id', async (req, res) => res.json(await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true })));
app.delete('/api/todos/:id', async (req, res) => { await Todo.findByIdAndDelete(req.params.id); res.json({ ok: true }); });

app.listen(5000, () => console.log('Server on :5000'));
