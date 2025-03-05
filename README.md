# `DeDo`
Welcome to the DeDo web application! This is a decentralized application (dApp) running on one of the Ethereum testnet blockchains.

With this app, you can create tasks on a decentralized task list, where your task data is securely stored using a smart contract on the blockchain, ensuring decentralization.

## Running locally

1. Clone the repository to your local machine from GitHub and navigate to the project folder via the command line.

2. Install all dependencies by running the following command:
```bash
npm run install:all
```

3. Create a .env file in the 'backend' subfolder of the project:
```bash
cd backend
touch .env
cd ..
```

4. Edit the .env file to include the next necessary credentials. Fill in according to your provider URL, contract address, and private key:
INFURA_PROVIDER_URL= 'Your URL'
CONTRACT_ADDRESS='Your contract address'
PRIVATE_KEY='Your private key'

5. Start the application by running this command:
```bash
npm run start
```

6. Open your browser and go to the URL displayed in the console (typically: http://localhost:3000).

7. Interact with the user interface (UI). You can create new tasks and mark existing ones as complete by clicking the '+' and 'Complete' buttons.
