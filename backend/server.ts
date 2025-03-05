import bodyParser from "body-parser";
import morgan from "morgan";
import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { ethers } from 'ethers';
// Importing global constants
import { SERVER_URL, PORT } from './config/appConfig.js';
// Importing blockchain related content
import abi from './config/abi/abi.json' with { type: "json" };
import { EthereumManager } from './ethManager/EthereumManager.js';


// Load variables from .env file into process.env
dotenv.config();

// Access the variables
const providerUrl = process.env.INFURA_PROVIDER_URL;
const contractAddress = process.env.CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Check for undefined variables and handle errors if needed
if (!providerUrl || !contractAddress || !PRIVATE_KEY) {
    throw new Error("Missing necessary environment variables");
}

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
    else res.status(400).json({ error: "Error with adding task to blockchain" });
});

app.patch("/api/complete-task", async (req: Request, res: Response) => {
    // Complete a todo item
    const taskId = req.body.id;
    console.log(req.body);
    // Check for task description
    // if (!taskId) res.status(400).json({ error: "Task id is required" });
    // const completeResult = await ethManager.completeTask(taskId);
    // if (completeResult) res.status(201).json({ message: "Task added successfully"});
    // else res.status(400).json({ error: "Error with adding task to blockchain" });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on ${SERVER_URL}:${PORT}`);
});