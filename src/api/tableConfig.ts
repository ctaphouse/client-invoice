export interface FKRef {
  column: string;
  refTable: string;
  refPk: string;
  refLabel: string;
}

export interface TableConfig {
  tableName: string;
  apiRoute: string;
  pk: string;
  sensitiveFields: string[];
  fks: FKRef[];
  labelColumn: string;
}

export const TABLE_CONFIGS: Record<string, TableConfig> = {
  clients: {
    tableName: "Client",
    apiRoute: "clients",
    pk: "Id",
    labelColumn: "Client",
    sensitiveFields: [],
    fks: [],
  },
  companies: {
    tableName: "Company",
    apiRoute: "companies",
    pk: "Id",
    labelColumn: "Company",
    sensitiveFields: [],
    fks: [],
  },
  departments: {
    tableName: "Department",
    apiRoute: "departments",
    pk: "Id",
    labelColumn: "Department",
    sensitiveFields: [],
    fks: [],
  },
  expenseItems: {
    tableName: "ExpenseItem",
    apiRoute: "expenseItems",
    pk: "Id",
    labelColumn: "Description",
    sensitiveFields: [],
    fks: [
      { column: "ClientID", refTable: "clients",  refPk: "Id", refLabel: "Client" },
      { column: "VendorID", refTable: "vendors",   refPk: "Id", refLabel: "Vendor" },
    ],
  },
  lineItems: {
    tableName: "LineItem",
    apiRoute: "lineItems",
    pk: "Id",
    labelColumn: "Description",
    sensitiveFields: [],
    fks: [
      { column: "ClientID",     refTable: "clients",     refPk: "Id", refLabel: "Client"     },
      { column: "ProjectID",    refTable: "projects",    refPk: "Id", refLabel: "Project"    },
      { column: "DepartmentID", refTable: "departments", refPk: "Id", refLabel: "Department" },
    ],
  },
  projects: {
    tableName: "Project",
    apiRoute: "projects",
    pk: "Id",
    labelColumn: "Project",
    sensitiveFields: [],
    fks: [],
  },
  rates: {
    tableName: "Rate",
    apiRoute: "rates",
    pk: "Id",
    labelColumn: "Rate",
    sensitiveFields: [],
    fks: [
      { column: "ClientID", refTable: "clients", refPk: "Id", refLabel: "Client" },
    ],
  },
  vendors: {
    tableName: "Vendor",
    apiRoute: "vendors",
    pk: "Id",
    labelColumn: "Vendor",
    sensitiveFields: [],
    fks: [],
  },
};

export const TABLE_CONFIG_LIST = Object.values(TABLE_CONFIGS);
