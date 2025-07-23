# Bulk Imports Module - Implementation Task

## Overview

Create a new `bulkImports` module that handles CSV file imports to batch create contracts and associate them with communities. The module should implement a validation and processing pipeline that checks for existing entities and creates new ones as needed.

## Business Requirements

### Purpose

Enable bulk creation of contracts for a community by importing CSV files containing contract and user data. The system should:

- Validate CSV structure and data integrity
- Check for existing users (by VAT) and contracts (by contractCode)
- Create missing entities (users, contracts) - **Note: Energy providers must already exist**
- Validate energy providers exist in database (by name or code match)
- Establish relationships between communities and contracts
- Provide detailed processing results and error reporting

### CSV Data Structure

The CSV import will contain the following columns:

| Column                   | Type   | Required | Validation                                     | Description                                |
| ------------------------ | ------ | -------- | ---------------------------------------------- | ------------------------------------------ |
| `contractCode`           | string | ✓        | Unique identifier                              | CUPS/CAU code                              |
| `contractName`           | string | ✓        | Non-empty                                      | Display name for contract                  |
| `contractType`           | enum   | ✓        | CONSUMPTION \| GENERATION                      | Contract type                              |
| `contractPower`          | number | ✓        | Positive number                                | Contract power in kW                       |
| `userVat`                | string | ✓        | Valid VAT format                               | User tax identification                    |
| `userName`               | string |          | Non-empty if provided                          | Full name                                  |
| `userEmail`              | email  |          | Valid email format                             | Email address                              |
| `userMobile`             | phone  |          | Valid phone format                             | Mobile number                              |
| `provider`               | string | ✓        | Must match existing provider name or code      | Energy provider company name or identifier |
| `fullAddress`            | string |          | Non-empty if provided                          | Contract location                          |
| `communityFee`           | number |          | Positive number                                | Community fee amount                       |
| `communityFeePeriodType` | enum   |          | Monthly \| Quarterly \| Semiannually \| Yearly | Fee frequency                              |

## Technical Architecture

### Module Structure

```
src/bulkImports/
├── bulkImports.module.ts              // Import other modules and their services
├── application/
│   ├── processBulkImport.service.ts   // Main orchestration service
│   ├── validateCsvData.service.ts     // CSV data validation
│   ├── validateEnergyProvider.service.ts // Provider validation using EnergyProvidersModule
│   ├── createOrFindUser.service.ts    // User processing using UsersModule services
│   ├── createOrFindContract.service.ts // Contract processing using ContractsModule services
│   ├── createCommunityContractRelation.service.ts // Relationship using CommunityContractsModule
│   └── generateImportReport.service.ts // Report generation and persistence
├── domain/
│   ├── BulkImportRequest.ts
│   ├── BulkImportResult.ts
│   ├── CsvRowData.ts
│   ├── ValidationError.ts
│   └── ProcessingReport.ts
└── infrastructure/
    ├── bulkImports.controller.ts
    ├── csvParser.service.ts
    └── repository/
        └── bulkImports.repository.ts  // Only for bulk_imports table operations
```

### Database Schema

A new table `bulk_imports` should be created to track import history and audit trails.

**Note**: Use Drizzle ORM for schema definition with SQLite. Check existing schema examples in the project (like `src/contractUsers/infrastructure/db/contractUsers.schema.ts`) to follow the same patterns and conventions used in the codebase.

**Drizzle Schema** (create in `src/bulkImports/infrastructure/db/bulkImports.schema.ts`):

```typescript
import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

import { communities } from "../../../communities/infrastructure/db/communities.schema";
import { users } from "../../../users/infrastructure/db/users.schema";

export const bulkImports = sqliteTable("bulk_imports", {
  id: text("id").primaryKey().notNull(),
  communityId: text("community_id")
    .notNull()
    .references(() => communities.id, { onDelete: "cascade" }),
  filename: text("filename").notNull(),
  totalRows: integer("total_rows").notNull(),
  successfulRows: integer("successful_rows").notNull(),
  failedRows: integer("failed_rows").notNull(),
  usersCreated: integer("users_created").notNull().default(0),
  usersFound: integer("users_found").notNull().default(0),
  contractsCreated: integer("contracts_created").notNull().default(0),
  contractsFound: integer("contracts_found").notNull().default(0),
  relationshipsCreated: integer("relationships_created").notNull().default(0),
  processingTimeMs: integer("processing_time_ms").notNull(),
  status: text("status", {
    enum: ["completed", "failed", "partial"],
  }).notNull(),
  errorSummary: text("error_summary"),
  detailedResults: text("detailed_results"), // JSON string of RowProcessingResult[]
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  createdBy: text("created_by").references(() => users.id), // Optional: track who performed the import
});

export const bulkImportsRelations = relations(bulkImports, ({ one }) => ({
  community: one(communities, {
    fields: [bulkImports.communityId],
    references: [communities.id],
  }),
  user: one(users, {
    fields: [bulkImports.createdBy],
    references: [users.id],
  }),
}));
```

