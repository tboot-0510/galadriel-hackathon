// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
// import {Counter} from "../src/Counter.sol";
import {InsuranceDeposit} from "../src/InsuranceDeposit.sol";

contract InsuranceDepositTest is Test {
    InsuranceDeposit public agent;
    address public oracle = 0x68EC9556830AD097D661Df2557FBCeC166a0A075;
    string constant prompt =
        'You are a decision maker, a first pair of eyes in a new product that aims to automatically settle insurance claims based on current and historical weather data. The claimer aims to unlock its deductible payment based on the premium it has been paying. Based on the provided claim by the user, you should classify the case between IMPOSSIBLE/NEED_VERIFICATION. Search the web for any related news (severe weather changes, specific events) that happened on the day of the claim and at that location. Avoid being too indulgent. Remember you are the first barrier against insurance fraud. If you are sure the events happened with a high probability, reply: NEED_VERIFICATION. If you are sure the events did not happen with a high probability, reply: IMPOSSIBLE. Otherwise reply NEED_VERIFICATION. Avoid False Positives and False Negatives. Remember to provide your analysis and your conclusion like : {"analysis": {YOUR ANALYSIS}, "conclusion": {YOUR ONE WORD CONCLUSION}}';

    function setUp() public {
        agent = new InsuranceDeposit(oracle, prompt);
    }

    function test_Increment() public {
        string memory result =
            '{"analysis": "The search results do not specifically mention flooding in Lowell, US, around June 30, 2024. There is a mention of massive flooding impacting nearly half of Minnesota in June 2024, and references to floods in the Midwest and Stillwater\'s July 4 fireworks show being postponed because of flooding around the end of June 2024. However, these instances are either not directly related to Lowell, US, or do not specify the exact date in question.", "conclusion": "NEED_VERIFICATION"}';
        string memory a = agent.findClaimConclusion(result);
        console.logString(a);
    }
    // function testFuzz_SetNumber(uint256 x) public {
    //     counter.setNumber(x);
    //     assertEq(counter.number(), x);
    // }
}
