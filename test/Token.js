const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), "ether")
}


describe('Token Contract', () => {
    // Tests go inside here...
    // Declare token variable here for it to be global and accessible in all functions
    let token, 
        accounts,
        deployer

    beforeEach(async () => {
        // Code goes in here...
        // Fetch Token from Blockchain
        const Token = await ethers.getContractFactory("Token")
        token = await Token.deploy("TonyCoin", "TONY", 1000000)
    

        // Get all accounts from blockchain 
        accounts = await ethers.getSigners();
        deployer = accounts[0];
    })
    
    // "Block" of testing 
    describe("Deployment", () => {
        const name = "TonyCoin";
        const symbol = "TONY";
        const decimals = 18;
        const totalSupply = tokens("1000000");

        it('has correct name', async () => {
            // Read token name and check that the name is correct
            expect(await token.name()).to.equal(name)
        })
    
        it('has correct symbol', async () => {    
            // Read token symbol and check that the symbol is correct
            expect(await token.symbol()).to.equal(symbol)
            })
    
        it('has 18 decimals', async () => {
            // Read token decimals and check that the decimal number is correct
            expect(await token.decimals()).to.equal(decimals)
        })
    
        it("has a total suply of 1.000.000", async () => {
            // Read Total Supply and check that the total Supply is correct
            expect(await token.totalSupply()).to.equal(totalSupply)
        })
        
        it('assigns total Supply to Contract deployer', async () => {
            expect(await token.balanceOf(deployer.address)).to.equal(totalSupply)
        })

    })
})
