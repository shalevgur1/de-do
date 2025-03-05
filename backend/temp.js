import { ethers } from 'ethers';
import { Web3 } from "web3";

const INFURA_PROVIDER_URL='https://holesky.infura.io/v3/e65a0c1ae488481eac0046bdda9440b2'
const CONTRACT_ADDRESS='0xC61966085893F3ff49becf192D5caFb9CA9d9Fd7'
const PRIVATE_KEY='0x0a0fad38721f4b87afd7623e037aa47cdfdc3a3e1cfbae94ed7736a204ae4977'


const web3: Web3 = new Web3(new Web3.providers.HttpProvider(this.providerUrl));
        const contract = new web3.eth.Contract(this.abi, this.contractAddress); // Contract address

        const account = web3.eth.accounts.privateKeyToAccount(this.privateKey);
        web3.eth.accounts.wallet.add(account);

        try {
            const currentNonce = await web3.eth.getTransactionCount(account.address);
            const nonce = currentNonce + 1n;
            const rawTransaction = {
                from: this.wallet.address,
                to: this.contractAddress,
                data: contract.methods.addTask(description).encodeABI(),
                gas: 100000,
                gasPrice: await web3.eth.getGasPrice(),
                nonce: nonce.toString(),
                chainId: 17000, // Replace with the correct chain ID
            };

            const signedTx = await web3.eth.accounts.signTransaction(rawTransaction, this.privateKey);

            web3.eth.sendSignedTransaction(signedTx.rawTransaction)
                .then(receipt => {
                    console.log(`Transaction successful: ${receipt.transactionHash}`);
                })
                .catch(error => {
                    console.error("Error sending raw transaction:", error);
                });

        } catch (err) {
            console.error("Error calling addTask():", err);
            return false;
        }

        
        // try {
            
        //     const currentNonce = await web3.eth.getTransactionCount(account.address);
        //     const nonce = currentNonce + 1n;
        //     console.log("Current nonce:", currentNonce);
        //     console.log("make transaction");
        //     const result = await contract.methods.addTask(description).send({
        //         from: this.wallet.address,
        //         nonce: nonce.toString(),  // Explicitly setting the nonce
        //         gas: web3.utils.toHex(100000), // Adjust the gas limit based on your needs
        //         gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()) // Use current gas price
        //     });
        //     console.log(`Transaction successful`);
        //     return true;
        // } catch (error) {
        //     console.error("Error calling addTask():", error);
        //     return false;
        // }

        try {
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