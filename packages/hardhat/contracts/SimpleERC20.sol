// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDCToken is ERC20 {
    uint8 private _decimals = 6; // USDC has 6 decimals
    
    constructor() ERC20("USD Coin", "USDC") {
        // Mint 1 million USDC to the deployer for testing
        _mint(msg.sender, 1_000_000 * 10**_decimals);
    }
    
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
    
    // Mint function for testing purposes
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
    
    // Faucet function for easy testing - gives 1000 USDC
    function faucet() public {
        _mint(msg.sender, 1000 * 10**_decimals);
    }
} 