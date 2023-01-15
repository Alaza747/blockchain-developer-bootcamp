// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

const { ethers } = require("hardhat");

async function main() {
  console.log("Preparing Deployment...")
  // Fetch contract to deploy
  const Token = await ethers.getContractFactory("Token");
  const Exchange = await ethers.getContractFactory("Exchange");

  // Fetch Accounts
  const accounts = await ethers.getSigners();

  console.log(
    `Accounts fetched:
    \n${accounts[0].address}
    \n${accounts[1].address}
    \n`)

  // Deploy contract
  const tony = await Token.deploy("TonyCoin", "TONY", 1000000);
  // Fetch the copy of the TONY token that is deployed to blockchain
  await tony.deployed();
  console.log(`TONY Token deployed to: ${tony.address}`);

  const mETH = await Token.deploy('MockEther', 'mETH', 1000000);
  // Fetch the copy of the TONY token that is deployed to blockchain
  await mETH.deployed();
  console.log(`mETH deployed to: ${mETH.address}`);

  const mDAI = await Token.deploy('mockDAI', 'mDAI', 1000000);
  // Fetch the copy of the TONY token that is deployed to blockchain
  await mDAI.deployed();
  console.log(`mDAI deployed to: ${mDAI.address}`);

  const exchange = await Exchange.deploy(accounts[1].address, 10);
  await exchange.deployed();
  console.log(`Exchange deployed to: ${exchange.address}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
