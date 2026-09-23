import Papa from "papaparse";

export interface CSVRow {
  [key: string]: string;
}

export interface FieldMapping {
  amount: string;
  date: string;
  description: string;
  accountId: string;
  categoryId: string;
}

export interface ParsedCSV {
  headers: string[];
  data: CSVRow[];
  errors: string[];
}

export function parseCSV(csvText: string): ParsedCSV {
  let parsedData: CSVRow[] = [];
  let parsedErrors: string[] = [];
  let headers: string[] = [];

  Papa.parse<CSVRow>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
    complete: (result) => {
      parsedData = result.data;
      parsedErrors = result.errors.map(
        (error) => `Row ${error.row}: ${error.message}`
      );

      if (result.meta.fields) {
        headers = result.meta.fields;
      }
    },
    error: (error: Error) => {
      parsedErrors.push(error.message);
    },
  });

  return {
    headers,
    data: parsedData,
    errors: parsedErrors,
  };
}

export function mapRow(
  row: CSVRow,
  mapping: FieldMapping
): {
  amount: number;
  date: string;
  description: string;
  accountId: string;
  categoryId: string;
} | null {
  const amountValue = row[mapping.amount];
  const dateValue = row[mapping.date];
  const descriptionValue = row[mapping.description];

  if (!amountValue || !dateValue || !descriptionValue) {
    return null;
  }

  const amount = Number(
    amountValue.replace(/[$,\s]/g, "").replace(/[()]/g, (match) => {
      return match === "(" ? "-" : "";
    })
  );

  if (!Number.isFinite(amount)) {
    return null;
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return {
    amount,
    date: dateValue,
    description: descriptionValue.trim(),
    accountId: mapping.accountId,
    categoryId: mapping.categoryId,
  };
}
