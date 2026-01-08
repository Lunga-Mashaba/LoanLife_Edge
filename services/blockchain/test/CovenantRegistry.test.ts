import { expect } from "chai";
import { ethers } from "hardhat";
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("CovenantRegistry", function () {
  // We define a fixture to reuse the same setup in every test.
  async function deployCovenantRegistryFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const CovenantRegistryFactory = await ethers.getContractFactory("CovenantRegistry");
    const covenantRegistry = await CovenantRegistryFactory.deploy();

    return { covenantRegistry, owner, addr1, addr2 };
  }

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      const { covenantRegistry } = await loadFixture(deployCovenantRegistryFixture);
      expect(await covenantRegistry.getAddress()).to.be.properAddress;
    });

    // it("Should set the right owner", async function () {
    //   const { covenantRegistry, owner } = await loadFixture(deployCovenantRegistryFixture);
    //   // Owner is deployer by default
    //   expect(await covenantRegistry.owner()).to.equal(owner.address);
    // });
  });

  describe("Covenant Registration", function () {
    it("Should register a new covenant", async function () {
      const { covenantRegistry, owner } = await loadFixture(deployCovenantRegistryFixture);
      
      const loanId = "LOAN-2023-001";
      const covenantHash = ethers.keccak256(ethers.toUtf8Bytes("covenant-data"));
      const covenantType = "FINANCIAL";
      
      await expect(covenantRegistry.registerCovenant(loanId, covenantHash, covenantType))
        .to.emit(covenantRegistry, "CovenantRegistered")
        .withArgs(loanId, covenantHash, await time.latest(), owner.address, covenantType);
      
      // Verify the covenant was stored
      const covenant = await covenantRegistry.getCovenant(loanId);
      expect(covenant.hash).to.equal(covenantHash);
      expect(covenant.covenantType).to.equal(covenantType);
      expect(covenant.registeredBy).to.equal(owner.address);
    });

    it("Should reject duplicate covenant registration", async function () {
      const { covenantRegistry } = await loadFixture(deployCovenantRegistryFixture);
      
      const loanId = "LOAN-2023-001";
      const covenantHash = ethers.keccak256(ethers.toUtf8Bytes("covenant-data"));
      
      // First registration should succeed
      await covenantRegistry.registerCovenant(loanId, covenantHash, "FINANCIAL");
      
      // Second registration should fail
      await expect(
        covenantRegistry.registerCovenant(loanId, covenantHash, "FINANCIAL")
      ).to.be.revertedWith("CovenantRegistry: covenant already exists");
    });

    it("Should reject zero hash", async function () {
      const { covenantRegistry } = await loadFixture(deployCovenantRegistryFixture);
      
      await expect(
        covenantRegistry.registerCovenant("LOAN-001", ethers.ZeroHash, "FINANCIAL")
      ).to.be.revertedWith("CovenantRegistry: invalid hash");
    });

    it("Should reject empty covenant type", async function () {
      const { covenantRegistry } = await loadFixture(deployCovenantRegistryFixture);
      
      const covenantHash = ethers.keccak256(ethers.toUtf8Bytes("covenant-data"));
      
      await expect(
        covenantRegistry.registerCovenant("LOAN-001", covenantHash, "")
      ).to.be.revertedWith("CovenantRegistry: covenant type required");
    });
  });

  describe("Covenant Verification", function () {
    it("Should verify correct hash", async function () {
      const { covenantRegistry } = await loadFixture(deployCovenantRegistryFixture);
      
      const loanId = "LOAN-2023-001";
      const covenantHash = ethers.keccak256(ethers.toUtf8Bytes("covenant-data"));
      
      await covenantRegistry.registerCovenant(loanId, covenantHash, "FINANCIAL");
      
      const isValid = await covenantRegistry.verifyCovenant(loanId, covenantHash);
      expect(isValid).to.be.true;
    });

    it("Should reject incorrect hash", async function () {
      const { covenantRegistry } = await loadFixture(deployCovenantRegistryFixture);
      
      const loanId = "LOAN-2023-001";
      const correctHash = ethers.keccak256(ethers.toUtf8Bytes("covenant-data"));
      const incorrectHash = ethers.keccak256(ethers.toUtf8Bytes("different-data"));
      
      await covenantRegistry.registerCovenant(loanId, correctHash, "FINANCIAL");
      
      const isValid = await covenantRegistry.verifyCovenant(loanId, incorrectHash);
      expect(isValid).to.be.false;
    });

    it("Should check if covenant exists", async function () {
      const { covenantRegistry } = await loadFixture(deployCovenantRegistryFixture);
      
      const loanId = "LOAN-2023-001";
      const covenantHash = ethers.keccak256(ethers.toUtf8Bytes("covenant-data"));
      
      // Before registration
      let exists = await covenantRegistry.covenantExists(loanId);
      expect(exists).to.be.false;
      
      // After registration
      await covenantRegistry.registerCovenant(loanId, covenantHash, "FINANCIAL");
      exists = await covenantRegistry.covenantExists(loanId);
      expect(exists).to.be.true;
    });
  });
});