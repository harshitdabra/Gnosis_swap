import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { ethers } from 'ethers';
import SimpleSwapRouterABI from './abis/SimpleSwapRouter.json'; // Import your contract ABI

const Swap = () => {
  const [account, setAccount] = useState('');
  const [amountIn, setAmountIn] = useState('');
  const [amountOutMin, setAmountOutMin] = useState('');
  const [tokenIn, setTokenIn] = useState('');
  const [tokenOut, setTokenOut] = useState('');
  const [deadline, setDeadline] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const loadWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      } else {
        console.log("Non-Ethereum browser detected. You should consider trying MetaMask!");
      }
    };

    const loadBlockchainData = async () => {
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
      const contractInstance = new web3.eth.Contract(SimpleSwapRouterABI, contractAddress);
      setContract(contractInstance);
    };

    if (web3) loadBlockchainData();
    else loadWeb3();
  }, [web3]);

  const handleSwap = async () => {
    try {
      const path = [tokenIn, tokenOut];
      const deadlineTimestamp = Math.floor(Date.now() / 1000) + parseInt(deadline); // Set deadline as seconds from now
      
      const tx = await contract.methods
        .swapExactTokensForTokens(
          ethers.utils.parseUnits(amountIn, 'ether'),  // amountIn in Wei
          ethers.utils.parseUnits(amountOutMin, 'ether'), // amountOutMin in Wei
          path,
          account,
          deadlineTimestamp
        )
        .send({ from: account });

      console.log('Transaction:', tx);
      alert('Swap successful!');
    } catch (error) {
      console.error('Error swapping tokens:', error);
      alert('Swap failed');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Token Swap</h2>
      <p>Account: {account}</p>
      <input
        type="text"
        placeholder="Token In Address"
        value={tokenIn}
        onChange={(e) => setTokenIn(e.target.value)}
      />
      <input
        type="text"
        placeholder="Token Out Address"
        value={tokenOut}
        onChange={(e) => setTokenOut(e.target.value)}
      />
      <input
        type="text"
        placeholder="Amount In (ETH)"
        value={amountIn}
        onChange={(e) => setAmountIn(e.target.value)}
      />
      <input
        type="text"
        placeholder="Minimum Amount Out (ETH)"
        value={amountOutMin}
        onChange={(e) => setAmountOutMin(e.target.value)}
      />
      <input
        type="text"
        placeholder="Deadline (seconds)"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />
      <button onClick={handleSwap}>Swap</button>
    </div>
  );
};

export default Swap;
