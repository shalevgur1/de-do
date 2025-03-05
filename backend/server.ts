import bodyParser from "body-parser";
import morgan from "morgan";
import express, { Request, Response, NextFunction } from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { ethers } from 'ethers';
// Importing blockchain related content
import abi from './config/abi/abi.json' with { type: "json" };
// Importing global constants
import { SERVER_URL, PORT } from './config/appConfig.js';

// Setup RPC and contract interactions with ethers
const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/e65a0c1ae488481eac0046bdda9440b2");
const contractAddress = '0xC282597ff29ca5b8c8dC8783E27503a79cb42a5D';

// Define the Task structure based on your contract's output
interface Task {
    id: number;
    description: string;
    completed: boolean;
}

// Create a contract instance and specify the custom interface with the getTasks method
const contract: any = new ethers.Contract(contractAddress, abi, provider);

// Add provided wallet as a signer
const PRIVATE_KEY = "0a0fad38721f4b87afd7623e037aa47cdfdc3a3e1cfbae94ed7736a204ae4977"
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contractWithSigner = contract.connect(wallet);

// Initialize tasks as empty list
let tasks: Task[] = [];

async function getAllTasks() {
    // Read all tasks from blockchain
    const tasks: Task[] = await contractWithSigner.getTasks();
    return tasks;
}

async function initializeTasks() {
    // Get all tasks that are not already completed from the blockchain
    tasks = await getAllTasks();
}

// Call the function to initialize the tasks
initializeTasks();
  



// Setup express app
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Middlewares for http requests
app.use(bodyParser.json());                           // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));   // For parsing application/x-www-form-urlencoded
app.use(morgan("tiny"));

// Serve static files from the frontend's build folder
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get("/", async (req: Request, res: Response) => {
    // Get main page
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

app.get("/api/all-tasks", async (req: Request, res: Response) => {
    // Get all todo list tasks
    const formattedTasks = tasks
    .filter((task: Task) => !task.completed) // Filter out completed tasks
    .map((task: Task) => {
        // Fomrat tasks before sending to client
        return {
            id: task.id.toString(),  // Convert BigInt to string
            name: task.description,
            completed: task.completed
        };
    });
    res.json(formattedTasks);
});

app.post("/api/add", async (req: Request, res: Response) => {
    // Add a new todo item
});

app.post("/api/update", async (req: Request, res: Response) => {
    // Update a todo item
});

app.post("/api/complete", async (req: Request, res: Response) => {
    // Delete a todo item
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on ${SERVER_URL}:${PORT}`);
});