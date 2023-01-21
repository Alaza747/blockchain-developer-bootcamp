const { ethers } = require("hardhat");
const { attempt } = require("lodash");
const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), "ether")
}

const wait = (seconds) => {
  const milliseconds = seconds * 1000
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function main() {
    const accounts = await ethers.getSigners();

    const Tony = await ethers.getContractAt('Token', '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9')
    console.log(`Tony fetched: ${Tony.address}`)
    const mETH = await ethers.getContractAt('Token', '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707')
    console.log(`mETH fetched: ${mETH.address}`)
    const mDAI = await ethers.getContractAt('Token', '0x0165878A594ca255338adfa4d48449f69242Eb8F')
    console.log(`mDAI fetched: ${mDAI.address}\n`)

    const exchange = await ethers.getContractAt('Exchange', '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853')
    console.log(`exchange fetched: ${exchange.address}\n`)

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
    transaction = await exchange.connect(user1).depositToken(Tony.address, amount)
    await transaction.wait()
    console.log(`Deposited ${amount} TONY from ${user1.address}`)

    // user2 approves 10000 mETH
    transaction = await mETH.connect(user2).approve(mETH.address, amount)
    await transaction.wait()
    console.log(` Approved ${amount} mETH from ${user2.address}`)

    // user2 deposits 10000 mETH
    transaction = await exchange.connect(user2).depositToken(mETH.address, amount)
    await transaction.wait()
    console.log(` Deposited ${amount} mETH from ${user2.address}`)

    //////////////////////
    // Seed a Cancelled Order
    //

    // User 1 makes an order to get tokens
    let orderId
    transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(100), Tony.address, tokens(5))
    result = await transaction.wait()
    console.log(`Made Order from ${user1.address}`)

    // User 1 cancels an order
    orderId = result.events[0].args.id
    transaction = await exchange.connect(user1).cancelOrder(orderId)
    result = await transaction.wait()
    console.log(`Canceled order from ${user1.address}\n`)

    // Wait 1 second
    await wait(1)

    //////////////////////
    // Seed a Filled Order
    //

    // User1 makes an order
    let orderId
    transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(100), Tony.address, tokens(5))
    result = await transaction.wait()
    console.log(`Made Order from ${user1.address}`)

    // User2 fills the order
    orderId = result.events[0].args.id
    transaction = await exchange.connect(user2).fillOrder(orderId)
    result = await transaction.wait()
    console.log(`Filled order from ${user1.address}\n`)  


    // Wait 1 second
    await wait(1)
      
    // User1 makes another order
    transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(50), Tony.address, tokens(15))
    result = await transaction.wait()
    console.log(`Made Order from ${user1.address}`)

    // User2 fills another order
    orderId = result.events[0].args.id
    transaction = await exchange.connect(user2).fillOrder(orderId)
    result = await transaction.wait()
    console.log(`Filled order from ${user1.address}\n`) 
    
    // Wait 1 second
    await wait(1)

    // User1 makes final order
    transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(200), Tony.address, tokens(20))
    result = await transaction.wait()
    console.log(`Made Order from ${user1.address}`)

    // User2 fills final order
    orderId = result.events[0].args.id
    transaction = await exchange.connect(user2).fillOrder(orderId)
    result = await transaction.wait()
    console.log(`Filled order from ${user1.address}\n`) 
    
    // Wait 1 second
    await wait(1)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
