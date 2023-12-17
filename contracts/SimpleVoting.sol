// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0; // required compiler version

contract SimpleVoting {

    // Structure to represent a vote option
    struct Option {
        string name;
        uint256 voteCount;
    }

    // Emit when a vote is registered
    event Voted(address indexed voter, uint256 indexed optionIndex);


    // Modifier to restrict some functions to be called just by the 'admin'
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    // The 'admin' address of the contract
    address public owner;


    // Array of options for voting
    Option[] public options;

    // Map of addresses to emited votes | the default value is false for each address
    mapping(address => bool) public hasVoted;    

    // Constructor of the contract
    constructor(string[] memory optionNames) {
        owner = msg.sender;

        // Initialice the voting options
        for (uint256 i = 0; i < optionNames.length; i++) {
            options.push(Option({
                name: optionNames[i],
                voteCount: 0
            }));
        }
    }

    // Vote for a valid option
    function vote(uint256 optionIndex) public {
        // Verify that user did NOT vote already
        require(!hasVoted[msg.sender], "You alredy voted!");

        // Verify that the option is valid
        require(optionIndex < options.length, "This options is NOT valid");

        // Register the vote and mark this address as 'already voted'
        options[optionIndex].voteCount++;
        hasVoted[msg.sender] = true;

        // Emit the event that some user has already voted!
        emit Voted(msg.sender, optionIndex);
    }

    // Get the list of current options
    function getOptions() public view returns (Option[] memory) {
        return options;
    }

    // Get the votes for a specific option
    function getVoteCount(uint256 optionIndex) public view returns (uint256) {
        require(optionIndex < options.length, "This options is NOT valid");
        return options[optionIndex].voteCount;
    }

    // (ONLY ADMIN) add a option in the voting options array
    function addOption(string memory optionName) public onlyOwner {
        options.push(Option({
            name: optionName,
            voteCount: 0
        }));
    }

}
