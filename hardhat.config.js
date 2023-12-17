require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    gobiTestnet: {
      url: "https://gobi-rpc.horizenlabs.io/ethv1",
      accounts: ["your_private_key"]
    }
  },
  solidity: "0.8.19",
};
