const { ethers } = require("hardhat");
const { attempt } = require("lodash");
const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), "ether")
}

async function main() {
    const accounts = await ethers.getSigners();

    const Tony = await ethers.getContractAt('Token', '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9')
    console.log(`Tony fetched: ${Tony.address}`)
    const mETH = await ethers.getContractAt('Token', '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707')
    console.log(`mETH fetched: ${mETH.address}`)
    const mDAI = await ethers.getContractAt('Token', '0x0165878A594ca255338adfa4d48449f69242Eb8F')
    console.log(`mDAI fetched: ${mDAI.address}\n`)

    const Exchange = await ethers.getContractAt('Exchange', '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853')
    console.log(`Exchange fetched: ${Exchange.address}\n`)

    // Give Tokens to account[1]
    const sender = accounts[0]
    const receiver = accounts[1]
    let amount = tokens(10000)

    // user1 transfers 10000 mETH
    let transaction, result
    transaction = await mETH.connect(sender).transfer(receiver.address, amount)
    console.log(`Transferred ${amount} of mETH tokens from ${sender.address} to ${receiver.address}\n`)

    // Set up exchange users
    const user1 = accounts[0]
    const user2 = accounts[1]
    amount = tokens(10000)


    // user1 approves 10000 Tony
    transaction = await Tony.connect(user1).approve(Tony.address, amount)
    await transaction.wait()
    console.log(`Approved ${amount} TONY from ${user1.address}`)

    // user1 deposits 10000 Tony
    transaction = await Exchange.connect(user1).depositToken(Tony.address, amount)
    await transaction.wait()
    console.log(`Deposited ${amount} TONY from ${user1.address}`)

    // user2 approves 10000 mETH
    transaction = await mETH.connect(user2).approve(mETH.address, amount)
    await transaction.wait()
    console.log(` Approved ${amount} mETH from ${user2.address}`)

    // user2 deposits 10000 mETH
    transaction = await Exchange.connect(user2).depositToken(mETH.address, amount)
    await transaction.wait()
    console.log(` Deposited ${amount} mETH from ${user2.address}`)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
