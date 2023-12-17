const {
    loadFixture,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
  const { expect } = require("chai");
const { ethers } = require("hardhat");

  const INITIAL_OPTIONS = ["OPTION_A", "OPTION_B", "OPTION_C"];
  
  describe("SimpleVoting", function () {
    // We define a fixture to create a contract with a list of initial options to be vote for
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    //
    // The custom fixture returns the owner of the contract, two voters accounts and the contract address
    async function deployContractWithSomeInitialOptions() {
  
      // Contracts are deployed using the first signer/account by default
      const [owner, voter_one, voter_two, another_user] = await ethers.getSigners();
  
      const SimpleVoting = await ethers.getContractFactory("SimpleVoting", { from: owner });
      const simpleVoting = await SimpleVoting.deploy(INITIAL_OPTIONS);
  
      return { simpleVoting, owner, voter_one, voter_two, another_user };
    }
  
    describe("Deployment", function () {

      it ("Should return the correct list of initial options", async function() {
        const { simpleVoting } = await loadFixture(deployContractWithSomeInitialOptions);
        
        const currentOptionsResponse = await simpleVoting.getOptions();
        const currentOptionsCleaned = currentOptionsResponse.map(res => res[0]);


        expect(currentOptionsCleaned).to.deep.equal(INITIAL_OPTIONS);
      });

    });

    describe("Ownership", function() {
      
      it("Should allow to add a new option if the call is the owner", async function() {
        const { simpleVoting, owner } = await loadFixture(deployContractWithSomeInitialOptions);
        
        // call to add a new option from the owner account
        const newOption = "OPTION_D"
        await simpleVoting.addOption(newOption, { from: owner })

        // check that new options was added
        const newOptions = INITIAL_OPTIONS.concat(newOption)
        const currentOptionsResponse = await simpleVoting.getOptions()
        const currentOptionsCleaned = currentOptionsResponse.map(res => res[0])

        expect(currentOptionsCleaned).to.deep.equal(newOptions)
      }); 

      it("Should NOT allow to add a new option if the caller is NOT the owner", async function() {
        const { simpleVoting, another_user } = await loadFixture(deployContractWithSomeInitialOptions);

        // call to add a new option from the a NON-OWNER account
        const newOption = "OPTION_D";
        await expect(simpleVoting.connect(another_user).addOption(newOption)).to.eventually.rejectedWith("Only the owner can call this function");

        // Verify that the OPTION_D options was NOT added
        const currentOptionsResponse = await simpleVoting.getOptions();
        const currentOptionsCleaned = currentOptionsResponse.map(res => res[0]);

        expect(currentOptionsCleaned).to.deep.equal(INITIAL_OPTIONS);
      });

    });

    describe("Usability", function() {

      it ("Should allow vote a user but just ONE TIME per account", async function() {
        const { simpleVoting, voter_one, voter_two } = await loadFixture(deployContractWithSomeInitialOptions);

        // BOTH Transaction should emit the event called `Voted` with the address and the index value that user voted for as arguments

        // voter one vote for the OPTION_A
        await expect(simpleVoting.connect(voter_one).vote(INITIAL_OPTIONS.indexOf("OPTION_A"))).to.emit(simpleVoting, "Voted").withArgs(voter_one.address, 0);

        // voter two vote for the OPTION_C
        await expect(simpleVoting.connect(voter_two).vote(INITIAL_OPTIONS.indexOf("OPTION_C"))).to.emit(simpleVoting, "Voted").withArgs(voter_two.address, 2);

        // voter one try to vote again but for the OPTION_B, This is not allowed 
        await expect(simpleVoting.connect(voter_one).vote(INITIAL_OPTIONS.indexOf("OPTION_B"))).to.eventually.rejectedWith("'You alredy voted!'");

      });


      it ("Should return the correct amount of votes per option", async function() {
        const { simpleVoting, voter_one, voter_two } = await loadFixture(deployContractWithSomeInitialOptions);

        // BOTH Transaction should emit the event called `Voted` with the address and the index value that user voted for as arguments

        // voter one vote for the OPTION_A
        await expect(simpleVoting.connect(voter_one).vote(INITIAL_OPTIONS.indexOf("OPTION_A"))).to.emit(simpleVoting, "Voted").withArgs(voter_one.address, 0);

        // voter two vote for the OPTION_C
        await expect(simpleVoting.connect(voter_two).vote(INITIAL_OPTIONS.indexOf("OPTION_C"))).to.emit(simpleVoting, "Voted").withArgs(voter_two.address, 2);

        // voter one try to vote again but for the OPTION_B, This is not allowed 
        await expect(simpleVoting.connect(voter_one).vote(INITIAL_OPTIONS.indexOf("OPTION_B"))).to.eventually.rejectedWith("'You alredy voted!'");

        expect(await simpleVoting.getVoteCount(INITIAL_OPTIONS.indexOf("OPTION_A"))).to.equal(1);
        expect(await simpleVoting.getVoteCount(INITIAL_OPTIONS.indexOf("OPTION_B"))).to.equal(0);
        expect(await simpleVoting.getVoteCount(INITIAL_OPTIONS.indexOf("OPTION_C"))).to.equal(1);
      });
 
    });

  });
  