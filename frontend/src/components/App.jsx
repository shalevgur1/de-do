import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Task from "./Task";
import CreateArea from "./CreateArea";
import { SERVER_URL } from "../config/constants";

function App() {

  // Configure React states
  const [tasks, setTasks] = useState([]);                       // List of tasks on dashboard
  const [isLoading, setIsLoading] = useState(false);            // Set loading screen during transactions
  const [isResult, setIsResult] = useState(false);              // Check for transaction result screen
  const [resultText, setResultText] = useState("");             // Set transaction result screen text
  const [tasksUpdated, setTasksUpdated] = useState(false);      // Update tasks list with useEffect after adding a new task

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
  }, [tasksUpdated]);

  async function addTask(newTask) {
    // Add a new task and send to backend
    // Send added task to backend
    let resultMessage = "An issue occurred with the transaction...";
    setIsLoading(true);
    try {
      // Send api request
      const response = await fetch(`${SERVER_URL}/api/add-task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });
      if (!response.ok) {
        throw new Error(response.error);
      } else {
        const data = await response.json();
        resultMessage = data.message;
        console.log(resultMessage);
        // Update frontend with new task only if task was added to blockchain
      }
    } catch (err) {
      console.error("Error:", err);
    }
    setIsLoading(false);
    setResultText(resultMessage);
    setIsResult(true);
  }


  async function completeTask(id) {
    // Complete a task and send complition to backend
    // Send added task to backend
    let resultMessage = "An issue occurred with the transaction...";
    setIsLoading(true);
    try {
      // Send api request
      const response = await fetch(`${SERVER_URL}/api/complete-task`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });
      if (!response.ok) {
        throw new Error(response.error);
      } else {
          // Remove completed task from frontend only if task was marked completed on the blockchain 
          setTasks(prevTasks => {
            return prevTasks.filter((taskItem, index) => {
              return taskItem.id !== id;
            });
          });
        const data = await response.json();
        resultMessage = data.message;
        console.log(resultMessage);
      }
    } catch (err) {
      console.error("Error:", err);
    }
    setIsLoading(false);
    setResultText(resultMessage);
    setIsResult(true);
  }

  return (
    <div>
      <Header />
      
      {/* Loading screen */}
      {isLoading ? (
        <div className="loading-container">
          <h2>Waiting for your transaction to be mined...</h2>
        </div>
      ) : (
        // Display after loading is finished
        isResult ? (
          <div className="completed-container">
            <h2>{resultText}</h2>
            <button onClick={() => { 
              setIsResult(false);
              setIsLoading(false);
              setTasksUpdated(prev => !prev);       // Fetch tasks again from backend
              }}>
              Close
            </button>
          </div>
        ) : (
          <>
            <CreateArea onAdd={addTask} />
            {tasks.map((taskItem) => {
              return (
                <Task
                  key={taskItem.id}
                  id={taskItem.id}
                  description={taskItem.description}
                  onComplete={completeTask}
                />
              );
            })}
          </>
        )
      )}
      
      <Footer />
    </div>
  );
}

export default App;
