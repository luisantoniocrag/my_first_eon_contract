const hre = require("hardhat");

async function main() {
  const INITIAL_OPTIONS = ["OPTION_A", "OPTION_B", "OPTION_C"];
  const simpleVotingContract = await hre.ethers.deployContract("SimpleVoting", [INITIAL_OPTIONS]);

  await simpleVotingContract.waitForDeployment();

  console.log(`Contract was deployed: ${simpleVotingContract.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
