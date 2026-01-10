# Frontend-Backend Integration Guide

## Overview

The frontend has been fully integrated with the backend API. All components now fetch real data from the FastAPI backend instead of using mock data.

## Architecture

```
Frontend (Next.js/React)  ←→  API Client  ←→  Backend API (FastAPI)
                              (lib/api/)
```

## Integration Components

### 1. API Client (`lib/api/`)

- **`config.ts`**: API configuration and endpoint definitions
- **`client.ts`**: Centralized HTTP client with error handling
- **`types.ts`**: TypeScript types matching backend models
- **`loans.ts`**: Loan-related API functions
- **`predictions.ts`**: Risk prediction API functions
- **`esg.ts`**: ESG scoring API functions
- **`audit.ts`**: Audit log API functions

### 2. React Hooks (`hooks/`)

- **`use-loans.ts`**: Hook for fetching loans and loan states
- **`use-predictions.ts`**: Hook for fetching risk predictions
- **`use-audit.ts`**: Hook for fetching audit logs
- **`use-esg.ts`**: Hook for fetching ESG scores and compliance

### 3. Updated Components

- **`loan-health-grid.tsx`**: Now fetches real loans and displays health scores
- **`audit-log-panel.tsx`**: Displays real audit logs from the backend
- **`esg-compliance.tsx`**: Shows aggregated ESG scores across all loans

## Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

The API client defaults to `http://localhost:8000` if the environment variable is not set.

### API Base URL

The API base URL is configured in `lib/api/config.ts`:

```typescript
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 30000, // 30 seconds
}
```

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

## Troubleshooting

### API Connection Issues

- **Check API URL**: Ensure `NEXT_PUBLIC_API_URL` matches your backend URL
- **CORS Errors**: Backend CORS is configured to allow all origins (for hackathon)
- **Network Errors**: Ensure the backend API is running on the correct port

### Empty Data

- **Check backend**: Verify backend is running and seeded with data
- **Check console**: Look for API errors in browser console
- **Check network tab**: Inspect API requests in browser DevTools

### Type Errors

- **Type definitions**: Ensure `lib/api/types.ts` matches backend models
- **Import paths**: Verify `@/` alias is configured correctly in `tsconfig.json`

## Next Steps

1. Add authentication/authorization headers to API requests
2. Implement optimistic updates for better UX
3. Add retry logic for failed requests
4. Implement caching for frequently accessed data
5. Add error boundaries for better error handling
