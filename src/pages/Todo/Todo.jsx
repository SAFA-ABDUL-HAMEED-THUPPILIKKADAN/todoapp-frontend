import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Todo.module.css";

const Todo = () => {
  const navigate = useNavigate();
  // const [currentUser, setCurrentUser] = useState(
  //   JSON.parse(localStorage.getItem("loggedInUser"))
  // );
  const [userTodos, setUserTodos] = useState([]);
  const [currentTodo, setCurrentTodo] = useState({
    title: "",
    deadline: "",
    createdAt: new Date().toISOString(),
    completedAt: null,
    isCompleted: false,
  });
  const [previousTodo, setPreviousTodo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await fetch("http://localhost:8000/getAll", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch todos");
        const todos = await response.json();
        setUserTodos(todos);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTodos();
  }, []);

  const updateTodo = async () => {
    if (currentTodo.title.trim() === "" || currentTodo.deadline.trim() === "")
      return;

    const token = localStorage.getItem("access_token"); // Ensure token is available
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      let response;
      if (isEditing) {
        // Send a PUT request to update an existing todo
        response = await fetch(
          `http://localhost:8000/update/${currentTodo.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title: currentTodo.title,
              deadline: currentTodo.deadline,
              isCompleted: currentTodo.isCompleted,
            }),
          }
        );
      } else {
        // Send a POST request to create a new todo
        response = await fetch("http://localhost:8000/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: currentTodo.title,
            deadline: currentTodo.deadline,
            isCompleted: false,
          }),
        });
      }

      if (!response.ok) {
        throw new Error("Failed to save todo");
      }

      const updatedTodo = await response.json();

      if (isEditing) {
        // Update UI for edited todo
        setUserTodos(
          userTodos.map((todo) =>
            todo.id === updatedTodo.id ? updatedTodo : todo
          )
        );
      } else {
        // Add new todo to UI
        setUserTodos([...userTodos, updatedTodo]);
      }

      cancelEdit(); // Reset form fields after update
    } catch (error) {
      console.error("Error saving todo:", error);
    }
  };

  const editTodo = (id) => {
    const todoToEdit = userTodos.find((todo) => todo.id === id);
    setPreviousTodo({ ...todoToEdit });
    setCurrentTodo(todoToEdit);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setCurrentTodo({
      title: "",
      deadline: "",
      createdAt: new Date().toISOString(),
      completedAt: null,
      isCompleted: false,
    });
    setIsEditing(false);
    setPreviousTodo(null);
  };

  const deleteTodo = async (id) => {
    try {
      const token = localStorage.getItem("access_token"); // Ensure the token is available
      if (!token) {
        console.error("No token found, user is not authenticated");
        return;
      }

      const response = await fetch(`http://localhost:8000/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Sending JWT token
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to delete todo");
      }

      setUserTodos(userTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const markTodoDone = async (id) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("No token found, user is not authenticated");
        return;
      }

      const response = await fetch(`http://localhost:8000/update/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isCompleted: true, // This triggers completion in the backend
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update todo");
      }

      const updatedTodo = await response.json();

      // Update the UI state after marking as completed
      setUserTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id
            ? {
                ...todo,
                isCompleted: true,
                completedAt: new Date().toISOString(),
              }
            : todo
        )
      );
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const categorizeTasks = () => {
    const now = new Date();
    const pending = [];
    const completedOnTime = [];
    const delayed = [];

    userTodos.forEach((todo) => {
      const deadline = new Date(todo.deadline);
      if (!todo.isCompleted) {
        if (deadline < now) {
          delayed.push(todo);
        } else {
          pending.push(todo);
        }
      } else {
        const completedAt = new Date(todo.completedAt);
        if (completedAt <= deadline) {
          completedOnTime.push(todo);
        } else {
          delayed.push(todo); // If completed after deadline, move to delayed
        }
      }
    });

    return { pending, completedOnTime, delayed };
  };

  const { pending, completedOnTime, delayed } = categorizeTasks();

  const formatDate = (date) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(date).toLocaleDateString("en-GB", options);
  };

  return (
    <>
      <div className={styles.mainContainer}>
        <h1 className={styles.todo}>My Todos</h1>
        <div>
          <input
            type="text"
            placeholder="Task Title"
            value={currentTodo.title}
            onChange={(e) =>
              setCurrentTodo({ ...currentTodo, title: e.target.value })
            }
            className={styles.title}
          />
          <input
            type="datetime-local"
            value={currentTodo.deadline}
            onChange={(e) =>
              setCurrentTodo({ ...currentTodo, deadline: e.target.value })
            }
            className={styles.title}
          />
          <button onClick={updateTodo} className={styles.btn1}>
            {isEditing ? "Update Todo" : "Add Todo"}
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("loggedInUser");
              navigate("/login");
            }}
            className={styles.btn5}
          >
            Logout
          </button>
          {isEditing && (
            <button
              onClick={cancelEdit}
              style={{ marginLeft: "10px" }}
              className={styles.btn1}
            >
              Undo
            </button>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "50px",
        }}
      >
        <div className={styles.tasks}>
          <h2 className={styles.heading}>Pending Tasks</h2>
          {pending.map((todo) => (
            <div key={todo.id}>
              <p className={styles.miniTitle}>{todo.title}</p>
              <p className={styles.container}>
                Deadline: {formatDate(todo.deadline)}
              </p>
              <div className={styles.buttons}>
                <button
                  onClick={() => markTodoDone(todo.id)}
                  className={styles.btn3}
                >
                  Mark as Done
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className={styles.btn4}
                >
                  Delete
                </button>
                <button
                  onClick={() => editTodo(todo.id)}
                  className={styles.btn2}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.tasks}>
          <h2 className={styles.heading}>Completed On Time</h2>
          {completedOnTime.map((todo) => (
            <div key={todo.id}>
              <p className={styles.miniTitle}>{todo.title}</p>
              <p className={styles.container}>
                Completed At: {formatDate(todo.completedAt)}
              </p>
            </div>
          ))}
        </div>

        <div className={styles.tasks}>
          <h2 className={styles.heading}>Delayed Tasks</h2>
          {delayed.map((todo) => (
            <div key={todo.id}>
              <p className={styles.miniTitle}>{todo.title}</p>
              <p className={styles.container}>
                Deadline: {formatDate(todo.deadline)}
              </p>
              <div className={styles.buttons}>
                <button
                  onClick={() => markTodoDone(todo.id)}
                  className={styles.btn3}
                >
                  Mark as Done
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Todo;
