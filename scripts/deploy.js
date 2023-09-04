// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");

async function main() {

  let router = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  let vault = "0x7B7887059860a1A21f3C62542B6CE5c0a23c76d5";
  let token = {
    address: "0xcaC3DD71473BcB38F41f8C0AC6DFC0590078E6EA"
  }
  let timelockController = {
    address: "0x94fdBD4d8Fd6B39888297bc5f8Db83D3798d328D"
  }

  // let governor = {
  //   address: "0x91C45c77cEe873388169E5cf4c1e1faA3045De31"
  // }

  let processors = ["0x7B7887059860a1A21f3C62542B6CE5c0a23c76d5"];
  let executors = ["0x7B7887059860a1A21f3C62542B6CE5c0a23c76d5"]

  const Token = await hre.ethers.getContractFactory("DRE");
  // const token = await Token.deploy()
  // console.log("DRE deployed to:", token.address);
  token = await Token.attach(token.address);


  // const TimelockController = await ethers.getContractFactory("TimelockController");
  // const timelockController = await TimelockController.deploy(7200, processors, executors, processors[0]);
  // await timelockController.deployed();
  // console.log(`TimelockController deployed to: ${timelockController.address}`);

  // deploy Governor
  const DREGovernor = await ethers.getContractFactory("DREGovernor");
  governor = await DREGovernor.deploy(token.address, timelockController.address);
  await governor.deployed();
  console.log(`Dovernor deployed to: ${governor.address}`);

  // governor = await DREGovernor.attach(governor.address);
  
  // const grantAmount = ethers.utils.parseEther("1000");
  // const transferCalldata = token.interface.encodeFunctionData("transfer", [processors[0], grantAmount]);

  // await governor.propose(
  //     [token.address],
  //     [0],
  //     [transferCalldata],
  //     "Proposal #1: Give grant to team"
  //   );



}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
