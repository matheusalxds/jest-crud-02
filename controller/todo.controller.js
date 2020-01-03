const TodoModel = require('../model/todo.model');

exports.createTodo = async (req, res, next) => {
  try {
    const newTodo = await TodoModel.create(req.body);
    res.status(201).json(newTodo);
  } catch (err) {
    next(err);
  }
};

exports.getTodos = async (req, res, next) => {
  try {
    const response = await TodoModel.find({});
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

exports.getTodoById = async (req, res, next) => {
  try {
    const response = await TodoModel.findById(req.params.todoId);
    if (response) {
      res.status(200).json(response);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    next(err);
  }
};

exports.updateTodo = async (req, res, next) => {
  try {
    const response = await TodoModel.findByIdAndUpdate(
      req.params.todoId,
      req.body,
      { new: true, useFindAndModify: false },
    );
    if (response) {
      res.status(200).json(response);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteTodo = async (req, res, next) => {
  try {
    const response = await TodoModel.findByIdAndDelete(req.params.todoId);
    if (response) {
      res.status(200).json(response);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    next(err)
  }
};
