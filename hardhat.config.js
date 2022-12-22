require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// For more information see: https://hardhat.org/config/

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.17",
  networks: {
    localhost: {}
  }
};
