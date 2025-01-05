import React, { useState, useEffect } from 'react';
import Web3 from 'web3';  // Import Web3.js

const MintNFT = () => {
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [numTokens, setNumTokens] = useState(1);

  const contractAddress = "0x8d1E872DcadB2879CB8C3558E9B6C231A6f53a3C"; // Replace with your contract address
  const contractABI = [
    // Minimal contract ABI for mint function
    {
      "constant": false,
      "inputs": [
        {
          "name": "_numTokens",
          "type": "uint256"
        }
      ],
      "name": "mint",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    }
  ];

  useEffect(() => {
    if (window.ethereum) {
      // Initialize Web3.js using the browser's Ethereum provider (Metamask)
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
    } else {
      alert("Please install MetaMask!");
    }
  }, []);

  // Connect to MetaMask
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }

    // Request user's accounts and set the account
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0]);

    // Create contract instance
    const contractInstance = new web3.eth.Contract(contractABI, contractAddress);
    setContract(contractInstance);
  };

  // Handle Minting
  const mintNFT = async () => {
    if (!contract || !account) {
      alert("Please connect wallet first");
      return;
    }

    // Convert 0.02 Ether to Wei
    const value = web3.utils.toWei('0.02', 'ether'); 

    try {
      await contract.methods.mint(numTokens)
        .send({ from: account, value });
      alert("Minting Successful!");
    } catch (error) {
      console.error(error);
      alert("Minting failed!");
    }
  };

  return (
    <div>
      <h1>Mint Angry Seal NFTs</h1>
      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected as: {account}</p>
          <button onClick={() => connectWallet()}>Switch Account</button>
        </div>
      )}

      <div>
        <input
          type="number"
          value={numTokens}
          onChange={(e) => setNumTokens(e.target.value)}
          min="1"
          max="20"
        />
        <button onClick={mintNFT}>Mint</button>
      </div>
    </div>
  );
};

export default MintNFT;