import bodyParser from "body-parser";
import morgan from "morgan";
import express, { Request, Response, NextFunction } from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { ethers } from 'ethers';
// Importing global constants
import { SERVER_URL, PORT } from './config/appConfig.js';
// Importing blockchain related content
import abi from './config/abi/abi.json' with { type: "json" };
import { EthereumManager } from './ethManager/EthereumManager.js';

// Setup RPC and contract interactions with ethers
const providerUrl = "https://holesky.infura.io/v3/e65a0c1ae488481eac0046bdda9440b2";
const contractAddress = '0xC61966085893F3ff49becf192D5caFb9CA9d9Fd7';
const PRIVATE_KEY = "0a0fad38721f4b87afd7623e037aa47cdfdc3a3e1cfbae94ed7736a204ae4977"

const ethManager = new EthereumManager(PRIVATE_KEY, providerUrl, contractAddress, abi);

// Setup express app
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Middlewares for http requests
app.use(bodyParser.json());                           // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));   // For parsing application/x-www-form-urlencoded
// app.use(morgan("tiny"));

// Serve static files from the frontend's build folder
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get("/", async (req: Request, res: Response) => {
    // Get main page
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

app.get("/api/all-tasks", async (req: Request, res: Response) => {
    // Get all todo list tasks
    const formattedTasks = ethManager.getTasks();
    res.json(formattedTasks);
});

app.post("/api/add-task", async (req: Request, res: Response) => {
    // Add a new todo item
    const taskDescription = req.body.description;
    // Check for task description
    if (!taskDescription) res.status(400).json({ error: "Task description is required" });
    const addResult = await ethManager.addTask(taskDescription);
    if (addResult) res.status(201).json({ message: "Task added successfully"});
    res.status(400).json({ error: "Error with adding task to blockchain" })
});

app.patch("/api/complete-task", async (req: Request, res: Response) => {
    // Complete a todo item
    const taskId = req.body.id;
    // Check for task description
    if (!taskId) res.status(400).json({ error: "Task id is required" });
    const completeResult = await ethManager.completeTask(taskId);
    if (completeResult) res.status(201).json({ message: "Task added successfully"});
    res.status(400).json({ error: "Error with adding task to blockchain" })
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on ${SERVER_URL}:${PORT}`);
});