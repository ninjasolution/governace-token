const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { constants } = require("ethers");
const { UniswapV2Deployer, ethers } = require("hardhat");

function eth(amount) {
  return ethers.utils.parseEther(amount.toString())
}

describe("DRE", function () {
  var token, governor, timelockController;
  var deployer, target, fund;
  var proposalId;
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploy() {
    [deployer, fund, target] = await ethers.getSigners();


    // deploy the uniswap v2 protocol
    const { factory, router, weth9 } = await UniswapV2Deployer.deploy(deployer);

    // deploy our token
    const Token = await ethers.getContractFactory("DRE")
    token = await Token.deploy()
    await token.deployed()
    console.log(`Token deployed to: ${token.address}`)


    // deploy time lock controller
    const TimelockController = await ethers.getContractFactory("TimelockController");
    timelockController = await TimelockController.deploy(7200, [fund.address], [target.address], deployer.address);
    await timelockController.deployed();
    console.log(`TimelockController deployed to: ${timelockController.address}`);

    // deploy governor
    const DREGovernor = await ethers.getContractFactory("DREGovernor");
    governor = await DREGovernor.deploy(token.address, timelockController.address);
    await governor.deployed();
    console.log(`Dovernor deployed to: ${governor.address}`);


  }

  before(async () => {
    await deploy();
  })

  describe("transfer", function () {

    it("shouldn't tax on transfer", async function () {

      await token.approve(target.address, eth(100));
      await expect(token.transfer(target.address, eth(100))).to.changeTokenBalances(
        token,
        [deployer, fund, target],
        [eth(100).mul(-1), 0, eth(100)]
      )
    })

    it("should be changed voting power", async function () {

      console.log(await token.getVotes(target.address))
      console.log(await token.getVotes(deployer.address))
      
    })

    // it("Create a proposal", async function () {

    //   const tx = await governor.propose(
    //     "First",
    //     "Proposal #1: Give grant to team"
    //   );
    //   const receipt = await tx.wait();

    //   const event = receipt.events[0];
    //   proposalId = event.args.proposalId


    // })

    // it("Create a vote", async function () {

    //   const descriptionHash = ethers.utils.id("Proposal #1: Give grant to team");
    //   const titleHash = ethers.utils.id("First");

    //   await governor.castVote(
    //     proposalId,
    //     1,
    //   );

    //   await governor.execute(
    //     proposalId,
    //     titleHash,
    //     descriptionHash
    //   );

    //   await governor.queue(
    //     proposalId
    //   );


    // })

    // it("Execute the Proposal", async function () {
    //   const descriptionHash = ethers.utils.id("Proposal #1: Give grant to team");
    //   const titleHash = ethers.utils.id("First");

    //   await governor.execute(
    //     proposalId,
    //     titleHash,
    //     descriptionHash
    //   );
    // })
  })

});
