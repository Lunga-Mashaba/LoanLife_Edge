// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract GovernanceRules {
    enum Severity { LOW, MEDIUM, HIGH, CRITICAL }
    enum Status { PENDING, APPROVED, REJECTED, MITIGATED }
    
    struct Rule {
        string ruleId;
        string covenantType;
        uint256 threshold;
        address[] approvers;
        uint256 gracePeriod; // in days
        bool isActive;
    }
    
    struct Breach {
        string breachId;
        string loanId;
        string ruleId;
        Severity severity;
        Status status;
        uint256 detectedAt;
        uint256 resolvedAt;
        address detectedBy;
        address resolvedBy;
        string mitigationPlan;
    }
    
    mapping(string => Rule) internal rules;
    mapping(string => Breach) public breaches;
    mapping(string => string[]) public loanBreaches; // loanId -> breachIds
    
    event RuleCreated(string indexed ruleId, string covenantType, uint256 threshold);
    event BreachDetected(
        string indexed breachId,
        string indexed loanId,
        string ruleId,
        Severity severity
    );
    event BreachResolved(
        string indexed breachId,
        Status status,
        address resolvedBy
    );

    /**
     * @dev Get a governance rule by ruleId
     */
    function getRule(string memory ruleId) external view returns (
        string memory,
        string memory,
        uint256,
        address[] memory,
        uint256,
        bool
    ) {
        Rule storage rule = rules[ruleId];
        return (
            rule.ruleId,
            rule.covenantType,
            rule.threshold,
            rule.approvers,
            rule.gracePeriod,
            rule.isActive
        );
    }
    
    /**
     * @dev Create a new governance rule
     */
    function createRule(
        string memory ruleId,
        string memory covenantType,
        uint256 threshold,
        address[] memory approvers,
        uint256 gracePeriod
    ) external {
        require(bytes(rules[ruleId].ruleId).length == 0, "Rule already exists");
        require(approvers.length > 0, "At least one approver required");
        
        rules[ruleId] = Rule({
            ruleId: ruleId,
            covenantType: covenantType,
            threshold: threshold,
            approvers: approvers,
            gracePeriod: gracePeriod,
            isActive: true
        });
        
        emit RuleCreated(ruleId, covenantType, threshold);
    }
    
    /**
     * @dev Detect a potential breach
     */
    function detectBreach(
        string memory breachId,
        string memory loanId,
        string memory ruleId,
        Severity severity,
        uint256 predictedValue
    ) external returns (bool) {
        Rule memory rule = rules[ruleId];
        require(rule.isActive, "Rule is not active");
        require(predictedValue >= rule.threshold, "Below threshold");
        
        breaches[breachId] = Breach({
            breachId: breachId,
            loanId: loanId,
            ruleId: ruleId,
            severity: severity,
            status: Status.PENDING,
            detectedAt: block.timestamp,
            resolvedAt: 0,
            detectedBy: msg.sender,
            resolvedBy: address(0),
            mitigationPlan: ""
        });
        
        loanBreaches[loanId].push(breachId);
        
        emit BreachDetected(breachId, loanId, ruleId, severity);
        return true;
    }
    
    /**
     * @dev Resolve a breach with approver validation
     */
    function resolveBreach(
        string memory breachId,
        Status status,
        string memory mitigationPlan
    ) external {
        Breach storage breach = breaches[breachId];
        require(breach.status == Status.PENDING, "Breach already resolved");
        
        Rule memory rule = rules[breach.ruleId];
        bool isApprover = false;
        
        for (uint i = 0; i < rule.approvers.length; i++) {
            if (rule.approvers[i] == msg.sender) {
                isApprover = true;
                break;
            }
        }
        
        require(isApprover, "Not authorized to resolve");
        
        breach.status = status;
        breach.resolvedAt = block.timestamp;
        breach.resolvedBy = msg.sender;
        breach.mitigationPlan = mitigationPlan;
        
        emit BreachResolved(breachId, status, msg.sender);
    }
}