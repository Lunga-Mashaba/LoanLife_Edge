// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title Covenant Registry
/// @notice Stores cryptographic hashes of loan covenants on-chain
/// @dev Only stores hashes, not sensitive data
contract CovenantRegistry {
    struct Covenant {
        bytes32 hash;
        uint256 timestamp;
        address registeredBy;
        string loanId;
        string covenantType;
    }
    
    /// @notice Mapping from loanId to covenant data
    mapping(string => Covenant) private _covenants;
    
    /// @notice Emitted when a new covenant is registered
    /// @param loanId The unique loan identifier
    /// @param hash The SHA-256 hash of the covenant data
    /// @param timestamp When the covenant was registered
    /// @param registeredBy Who registered the covenant
    /// @param covenantType Type of covenant (FINANCIAL, ESG, etc.)
    event CovenantRegistered(
        string indexed loanId,
        bytes32 hash,
        uint256 timestamp,
        address indexed registeredBy,
        string covenantType
    );
    
    /// @notice Emitted when a covenant is updated
    /// @param loanId The unique loan identifier
    /// @param oldHash The previous hash
    /// @param newHash The new hash
    /// @param timestamp When the update occurred
    event CovenantUpdated(
        string indexed loanId,
        bytes32 oldHash,
        bytes32 newHash,
        uint256 timestamp
    );
    
    /// @notice Register a new covenant for a loan
    /// @dev Reverts if covenant already exists for this loanId
    /// @param loanId Unique identifier for the loan
    /// @param covenantHash SHA-256 hash of covenant data
    /// @param covenantType Type of covenant
    function registerCovenant(
        string calldata loanId,
        bytes32 covenantHash,
        string calldata covenantType
    ) external {
        require(_covenants[loanId].timestamp == 0, "CovenantRegistry: covenant already exists");
        require(covenantHash != bytes32(0), "CovenantRegistry: invalid hash");
        require(bytes(covenantType).length > 0, "CovenantRegistry: covenant type required");
        
        _covenants[loanId] = Covenant({
            hash: covenantHash,
            timestamp: block.timestamp,
            registeredBy: msg.sender,
            loanId: loanId,
            covenantType: covenantType
        });
        
        emit CovenantRegistered(
            loanId,
            covenantHash,
            block.timestamp,
            msg.sender,
            covenantType
        );
    }
    
    /// @notice Get covenant details by loanId
    /// @param loanId The loan identifier
    /// @return hash The covenant hash
    /// @return timestamp When it was registered
    /// @return registeredBy Who registered it
    /// @return covenantType The type of covenant
    function getCovenant(string calldata loanId) 
        external 
        view 
        returns (
            bytes32 hash,
            uint256 timestamp,
            address registeredBy,
            string memory covenantType
        ) 
    {
        Covenant memory covenant = _covenants[loanId];
        require(covenant.timestamp > 0, "CovenantRegistry: covenant not found");
        
        return (
            covenant.hash,
            covenant.timestamp,
            covenant.registeredBy,
            covenant.covenantType
        );
    }
    
    /// @notice Verify if a hash matches the stored covenant
    /// @param loanId The loan identifier
    /// @param hashToVerify The hash to check
    /// @return isValid True if the hash matches
    function verifyCovenant(
        string calldata loanId,
        bytes32 hashToVerify
    ) external view returns (bool isValid) {
        return _covenants[loanId].hash == hashToVerify;
    }
    
    /// @notice Check if a covenant exists for a loan
    /// @param loanId The loan identifier
    /// @return exists True if covenant exists
    function covenantExists(string calldata loanId) external view returns (bool exists) {
        return _covenants[loanId].timestamp > 0;
    }
}