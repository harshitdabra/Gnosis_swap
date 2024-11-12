// SPDX-License-Identifier: MIT
pragma solidity >=0.6.6;

import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract SimpleSwapRouter {
    using SafeMath for uint;

    address public factory;
    address public WETH;

    constructor(address _factory, address _WETH) {
        factory = _factory;
        WETH = _WETH;
    }

    // Function to swap exact amount of input token for output token
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts) {
        require(path.length >= 2, "Invalid path length");
        require(deadline >= block.timestamp, "Transaction expired");

        // Transfer `amountIn` of input token from sender to this contract
        IERC20(path[0]).transferFrom(msg.sender, address(this), amountIn);

        // Approve the pair contract to use tokens
        address pair = IUniswapV2Factory(factory).getPair(path[0], path[1]);
        require(pair != address(0), "No liquidity pool for this pair");
        
        IERC20(path[0]).approve(pair, amountIn);

        // Get reserves and calculate amounts
        (uint reserveIn, uint reserveOut) = getReserves(path[0], path[1], pair);
        uint amountOut = getAmountOut(amountIn, reserveIn, reserveOut);
        require(amountOut >= amountOutMin, "Insufficient output amount");

        // Perform swap
        (address token0, ) = sortTokens(path[0], path[1]);
        (uint amount0Out, uint amount1Out) = path[0] == token0 ? (uint(0), amountOut) : (amountOut, uint(0));
        
        IUniswapV2Pair(pair).swap(amount0Out, amount1Out, to, new bytes(0));
        
        // Return the output amount in an array
        amounts = new uint      amounts[0] = amountIn;
        amounts[1] = amountOut;
    }

    // Helper to get reserves of the token pair
    function getReserves(address tokenA, address tokenB, address pair) internal view returns (uint reserveA, uint reserveB) {
        (address token0, ) = sortTokens(tokenA, tokenB);
        (uint reserve0, uint reserve1, ) = IUniswapV2Pair(pair).getReserves();
        (reserveA, reserveB) = tokenA == token0 ? (reserve0, reserve1) : (reserve1, reserve0);
    }

    // Helper to sort tokens
    function sortTokens(address tokenA, address tokenB) internal pure returns (address token0, address token1) {
        require(tokenA != tokenB, "Identical addresses");
        (token0, token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
    }

    // Calculate the amount out given the reserves
    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) internal pure returns (uint amountOut) {
        require(amountIn > 0, "Insufficient input amount");
        require(reserveIn > 0 && reserveOut > 0, "Insufficient liquidity");

        uint amountInWithFee = amountIn.mul(997);
        uint numerator = amountInWithFee.mul(reserveOut);
        uint denominator = reserveIn.mul(1000).add(amountInWithFee);
        amountOut = numerator / denominator;
    }
}