**Migration File** (generated using Drizzle Kit):

```sql
CREATE TABLE `bulk_imports` (
  `id` text PRIMARY KEY NOT NULL,
  `community_id` text NOT NULL,
  `filename` text NOT NULL,
  `total_rows` integer NOT NULL,
  `successful_rows` integer NOT NULL,
  `failed_rows` integer NOT NULL,
  `users_created` integer DEFAULT 0 NOT NULL,
  `users_found` integer DEFAULT 0 NOT NULL,
  `contracts_created` integer DEFAULT 0 NOT NULL,
  `contracts_found` integer DEFAULT 0 NOT NULL,
  `relationships_created` integer DEFAULT 0 NOT NULL,
  `processing_time_ms` integer NOT NULL,
  `status` text NOT NULL,
  `error_summary` text,
  `detailed_results` text,
  `created_at` text DEFAULT (current_timestamp) NOT NULL,
  `created_by` text,
  FOREIGN KEY (`community_id`) REFERENCES `communities`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
```

### Dependencies

The module will need to import and use **existing services** from other modules (following dependency injection patterns):

- `UsersModule` - for user lookup and creation
  - `GetUserByVatService` - to find existing users
  - `CreatePendingUserService` - to create new users with PENDING_TO_CLAIM status
  - `RegisterUserService` - if needed for user creation
- `ContractsModule` - for contract lookup and creation
  - `GetContractsByIdService` or similar - to find existing contracts by contractCode
  - `CreateContractService` - to create new contracts
- `CommunityContractsModule` - for creating community-contract relationships
  - `CreateCommunityContractService` - to establish community-contract relationships
  - `UpdateCommunityContractService` - to update existing relationships (fees, etc.)
  - `GetCommunityContractsByContractIdService` - to check existing relationships
- `EnergyProvidersModule` - for provider validation and lookup (by name or code)
  - `GetEnergyProviders` or similar service - to validate provider existence
- `CommunitiesModule` - for community validation
  - Service to validate community existence

**Note**: Use existing services rather than creating new database access logic. This ensures consistency with business rules and validation already implemented in each module.

## Processing Pipeline

### 1. File Upload & Validation

- **Input**: CSV file + communityId
- **Validation**:
  - File format validation (CSV)
  - File size limits
  - Community existence check
  - CSV structure validation (required columns)
- **Output**: Parsed CSV data array

### 2. Data Validation Service

For each CSV row:

- **Field Validation**:
  - Required fields presence
  - Data type validation
  - Format validation (email, phone, VAT)
  - Enum value validation
- **Business Logic Validation**:
  - Energy provider existence (must match existing provider by name or code)
  - VAT format compliance
  - Contract code uniqueness within the batch
- **Provider Validation**:
  - Search for energy provider by exact name match (case-insensitive)
  - If not found, search by exact code match (case-insensitive)
  - If provider not found: add validation error (contract creation will fail)
- **Output**: Array of validated rows + validation errors

### 3. Entity Processing Pipeline

#### 3.1 Energy Provider Validation (`validateEnergyProvider.service.ts`)

```typescript
async validateProvider(providerNameOrCode: string): Promise<{
  provider: EnergyProvider;
  matchedBy: 'name' | 'code';
}>
```

- **Logic**:
  1. Use `GetEnergyProviders` service (or similar) from `EnergyProvidersModule`
  2. Search for energy provider by exact name match (case-insensitive)
  3. If not found, search by exact code match (case-insensitive)
  4. If still not found: throw validation error
  5. Return found provider and match type

