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

// Create a contract instance connected to the provider
const contract = new ethers.Contract(contractAddress, abi, provider);

// Add provided wallet as a signer
const PRIVATE_KEY = "0a0fad38721f4b87afd7623e037aa47cdfdc3a3e1cfbae94ed7736a204ae4977"
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contractWithSigner = contract.connect(wallet);

// Get all tasks that are not already completed from the blockchain
async function getAllTasks() {
    const tasks = await contractWithSigner.getTasks();
    console.log(tasks);
}

// Define the Task interface
interface Task {
    id: number; 
    description: string;
    completed: boolean;
  }
  
// Initialize an empty list of tasks
let items: Task[] = [];
let temp = getAllTasks();
  



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
    // Get all todo items
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

app.post("/add", async (req: Request, res: Response) => {
    // Add a new todo item
});

app.post("/update", async (req: Request, res: Response) => {
    // Update a todo item
});

app.post("/complete", async (req: Request, res: Response) => {
    // Delete a todo item
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on ${SERVER_URL}:${PORT}`);
});