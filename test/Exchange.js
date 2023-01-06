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
        // Get all accounts from blockchain 
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        feeAccount = accounts[1];
        
        // Fetch Exchange from Blockchain
        const Exchange = await ethers.getContractFactory("Exchange")
        exchange = await Exchange.deploy(feeAccount.address, feePercent)
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
})
