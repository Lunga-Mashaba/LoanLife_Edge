"""
Shared service instances - ensures seed data and API use same instances
"""
from app.services.digital_twin_service import DigitalTwinService
from app.services.audit_service import AuditService

# Create singleton instances
twin_service = DigitalTwinService()
audit_service = AuditService()

