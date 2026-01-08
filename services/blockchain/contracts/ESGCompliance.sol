// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title ESG Compliance Tracker for LoanLife Edge
/// @notice Monitors and scores Environmental, Social, and Governance compliance
contract ESGCompliance {
    enum ESGPillar { ENVIRONMENTAL, SOCIAL, GOVERNANCE }
    
    struct ESGScore {
        uint256 environmental;    // 0-100
        uint256 social;          // 0-100
        uint256 governance;      // 0-100
        uint256 timestamp;
        address scoredBy;
        string evidenceHash;     // IPFS or similar hash for evidence
    }
    
    struct ESGRequirement {
        string requirementId;
        ESGPillar pillar;
        uint256 minScore;
        uint256 weight;
        bool isActive;
    }
    
    // Storage
    mapping(string => ESGScore[]) private _loanScores; // loanId -> scores
    mapping(string => ESGRequirement) private _requirements; // requirementId -> requirement
    mapping(string => mapping(ESGPillar => uint256)) private _latestScores; // loanId -> pillar -> score
    
    // Events
    event ESGScoreRecorded(
        string indexed loanId,
        uint256 environmental,
        uint256 social,
        uint256 governance,
        uint256 totalScore,
        address scoredBy,
        uint256 timestamp,
        string evidenceHash
    );
    
    event ESGRequirementAdded(
        string indexed requirementId,
        ESGPillar pillar,
        uint256 minScore,
        uint256 weight,
        address addedBy,
        uint256 timestamp
    );
    
    event ESGRequirementUpdated(
        string indexed requirementId,
        bool isActive,
        address updatedBy,
        uint256 timestamp
    );
    
    event ESGAlertTriggered(
        string indexed loanId,
        string requirementId,
        uint256 actualScore,
        uint256 requiredScore,
        address triggeredBy,
        uint256 timestamp
    );
    
    /// @notice Record an ESG score for a loan
    /// @param loanId Loan identifier
    /// @param environmental Environmental score (0-100)
    /// @param social Social score (0-100)
    /// @param governance Governance score (0-100)
    /// @param evidenceHash Hash of supporting evidence
    function recordESGScore(
        string calldata loanId,
        uint256 environmental,
        uint256 social,
        uint256 governance,
        string calldata evidenceHash
    ) external returns (uint256 totalScore) {
        require(environmental <= 100, "ESGCompliance: environmental score out of range");
        require(social <= 100, "ESGCompliance: social score out of range");
        require(governance <= 100, "ESGCompliance: governance score out of range");
        require(bytes(evidenceHash).length > 0, "ESGCompliance: evidence hash required");
        
        totalScore = (environmental + social + governance) / 3;
        
        ESGScore memory newScore = ESGScore({
            environmental: environmental,
            social: social,
            governance: governance,
            timestamp: block.timestamp,
            scoredBy: msg.sender,
            evidenceHash: evidenceHash
        });
        
        _loanScores[loanId].push(newScore);
        
        // Update latest scores
        _latestScores[loanId][ESGPillar.ENVIRONMENTAL] = environmental;
        _latestScores[loanId][ESGPillar.SOCIAL] = social;
        _latestScores[loanId][ESGPillar.GOVERNANCE] = governance;
        
        // Check for breaches
        _checkESGRequirements(loanId, environmental, social, governance);
        
        emit ESGScoreRecorded(
            loanId,
            environmental,
            social,
            governance,
            totalScore,
            msg.sender,
            block.timestamp,
            evidenceHash
        );
        
        return totalScore;
    }
    
    /// @notice Add a new ESG requirement
    /// @param requirementId Unique requirement identifier
    /// @param pillar ESG pillar
    /// @param minScore Minimum required score (0-100)
    /// @param weight Weight for composite scoring
    function addESGRequirement(
        string calldata requirementId,
        ESGPillar pillar,
        uint256 minScore,
        uint256 weight
    ) external returns (bool) {
        require(bytes(_requirements[requirementId].requirementId).length == 0, 
                "ESGCompliance: requirement already exists");
        require(minScore <= 100, "ESGCompliance: minScore out of range");
        require(weight > 0 && weight <= 100, "ESGCompliance: weight out of range");
        
        _requirements[requirementId] = ESGRequirement({
            requirementId: requirementId,
            pillar: pillar,
            minScore: minScore,
            weight: weight,
            isActive: true
        });
        
        emit ESGRequirementAdded(
            requirementId,
            pillar,
            minScore,
            weight,
            msg.sender,
            block.timestamp
        );
        
        return true;
    }
    
    /// @notice Get current ESG score for a loan
    /// @param loanId Loan identifier
    function getCurrentESGScore(string calldata loanId) external view returns (
        uint256 environmental,
        uint256 social,
        uint256 governance,
        uint256 totalScore,
        uint256 timestamp
    ) {
        ESGScore[] storage scores = _loanScores[loanId];
        require(scores.length > 0, "ESGCompliance: no scores found");
        
        ESGScore memory latestScore = scores[scores.length - 1];
        
        environmental = latestScore.environmental;
        social = latestScore.social;
        governance = latestScore.governance;
        totalScore = (environmental + social + governance) / 3;
        timestamp = latestScore.timestamp;
    }
    
    /// @notice Get ESG score history for a loan
    /// @param loanId Loan identifier
    function getESGHistory(string calldata loanId) external view returns (
        uint256[] memory timestamps,
        uint256[] memory environmentalScores,
        uint256[] memory socialScores,
        uint256[] memory governanceScores,
        uint256[] memory totalScores
    ) {
        ESGScore[] storage scores = _loanScores[loanId];
        uint256 count = scores.length;
        
        timestamps = new uint256[](count);
        environmentalScores = new uint256[](count);
        socialScores = new uint256[](count);
        governanceScores = new uint256[](count);
        totalScores = new uint256[](count);
        
        for (uint256 i = 0; i < count; i++) {
            ESGScore memory score = scores[i];
            timestamps[i] = score.timestamp;
            environmentalScores[i] = score.environmental;
            socialScores[i] = score.social;
            governanceScores[i] = score.governance;
            totalScores[i] = (score.environmental + score.social + score.governance) / 3;
        }
    }
    
    /// @notice Check if a loan meets all active ESG requirements
    /// @param loanId Loan identifier
    /// @return meetsRequirements True if all requirements are met
    /// @return failingRequirements List of requirement IDs that are not met
    function checkESGCompliance(
        string calldata loanId
    ) external view returns (
        bool meetsRequirements,
        string[] memory failingRequirements
    ) {
        ESGScore[] storage scores = _loanScores[loanId];
        require(scores.length > 0, "ESGCompliance: no scores found");
        
        ESGScore memory latestScore = scores[scores.length - 1];
        
        // Count failing requirements (simplified - in production would iterate requirements)
        uint256 failingCount = 0;
        
        // For demo: check if any score below 50 (minimum compliance)
        if (latestScore.environmental < 50) failingCount++;
        if (latestScore.social < 50) failingCount++;
        if (latestScore.governance < 50) failingCount++;
        
        failingRequirements = new string[](failingCount);
        uint256 index = 0;
        
        if (latestScore.environmental < 50) {
            failingRequirements[index++] = "ENV_MINIMUM";
        }
        if (latestScore.social < 50) {
            failingRequirements[index++] = "SOC_MINIMUM";
        }
        if (latestScore.governance < 50) {
            failingRequirements[index++] = "GOV_MINIMUM";
        }
        
        meetsRequirements = failingCount == 0;
        
        return (meetsRequirements, failingRequirements);
    }
    
    /// @notice Get ESG trend for a loan (improving/stable/declining)
    /// @param loanId Loan identifier
    /// @param periods Number of periods to analyze
    function getESGTrend(
        string calldata loanId,
        uint256 periods
    ) external view returns (int256 trend) {
        ESGScore[] storage scores = _loanScores[loanId];
        require(scores.length >= 2, "ESGCompliance: insufficient history");
        require(periods > 0, "ESGCompliance: periods must be positive");
        
        if (periods > scores.length) {
            periods = scores.length;
        }
        
        uint256 startIdx = scores.length - periods;
        uint256 endIdx = scores.length - 1;
        
        uint256 startTotal = (scores[startIdx].environmental + 
                            scores[startIdx].social + 
                            scores[startIdx].governance) / 3;
        
        uint256 endTotal = (scores[endIdx].environmental + 
                          scores[endIdx].social + 
                          scores[endIdx].governance) / 3;
        
        if (endTotal > startTotal) {
            trend = 1; // Improving
        } else if (endTotal < startTotal) {
            trend = -1; // Declining
        } else {
            trend = 0; // Stable
        }
    }
    
    /// @dev Internal function to check ESG requirements
    function _checkESGRequirements(
        string memory loanId,
        uint256 environmental,
        uint256 social,
        uint256 governance
    ) internal {
        // Simplified requirement checking for demo
        // In production, would iterate through active requirements
        
        if (environmental < 50) {
            emit ESGAlertTriggered(
                loanId,
                "ENV_MINIMUM",
                environmental,
                50,
                msg.sender,
                block.timestamp
            );
        }
        
        if (social < 50) {
            emit ESGAlertTriggered(
                loanId,
                "SOC_MINIMUM",
                social,
                50,
                msg.sender,
                block.timestamp
            );
        }
        
        if (governance < 50) {
            emit ESGAlertTriggered(
                loanId,
                "GOV_MINIMUM",
                governance,
                50,
                msg.sender,
                block.timestamp
            );
        }
    }
    
    /// @notice Get requirement details
    /// @param requirementId Requirement identifier
    function getRequirement(string calldata requirementId) external view returns (
        ESGPillar pillar,
        uint256 minScore,
        uint256 weight,
        bool isActive
    ) {
        ESGRequirement memory req = _requirements[requirementId];
        require(bytes(req.requirementId).length > 0, "ESGCompliance: requirement not found");
        
        return (
            req.pillar,
            req.minScore,
            req.weight,
            req.isActive
        );
    }
}