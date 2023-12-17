const hre = require("hardhat");

const OPTIONS = ["OPTION_A", "OPTION_B", "OPTION_C"];

async function main() {
  // update with your deployed contract address
  const CONTRACT_ADDRESS = "PASTE_HERE_YOUR_SMART_CONTRACT_ADDRESS";

  // Create a contract instance
  const SimpleVoting = await hre.ethers.getContractFactory("SimpleVoting");
  const simpleVoting = SimpleVoting.attach(CONTRACT_ADDRESS);

  // Get the first account from your hardhat private key set in the hardhat config file
  const [caller] = await hre.ethers.getSigners();

  // send the vote() function with 'OPTION_A' as option and get the hash of the transaction
  const hash = await vote(simpleVoting, caller, "OPTION_A");
  console.log(`
    The hash of the vote is: ${hash}
  `);
}


async function vote(contract, caller, option) {
  const { hash } = await contract.connect(caller).vote(OPTIONS.indexOf(option));
  return hash;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});