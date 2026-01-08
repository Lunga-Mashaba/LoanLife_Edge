import { expect } from "chai";
import { ethers } from "hardhat";
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import type { ESGCompliance } from "../typechain-types"; // Adjust the path if needed

describe("ESGCompliance", function () {
  async function deployFixture() {
    const [owner, scorer, manager] = await ethers.getSigners();
    const ESGComplianceFactory = await ethers.getContractFactory("ESGCompliance");
    const esgCompliance = (await ESGComplianceFactory.deploy()) as ESGCompliance;
    return { esgCompliance, owner, scorer, manager };
  }

  describe("ESG Scoring", function () {
    it("Should record ESG score", async function () {
      const { esgCompliance, scorer } = await loadFixture(deployFixture);
      
      const loanId = "LOAN-001";
      const evidenceHash = "QmX1...";
      
      await expect(
        esgCompliance.connect(scorer).recordESGScore(loanId, 75, 80, 85, evidenceHash)
      )
        .to.emit(esgCompliance, "ESGScoreRecorded")
        .withArgs(loanId, 75, 80, 85, 80, scorer.address, await time.latest(), evidenceHash);
      
      const score = await esgCompliance.getCurrentESGScore(loanId);
      expect(score.environmental).to.equal(75);
      expect(score.social).to.equal(80);
      expect(score.governance).to.equal(85);
      expect(score.totalScore).to.equal(80);
    });

    it("Should reject invalid scores", async function () {
      const { esgCompliance, scorer } = await loadFixture(deployFixture);
      
      const loanId = "LOAN-001";
      const evidenceHash = "QmX1...";
      
      await expect(
        esgCompliance.connect(scorer).recordESGScore(loanId, 150, 80, 85, evidenceHash)
      ).to.be.revertedWith("ESGCompliance: environmental score out of range");
      
      await expect(
        esgCompliance.connect(scorer).recordESGScore(loanId, 75, 150, 85, evidenceHash)
      ).to.be.revertedWith("ESGCompliance: social score out of range");
      
      await expect(
        esgCompliance.connect(scorer).recordESGScore(loanId, 75, 80, 150, evidenceHash)
      ).to.be.revertedWith("ESGCompliance: governance score out of range");
    });

    it("Should reject empty evidence hash", async function () {
      const { esgCompliance, scorer } = await loadFixture(deployFixture);
      
      await expect(
        esgCompliance.connect(scorer).recordESGScore("LOAN-001", 75, 80, 85, "")
      ).to.be.revertedWith("ESGCompliance: evidence hash required");
    });
  });

  describe("ESG History", function () {
    it("Should track ESG history", async function () {
      const { esgCompliance, scorer } = await loadFixture(deployFixture);
      
      const loanId = "LOAN-001";
      const evidenceHash = "QmX1...";
      
      // Record multiple scores
      await esgCompliance.connect(scorer).recordESGScore(loanId, 70, 75, 80, evidenceHash);
      await time.increase(86400); // 1 day later
      await esgCompliance.connect(scorer).recordESGScore(loanId, 75, 80, 85, evidenceHash);
      await time.increase(86400); // Another day later
      await esgCompliance.connect(scorer).recordESGScore(loanId, 80, 85, 90, evidenceHash);
      
      const history = await esgCompliance.getESGHistory(loanId);
      expect(history.timestamps.length).to.equal(3);
      expect(history.environmentalScores[2]).to.equal(80);
      expect(history.socialScores[2]).to.equal(85);
      expect(history.governanceScores[2]).to.equal(90);
      expect(history.totalScores[2]).to.equal(85);
    });

    it("Should handle non-existent loan", async function () {
      const { esgCompliance } = await loadFixture(deployFixture);
      
      await expect(esgCompliance.getCurrentESGScore("LOAN-NONE"))
        .to.be.revertedWith("ESGCompliance: no scores found");
    });
  });

  describe("ESG Requirements", function () {
    it("Should add ESG requirement", async function () {
      const { esgCompliance, owner } = await loadFixture(deployFixture);
      
      const requirementId = "ENV_CARBON";
      
      await expect(
        esgCompliance.addESGRequirement(requirementId, 0, 60, 30) // ENVIRONMENTAL, min 60, weight 30
      )
        .to.emit(esgCompliance, "ESGRequirementAdded")
        .withArgs(requirementId, 0, 60, 30, owner.address, await time.latest());
      
      const requirement = await esgCompliance.getRequirement(requirementId);
      expect(requirement.pillar).to.equal(0); // ENVIRONMENTAL
      expect(requirement.minScore).to.equal(60);
      expect(requirement.weight).to.equal(30);
      expect(requirement.isActive).to.be.true;
    });

    it("Should reject duplicate requirement", async function () {
      const { esgCompliance } = await loadFixture(deployFixture);
      
      const requirementId = "ENV_CARBON";
      
      await esgCompliance.addESGRequirement(requirementId, 0, 60, 30);
      
      await expect(
        esgCompliance.addESGRequirement(requirementId, 0, 70, 40)
      ).to.be.revertedWith("ESGCompliance: requirement already exists");
    });

    it("Should reject invalid weight", async function () {
      const { esgCompliance } = await loadFixture(deployFixture);
      
      await expect(
        esgCompliance.addESGRequirement("ENV_CARBON", 0, 60, 150)
      ).to.be.revertedWith("ESGCompliance: weight out of range");
    });
  });

  describe("Compliance Checking", function () {
    it("Should check compliance", async function () {
      const { esgCompliance, scorer } = await loadFixture(deployFixture);
      
      const loanId = "LOAN-001";
      const evidenceHash = "QmX1...";
      
      // Record compliant score
      await esgCompliance.connect(scorer).recordESGScore(loanId, 75, 80, 85, evidenceHash);
      
      const [isCompliant, failing] = await esgCompliance.checkESGCompliance(loanId);
      expect(isCompliant).to.be.true;
      expect(failing.length).to.equal(0);
    });

    it("Should detect non-compliance", async function () {
      const { esgCompliance, scorer } = await loadFixture(deployFixture);
      
      const loanId = "LOAN-001";
      const evidenceHash = "QmX1...";
      
      // Record non-compliant score (below 50 minimum)
      await esgCompliance.connect(scorer).recordESGScore(loanId, 40, 60, 70, evidenceHash);
      
      const [isCompliant, failing] = await esgCompliance.checkESGCompliance(loanId);
      expect(isCompliant).to.be.false;
      expect(failing.length).to.equal(1);
      expect(failing[0]).to.equal("ENV_MINIMUM");
    });

    it("Should trigger ESG alerts", async function () {
      const { esgCompliance, scorer } = await loadFixture(deployFixture);
      
      const loanId = "LOAN-001";
      const evidenceHash = "QmX1...";
      
      await expect(
        esgCompliance.connect(scorer).recordESGScore(loanId, 40, 45, 50, evidenceHash)
      )
        .to.emit(esgCompliance, "ESGAlertTriggered")
        .withArgs(loanId, "ENV_MINIMUM", 40, 50, scorer.address, await time.latest());
    });
  });

  describe("ESG Trends", function () {
    it("Should detect improving trend", async function () {
      const { esgCompliance, scorer } = await loadFixture(deployFixture);
      
      const loanId = "LOAN-001";
      const evidenceHash = "QmX1...";
      
      await esgCompliance.connect(scorer).recordESGScore(loanId, 60, 65, 70, evidenceHash);
      await time.increase(86400);
      await esgCompliance.connect(scorer).recordESGScore(loanId, 70, 75, 80, evidenceHash);
      
      const trend = await esgCompliance.getESGTrend(loanId, 2);
      expect(trend).to.equal(1); // Improving
    });

    it("Should detect declining trend", async function () {
      const { esgCompliance, scorer } = await loadFixture(deployFixture);
      
      const loanId = "LOAN-001";
      const evidenceHash = "QmX1...";
      
      await esgCompliance.connect(scorer).recordESGScore(loanId, 80, 75, 70, evidenceHash);
      await time.increase(86400);
      await esgCompliance.connect(scorer).recordESGScore(loanId, 70, 65, 60, evidenceHash);
      
      const trend = await esgCompliance.getESGTrend(loanId, 2);
      expect(trend).to.equal(-1); // Declining
    });
  });
});