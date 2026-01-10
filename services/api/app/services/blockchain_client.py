"""
Blockchain Client
Python client for interacting with blockchain HTTP API bridge
Handles all blockchain operations with proper error handling and fallbacks
"""
import os
import requests
import json
from typing import Dict, Any, Optional
from datetime import datetime
import hashlib


class BlockchainClient:
    """Client for blockchain HTTP API bridge"""
    
    def __init__(self, base_url: str = None):
        self.base_url = base_url or os.getenv(
            "BLOCKCHAIN_API_URL", 
            "http://localhost:3001"
        )
        self.enabled = os.getenv("BLOCKCHAIN_ENABLED", "true").lower() == "true"
        self.timeout = 5  # 5 second timeout
    
    def _make_request(
        self, 
        method: str, 
        endpoint: str, 
        data: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """Make HTTP request to blockchain API with error handling"""
        if not self.enabled:
            return {"success": False, "error": "Blockchain integration disabled"}
        
        try:
            url = f"{self.base_url}{endpoint}"
            response = requests.request(
                method=method,
                url=url,
                json=data,
                timeout=self.timeout
            )
            
            if response.status_code == 200:
                return response.json()
            elif response.status_code == 503:
                # Service unavailable - blockchain not initialized
                return {
                    "success": False,
                    "error": "Blockchain service not initialized",
                    "fallback": True
                }
            else:
                return {
                    "success": False,
                    "error": response.json().get("error", "Unknown error"),
                    "status_code": response.status_code
                }
        except requests.exceptions.ConnectionError:
            return {
                "success": False,
                "error": "Cannot connect to blockchain service",
                "fallback": True
            }
        except requests.exceptions.Timeout:
            return {
                "success": False,
                "error": "Blockchain service timeout",
                "fallback": True
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "fallback": True
            }
    
    def register_covenant(
        self, 
        loan_id: str, 
        covenant_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Register covenant on blockchain
        
        Args:
            loan_id: Loan ID
            covenant_data: Covenant data dictionary
        
        Returns:
            Result with transaction hash or error
        """
        # Generate hash of covenant data
        covenant_hash = self._hash_data(covenant_data)
        
        result = self._make_request(
            "POST",
            "/api/v1/covenants/register",
            {
                "loanId": loan_id,
                "covenantData": covenant_data
            }
        )
        
        return result
    
    def log_audit_entry(
        self,
        action_type: int,
        loan_id: str,
        actor: str,
        metadata: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Log audit entry to blockchain
        
        Args:
            action_type: Action type code (see AuditEventType mapping)
            loan_id: Loan ID
            actor: User/actor who performed the action
            metadata: Additional metadata
        
        Returns:
            Result with transaction hash or error
        """
        # Hash metadata
        metadata_str = json.dumps(metadata or {}, sort_keys=True)
        data_hash = hashlib.sha256(metadata_str.encode()).hexdigest()
        
        result = self._make_request(
            "POST",
            "/api/v1/audit/log",
            {
                "actionType": action_type,
                "loanId": loan_id,
                "actor": actor,
                "dataHash": f"0x{data_hash}",
                "metadata": metadata_str
            }
        )
        
        return result
    
    def record_esg_score(
        self,
        loan_id: str,
        environmental: float,
        social: float,
        governance: float,
        evidence: str = None
    ) -> Dict[str, Any]:
        """
        Record ESG score on blockchain
        
        Args:
            loan_id: Loan ID
            environmental: Environmental score (0-100)
            social: Social score (0-100)
            governance: Governance score (0-100)
            evidence: Optional evidence hash
        
        Returns:
            Result with transaction hash or error
        """
        evidence_hash = evidence or "0x0000000000000000000000000000000000000000000000000000000000000000"
        
        result = self._make_request(
            "POST",
            "/api/v1/esg/record",
            {
                "loanId": loan_id,
                "environmental": int(environmental),
                "social": int(social),
                "governance": int(governance),
                "evidenceHash": evidence_hash
            }
        )
        
        return result
    
    def detect_breach(
        self,
        breach_id: str,
        loan_id: str,
        rule_id: str,
        severity: int,
        predicted_value: float = 0.0
    ) -> Dict[str, Any]:
        """
        Detect breach on blockchain via governance rules
        
        Args:
            breach_id: Unique breach ID
            loan_id: Loan ID
            rule_id: Governance rule ID
            severity: Severity level (0-3)
            predicted_value: Predicted breach value
        
        Returns:
            Result with transaction hash or error
        """
        result = self._make_request(
            "POST",
            "/api/v1/governance/detect-breach",
            {
                "breachId": breach_id,
                "loanId": loan_id,
                "ruleId": rule_id,
                "severity": severity,
                "predictedValue": predicted_value
            }
        )
        
        return result
    
    def get_covenant(self, loan_id: str) -> Optional[Dict[str, Any]]:
        """Get covenant from blockchain"""
        result = self._make_request("GET", f"/api/v1/covenants/{loan_id}")
        
        if result.get("success") is not False and "hash" in result:
            return result
        return None
    
    def get_esg_score(self, loan_id: str) -> Optional[Dict[str, Any]]:
        """Get ESG score from blockchain"""
        result = self._make_request("GET", f"/api/v1/esg/{loan_id}")
        
        if result.get("success") is not False and "environmental" in result:
            return result
        return None
    
    def is_available(self) -> bool:
        """Check if blockchain service is available"""
        try:
            response = requests.get(f"{self.base_url}/health", timeout=2)
            return response.status_code == 200
        except:
            return False
    
    def _hash_data(self, data: Dict[str, Any]) -> str:
        """Generate hash for data"""
        data_str = json.dumps(data, sort_keys=True)
        return hashlib.sha256(data_str.encode()).hexdigest()


# Singleton instance
_blockchain_client: Optional[BlockchainClient] = None

def get_blockchain_client() -> BlockchainClient:
    """Get singleton blockchain client instance"""
    global _blockchain_client
    if _blockchain_client is None:
        _blockchain_client = BlockchainClient()
    return _blockchain_client

