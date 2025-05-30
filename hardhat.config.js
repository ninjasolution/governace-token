const fs = require('fs');
require("@nomicfoundation/hardhat-toolbox");
require("@onmychain/hardhat-uniswap-v2-deploy-plugin");
// Any file that has require('dotenv').config() statement 
// will automatically load any variables in the root's .env file.
require('dotenv').config();

const PRIVATE_KEY = process.env.PRIVATE_KEY
const etherscanKey = process.env.ETHERSCAN_KEY
const infraKey = process.env.INFRA_KEY

function getRemappings() {
  return fs
    .readFileSync('remappings.txt', 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => line.trim().split('='));
}

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    mainnet: {
      url: `https://mainnet.infura.io/v3/${infraKey}`,
      accounts: [PRIVATE_KEY],
      //gasPrice: 120 * 1000000000,
      chainId: 1,
    },
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: [PRIVATE_KEY]
    },
    hardhat: {
      allowUnlimitedContractSize: true,
      chainId: 31337
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${infraKey}`,
      accounts: [PRIVATE_KEY],
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/-hba0sbFIuYmoTG2WmZDby52IY90I5pb`,
      accounts: [PRIVATE_KEY],
      chainId: 11155111
    },
    localhost: {
      live: false,
      saveDeployments: true,
      tags: ["local"],
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 2000
          },
        },
      },
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 2000,
          },
          viaIR: true
        },
      },]
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  },
  etherscan: {
    apiKey: etherscanKey,
  },
  preprocess: {
    eachLine: (hre) => ({
      transform: (line) => {
        if (line.match(/^\s*import /i)) {
          getRemappings().forEach(([find, replace]) => {
            if (line.match(find)) {
              line = line.replace(find, replace);
            }
          });
        }
        return line;
      },
    }),
  },
}