#### 3.2 User Processing (`createOrFindUser.service.ts`)

```typescript
async processUser(userVat: string, userData: Partial<UserData>): Promise<{
  user: User;
  isNew: boolean;
  actions: string[];
}>
```

- **Logic**:
  1. Use `GetUserByVatService` from `UsersModule` to search existing user by VAT
  2. If found: return existing user
  3. If not found: use `CreatePendingUserService` to create new user with status `PENDING_TO_CLAIM`
  4. Update existing user data if new information is provided (name, email, mobile) using appropriate update service

#### 3.3 Contract Processing (`createOrFindContract.service.ts`)

```typescript
async processContract(contractCode: string, contractData: ContractData, userId: string): Promise<{
  contract: Contract;
  isNew: boolean;
  actions: string[];
}>
```

- **Logic**:
  1. Use existing contract lookup service to search by contractCode
  2. If found: validate compatibility (same user, type, etc.)
  3. If not found:
     - First validate energy provider exists using `validateEnergyProvider.service.ts`
     - If provider not found: throw validation error (contract cannot be created)
     - If provider found: use `CreateContractService` from `ContractsModule` to create new contract

#### 3.4 Community Relationship (`createCommunityContractRelation.service.ts`)

```typescript
async createCommunityRelation(communityId: string, contractId: string, relationData: CommunityRelationData): Promise<{
  communityContract: CommunityContract;
  isNew: boolean;
  actions: string[];
}>
```

- **Logic**:
  1. Use `GetCommunityContractsByContractIdService` to check if relationship already exists
  2. If exists: use `UpdateCommunityContractService` to update community fee data if different
  3. If not exists: use `CreateCommunityContractService` from `CommunityContractsModule` to create new relationship

### 4. Report Generation (`generateImportReport.service.ts`)

Generate comprehensive report including:

- **Summary Statistics**:
  - Total rows processed
  - Success/failure counts
  - New entities created vs existing found
- **Detailed Results**:
  - Per-row processing status
  - Actions taken for each entity
  - Error details with row references
- **Entity Breakdown**:
  - Users: created/found/updated
  - Contracts: created/found
  - Community relationships: created/updated
- **Database Persistence**:
  - Save import history record to `bulk_imports` table
  - Store summary statistics and detailed results
  - Enable audit trail and history tracking

## API Endpoints

### POST `/bulk-imports/process`

```typescript
@Post('process')
@UseInterceptors(FileInterceptor('file'))
async processBulkImport(
  @UploadedFile() file: Express.Multer.File,
  @Body('communityId') communityId: string,
  @Body('options') options?: ImportOptions
): Promise<BulkImportResult>
```

**Request**:

- `file`: CSV file (multipart/form-data)
- `communityId`: Target community UUID
- `options`: Optional processing options (dry-run, validation-only, etc.)

**Response**:

```typescript
interface BulkImportResult {
  success: boolean;
  summary: {
    totalRows: number;
    successfulRows: number;
    failedRows: number;
    usersCreated: number;
    usersFound: number;
    contractsCreated: number;
    contractsFound: number;
    relationshipsCreated: number;
  };
  details: RowProcessingResult[];
  errors: ValidationError[];
  processingTimeMs: number;
}
```

### GET `/bulk-imports/template`

```typescript
@Get('template')
async downloadTemplate(): Promise<StreamableFile>
```

- Returns CSV template with headers and example data

### GET `/bulk-imports/history/:communityId`

```typescript
@Get('history/:communityId')
async getImportHistory(
  @Param('communityId') communityId: string
): Promise<ImportHistoryEntry[]>
```

- Returns history of bulk imports for a specific community

### Domain Models

### BulkImportHistory

```typescript
export interface BulkImportHistory {
  id: string;
  communityId: string;
  filename: string;
  totalRows: number;
  successfulRows: number;
  failedRows: number;
  usersCreated: number;
  usersFound: number;
  contractsCreated: number;
  contractsFound: number;
  relationshipsCreated: number;
  processingTimeMs: number;
  status: "completed" | "failed" | "partial";
  errorSummary?: string;
  detailedResults: RowProcessingResult[];
  createdAt: string;
  createdBy?: string;
}

export interface ImportHistoryEntry {
  id: string;
  filename: string;
  totalRows: number;
  successfulRows: number;
  failedRows: number;
  status: "completed" | "failed" | "partial";
  createdAt: string;
  processingTimeMs: number;
}
```

