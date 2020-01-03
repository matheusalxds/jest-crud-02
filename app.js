const express = require('express');
const mongodb = require('./mongodb/mongodb.connect');

const app = express();

const todoRouter = require('./routes/todo.routes');

mongodb.connect();

app.use(express.json());

app.use('/todos', todoRouter);
app.use((error, req, res, next) => {
  res.status(500).json({ message: error.message });
});

app.get('/', (req, res) => {
  res.json({ hello: 'World' });
});


module.exports = app;
