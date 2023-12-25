// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");

async function main() {

  let tokenAddr = "0x0cb611b4346Cb732Aad3bAcEFADADAC3d4666372"
  let timelockControllerAddr = "0xd164Ff4C8F30C7559c51725213DD520F781F5854"

  let governorAddr = "0xc552BF1dABA24A72C7Fad642a6b875079bd6Db85"

  let processors = ["0x7B7887059860a1A21f3C62542B6CE5c0a23c76d5"];
  let executors = ["0x7B7887059860a1A21f3C62542B6CE5c0a23c76d5"]

  const Token = await hre.ethers.getContractFactory("DRE");
  const token = await Token.deploy()
  console.log("DRE deployed to:", token.address);
  // let token = await Token.attach(tokenAddr);


  const TimelockController = await ethers.getContractFactory("TimelockController");
  const timelockController = await TimelockController.deploy(7200, processors, executors, processors[0]);
  await timelockController.deployed();
  console.log(`TimelockController deployed to: ${timelockController.address}`);
  // const timelockController = await TimelockController.attach(timelockControllerAddr)

  // deploy Governor
  const DREGovernor = await ethers.getContractFactory("DREGovernor");
  governor = await DREGovernor.deploy(token.address, timelockController.address);
  await governor.deployed();
  console.log(`Dovernor deployed to: ${governor.address}`);

  // let governor = await DREGovernor.attach(governorAddr);
  
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
