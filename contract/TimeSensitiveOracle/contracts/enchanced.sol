// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TimeSensitiveOracle is ERC20, Ownable {
    AggregatorV3Interface internal immutable priceFeed;
    
    uint256 public constant REWARD_PERIOD = 60; // 1 minute
    uint256 public constant TOKENS_PER_REWARD_PERIOD = 1e18; // 1 token
    uint256 public constant MAX_SUPPLY = 1000000 * 1e18; // 1 million tokens

    mapping(address => uint256) public lastRewardTime;
    mapping(address => uint256) public userTimeSpent;

    event UserRewarded(address indexed user, uint256 amount);

    constructor(address _priceFeed) ERC20("RewardToken", "RTK") Ownable(msg.sender) {
        require(_priceFeed != address(0), "Invalid price feed address");
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function getLatestPrice() public view returns (int) {
        (
            ,
            int price,
            ,
            uint256 timeStamp,
            
        ) = priceFeed.latestRoundData();

        require(block.timestamp - timeStamp < 10 minutes, "Price data is too old.");
        return price;
    }

    function rewardUser(address user) external {
        require(user != address(0), "Invalid user address");
        require(lastRewardTime[user] < block.timestamp, "Too soon to reward");

        uint256 timeSpent = block.timestamp - lastRewardTime[user];
        uint256 rewardAmount = (timeSpent / REWARD_PERIOD) * TOKENS_PER_REWARD_PERIOD;

        require(rewardAmount > 0, "Reward amount must be greater than zero");
        require(totalSupply() + rewardAmount <= MAX_SUPPLY, "Max supply reached");

        _mint(user, rewardAmount);
        lastRewardTime[user] = block.timestamp;
        userTimeSpent[user] += timeSpent;

        emit UserRewarded(user, rewardAmount);
    }

    function getUserTimeSpent(address user) external view returns (uint256) {
        return userTimeSpent[user];
    }
}