// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24

import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";

import "./interfaces/IOracle.sol";
import "./Agent.sol";

// 1. register land on chain
// 2. store ipfs knowledge base on chain -> yearly historical data 
// 3. determines the yearly base premium insurance fee based on last year, split it down to each week 
// THOUGHS 
// have the premium change per hour and automatically triggers the payment if severe weather suddenly arrives (increase in premium)
// otherwise just pay the day lowest forecast of premium 
// 4. user pays weekly premium fee at fixed rate based on feedback 
//        0. should ask the user to insure (conservatively/risk free/total)
//        a. opt for flexible payback (paid surplus is reimbursed weekly)
//        b. if premium increases, pay until it reaches maximum user is willing to pay
// 5. user can claim for previous date, providing claim message to agent -> (backend provides precise weather data)
// decides if user is correct, incorrect (no extreme weather reported - ignore claim and increase premium) or need human intervention (lack of proof - fire/flooding/damage)


contract InsuranceRegistry is Agent, KeeperCompatibleInterface {

    struct Coordinates {
        int256 lat;
        int256 lng;
    }

    struct Polygon {
        Coordinate[] coordinates;
    }

    mapping(address => uint256) public premiumBalances;
    mapping(address => mapping(uint256 => Polygon)) public landCoordinates;
    mapping(address => uint256) internal registeredLands;

    event LandRegistered(address landOwner);
    event PaymentSent(address indexed user, uint256 amount);
    uint256 public paymentInterval = 1 days;

    constant immutable uint8 MAX_ITERATIONS = 20;

    error AlreadyRegisteredLand(address);

    modifier onlyOracle() {
        require(msg.sender == oracleAddress, "Caller is not oracle");
        _;
    }

    constructor(address initialOracleAddress, string memory systemPrompt) Agent(initialOracleAddress, systemPrompt) {}

    function registerLand(Polygon[] memory _polygons) public {
        require(registeredLands(msg.sender) == 0, AlreadyRegisteredLand(msg.sender));
        
        uint256 length = _polygons.length;
        require(length < 10, "Too many data points");

        for (uint256 i = 0; i < length; i++) {
            landCoordinates[msg.sender][i] = _polygons[i];
            registeredLands[msg.sender]++;
        }
        emit LandRegistered(msg.sender, polygonId);
    }

    function claim(string memory message) public returns (uint i) {
        runAgent(message, MAX_ITERATIONS)
    }

    function onOracleOpenAiLlmResponse(
        uint runId,
        IOracle.OpenAiResponse memory response,
        string memory errorMessage
    ) public onlyOracle {

    function payInsuranceSettelment() public {

    }

    receive() external payable {}
}

