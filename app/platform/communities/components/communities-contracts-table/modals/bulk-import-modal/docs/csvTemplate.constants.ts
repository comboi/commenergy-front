// Enriched CSV column definitions - single source of truth
export interface CsvColumnDefinition {
  id: string;
  label: string;
  required: boolean;
  type: "string" | "number" | "email" | "phone" | "enum";
  enumValues?: readonly string[];
  description: string;
}

export const CSV_COLUMN_DEFINITIONS: readonly CsvColumnDefinition[] = [
  {
    id: "contractCode",
    label: "Contract Code",
    required: true,
    type: "string",
    description: "Unique identifier for the contract (CUPS/CAU code)",
  },
  {
    id: "contractName",
    label: "Contract Name",
    required: true,
    type: "string",
    description: "Display name for the contract",
  },
  {
    id: "contractType",
    label: "Contract Type",
    required: true,
    type: "enum",
    enumValues: ["CONSUMPTION", "GENERATION"],
    description: "Type of contract: CONSUMPTION or GENERATION",
  },
  {
    id: "contractPower",
    label: "Contract Power",
    required: false,
    type: "number",
    description: "Contract power in kW (optional)",
  },
  {
    id: "userVat",
    label: "User VAT",
    required: true,
    type: "string",
    description: "User VAT/Tax identification number",
  },
  {
    id: "userName",
    label: "User Name",
    required: false,
    type: "string",
    description: "Full name of the contract user",
  },
  {
    id: "userEmail",
    label: "User Email",
    required: false,
    type: "email",
    description: "Email address of the contract user",
  },
  {
    id: "userMobile",
    label: "User Mobile",
    required: false,
    type: "phone",
    description: "Mobile phone number of the contract user",
  },
  {
    id: "provider",
    label: "Provider",
    required: true,
    type: "string",
    description: "Energy provider company name or identifier",
  },
  {
    id: "fullAddress",
    label: "Full Address",
    required: false,
    type: "string",
    description: "Complete address of the contract location",
  },
  {
    id: "communityFee",
    label: "Community Fee",
    required: false,
    type: "number",
    description: "Fee amount charged by the community",
  },
  {
    id: "communityFeePeriodType",
    label: "Community Fee Period Type",
    required: false,
    type: "enum",
    enumValues: ["Monthly", "Quarterly", "Semiannually", "Yearly"],
    description: "Frequency of the community fee charges",
  },
] as const;

// Derived constants from the enriched model
export const CSV_HEADERS = CSV_COLUMN_DEFINITIONS.map(col => col.id);

export const CSV_REQUIRED_HEADERS = CSV_COLUMN_DEFINITIONS.filter(
  col => col.required,
).map(col => col.id);

export const CSV_EXAMPLE_DATA = [
  "ES1234567890123456", // contractCode
  "Contract Example", // contractName
  "CONSUMPTION", // contractType
  "100", // contractPower
  "12345678A", // userVat
  "John Doe", // userName
  "john@example.com", // userEmail
  "+34600123456", // userMobile
  "Iberdrola", // provider
  "123 Main St, Madrid", // fullAddress
  "25.50", // communityFee
  "Monthly", // communityFeePeriodType
] as const;

export const CSV_FIELD_DESCRIPTIONS = CSV_COLUMN_DEFINITIONS.reduce(
  (acc, col) => ({ ...acc, [col.id]: col.description }),
  {} as Record<string, string>,
);

// Utility functions to work with the enriched model
export const getColumnDefinition = (
  columnId: string,
): CsvColumnDefinition | undefined => {
  return CSV_COLUMN_DEFINITIONS.find(col => col.id === columnId);
};

export const isRequiredColumn = (columnId: string): boolean => {
  const col = getColumnDefinition(columnId);
  return col?.required ?? false;
};

export const getColumnType = (
  columnId: string,
): CsvColumnDefinition["type"] | undefined => {
  const col = getColumnDefinition(columnId);
  return col?.type;
};

export const getEnumValues = (
  columnId: string,
): readonly string[] | undefined => {
  const col = getColumnDefinition(columnId);
  return col?.enumValues;
};
