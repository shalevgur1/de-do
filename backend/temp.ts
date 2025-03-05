  
  // Step 3: Define the contract ABI (Interface for the contract)
// const contractAbi = [
//     "function getTasks() public view returns (tuple(uint256 id, string description, bool completed)[])",
//     "function addTask(string description) public",
//     "function completeTask(uint256 taskId) public"
//   ];

  

// Define the interface for the contract, based on the ABI
interface TodoContract extends ethers.Contract {
    // Function to get all tasks, returns an array of task objects
    getTasks(): Promise<{ id: number; description: string; completed: boolean }[]>;
    // Function to add a task, no output (void)
    addTask(description: string): Promise<void>;
    // Function to mark a task as completed, no output (void)
    completeTask(taskId: number): Promise<void>;
    // Event for when a task is added
    onTaskAdded(listener: (id: number, description: string) => void): void;
    // Event for when a task is completed
    onTaskCompleted(listener: (id: number) => void): void;
}


async function addTask(description) {
  const tx = await contractWithSigner.addTask(description);
  await tx.wait();  // Wait for the transaction to be mined
  console.log('Task added!');
}

addTask("New Task Description");