## Domain Models

### BulkImportRequest

```typescript
export interface BulkImportRequest {
  communityId: string;
  file: Express.Multer.File;
  options: ImportOptions;
}

export interface ImportOptions {
  dryRun?: boolean;
  validateOnly?: boolean;
  skipDuplicates?: boolean;
  updateExistingUsers?: boolean;
}
```

### CsvRowData

```typescript
export interface CsvRowData {
  rowNumber: number;
  contractCode: string;
  contractName: string;
  contractType: ContractType;
  contractPower: number;
  userVat: string;
  userName?: string;
  userEmail?: string;
  userMobile?: string;
  provider: string;
  fullAddress?: string;
  communityFee?: number;
  communityFeePeriodType?: ContractCommunityFeePeriodType;
}
```

### ValidationError

```typescript
export interface ValidationError {
  rowNumber: number;
  field: string;
  value: any;
  message: string;
  severity: "error" | "warning";
}
```

### ProcessingReport

```typescript
export interface RowProcessingResult {
  rowNumber: number;
  status: "success" | "failed" | "warning";
  contractCode: string;
  userVat: string;
  actions: {
    user: "created" | "found" | "updated" | "failed";
    contract: "created" | "found" | "failed";
    relationship: "created" | "updated" | "failed";
  };
  errors: string[];
  warnings: string[];
}
```

## Error Handling Strategy

### Validation Errors

- **Field-level errors**: Invalid format, missing required fields
- **Business logic errors**: Non-existent providers (provider name/code not found in database), invalid enum values
- **Cross-row errors**: Duplicate contract codes within the same batch

### Processing Errors

- **Database errors**: Connection issues, constraint violations
- **Service errors**: Failed user creation, energy provider not found
- **Relationship errors**: Community-contract association failures

### Error Response Strategy

- **Fail-fast for file-level errors**: Invalid CSV format, missing community
- **Row-level error collection**: Continue processing, collect all errors
- **Partial success support**: Process successful rows, report failed ones
- **Rollback options**: Configurable transaction rollback on any failure

## Transaction Management

### Approach

- **Row-level transactions**: Each row processed in its own transaction
- **Batch summary transaction**: Final statistics update
- **Rollback options**:
  - `all-or-nothing`: Rollback entire import on any failure
  - `partial-success`: Keep successful rows, rollback only failed ones

### Database Considerations

- Use database transactions for data consistency
- Implement proper error handling for constraint violations
- Consider batch processing for large files (chunking)

## Performance Considerations

### Optimization Strategies

- **Batch database queries**: Lookup multiple users/contracts at once
- **Streaming CSV processing**: For large files
- **Async processing**: Background job for large imports
- **Caching**: Energy providers, community data

### Monitoring

- Processing time metrics
- Memory usage for large files
- Database query performance
- Error rate tracking

## Security Considerations

### File Upload Security

- File type validation (CSV only)
- File size limits
- Virus scanning integration
- Temporary file cleanup

### Data Validation

- SQL injection prevention
- XSS prevention in error messages
- Input sanitization
- VAT number format validation

### Authorization

- Community access validation
- User permissions for bulk import
- Audit logging for import activities

## Implementation Phases

### Phase 1: Core Infrastructure

1. Create module structure
2. **Check existing schema examples** in the project (like `contractUsers.schema.ts`) to understand Drizzle ORM with SQLite patterns
3. Create Drizzle schema definition for `bulk_imports` table in `src/bulkImports/infrastructure/db/bulkImports.schema.ts`
4. Generate and run database migration using Drizzle Kit (`npx drizzle-kit generate` and `npm run db:push`)
5. Implement CSV parsing service
6. Create basic domain models
7. Set up API endpoints

### Phase 2: Processing Pipeline

1. Implement validation services
2. Create entity processing services
3. Add transaction management
4. Implement error handling

## Conclusion

This bulk imports module will provide a robust, scalable solution for batch importing contract data while maintaining data integrity and providing comprehensive error reporting. The modular design allows for future enhancements and ensures maintainability within the existing NestJS architecture.
