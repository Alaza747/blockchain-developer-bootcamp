// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

 // Enables console.log functionality
import "hardhat/console.sol";
import "./Token.sol";


contract Exchange {

    address public feeAccount;
    uint256 public feePercent;
    mapping (address => mapping (address => uint256)) public tokens;
    uint256 public orderCount;

    // Orders Struct
    struct _Order {
        uint256 id; // unique identifier
        address user; // User who made the order
        address tokenGet;
        uint256 amountGet;
        address tokenGive;
        uint256 amountGive;
        uint256 timestamp; // When was the order created
    }

    mapping (uint256 => _Order) public orders; 


    event Deposit(address token, address user, uint256 amount, uint256 balance);
    event Withdraw(address token, address user, uint256 amount, uint256 balance);
    event Order(uint256 id, address user, address tokenGet, uint256 amountGet, address tokenGive, uint256 amountGive, uint256 timestamp);

    constructor(address _feeAccount, uint256 _feePercent){
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    // DEPOSIT TOKENS
    function depositToken(address _token, uint256 _amount) public {
        // Transfer Tokens to Exchange
        require(Token(_token).transferFrom(msg.sender, address(this), _amount));
                
        // Update balance
        tokens[_token][msg.sender] += _amount;

        // Emit event
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    function withdrawTokens(address _token, uint256 _amount) public {
        // Ensure user has enough funds to withdraw
        require(tokens[_token][msg.sender] >= _amount);
        // Transfer tokens to user
        Token(_token).transfer(msg.sender, _amount);

        // Update user balance
        tokens[_token][msg.sender] -= _amount;

        // Emit an event
        emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]) ;
    }

    // Wrapper function to return balances of a given token and user
    function balanceOf(address _token, address _user) public view returns (uint256){
        return tokens[_token][_user];
    }

    // Withdraw Tokens


    // Check Balances


    // Make Orders

    // token "Give" - the token they want to spend - which token, and how much
    // token "Get" - token that they want to receive - which token, and how much
    function makeOrder(
    address _tokenGet,
    uint256 _amountGet,
    address _tokenGive,
    uint256 _amountGive
    ) public {
        require(balanceOf(_tokenGive, msg.sender) >= _amountGive);
        
        orderCount += 1;
        orders[orderCount] =  _Order(
            orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );
        emit Order(orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp);
    }

    // require token balance

    // Cancel Orders


    // Fill Orders


    // Charge Fees


    // Track Fee Account

}
