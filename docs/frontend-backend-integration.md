# How Frontend Talks to Backend

We connected everything. The frontend now pulls real data from the backend API instead of using fake mock data.

## How It Works

```
Frontend (React) → API Client (lib/api/) → Backend (FastAPI)
```

Simple HTTP requests, nothing fancy.

## What We Built

**API Client (`lib/api/`):**
- `config.ts` - Where the API URL lives
- `client.ts` - Handles all HTTP requests and errors
- `types.ts` - TypeScript types so we don't mess up
- `loans.ts`, `predictions.ts`, `esg.ts`, `audit.ts` - Functions for each API endpoint

**React Hooks (`hooks/`):**
- `use-loans.ts` - Gets loans and their states
- `use-predictions.ts` - Gets risk predictions
- `use-audit.ts` - Gets audit logs
- `use-esg.ts` - Gets ESG scores

**Components:**
- All components now use these hooks to get real data
- No more mock data!

## Setup

Create `.env.local` in the root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

If you don't set this, it defaults to `localhost:8000` anyway.

## Usage Examples

### Fetching Loans

```typescript
import { useLoans } from '@/hooks/use-loans'

function MyComponent() {
  const { loans, loading, error } = useLoans()
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <div>
      {loans.map(loan => (
        <div key={loan.id}>{loan.borrower_name}</div>
      ))}
    </div>
  )
}
```

### Fetching Loan State

```typescript
import { useLoanState } from '@/hooks/use-loans'

function LoanDetails({ loanId }: { loanId: string }) {
  const { state, loading, error } = useLoanState(loanId)
  
  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      <p>Health Score: {state?.health_score}</p>
    </div>
  )
}
```

### Uploading a Loan Document

```typescript
import { loansApi } from '@/lib/api/loans'

async function handleUpload(file: File) {
  try {
    const result = await loansApi.uploadDocument(file, 'user-id')
    console.log('Loan created:', result.loan)
  } catch (error) {
    console.error('Upload failed:', error)
  }
}
```

## API Endpoints Used

### Loans
- `GET /api/v1/loans` - Get all loans
- `GET /api/v1/loans/{id}` - Get specific loan
- `GET /api/v1/loans/{id}/state` - Get loan state with health metrics
- `POST /api/v1/loans/upload` - Upload loan document

### Predictions
- `GET /api/v1/predictions/{id}?horizons=30,60,90` - Get risk predictions

### ESG
- `GET /api/v1/esg/{id}/score` - Get ESG score
- `GET /api/v1/esg/{id}/compliance` - Get ESG compliance summary

### Audit
- `GET /api/v1/audit` - Get audit logs (with optional filters)

## Error Handling

The API client handles errors gracefully:

- **Network errors**: Displays user-friendly error messages
- **API errors**: Parses error responses from the backend
- **Timeout errors**: Shows timeout message after 30 seconds

Components display loading states and error messages appropriately.

## Real-time Updates

Some components automatically refresh data:

- **Loan Health Grid**: Refetches loan states periodically
- **Audit Log Panel**: Refreshes every 10 seconds
- **Predictions**: Refreshes every 60 seconds

## Testing the Integration

1. **Start the backend API**:
   ```bash
   cd services/api
   .\venv\Scripts\Activate.ps1  # Windows
   $env:SEED_DATA="true"
   uvicorn app.main:app --reload
   ```

2. **Start the frontend**:
   ```bash
   npm install
   npm run dev
   ```

3. **Verify connection**:
   - Open http://localhost:3000
   - Check the browser console for any API errors
   - Verify that loan data is displayed (if SEED_DATA=true)

## If Something Breaks

**Can't connect?**
- Check that backend is running on port 8000
- Check `NEXT_PUBLIC_API_URL` matches your backend URL
- CORS is wide open, so that shouldn't be an issue

**No data showing?**
- Make sure backend is running
- Check browser console for errors
- Check Network tab to see if requests are failing

**TypeScript errors?**
- Make sure `lib/api/types.ts` matches what the backend actually returns
- Check that `@/` alias works in `tsconfig.json`
