// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract DRE is ERC20, ERC20Permit, ERC20Votes {

    uint256 public initialSupply = 10000000 * 10 ** 18;
    
    constructor() ERC20("Decentralised Real Estate", "DRE") ERC20Permit("Decentralised Real Estate") {
        _mint(msg.sender, initialSupply);
    }

    function _afterTokenTransfer(address from, address to, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
        super._delegate(from, from);
        super._delegate(to, to);
    }

    function _mint(address to, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._burn(account, amount);
    }
}