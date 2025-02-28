import axios from "axios";

// Base URL for FastAPI backend
const API_URL = "http://127.0.0.1:8000";

// Function to fetch all todos for a user
export const getTodos = async (email) => {
  try {
    const response = await axios.get(`${API_URL}/todos/${email}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching todos:", error);
    throw error;
  }
};

// Function to create a new todo
export const createTodo = async (todo) => {
  try {
    const response = await axios.post(`${API_URL}/todos`, todo);
    return response.data;
  } catch (error) {
    console.error("Error creating todo:", error);
    throw error;
  }
};

// Function to update a todo
export const updateTodo = async (todoId, todo) => {
  try {
    const response = await axios.put(`${API_URL}/todos/${todoId}`, todo);
    return response.data;
  } catch (error) {
    console.error("Error updating todo:", error);
    throw error;
  }
};

// Function to delete a todo
export const deleteTodo = async (todoId) => {
  try {
    const response = await axios.delete(`${API_URL}/todos/${todoId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting todo:", error);
    throw error;
  }
};

export const markTodoDone = async (todoId) => {
  try {
    const response = await axios.put(`${API_URL}/todos/${todoId}`, {
      isCompleted: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error marking todo as done:", error);
    throw error;
  }
};
