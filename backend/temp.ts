

async function addTask(description) {
  const tx = await contractWithSigner.addTask(description);
  await tx.wait();  // Wait for the transaction to be mined
  console.log('Task added!');
}

addTask("New Task Description");