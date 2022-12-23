const { expect } = require("chai");
const { ethers } = require("hardhat");


describe('Token Contract', () => {
    // Tests go inside here...
    it('has correct name', async () => {
        // Fetch Token from Blockchain
        const Token = await ethers.getContractFactory("Token")
        let token = await Token.deploy()
        
        // Read token name
        const name = await token.name()
        
        // Check that the name is correct
        expect(name).to.equal("TonyCoin")
    })
})
