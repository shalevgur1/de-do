import { ethers } from 'ethers';

// Define the Task structure based on your contract's output
interface Task {
    id: number;
    description: string;
    completed: boolean;
}

export class EthereumManager {

    private provider: ethers.JsonRpcProvider;
    private wallet: ethers.Wallet;
    private contract: any;
    private contractWithSigner;
    private tasks: Task[] = [];                 // Initialize tasks as empty list

    constructor(privateKey: string, providerUrl: string, contractAddress: string, abi: Array<any>) {
        // Initialize provider and wallet
        this.provider = new ethers.JsonRpcProvider(providerUrl);
        this.wallet = new ethers.Wallet(privateKey, this.provider);
        // Create a contract instance
        this.contract = new ethers.Contract(contractAddress, abi, this.provider);
        // Add provided wallet as a signer
        this.contractWithSigner = this.contract.connect(this.wallet);
        console.log(`Wallet address: ${this.wallet.address}`);
        // Initialize tasks with existing tasks
        this.initializeTasks();
      }

    private async getAllTasks() {
        // Read all tasks from blockchain
        try {
            const tasks = await this.contractWithSigner.getTasks();
            // If tasks is empty (e.g., no tasks on the contract), handle it gracefully
            if (!tasks || tasks.length === 0) {
              console.log('No tasks found.');
              return []; // Return an empty array if no tasks are found
            }
            return tasks;
          } catch (error) {
            //console.error('Error getting tasks:', error);
            console.log("No tasks found in initialization");
            return []; // Return empty array if there's an error
          }
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
        .map((task: Task) => {
            // Fomrat tasks before sending to client
            return {
                id: task.id.toString(),  // Convert BigInt to string
                description: task.description,
                completed: task.completed
            };
        });
        return formattedTasks;
    }


    public async addTask (description: string) {
        try {
            // Send transaction to RPC provider
            console.log("Send transaction to RPC provider...")
            const currentNonce = await this.provider.getTransactionCount(this.wallet.address, "latest");
            const tx = await this.contractWithSigner.addTask(description,  {
                gasLimit: 100000, // Set a reasonable gas limit for the transaction
                nonce: currentNonce + 1 // Use the fetched current nonce
            });
            console.log(tx.hash);
    
            // Wait for the transaction to be mined
            console.log("Waiting for confirmation...");
            const receipt = await tx.wait(); 
            console.log("Transaction confirmed in block:", receipt.blockNumber);
    
            // Fetch the updated task list AFTER confirmation
            const updatedTasks = await this.getAllTasks();
            console.log("Updated Tasks:", updatedTasks);
    
            console.log("Task added successfully!");
            return true;
        } catch (err) {
            console.error("Error adding task:", err);
            return false;
        }
    }
    
    public async completeTask(id: number) {
        try {
            // Send transaction to RPC provider
            const tx = await this.contractWithSigner.completeTask(id);
            console.log(tx.hash);
    
            // Wait for the transaction to be mined
            console.log("Waiting for confirmation...");
            const receipt = await tx.wait(); 
            console.log("Transaction confirmed in block:", receipt.blockNumber);
    
            // Fetch the updated task list AFTER confirmation
            const updatedTasks = await this.getAllTasks();
            console.log("Updated Tasks:", updatedTasks);
    
            console.log("Task added successfully!");
            return true;
        } catch (err) {
            console.error("Error adding task:", err);
            return false;
        }
    }
}