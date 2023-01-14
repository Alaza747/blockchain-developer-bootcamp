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
        user2 = accounts[3];

        // Deploy Exchange to Blockchain
        exchange = await Exchange.deploy(feeAccount.address, feePercent)

        // Deploy Token1 to blockchain
        token1 = await Token.deploy("TonyCoin", "TONY", "1000000")
        token2 = await Token.deploy("Mock Dai", "mDAI", "1000000")

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

        describe("Success", () => {
            
            beforeEach(async () => {
                // Approve
                transaction = await token1.connect(user1).approve(exchange.address, amount)
                result = await transaction.wait()
                // Deposit
                transaction = await exchange.connect(user1).depositToken(token1.address, amount)
                result = await transaction.wait()
            })

            it(" tracks the token deposit", async () => {
                expect( await token1.balanceOf(exchange.address)).to.equal(amount)
            })

            it(" updates user's balance", async () => {
                // One way to test 
                expect( await exchange.tokens(token1.address, user1.address)).to.equal(amount)
                // Another way to test
                expect( await exchange.balanceOf(token1.address, user1.address)).to.equal(amount)
            })

            it(" deposit event is fired", async () => {
                let event = result.events[1]
                let args = event.args
                
                expect(token1.address).to.equal(args.token)
                expect(user1.address).to.equal(args.user) 
                expect(amount).to.equal(args.amount)
                expect(amount).to.equal(args.balance)
            })
        })

        describe("Failure", () => {
            it(" fails when no tokens were approved", async () => [
                await expect(exchange.connect(user1).depositToken(token1.address, amount)).to.be.reverted
            ])
        })
    })

    describe("Withdrawal", () => {
        let transaction, result
        let amount = tokens(10)

        describe("Success", () => {
            beforeEach(async () => {
                transaction = await token1.connect(user1).approve(exchange.address, amount)
                result = await transaction.wait()
                transaction = await exchange.connect(user1).depositToken(token1.address, amount)
                result = await transaction.wait()
                transaction = await exchange.connect(user1).withdrawTokens(token1.address, amount)
                result = await transaction.wait()
            })

            it(" withdraw the token to user's account", async () => {
                expect(await token1.balanceOf(exchange.address)).to.equal(0)
                expect(await exchange.tokens(token1.address, user1.address)).to.equal(0)
                expect(await exchange.balanceOf(token1.address, user1.address)).to.equal(0)
            })

            it(" withdraw event is fired", async () => {
                let event = result.events[1]
                expect(event.event).to.equal("Withdraw")
                let args = event.args
                
                expect(token1.address).to.equal(args.token)
                expect(user1.address).to.equal(args.user) 
                expect(amount).to.equal(args.amount)
                expect(0).to.equal(args.balance)
            })
        })

        describe("Failure", () => {
            it(" fails for insufficient balance", async () => {
                await expect(exchange.connect(user1).withdrawTokens(token1.address, amount)).to.be.reverted
            })
        })
    })

    describe("Checking balances", () => {
        let transaction, result
        let amount = tokens(1)

        beforeEach(async () => {
            // Approve
            transaction = await token1.connect(user1).approve(exchange.address, amount)
            result = await transaction.wait()
            // Deposit
            transaction = await exchange.connect(user1).depositToken(token1.address, amount)
            result = await transaction.wait()
        })

        it(" returns users balance", async () => {
            expect(await exchange.balanceOf(token1.address, user1.address)).to.equal(amount)
        })
    })

    describe("Making Orders", () => {
        let transaction, result
        let amount = tokens(1)

        describe('Success', async () => {
            beforeEach(async () => {
                transaction = await token1.connect(user1).approve(exchange.address, amount)
                result = await transaction.wait()
                transaction = await exchange.connect(user1).depositToken(token1.address, amount)
                result = await transaction.wait()

                // Make order
                transaction = await exchange.connect(user1).makeOrder(token2.address, amount, token1.address, amount)
                result = await transaction.wait()
            })

            it(' tracks the newly created order', async () => {
                expect(await exchange.orderCount()).to.equal(1)
            })
            
            it(' emits an Order event', async () => {
                const event = result.events[0]
                expect(event.event).to.equal('Order')

                const args = event.args
                expect(args.id).to.equal(1)
                expect(args.user).to.equal(user1.address)
                expect(args.tokenGet).to.equal(token2.address)
                expect(args.amountGet).to.equal(amount)
                expect(args.tokenGive).to.equal(token1.address)
                expect(args.amountGive).to.equal(amount)
                expect(args.timestamp).to.at.least(1)
            })
        })

        describe('Failure', async () => {
            it(' rejects orders that have no balance', async () => {
                await expect(exchange.connect(user1).makeOrder(token2.address, amount, token1.address, amount)).to.be.reverted
            })

        })
    })

    describe(' Making orders', async () => {

    })

    describe(' Order actions', async () => {
        let transaction, result
        let amount = tokens(1)

        beforeEach(async () => {
            transaction = await token1.connect(user1).approve(exchange.address, amount)
            result = await transaction.wait()
            transaction = await exchange.connect(user1).depositToken(token1.address, amount)
            result = await transaction.wait()
            transaction = await exchange.connect(user1).makeOrder(token2.address, amount, token1.address, amount)
            result = await transaction.wait()
        })

        describe(' Cancelling Orders', async () => {
            describe('Success', async () => {
                beforeEach(async () => {
                    transaction = await exchange.connect(user1).cancelOrder(1);
                    result = await transaction.wait();
                })
                
                it(' updates cancelled orders', async () => {
                    expect(await exchange.orderCancelled(1)).to.equal(true);
                })

                it(' emits an Cancel event', async () => {
                    const event = result.events[0]
                    expect(event.event).to.equal('Cancel')
    
                    const args = event.args
                    expect(args.id).to.equal(1)
                    expect(args.user).to.equal(user1.address)
                    expect(args.tokenGet).to.equal(token2.address)
                    expect(args.amountGet).to.equal(amount)
                    expect(args.tokenGive).to.equal(token1.address)
                    expect(args.amountGive).to.equal(amount)
                    expect(args.timestamp).to.at.least(1)
                })
            })

            describe('Failure', async () => {
                beforeEach(async () => {
                    transaction = await exchange.connect(user1).cancelOrder(1);
                    result = await transaction.wait();
                })

                it(' rejects invalid order IDs', async () => {
                    await expect(exchange.cancelOrder(999)).to.be.reverted
                })

                it(' rejects the cancellation of another users order', async () => {
                    await expect(exchange.connect(user2).cancelOrder(1)).to.be.reverted
                })
            })
        })
    })
})
