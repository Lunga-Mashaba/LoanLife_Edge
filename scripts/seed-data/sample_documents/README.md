# Sample Documents

These are simple text files that can be converted to PDF/DOCX for testing the document upload endpoint.

## Converting to PDF/DOCX

### Option 1: Use Word/Google Docs
1. Open the `.txt` file
2. Save as PDF or DOCX

### Option 2: Use online converter
- Upload `.txt` file to any online converter
- Download as PDF or DOCX

### Option 3: Use Python script (if you have libraries)
```python
# For DOCX
from docx import Document
doc = Document()
with open('sample_loan_1.txt', 'r') as f:
    doc.add_paragraph(f.read())
doc.save('sample_loan_1.docx')
```

## Testing Upload

Once you have PDF/DOCX files:
1. Start the API server
2. Go to http://localhost:8000/docs
3. Use the `/api/v1/loans/upload` endpoint
4. Upload a sample document
5. Verify it creates a loan with extracted covenants and ESG clauses

