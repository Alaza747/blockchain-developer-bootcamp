const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), "ether")
}

describe('Exchange Contract', () => {
    // Declare token variable here for it to be global and accessible in all functions
    let deployer,
        feeAccount,
        exchange

    const feePercent = 10;

    beforeEach(async () => {
        const Exchange = await ethers.getContractFactory("Exchange")
        const Token = await ethers.getContractFactory("Token")

        // Get all accounts from blockchain 
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        feeAccount = accounts[1];
        user1 = accounts[2];

        // Deploy Exchange to Blockchain
        exchange = await Exchange.deploy(feeAccount.address, feePercent)

        // Deploy Token1 to blockchain
        token1 = await Token.deploy("TonyCoin", "TONY", "1000000")

        // Give some test-tokens
        let transaction = await token1.connect(deployer).transfer(user1.address, tokens(100))
        await transaction.wait()
    })
     
    describe("Deployment", () => {     
        it(' tracks the feeAccount', async () => {
            // Check that deployment address is correct
            expect(await exchange.feeAccount()).to.equal(feeAccount.address)
        })

        it(" fee Percent is 10%", async () => {
            expect(await exchange.feePercent()).to.equal(feePercent)
        })
    })

    describe("Depositing Tokens", () => {
        let transaction, result
        let amount = tokens(10)

        beforeEach(async () => {
            // Approve
            transaction = await token1.connect(user1).approve(exchange.address, amount)
            // Deposit
            transaction = await exchange.connect(user1).depositToken(token1.address, amount)
            result = await transaction.wait()
        })
        
        describe("Success", () => {
            it(" tracks the token deposit", async () => {
                expect(await token1.balanceOf(exchange.address)).to.equal(amount)
            })
        })

        describe("Failure", () => {
            
        })
    })
})
