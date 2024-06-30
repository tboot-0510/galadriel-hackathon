// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./interfaces/IOracle.sol";
import "./Agent.sol";
import "./library/DateTime.sol";

contract InsuranceDeposit is Agent {
    mapping(address => uint256) public premiumBalances;
    mapping(address => uint256) public insuredAmount;
    mapping(address => mapping(uint256 => uint256)) public premiumDeposits;
    mapping(address => string) public indexCid;

    event PremiumDeposited(
        address indexed payer,
        uint256 day,
        uint256 month,
        uint256 year,
        uint256 amount
    );

    uint8 public immutable MAX_ITERATIONS = 10;
    uint256 public constant DEDUCTIBLE_MULTIPLIER = 3;
    uint256 public constant PREMIUM_PENALTY = 100;

    event PaymentSent(address indexed user, uint256 amount);
    event InsuredAmountSet(address indexed payer, uint256 amount);
    event DeductibleLocked(address indexed owner, uint256 amount);
    event PenaltyAdded(address indexed owner, uint256 amout);

    error AlreadyDeposited(address, uint256);
    error AlreadySetInsuredAmount(address, uint256);
    error MissingInsuredAmount(address);

    constructor(
        address initialOracleAddress,
        string memory systemPrompt
    ) Agent(initialOracleAddress, systemPrompt) {}

    function claim(string memory message) public {
        (uint256 year, uint256 month, uint256 day) = DateTime.timestampToDate(
            block.timestamp
        );
        uint256 dateOfDeposit = day + year + month;
        if (premiumDeposits[msg.sender][dateOfDeposit] != 0) {
            revert AlreadyDeposited(msg.sender, dateOfDeposit);
        }

        runAgent(message, MAX_ITERATIONS, "");
    }

    function forecastPremium(
        string memory message,
        string memory newPrompt
    ) public {
        runAgent(message, MAX_ITERATIONS, newPrompt);
    }

    function onOracleOpenAiLlmResponse(
        uint256 runId,
        IOracle.OpenAiResponse memory response,
        string memory errorMessage
    ) public virtual override onlyOracle {
        AgentRun storage run = agentRuns[runId];

        if (!compareStrings(errorMessage, "")) {
            Message memory newMessage;
            newMessage.role = "assistant";
            newMessage.content = errorMessage;
            run.messages.push(newMessage);
            run.responsesCount++;
            run.is_finished = true;
            return;
        }

        string memory claimConclusion = findClaimConclusion(response.content);

        if (compareStrings(claimConclusion, "IMPOSSIBLE")) {
            // increase premium with penality
            emit PenaltyAdded(run.owner, PREMIUM_PENALTY);
        }

        if (compareStrings(claimConclusion, "NEED_VERIFICATION")) {
            // move amount to escrow account with funding from insurer
            emit DeductibleLocked(
                run.owner,
                insuredAmount[run.owner] * DEDUCTIBLE_MULTIPLIER
            );
        }

        if (run.responsesCount >= run.max_iterations) {
            run.is_finished = true;
            return;
        }
        if (!compareStrings(response.content, "")) {
            Message memory assistantMessage;
            assistantMessage.content = response.content;
            assistantMessage.role = "assistant";
            run.messages.push(assistantMessage);
            run.responsesCount++;
        }
        if (!compareStrings(response.functionName, "")) {
            IOracle(oracleAddress).createFunctionCall(
                runId,
                response.functionName,
                response.functionArguments
            );
            return;
        }
        run.is_finished = true;
    }

    function storeInsuredAmount(uint256 amount) external {
        if (insuredAmount[msg.sender] != 0) {
            revert AlreadySetInsuredAmount(msg.sender, amount);
        }
        insuredAmount[msg.sender] = amount;

        emit InsuredAmountSet(msg.sender, amount);
    }

    function depositPremium() external payable {
        if (insuredAmount[msg.sender] == 0) {
            revert MissingInsuredAmount(msg.sender);
        }
        (uint256 year, uint256 month, uint256 day) = DateTime.timestampToDate(
            block.timestamp
        );
        uint256 dateOfDeposit = day + year + month;

        if (premiumDeposits[msg.sender][dateOfDeposit] != 0) {
            revert AlreadyDeposited(msg.sender, dateOfDeposit);
        }
        premiumDeposits[msg.sender][dateOfDeposit] += msg.value;

        emit PremiumDeposited(msg.sender, day, month, year, msg.value);
    }

    function findClaimConclusion(
        string memory input
    ) public pure returns (string memory) {
        bytes memory inputBytes = bytes(input);
        string memory conclusionKey = '"conclusion": "';
        bytes memory keyBytes = bytes(conclusionKey);
        uint256 keyLength = keyBytes.length;
        uint256 inputLength = inputBytes.length;

        for (uint256 i = 0; i <= inputLength - keyLength; i++) {
            bool matched = true;
            for (uint256 j = 0; j < keyLength; j++) {
                if (inputBytes[i + j] != keyBytes[j]) {
                    matched = false;
                    break;
                }
            }

            if (matched) {
                uint256 startIndex = i + keyLength;
                uint256 endIndex = startIndex;

                while (endIndex < inputLength && inputBytes[endIndex] != '"') {
                    endIndex++;
                }

                bytes memory conclusionValue = new bytes(endIndex - startIndex);
                for (uint256 k = startIndex; k < endIndex; k++) {
                    conclusionValue[k - startIndex] = inputBytes[k];
                }

                return string(conclusionValue);
            }
        }

        return "";
    }
}
