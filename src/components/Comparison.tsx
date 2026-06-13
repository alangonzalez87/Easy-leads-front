import React, { useMemo, useState } from "react";
import { FileSearch, Upload, Users } from "lucide-react";
import { Lead } from "../types";
import {
  CsvContact,
  normalizeEmail,
  normalizeName,
  parseContactsCsv,
} from "../utils/csvComparison";

interface ComparisonProps {
  leads: Lead[];
}

const Comparison: React.FC<ComparisonProps> = ({ leads }) => {
  const [selectedBoard, setSelectedBoard] = useState("");
  const [fileName, setFileName] = useState("");
  const [csvContacts, setCsvContacts] = useState<CsvContact[]>([]);
  const [error, setError] = useState("");

  const boards = useMemo(
    () =>
      Array.from(
        new Set(leads.map((lead) => String(lead.tablero || "").trim()).filter(Boolean))
      ).sort((first, second) =>
        first.localeCompare(second, "es", { numeric: true, sensitivity: "base" })
      ),
    [leads]
  );

  const boardLeads = useMemo(
    () => leads.filter((lead) => String(lead.tablero).trim() === selectedBoard),
    [leads, selectedBoard]
  );

  const missingContacts = useMemo(() => {
    if (!selectedBoard || csvContacts.length === 0) return [];

    const knownEmails = new Set(boardLeads.map((lead) => normalizeEmail(lead.email)).filter(Boolean));
    const knownNames = new Set(boardLeads.map((lead) => normalizeName(lead.nombre)).filter(Boolean));
    const seen = new Set<string>();

    return csvContacts.filter((contact) => {
      const email = normalizeEmail(contact.email);
      const name = normalizeName(contact.nombre);
      const exists = (email && knownEmails.has(email)) || (name && knownNames.has(name));
      const identity = email || name;

      if (exists || !identity || seen.has(identity)) return false;
      seen.add(identity);
      return true;
    });
  }, [boardLeads, csvContacts, selectedBoard]);

  const handleFile = async (file?: File) => {
    setError("");
    setCsvContacts([]);
    setFileName("");
    if (!file) return;

    try {
      const contacts = parseContactsCsv(await file.text());
      setCsvContacts(contacts);
      setFileName(file.name);
    } catch (fileError) {
      setError(fileError instanceof Error ? fileError.message : "No se pudo leer el CSV.");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-700 p-6 text-white shadow-lg">
        <h1 className="flex items-center gap-3 text-3xl font-bold">
          <FileSearch className="h-8 w-8" /> Comparación
        </h1>
        <p className="mt-2 text-indigo-100">
          Encuentra contactos del CSV de Canva que no están registrados en Easy Leads.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">Tablero de Easy Leads</label>
          <select
            value={selectedBoard}
            onChange={(event) => setSelectedBoard(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          >
            <option value="">Seleccionar tablero</option>
            {boards.map((board) => (
              <option key={board} value={board}>Tablero {board}</option>
            ))}
          </select>
          {selectedBoard && (
            <p className="mt-2 text-sm text-gray-500">
              {boardLeads.length} leads registrados en este tablero.
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">CSV exportado de Canva</label>
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-indigo-300 px-4 py-3 text-indigo-700 hover:bg-indigo-50">
            <Upload className="h-5 w-5" />
            <span>{fileName || "Seleccionar archivo CSV"}</span>
            <input
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              disabled={!selectedBoard}
              onChange={(event) => handleFile(event.target.files?.[0])}
            />
          </label>
          {!selectedBoard && <p className="mt-2 text-sm text-gray-500">Primero selecciona un tablero.</p>}
        </div>
      </div>

      {error && <p className="rounded-xl bg-rose-100 p-4 text-rose-700">{error}</p>}

      {fileName && !error && (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 p-5">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <Users className="h-5 w-5 text-indigo-600" /> No están en Easy Leads
              </h2>
              <p className="text-sm text-gray-500">
                {csvContacts.length} filas leídas, {missingContacts.length} contactos para revisar en Canva.
              </p>
            </div>
          </div>

          {missingContacts.length === 0 ? (
            <p className="p-8 text-center text-emerald-700">
              Todos los contactos del CSV están registrados en el tablero seleccionado.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-left text-sm text-gray-600">
                  <tr>
                    <th className="px-6 py-3">Nombre</th>
                    <th className="px-6 py-3">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {missingContacts.map((contact, index) => (
                    <tr key={`${normalizeEmail(contact.email) || normalizeName(contact.nombre)}-${index}`}>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {contact.nombre || contact.email || "Sin nombre"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{contact.email || "Sin email"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Comparison;
