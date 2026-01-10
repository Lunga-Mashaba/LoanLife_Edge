import { expect } from "chai";
import { ethers } from "hardhat";
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { GovernanceRules } from "../typechain-types";

describe("GovernanceRules", function () {
  async function deployGovernanceRulesFixture() {
    const [owner, approver1, approver2, detector] = await ethers.getSigners();

    const GovernanceRulesFactory = await ethers.getContractFactory("GovernanceRules");
    const governanceRules = await GovernanceRulesFactory.deploy();

    return { governanceRules, owner, approver1, approver2, detector };
  }

  describe("Rule Creation", function () {
    it("Should create a new rule", async function () {
      const { governanceRules, owner, approver1 } = await loadFixture(deployGovernanceRulesFixture);
      
      const ruleId = "RULE-DTE-001";
      const covenantType = "DEBT_TO_EBITDA";
      const threshold = ethers.parseUnits("3.5", 18); // 3.5 with 18 decimals
      const approvers = [approver1.address];
      const gracePeriod = 30; // 30 days
      
      await expect(
        governanceRules.createRule(ruleId, covenantType, threshold, approvers, gracePeriod)
      ).to.emit(governanceRules, "RuleCreated")
       .withArgs(ruleId, covenantType, threshold);
      
      // Verify rule was created
      const rule = await governanceRules.rules(ruleId);
      expect(rule.ruleId).to.equal(ruleId);
      expect(rule.covenantType).to.equal(covenantType);
      expect(rule.threshold).to.equal(threshold);
      expect(rule.approvers[0]).to.equal(approver1.address);
      expect(rule.gracePeriod).to.equal(gracePeriod);
      expect(rule.isActive).to.be.true;
    });

    it("Should reject duplicate rule creation", async function () {
      const { governanceRules, approver1 } = await loadFixture(deployGovernanceRulesFixture);
      
      const ruleId = "RULE-DTE-001";
      const approvers = [approver1.address];
      
      // First creation should succeed
      await governanceRules.createRule(ruleId, "DTE", 100, approvers, 30);
      
      // Second creation should fail
      await expect(
        governanceRules.createRule(ruleId, "DTE", 100, approvers, 30)
      ).to.be.revertedWith("GovernanceRules: rule already exists");
    });
  });

  describe("Breach Detection", function () {
    it("Should detect a breach", async function () {
      const { governanceRules, detector, approver1 } = await loadFixture(deployGovernanceRulesFixture);
      
      // Create a rule first
      const ruleId = "RULE-DTE-001";
      await governanceRules.createRule(ruleId, "DTE", 100, [approver1.address], 30);
      
      // Detect breach
      const breachId = "BREACH-" + Date.now();
      const loanId = "LOAN-2023-001";
      const severity = 2; // HIGH
      const predictedValue = 150; // Above threshold
      
      await expect(
        governanceRules.connect(detector).detectBreach(
          breachId,
          loanId,
          ruleId,
          severity,
          predictedValue
        )
      ).to.emit(governanceRules, "BreachDetected")
       .withArgs(breachId, loanId, ruleId, severity);
      
      // Verify breach was recorded
      const breach = await governanceRules.breaches(breachId);
      expect(breach.breachId).to.equal(breachId);
      expect(breach.loanId).to.equal(loanId);
      expect(breach.ruleId).to.equal(ruleId);
      expect(breach.severity).to.equal(severity);
      expect(breach.status).to.equal(0); // PENDING
      expect(breach.detectedBy).to.equal(detector.address);
    });

    it("Should reject breach below threshold", async function () {
      const { governanceRules, detector, approver1 } = await loadFixture(deployGovernanceRulesFixture);
      
      // Create a rule with threshold 100
      const ruleId = "RULE-DTE-001";
      await governanceRules.createRule(ruleId, "DTE", 100, [approver1.address], 30);
      
      // Try to detect breach with value below threshold
      const breachId = "BREACH-" + Date.now();
      
      await expect(
        governanceRules.connect(detector).detectBreach(
          breachId,
          "LOAN-001",
          ruleId,
          1, // MEDIUM
          50 // Below threshold
        )
      ).to.be.revertedWith("GovernanceRules: below threshold");
    });
  });
});