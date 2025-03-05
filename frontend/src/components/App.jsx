import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Task from "./Task";
import CreateArea from "./CreateArea";
import { SERVER_URL } from "../config/constants";

function App() {

  // Configure React states
  const [tasks, setTasks] = useState([]);                     // List of tasks on dashboard

  // Fetch tasks from the backend when the component mounts
  useEffect( () => {
    async function fetchTasks() {
      // Fetch tasks from the API
      try {
        const response = await fetch(`${SERVER_URL}/api/all-tasks`, {method: "GET"});
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    }
    fetchTasks();
  }, []);

  async function addTask(newTask) {
    // Add a new task and send to backend
    // Send added task to backend
    try {
      const response = await fetch(`${SERVER_URL}/api/add-task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });
      if (!response.ok) {
        throw new Error("Failed to add task");
      } else {
        const data = await response.json();
        console.log(data.message);
      }
    } catch (err) {
      console.error("Error adding task:", err);
    }
    // Update frontend with added task
    setTasks(prevTasks => {
      return [...prevTasks, newTask];
    });
  }


  async function completeTask(id) {
    console.log(id);
    // Complete a task and send complition to backend
    // Send added task to backend
    try {
      const response = await fetch(`${SERVER_URL}/api/complete-task`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(id),
      });
      if (!response.ok) {
        throw new Error("Failed to add task");
      } else {
        const data = await response.json();
        console.log(data.message);
      }
    } catch (err) {
      console.error("Error adding task:", err);
    }
    // Remove completed task from frontend
    setTasks(prevTasks => {
      return prevTasks.filter((taskItem, index) => {
        console.log(taskItem.id);
        return taskItem.id !== id;
      });
    });
  }

  return (
    <div>
      <Header />
        <CreateArea onAdd={addTask} />
        {tasks.map((taskItem, index) => {
          return (
            <Task
              key={taskItem.id}
              id={taskItem.id}
              description={taskItem.description}
              onComplete={completeTask}
            />
          );
        })}
      <Footer />
    </div>
  );
}

export default App;
