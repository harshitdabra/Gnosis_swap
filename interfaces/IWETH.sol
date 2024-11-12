// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

interface IWETH {
    function deposit() external payable;
    function withdraw(uint) external;
}
