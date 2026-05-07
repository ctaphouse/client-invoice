import { Database } from "bun:sqlite";

const db = new Database("data/output/clientinvoice.sqlite");

const renames = [
  `ALTER TABLE tblClient RENAME TO Client`,
  `ALTER TABLE tblCompany RENAME TO Company`,
  `ALTER TABLE tblDepartment RENAME TO Department`,
  `ALTER TABLE tblExpenseItem RENAME TO ExpenseItem`,
  `ALTER TABLE tblLineItem RENAME TO LineItem`,
  `ALTER TABLE tblProject RENAME TO Project`,
  `ALTER TABLE tblRate RENAME TO Rate`,
  `ALTER TABLE tblVendor RENAME TO Vendor`,

  `ALTER TABLE Client RENAME COLUMN ClientID TO Id`,
  `ALTER TABLE Company RENAME COLUMN CompanyID TO Id`,
  `ALTER TABLE Department RENAME COLUMN DepartmentID TO Id`,
  `ALTER TABLE ExpenseItem RENAME COLUMN ExpenseItemID TO Id`,
  `ALTER TABLE LineItem RENAME COLUMN LineItemID TO Id`,
  `ALTER TABLE Project RENAME COLUMN ProjectID TO Id`,
  `ALTER TABLE Rate RENAME COLUMN RateID TO Id`,
  `ALTER TABLE Vendor RENAME COLUMN VendorID TO Id`,

  `ALTER TABLE Client RENAME COLUMN "Comment" TO "Notes"`,
  `ALTER TABLE Company RENAME COLUMN "Comment" TO "Notes"`,
  `ALTER TABLE Department RENAME COLUMN "Comment" TO "Notes"`,
  `ALTER TABLE ExpenseItem RENAME COLUMN "Comment" TO "Notes"`,
  `ALTER TABLE LineItem RENAME COLUMN "Comment" TO "Notes"`,
  `ALTER TABLE Project RENAME COLUMN "Comment" TO "Notes"`,
  `ALTER TABLE Rate RENAME COLUMN "Comment" TO "Notes"`,
  `ALTER TABLE Vendor RENAME COLUMN "Comment" TO "Notes"`,
];

for (const sql of renames) {
  console.log(sql);
  db.run(sql);
}
db.close();
console.log("\nAll renames applied.");
