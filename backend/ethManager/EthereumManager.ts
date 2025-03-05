import { ethers } from 'ethers';
import { Web3 } from "web3";

// Define the Task structure based on contract output
interface Task {
    id: number;
    description: string;
    completed: boolean;
}

export class EthereumManager {

    private provider: ethers.JsonRpcProvider;       // Should be initialized with RPC provider
    private wallet: ethers.Wallet;                  // Current wallet that interacts with the provider
    private contract: any;                          // Initialized to specified contract object from ethers
    private contractWithSigner;                     // Initialized with contract object from ethers signed by specified wallet and the privatekey
    private contractAddress: string;                // Initialized with contract address
    private providerUrl: string;                    // Initialized with provider URL
    private abi: Array<any>;                        // Initialized with contract abi
    private tasks: Task[] = [];                     // Initialize tasks as empty list

    constructor(privateKey: string, providerUrl: string, contractAddress: string, abi: Array<any>) {
        // Initalize api and provider URL
        this.abi = abi;
        this.providerUrl = providerUrl;
        // Initialize provider and wallet
        this.provider = new ethers.JsonRpcProvider(providerUrl);
        this.wallet = new ethers.Wallet(privateKey, this.provider);
        // Create a contract instance
        this.contractAddress = contractAddress;
        this.contract = new ethers.Contract(contractAddress, abi, this.provider);
        // Add provided wallet as a signer
        this.contractWithSigner = this.contract.connect(this.wallet);
        console.log(`Wallet address: ${this.wallet.address}`);
        // Initialize tasks with existing tasks
        this.initializeTasks();
      }

    private async getAllTasks() {
        // Read all tasks from blockchain
        const tasksResult = await this.contractWithSigner.getTasks();
        // Convert the result to match the Task interface
        const tasks: Task[] = tasksResult.map((task: any) => ({
            id: Number(task.id),
            description: task.description,
            completed: task.completed
        }));
        return tasks;
    }

    public async initializeTasks() {
        // Get all tasks that are not already completed from the blockchain
        this.tasks = await this.getAllTasks();
        console.log(this.tasks);
    }

    public getTasks() {
        // Public method to get the list of tasks
        // Format tasks before return
        const formattedTasks = this.tasks
        .filter((task: Task) => !task.completed) // Filter out completed tasks
        return formattedTasks;
    }

    public async addTask (description: string) {
        // Interact with contract to add a task with the specified description
        try {
            // Send transaction to RPC provider
            console.log("Send transaction to RPC provider...");
            const tx = await this.contractWithSigner.addTask(description);
            // Wait for the transaction to be mined
            console.log("Waiting for transaction to be mined...");
            await tx.wait();
            console.log(tx);
    
            // Fetch the updated task list after confirmation
            this.initializeTasks();
    
            console.log("Task added successfully!");
            return true;
        } catch (err) {
            console.error("Error adding task:", err);
            return false;
        }
    }
    
    public async completeTask(id: number) {
        // Interact with contract to complete a task by specified task id
        try {
            // Send transaction to RPC provider
            const tx = await this.contractWithSigner.completeTask(id);
            // Wait for the transaction to be mined
            console.log("Waiting for transaction to be mined...");
            await tx.wait();
            console.log(tx);
    
            // Fetch the updated task list after confirmation
            this.initializeTasks();
    
            console.log("Task completed successfully!");
            return true;
        } catch (err) {
            console.error("Error completing task:", err);
            return false;
        }
    }
}