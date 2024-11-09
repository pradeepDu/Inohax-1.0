// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TimeSensitiveOracle is ERC20 {
    AggregatorV3Interface internal priceFeed;

    mapping(address => uint256) public rewards;

    // Constructor sets the Chainlink Aggregator address for MATIC/USD
    constructor(address _priceFeed) ERC20("RewardToken", "RTK") {
        require(_priceFeed != address(0), "Invalid price feed address"); // Ensure price feed is valid
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    /**
     * @dev Returns the latest price of the asset
     * @return price Latest price
     */
    function getLatestPrice() public view returns (int) {
        (
            ,
            int price,
            ,
            uint256 timeStamp,
            // Ignoring the answerId
        ) = priceFeed.latestRoundData();

        // Check if the data is recent (example: within the last 10 minutes)
        require(block.timestamp - timeStamp < 10 minutes, "Price data is too old.");

        return price;
    }

    /**
     * @dev Reward user based on time spent
     * @param user The address of the user to reward
     * @param timeSpent The amount of time spent in seconds
     */
    function rewardUser(address user, uint256 timeSpent) external {
        require(user != address(0), "Invalid user address"); // Ensure the user address is valid
        require(timeSpent > 0, "Time spent must be positive"); // Ensure time spent is positive

        // Example: Rewarding 1 token for every 60 seconds spent
        uint256 rewardAmount = timeSpent / 60; 
        require(rewardAmount > 0, "Reward amount must be greater than zero"); // Ensure reward amount is valid

        _mint(user, rewardAmount); // Minting new tokens to the user
    }
}
