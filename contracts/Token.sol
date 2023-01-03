// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

 // Enables console.log functionality
import "hardhat/console.sol";

contract Token {
     // Declaring public (visible to everyone on the blockchain) variables 
     // belongs to the Contracts (e.g. not limitied to function's scope) Scope) 
     // variable
    string public name;
    string public symbol;
    uint256 public decimals = 18;
    uint256 public totalSupply;

    // Track balances
    mapping(address => uint256) public balanceOf; 
    // Send Tokens




    constructor(string memory _name, string memory _symbol, uint256 _totalSupply) {
        // "_variable" is a naming convention for local variables
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply * (10**decimals);
        balanceOf[msg.sender] = totalSupply;
    }
}