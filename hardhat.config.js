require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config(); // This loads environment variables from .env
require('@nomiclabs/hardhat-ethers');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.5.11", // For contracts using 0.5.11
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.6.6", // For contracts using 0.6.6
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.27", // For contracts using 0.8.27
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  
  networks: {
    gnosis: {
      url: "https://rpc.chiadochain.net",  // RPC URL for Gnosis Chain
      accounts: [`0x${process.env.PRIVATE_KEY}`],  // Use the private key from .env
    },
  },
};
