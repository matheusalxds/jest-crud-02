const httpMocks = require('node-mocks-http');

const todoController = require('../../todo.controller');
const TodoModel = require('../../../model/todo.model');

const newTodo = require('../../../model/__mock__/todo');
const allTodos = require('../../../model/__mock__/all-todos');

// Used to override the mongoose function, it'll a SPY now,
// TodoModel.create = jest.fn();
// TodoModel.find = jest.fn();
// TodoModel.findById = jest.fn();
// TodoModel.findByIdAndUpdate = jest.fn();
// TodoModel.findByIdAndDelete = jest.fn();

// if you use jest.mock, so you don't need to use jest.fn()
jest.mock('../../../model/todo.model');

describe('TODO Module', () => {
  let req, res, next;
  const todoId = '5e0e3f729d09773b74d0294a';

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  // Create
  describe('Controller CREATE', () => {
    beforeEach(() => {
      req.body = newTodo;
    });

    it('should have a createTodo function', () => {
      expect(typeof todoController.createTodo).toBe('function');
    });

    it('should call TodoModel.create', () => {
      todoController.createTodo(req, res, next);
      expect(TodoModel.create).toBeCalledWith(newTodo);
    });

    it('should return 201 response code', async () => {
      await todoController.createTodo(req, res, next);
      expect(res.statusCode).toBe(201);
      expect(res._isEndCalled()).toBeTruthy();
    });

    it('should return json body in response', async () => {
      TodoModel.create.mockReturnValue(newTodo);
      await todoController.createTodo(req, res, next);
      expect(res._getJSONData()).toStrictEqual(newTodo);
    });

    it('should handle errors', async () => {
      const errorMessage = { message: 'Done property missing' };
      const rejectedPromise = Promise.reject(errorMessage);
      TodoModel.create.mockReturnValue(rejectedPromise);
      await todoController.createTodo(req, res, next);
      expect(next).toBeCalledWith(errorMessage);
    });
  });

  // Retrieve
  describe('Controller RETRIVE', () => {
    it('should have a getTodos function', () => {
      expect(typeof todoController.getTodos).toBe('function');
    });

    it('should call TodoModel.find({})', async () => {
      // call find passing some arguments, in this case an empty object
      await todoController.getTodos(req, res, next);
      expect(TodoModel.find).toHaveBeenCalledWith({});
    });

    it('should return response with status 200 and all todos', async () => {
      TodoModel.find.mockReturnValue(allTodos);
      await todoController.getTodos(req, res, next);
      expect(res.statusCode).toBe(200);
      expect(res._isEndCalled()).toBeTruthy();
      expect(res._getJSONData()).toStrictEqual(allTodos);
    });

    it('should handle errors', async () => {
      const errorMessage = { message: 'Error finding' };
      const rejectPromise = Promise.reject(errorMessage);
      TodoModel.find.mockReturnValue(rejectPromise);
      await todoController.getTodos(req, res, next);
      expect(next).toHaveBeenCalledWith(errorMessage);
    });

    it('should have a getTodos function', () => {
      expect(typeof todoController.getTodoById).toBe('function');
    });

    it('should call TodoModel.findById with route parameters', async () => {
      // call find passing some arguments, in this case an empty object
      req.params.todoId = todoId;
      await todoController.getTodoById(req, res, next);
      expect(TodoModel.findById).toHaveBeenCalledWith(todoId);
    });

    it('should return response body with status 200', async () => {
      TodoModel.findById.mockReturnValue(newTodo);
      await todoController.getTodoById(req, res, next);
      expect(res.statusCode).toBe(200);
      expect(res._isEndCalled()).toBeTruthy();
      expect(res._getJSONData()).toStrictEqual(newTodo);
    });

    it('should handle errors', async () => {
      const errorMessage = { message: 'TODO not found' };
      const rejectPromise = Promise.reject(errorMessage);
      TodoModel.findById.mockReturnValue(rejectPromise);
      await todoController.getTodoById(req, res, next);
      expect(next).toHaveBeenCalledWith(errorMessage);
    });

    it('should return 404 when item doesnt exist', async () => {
      TodoModel.findById.mockReturnValue(null);
      await todoController.getTodoById(req, res, next);
      expect(res.statusCode).toBe(404);
      expect(res._isEndCalled()).toBeTruthy();
    });
  });

  // Update
  describe('Controller UPDATE', () => {
    it('should have an updateTodo function', () => {
      expect(typeof todoController.updateTodo).toBe('function');
    });

    it('should update with findByIdAndUpdate', async () => {
      req.params.todoId = todoId;
      req.body = newTodo;
      await todoController.updateTodo(req, res, next);
      expect(TodoModel.findByIdAndUpdate).toHaveBeenCalledWith(todoId, newTodo, {
        new: true,
        useFindAndModify: false,
      });
    });

    it('should return a response with json and http code 200', async () => {
      req.params.todoId = todoId;
      req.body = newTodo;
      TodoModel.findByIdAndUpdate.mockReturnValue(newTodo);
      await todoController.updateTodo(req, res, next);
      // To check if has a response back
      expect(res._isEndCalled()).toBeTruthy();
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toStrictEqual(newTodo);
    });

    it('should handle error', async () => {
      const errorMessage = { message: 'Error' };
      const rejectedPromise = Promise.reject(errorMessage);
      TodoModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
      await todoController.updateTodo(req, res, next);
      expect(next).toHaveBeenCalledWith(errorMessage);
    });

    it('should return 404 when item was not found', async () => {
      TodoModel.findByIdAndUpdate.mockReturnValue(null);
      await todoController.updateTodo(req, res, next);
      expect(res.statusCode).toBe(404);
      expect(res._isEndCalled()).toBeTruthy();
    });
  });

  // Delete
  describe('Controller DELETE', () => {
    it('should have a deleteTodo function', () => {
      expect(typeof todoController.deleteTodo).toBe('function');
    });

    it('should call TodoModel.findByIdAndDelete', async () => {
      req.params.todoId = todoId;
      await todoController.deleteTodo(req, res, next);
      expect(TodoModel.findByIdAndDelete).toBeCalledWith(todoId);
    });

    it('should return 200 OK and delete TodoModel', async () => {
      TodoModel.findByIdAndDelete.mockReturnValue(newTodo);
      await todoController.deleteTodo(req, res, next);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toStrictEqual(newTodo);
      expect(res._isEndCalled()).toBeTruthy();
    });

    it('should handle errors', async () => {
      const errorMessage = { message: 'Error deleting' };
      const rejectMessage = Promise.reject(errorMessage);

      TodoModel.findByIdAndDelete.mockReturnValue(rejectMessage);
      await todoController.deleteTodo(req, res, next);
      expect(next).toHaveBeenCalledWith(errorMessage);
    });

    it('should handle error 404', async () => {
      TodoModel.findByIdAndDelete.mockReturnValue(null);
      await todoController.deleteTodo(req, res, next);
      expect(res.statusCode).toBe(404);
      expect(res._isEndCalled()).toBeTruthy();
    });
  });
});
