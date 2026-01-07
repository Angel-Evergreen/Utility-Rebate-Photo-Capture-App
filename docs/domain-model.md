# Domain Model

## Core Entities

### Job
- jobId
- customerName
- address
- city
- rebateProgram
- services[]
- createdAt
- status

### Service
- serviceId
- label
- rebateProgram
- requiredEvidence[]

### EvidenceRequirement
- code
- label
- required (boolean)

### EvidenceItem
- requirementCode
- photoUri
- capturedAt
- capturedBy
