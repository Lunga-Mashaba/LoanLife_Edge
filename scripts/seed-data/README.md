# Seed Data Scripts

## seed_loans.py

Creates sample loan data for demo purposes. This populates the digital twin service with realistic loan data so the frontend has something to display immediately.

### Usage

**Important**: The seed script uses the same in-memory service instances. For it to work, you need to either:

1. **Run seed script in the same process as the API** (modify API startup)
2. **Use a database** (future enhancement)
3. **Import and call from API startup** (recommended for demo)

### Quick Integration

Add this to `services/api/app/main.py`:

```python
# At the top
import sys
from pathlib import Path

# After app creation, before routes
if os.getenv("SEED_DATA", "false").lower() == "true":
    from scripts.seed_data.seed_loans import create_sample_loans
    create_sample_loans()
```

Then run API with:
```bash
SEED_DATA=true uvicorn app.main:app --reload
```

### Manual Usage

For testing, you can run it directly (but data won't persist to API):

```bash
cd scripts/seed-data
python seed_loans.py
```

## Sample Documents

Place sample PDF/DOCX loan documents in `sample_documents/` folder for testing the upload endpoint.

