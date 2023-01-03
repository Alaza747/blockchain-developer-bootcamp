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
        deployer,
        receiver

    beforeEach(async () => {
        // Code goes in here...
        // Fetch Token from Blockchain
        const Token = await ethers.getContractFactory("Token")
        token = await Token.deploy("TonyCoin", "TONY", 1000000)
    

        // Get all accounts from blockchain 
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        receiver = accounts[1];
    })
    
    // "Block" of testing 
    describe("Deployment", () => {
        const name = "TonyCoin";
        const symbol = "TONY";
        const decimals = 18;
        const totalSupply = tokens("1000000");

        it(' has correct name', async () => {
            // Read token name and check that the name is correct
            expect(await token.name()).to.equal(name)
        })
    
        it(' has correct symbol', async () => {    
            // Read token symbol and check that the symbol is correct
            expect(await token.symbol()).to.equal(symbol)
            })
    
        it(' has 18 decimals', async () => {
            // Read token decimals and check that the decimal number is correct
            expect(await token.decimals()).to.equal(decimals)
        })
    
        it(" has a total supply of 1.000.000", async () => {
            // Read Total Supply and check that the total Supply is correct
            expect(await token.totalSupply()).to.equal(totalSupply)
        })
        
        it('assigns total Supply to Contract deployer', async () => {
            expect(await token.balanceOf(deployer.address)).to.equal(totalSupply)
        })

    })

    describe("Sending Tokens", () => {
        let amount,
            transaction,
            result

        beforeEach(async () => {
            // Transfer tokens
            amount = tokens(100)
            transaction = await token.connect(deployer).transfer(receiver.address, amount)
            result = await transaction.wait()
        })

        it(' transfers Tokens from one account to another', async () => {
            // Ensure that tokens were transferred
            expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900))
            expect(await token.balanceOf(receiver.address)).to.equal(amount)
        })

        it(' emits a transfer event', async () => {
            const event = result.events[0] 
            expect(await event.event).to.equal('Transfer')

            // Get the logs of the events
            const args = event.args

            // Confirm that the input is correct
            expect(await args.from).to.equal(deployer.address)
            expect(await args.to).to.equal(receiver.address)
            expect(await args.value).to.equal(amount)
        })
    })
})
