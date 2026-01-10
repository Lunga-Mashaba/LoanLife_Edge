"""
Quick API test script - verifies all endpoints work
Run this after starting the server to test everything
"""
import requests
import json
from typing import Dict, Any

BASE_URL = "http://localhost:8000"
API_BASE = f"{BASE_URL}/api/v1"


def test_health():
    """Test health check endpoint"""
    print("🔍 Testing health check...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        response.raise_for_status()
        print(f"✅ Health check passed: {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False


def test_get_loans():
    """Test getting all loans"""
    print("\n🔍 Testing GET /api/v1/loans...")
    try:
        response = requests.get(f"{API_BASE}/loans")
        response.raise_for_status()
        loans = response.json()
        print(f"✅ Found {len(loans)} loan(s)")
        if loans:
            print(f"   First loan: {loans[0].get('borrower_name', 'N/A')}")
            return loans[0].get('id')
        return None
    except Exception as e:
        print(f"❌ Failed to get loans: {e}")
        return None


def test_get_loan_state(loan_id: str):
    """Test getting loan state"""
    print(f"\n🔍 Testing GET /api/v1/loans/{loan_id}/state...")
    try:
        response = requests.get(f"{API_BASE}/loans/{loan_id}/state")
        response.raise_for_status()
        state = response.json()
        print(f"✅ Loan state retrieved")
        print(f"   Health metrics: {state.get('health_metrics', {})}")
        return True
    except Exception as e:
        print(f"❌ Failed to get loan state: {e}")
        return False


def test_get_predictions(loan_id: str):
    """Test risk predictions"""
    print(f"\n🔍 Testing GET /api/v1/predictions/{loan_id}...")
    try:
        response = requests.get(f"{API_BASE}/predictions/{loan_id}")
        response.raise_for_status()
        predictions = response.json()
        print(f"✅ Predictions retrieved")
        overall = predictions.get('overall_risk', {})
        print(f"   Overall risk: {overall.get('level', 'N/A')}")
        return True
    except Exception as e:
        print(f"❌ Failed to get predictions: {e}")
        return False


def test_get_esg_score(loan_id: str):
    """Test ESG scoring"""
    print(f"\n🔍 Testing GET /api/v1/esg/{loan_id}/score...")
    try:
        response = requests.get(f"{API_BASE}/esg/{loan_id}/score")
        response.raise_for_status()
        score = response.json()
        print(f"✅ ESG score retrieved")
        print(f"   Overall score: {score.get('overall_score', 'N/A')}")
        return True
    except Exception as e:
        print(f"❌ Failed to get ESG score: {e}")
        return False


def test_get_audit_logs(loan_id: str):
    """Test audit logs"""
    print(f"\n🔍 Testing GET /api/v1/audit?loan_id={loan_id}...")
    try:
        response = requests.get(f"{API_BASE}/audit", params={"loan_id": loan_id})
        response.raise_for_status()
        logs = response.json()
        print(f"✅ Audit logs retrieved: {len(logs)} event(s)")
        return True
    except Exception as e:
        print(f"❌ Failed to get audit logs: {e}")
        return False


def main():
    """Run all tests"""
    print("=" * 50)
    print("LoanLife Edge API Test Suite")
    print("=" * 50)
    
    # Check if server is running
    if not test_health():
        print("\n❌ Server is not running or not accessible!")
        print("   Start the server with: uvicorn app.main:app --reload")
        return
    
    # Test endpoints
    loan_id = test_get_loans()
    
    if not loan_id:
        print("\n⚠️  No loans found. Start server with SEED_DATA=true to create demo loans.")
        return
    
    test_get_loan_state(loan_id)
    test_get_predictions(loan_id)
    test_get_esg_score(loan_id)
    test_get_audit_logs(loan_id)
    
    print("\n" + "=" * 50)
    print("✅ All tests completed!")
    print("=" * 50)


if __name__ == "__main__":
    main()

