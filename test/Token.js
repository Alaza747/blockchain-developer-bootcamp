const { expect } = require("chai");
const { ethers } = require("hardhat");


describe('Token Contract', () => {
    // Tests go inside here...
    // Declare token variable here for it to be global and accessible in all functions
    let token

    beforeEach(async () => {
        // Code goes in here...
        // Fetch Token from Blockchain
        const Token = await ethers.getContractFactory("Token")
        token = await Token.deploy()

    })
    
    it('has correct name', async () => {
        // Read token name
        const name = await token.name()
        
        // Check that the name is correct
        expect(name).to.equal("TonyCoin")
    })

    it('has correct symbol', async () => {    
            // Read token symbol
            const symbol = await token.symbol()
            
            // Check that the symbol is correct
            expect(symbol).to.equal("TONY")
        })


})
