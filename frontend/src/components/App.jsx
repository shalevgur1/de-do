import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Task from "./Task";
import CreateArea from "./CreateArea";
import { SERVER_URL } from "../config/constants";

function App() {

  // Configure React states
  const [tasks, setTasks] = useState([]);                     // List of tasks on dashboard

  // Detect web3 provider (should be MetaMask)
  const detectCurrentProvider = () => {
    let provider;
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      provider = window.web3.currentProvider;
    } else {
      console.log("NON ETHEREUM BROWSER DETECTED: You should install MetaMask");
    }
    return provider;
  }

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
              id={index}
              title={taskItem.title}
              content={taskItem.content}
              onDelete={completeTask}
            />
          );
        })}
      <Footer />
    </div>
  );
}

export default App;
