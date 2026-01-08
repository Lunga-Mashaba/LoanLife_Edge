import { expect } from "chai";
import { ethers } from "hardhat";
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("AuditLedger", function () {
  async function deployFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const AuditLedger = await ethers.getContractFactory("AuditLedger");
    const auditLedger = await AuditLedger.deploy();
    return { auditLedger, owner, addr1, addr2 };
  }

  describe("Audit Logging", function () {
    it("Should log an audit entry", async function () {
      const { auditLedger, owner } = await loadFixture(deployFixture);
      
      const entityId = "LOAN-001";
      const previousHash = ethers.ZeroHash;
      const newHash = ethers.keccak256(ethers.toUtf8Bytes("new-state"));
      const metadata = "Covenant registered";
      
      await expect(
        auditLedger.logAction(0, entityId, previousHash, newHash, metadata)
      )
        .to.emit(auditLedger, "AuditEntryCreated")
        .withArgs(0, 0, entityId, owner.address, await time.latest(), previousHash, newHash, metadata);
      
      expect(await auditLedger.totalAuditEntries()).to.equal(1);
    });

    it("Should retrieve audit entry", async function () {
      const { auditLedger, owner } = await loadFixture(deployFixture);
      
      const entityId = "LOAN-001";
      const newHash = ethers.keccak256(ethers.toUtf8Bytes("state"));
      const metadata = "Test entry";
      
      await auditLedger.logAction(0, entityId, ethers.ZeroHash, newHash, metadata);
      
      const entry = await auditLedger.getAuditEntry(0);
      expect(entry.entityId).to.equal(entityId);
      expect(entry.actor).to.equal(owner.address);
      expect(entry.newStateHash).to.equal(newHash);
      expect(entry.metadata).to.equal(metadata);
    });

    it("Should get audits for entity", async function () {
      const { auditLedger } = await loadFixture(deployFixture);
      
      const entityId = "LOAN-001";
      const hash = ethers.keccak256(ethers.toUtf8Bytes("state"));
      
      await auditLedger.logAction(0, entityId, ethers.ZeroHash, hash, "Entry 1");
      await auditLedger.logAction(1, entityId, hash, hash, "Entry 2");
      
      const audits = await auditLedger.getAuditsForEntity(entityId);
      expect(audits.length).to.equal(2);
      expect(audits[0]).to.equal(0);
      expect(audits[1]).to.equal(1);
    });

    it("Should get audits for actor", async function () {
      const { auditLedger, addr1 } = await loadFixture(deployFixture);
      
      const hash = ethers.keccak256(ethers.toUtf8Bytes("state"));
      
      await auditLedger.logAction(0, "LOAN-001", ethers.ZeroHash, hash, "Entry 1");
      // Ensure addr1 has enough ETH and is allowed to log actions
      await addr1.sendTransaction({ to: addr1.address, value: ethers.parseEther("1.0") });
      await auditLedger.connect(addr1).logAction(1, "LOAN-002", ethers.ZeroHash, hash, "Entry 2");
      
      const audits = await auditLedger.getAuditsForActor(addr1.address);
      expect(audits.length).to.equal(1);
      expect(audits[0]).to.equal(1);
    });
  });

  describe("Audit Trail Verification", function () {
    it("Should verify valid audit trail", async function () {
      const { auditLedger } = await loadFixture(deployFixture);
      
      const hash1 = ethers.keccak256(ethers.toUtf8Bytes("state1"));
      const hash2 = ethers.keccak256(ethers.toUtf8Bytes("state2"));
      const hash3 = ethers.keccak256(ethers.toUtf8Bytes("state3"));
      
      await auditLedger.logAction(0, "LOAN-001", ethers.ZeroHash, hash1, "First");
      await auditLedger.logAction(1, "LOAN-001", hash1, hash2, "Second");
      await auditLedger.logAction(2, "LOAN-001", hash2, hash3, "Third");
      
      const isValid = await auditLedger.verifyAuditTrail(0, 2);
      expect(isValid).to.be.true;
    });

    it("Should detect invalid audit trail", async function () {
      const { auditLedger } = await loadFixture(deployFixture);
      
      const hash1 = ethers.keccak256(ethers.toUtf8Bytes("state1"));
      const hash2 = ethers.keccak256(ethers.toUtf8Bytes("state2"));
      const hash3 = ethers.keccak256(ethers.toUtf8Bytes("state3"));
      
      // Log entries with mismatched hashes
      await auditLedger.logAction(0, "LOAN-001", ethers.ZeroHash, hash1, "First");
      await auditLedger.logAction(1, "LOAN-001", hash2, hash3, "Second"); // Wrong previous hash
      
      const isValid = await auditLedger.verifyAuditTrail(0, 1);
      expect(isValid).to.be.false;
    });
  });

  describe("Recent Audits", function () {
    it("Should get recent audits", async function () {
      const { auditLedger } = await loadFixture(deployFixture);
      
      const hash = ethers.keccak256(ethers.toUtf8Bytes("state"));
      
      // Create 5 audit entries
      for (let i = 0; i < 5; i++) {
        await auditLedger.logAction(0, `LOAN-00${i}`, ethers.ZeroHash, hash, `Entry ${i}`);
      }
      
      const recent = await auditLedger.getRecentAudits(3, 0);
      expect(recent.length).to.equal(3);
      expect(recent[0].entityId).to.equal("LOAN-004");
      expect(recent[1].entityId).to.equal("LOAN-003");
      expect(recent[2].entityId).to.equal("LOAN-002");
    });

    it("Should handle empty recent audits", async function () {
      const { auditLedger } = await loadFixture(deployFixture);
      
      const recent = await auditLedger.getRecentAudits(5, 10);
      expect(recent.length).to.equal(0);
    });
  });
});