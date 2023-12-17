const hre = require("hardhat");

const OPTIONS = ["OPTION_A", "OPTION_B", "OPTION_C"];

async function main() {
  // update with your deployed contract address
  const CONTRACT_ADDRESS = "PASTE_HERE_YOUR_SMART_CONTRACT_ADDRESS";
  const OPTION = "OPTION_A"; //modify if you want to get the total count of a different option

  // Create a contract instance
  const SimpleVoting = await hre.ethers.getContractFactory("SimpleVoting");
  const simpleVoting = SimpleVoting.attach(CONTRACT_ADDRESS);

  // Check the vote count of the OPTION
  const voteCountResponse = await getVoteCount(simpleVoting, OPTION);
  console.log(`The vote count of ${OPTION} is ${voteCountResponse}`);
}


async function getVoteCount(contract, option) {
    const response = await contract.getVoteCount(OPTIONS.indexOf(option));
    return response;
}

  // We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });