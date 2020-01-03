const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  title: { type: String, required: true },
  done: { type: Boolean, required: true },
});

const TodoModel = mongoose.model('todo', Schema);

module.exports = TodoModel;
