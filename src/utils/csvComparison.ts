export interface CsvContact {
  nombre: string;
  email: string;
}

const normalizeHeader = (value: string) =>
  value
    .replace(/^\uFEFF/, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const parseRows = (content: string, delimiter: string): string[][] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < content.length; index += 1) {
    const character = content[index];
    const nextCharacter = content[index + 1];

    if (character === '"') {
      if (quoted && nextCharacter === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === delimiter && !quoted) {
      row.push(value.trim());
      value = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && nextCharacter === "\n") index += 1;
      row.push(value.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      value = "";
    } else {
      value += character;
    }
  }

  row.push(value.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
};

const detectDelimiter = (headerLine: string) => {
  const commas = (headerLine.match(/,/g) || []).length;
  const semicolons = (headerLine.match(/;/g) || []).length;
  return semicolons > commas ? ";" : ",";
};

const findColumn = (headers: string[], aliases: string[]) =>
  headers.findIndex((header) => aliases.includes(normalizeHeader(header)));

export const parseContactsCsv = (content: string): CsvContact[] => {
  const firstLine = content.split(/\r?\n/, 1)[0] || "";
  const rows = parseRows(content, detectDelimiter(firstLine));
  if (rows.length === 0) return [];

  const headers = rows[0];
  const nameIndex = findColumn(headers, ["nombre", "name", "nombrecompleto", "cliente"]);
  const emailIndex = findColumn(headers, ["email", "correo", "correoelectronico", "mail"]);

  if (nameIndex === -1 && emailIndex === -1) {
    throw new Error('El CSV debe incluir una columna "nombre" o "email".');
  }

  return rows
    .slice(1)
    .map((row) => ({
      nombre: nameIndex >= 0 ? (row[nameIndex] || "").trim() : "",
      email: emailIndex >= 0 ? (row[emailIndex] || "").trim() : "",
    }))
    .filter((contact) => contact.nombre || contact.email);
};

export const normalizeEmail = (value?: string | null) =>
  (value || "").trim().toLowerCase().replace(/\s+/g, "");

export const normalizeName = (value?: string | null) =>
  (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
