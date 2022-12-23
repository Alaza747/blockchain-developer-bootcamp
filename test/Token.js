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

    it('has correct symbol', async () => {
        // Fetch Token from Blockchain
            const Token = await ethers.getContractFactory("Token")
            let token = await Token.deploy()
            
            // Read token symbol
            const symbol = await token.symbol()
            
            // Check that the symbol is correct
            expect(symbol).to.equal("TONY")
        })


})
