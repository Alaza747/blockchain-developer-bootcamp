// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

 // Enables console.log functionality
import "hardhat/console.sol";
import "./Token.sol";


contract Exchange {

    address public feeAccount;
    uint256 public feePercent;

    constructor(address _feeAccount, uint256 _feePercent){
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }
    // Deposit Tokens
    function depositToken(address _token, uint256 _amount) public {
        // Trasndfer Tokens to Exchange
        Token(_token).transferFrom(msg.sender, address(this), _amount);        
        // Update balance

        // Emit event
    }

    // Withdraw Tokens


    // Check Balances


    // Make Orders


    // Cancel Orders


    // Fill Orders


    // Charge Fees


    // Track Fee Account

}
