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

    // Allowance nested Mapping
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(
        address indexed from,
        address indexed to,
        uint256 value
    );

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply
    ) {
        // "_variable" is a naming convention for local variables
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply * (10**decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint256 _value) 
        public 
        returns (bool success)
    {
        // Require that account has enough balance, if not a throw/error will be executed
        require(balanceOf[msg.sender] >= _value);
        
        // Sending tokens to some invalid address should not be allowed
        require(_to != address(0));

        // Deduct Tokens from sender
        balanceOf[msg.sender] -= _value;
        // Credit Tokens to receiver
        balanceOf[_to] += _value;

        // Emit Transfer Event
        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    function approve(address _spender, uint256 _value) 
        public 
        returns(bool success)
    {
        require(_spender != address(0));
        allowance[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);

        return true;
    }
}
