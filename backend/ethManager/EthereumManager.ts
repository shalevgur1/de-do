import { ethers } from 'ethers';
import { Web3 } from "web3";

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
    private contractAddress: string;
    private providerUrl: string;
    private abi: Array<any>;
    private tasks: Task[] = [];                 // Initialize tasks as empty list

    constructor(privateKey: string, providerUrl: string, contractAddress: string, abi: Array<any>) {
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
        //this.initializeTasks();
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
        // const providerUrl = "https://holesky.infura.io/v3/e65a0c1ae488481eac0046bdda9440b2";
        // const contractAddress = '0xC61966085893F3ff49becf192D5caFb9CA9d9Fd7';
        // const PRIVATE_KEY = '0x0a0fad38721f4b87afd7623e037aa47cdfdc3a3e1cfbae94ed7736a204ae4977';
        // const web3: Web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
        // const contract = new web3.eth.Contract(this.abi, contractAddress); // Contract address

        // const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
        // web3.eth.accounts.wallet.add(account);

        // //const result = await contract.methods.getSomeText().call();

        // try {
        //     const currentNonce = await web3.eth.getTransactionCount(account.address);
        //     console.log("Current nonce:", currentNonce);
        //     console.log("make transaction");
        //     const result = await contract.methods.addTask(description).send({
        //         from: this.wallet.address
        //     });
        //     console.log(`Transaction successful`);
        //     return true;
        // } catch (error) {
        //     console.error("Error calling addTask():", error);
        //     return false;
        // }



        try {
            console.log(this.providerUrl);
            console.log(this.contractAddress);
            // Send transaction to RPC provider
            console.log("Send transaction to RPC provider...");
            const tx = await this.wallet.sendTransaction({
                to: this.contractAddress,  // Contract address
                data: this.contract.interface.encodeFunctionData("addTask", [description]),
                gasLimit: ethers.parseUnits("100000", "wei"), // Adjust based on gas estimate
                gasPrice: ethers.parseUnits("100", "gwei"), // Increase gas price (in Gwei)
            });
            // const tx = await this.contractWithSigner.addTask(description);
            // Wait for the transaction to be mined
            await tx.wait();
            console.log(tx);
    
            // Fetch the updated task list after confirmation
            //const updatedTasks = await this.getAllTasks();
            //console.log("Updated Tasks:", updatedTasks);
    
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
    
            // Fetch the updated task list after confirmation
            const updatedTasks = await this.getAllTasks();
            console.log("Updated Tasks:", updatedTasks);
    
            console.log("Task completed successfully!");
            return true;
        } catch (err) {
            console.error("Error completing task:", err);
            return false;
        }
    }
}