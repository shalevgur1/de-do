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
  useEffect( async () => {
    // Fetch tasks from the API
    try {
      const response = await fetch(`${SERVER_URL}/api/all-tasks`, {method: "GET"});
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  }, []); // Empty dependency array ensures it runs once when the component mounts


  // Add a task to your dashboard
  function addTask(newTask) {
    setTasks(prevTasks => {
      return [...prevTasks, newTask];
    });
  }

  // Delete a task from your dashboard
  function completeTask(id) {
    setTasks(prevTasks => {
      return prevTasks.filter((taskItem, index) => {
        return index !== id;
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
              key={index}
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
