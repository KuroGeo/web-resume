# Product
<!-- impeccable:product-schema 1 -->
## Platform
web
## Users
The resume owner edits bilingual and job-specific resumes locally. Visitors separately read the public portfolio.
## Product Purpose
Maintain a private content source while editing, generating and reviewing PDFs from this repository.
## Operating Context
The owner uses a local browser workbench. Form editing is primary; a source entry remains available. A PDF preview accompanies the editing flow.
## Capabilities and Constraints
Only bind the workbench to localhost. Source and generated PDFs remain in the external private resume checkout. Do not add a public publish action or deploy the workbench through public/. Existing public website appearance and public PDF layout remain unchanged.
## Product Principles
- Show the actual generated PDF, not an approximation.
- Distinguish unsaved edits from the last generated PDF.
- Private variant edits should not alter other variants.
- Preserve existing private content and working-tree edits.
