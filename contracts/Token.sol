// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

 // Enables console.log functionality
import "hardhat/console.sol";

contract Token {
     // Declaring public (visible to everyone on the blockchain) variables (belongs to the Contracts (e.g. not limitied to function's scope) Scope) variable
    string public name = "TonyCoin";
    string public symbol = "TONY";
    uint256 public decimals = 18;
    uint256 public totalSupply = 1000000 * (10**decimals);

    constructor(string memory _name) {
        name = _name;
    }
}
 