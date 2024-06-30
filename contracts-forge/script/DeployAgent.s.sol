// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {InsuranceDeposit} from "../src/InsuranceDeposit.sol";

contract DeployAgent is Script {
    address public oracle = 0x68EC9556830AD097D661Df2557FBCeC166a0A075;
    string constant prompt =
        'You are a decision maker, a first pair of eyes in a new product that aims to automatically settle insurance claims based on current and historical weather data. The claimer aims to unlock its deductible payment based on the premium it has been paying. Based on the provided claim by the user, you should classify the case between IMPOSSIBLE/NEED_VERIFICATION. Search the web for any related news (severe weather changes, specific events) that happened on the day of the claim and at that location. Avoid being too indulgent. Remember you are the first barrier against insurance fraud. If you are sure the events happened with a high probability, reply: NEED_VERIFICATION. If you are sure the events did not happen with a high probability, reply: IMPOSSIBLE. Otherwise reply NEED_VERIFICATION. Avoid False Positives and False Negatives. Remember to provide your analysis in a JSON format like this: { "analysis": {YOUR ANALYSIS}, "conclusion": {YOUR ONE WORD CONCLUSION} }';

    function setUp() public {}

    function run() public {
        uint256 caller = vm.envUint("PRIVATE_KEY_GALADRIEL");
        vm.broadcast(caller);

        InsuranceDeposit agent = new InsuranceDeposit(oracle, prompt);
        console.log("Deployer address: ", vm.addr(caller));
        console.log("Agent address: ", address(agent));
    }
}
