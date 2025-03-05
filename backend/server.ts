import bodyParser from "body-parser";
import morgan from "morgan";
import express, { Request, Response, NextFunction } from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
// Importing constants
import { SERVER_URL, PORT } from './config/appConfig.js';

// Setup express app
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Middlewares for http requests
app.use(bodyParser.json());                           // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));   // For parsing application/x-www-form-urlencoded
app.use(morgan("tiny"));

// Serve static files from the frontend's build folder
app.use(express.static(path.join(__dirname, '../frontend/build')));

let items = [];

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