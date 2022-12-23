// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

async function main() {
    // Fetch contract to deploy
    const Token = await ethers.getContractFactory("Token");

    // Deploy contract
    const token = await Token.deploy();

    // Fetch the copy of the token that is deployed to blockchain
    await token.deployed();
    console.log(`Token deployed to: ${token.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
