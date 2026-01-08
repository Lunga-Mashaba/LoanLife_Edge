// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title Audit Ledger for LoanLife Edge
/// @notice Immutable log of all system actions and state changes
/// @dev Provides tamper-proof audit trail for compliance and transparency
contract AuditLedger {
    enum ActionType {
        COVENANT_REGISTERED,
        COVENANT_UPDATED,
        COVENANT_VERIFIED,
        RULE_CREATED,
        RULE_UPDATED,
        BREACH_DETECTED,
        BREACH_STATUS_CHANGED,
        BREACH_RESOLVED,
        ESG_SCORE_UPDATED,
        GOVERNANCE_ACTION
    }
    
    struct AuditEntry {
        uint256 entryId;
        ActionType action;
        string entityId;
        address actor;
        uint256 timestamp;
        bytes32 previousStateHash;
        bytes32 newStateHash;
        string metadata;
    }
    
    // Storage
    AuditEntry[] private _auditTrail;
    mapping(string => uint256[]) private _entityAudits; // entityId -> entryIds
    mapping(address => uint256[]) private _actorAudits; // actor -> entryIds
    mapping(ActionType => uint256[]) private _actionAudits; // action -> entryIds
    
    // Events
    event AuditEntryCreated(
        uint256 indexed entryId,
        ActionType action,
        string indexed entityId,
        address indexed actor,
        uint256 timestamp,
        bytes32 previousStateHash,
        bytes32 newStateHash,
        string metadata
    );
    
    /// @notice Create a new audit entry
    /// @param action Type of action being logged
    /// @param entityId Identifier of the entity (loanId, breachId, etc.)
    /// @param previousStateHash Hash of previous state (0x0 for new entities)
    /// @param newStateHash Hash of new state
    /// @param metadata Additional information about the action
    function logAction(
        ActionType action,
        string calldata entityId,
        bytes32 previousStateHash,
        bytes32 newStateHash,
        string calldata metadata
    ) external returns (uint256) {
        require(newStateHash != bytes32(0), "AuditLedger: new state hash required");
        
        uint256 entryId = _auditTrail.length;
        
        AuditEntry memory entry = AuditEntry({
            entryId: entryId,
            action: action,
            entityId: entityId,
            actor: msg.sender,
            timestamp: block.timestamp,
            previousStateHash: previousStateHash,
            newStateHash: newStateHash,
            metadata: metadata
        });
        
        _auditTrail.push(entry);
        _entityAudits[entityId].push(entryId);
        _actorAudits[msg.sender].push(entryId);
        _actionAudits[action].push(entryId);
        
        emit AuditEntryCreated(
            entryId,
            action,
            entityId,
            msg.sender,
            block.timestamp,
            previousStateHash,
            newStateHash,
            metadata
        );
        
        return entryId;
    }
    
    /// @notice Get audit entry by ID
    /// @param entryId Entry identifier
    function getAuditEntry(uint256 entryId) external view returns (
        ActionType action,
        string memory entityId,
        address actor,
        uint256 timestamp,
        bytes32 previousStateHash,
        bytes32 newStateHash,
        string memory metadata
    ) {
        require(entryId < _auditTrail.length, "AuditLedger: entry not found");
        
        AuditEntry memory entry = _auditTrail[entryId];
        
        return (
            entry.action,
            entry.entityId,
            entry.actor,
            entry.timestamp,
            entry.previousStateHash,
            entry.newStateHash,
            entry.metadata
        );
    }
    
    /// @notice Get all audit entries for an entity
    /// @param entityId Entity identifier
    function getAuditsForEntity(string calldata entityId) external view returns (uint256[] memory) {
        return _entityAudits[entityId];
    }
    
    /// @notice Get all audit entries for an actor
    /// @param actor Actor address
    function getAuditsForActor(address actor) external view returns (uint256[] memory) {
        return _actorAudits[actor];
    }
    
    /// @notice Get all audit entries for an action type
    /// @param action Action type
    function getAuditsForAction(ActionType action) external view returns (uint256[] memory) {
        return _actionAudits[action];
    }
    
    /// @notice Get total number of audit entries
    function totalAuditEntries() external view returns (uint256) {
        return _auditTrail.length;
    }
    
    /// @notice Verify audit trail integrity
    /// @param startEntryId Starting entry ID
    /// @param endEntryId Ending entry ID
    /// @return isValid True if chain of hashes is valid
    function verifyAuditTrail(
        uint256 startEntryId,
        uint256 endEntryId
    ) external view returns (bool isValid) {
        require(startEntryId <= endEntryId, "AuditLedger: invalid range");
        require(endEntryId < _auditTrail.length, "AuditLedger: entry not found");
        
        isValid = true;
        bytes32 expectedPreviousHash = bytes32(0);
        
        for (uint256 i = startEntryId; i <= endEntryId; i++) {
            AuditEntry memory entry = _auditTrail[i];
            
            if (entry.previousStateHash != expectedPreviousHash) {
                isValid = false;
                break;
            }
            
            expectedPreviousHash = entry.newStateHash;
        }
        
        return isValid;
    }
    
    /// @notice Get latest audit entries (for pagination)
    /// @param limit Maximum number of entries to return
    /// @param offset Starting offset
    function getRecentAudits(
        uint256 limit,
        uint256 offset
    ) external view returns (AuditEntry[] memory) {
        require(limit > 0, "AuditLedger: limit must be positive");
        
        uint256 total = _auditTrail.length;
        if (offset >= total) {
            return new AuditEntry[](0);
        }
        
        uint256 end = offset + limit;
        if (end > total) {
            end = total;
        }
        
        uint256 resultCount = end - offset;
        AuditEntry[] memory result = new AuditEntry[](resultCount);
        
        for (uint256 i = 0; i < resultCount; i++) {
            result[i] = _auditTrail[total - 1 - offset - i];
        }
        
        return result;
    }
}