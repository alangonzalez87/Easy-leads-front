interface GoogleSheetsConfig {
  spreadsheetId: string;
  range: string;
  apiKey?: string;
}

interface SheetRow {
  nombre: string;
  email: string;
  tel?: string;
  tablero: string;
  estado: string;
  tiempo: string;
  finalizaDia: string;
  vendedor: string;
}

export class GoogleSheetsService {
  private config: GoogleSheetsConfig;

  constructor(config: GoogleSheetsConfig) {
    this.config = config;
  }

  async fetchData(): Promise<SheetRow[]> {
    try {
      // Intentar primero con acceso público (CSV export)
      const publicUrl = `https://docs.google.com/spreadsheets/d/${this.config.spreadsheetId}/export?format=csv&gid=0`;
      
      let response = await fetch(publicUrl);
      
      if (!response.ok) {
        // Si falla el acceso público, intentar con API Key
        if (this.config.apiKey) {
          const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${this.config.spreadsheetId}/values/${this.config.range}?key=${this.config.apiKey}`;
          response = await fetch(apiUrl);
          
          if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
          }
          
          return this.parseApiResponse(await response.json());
        } else {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }
      }

      return this.parseCsvResponse(await response.text());
    } catch (error) {
      console.error('Error fetching Google Sheets data:', error);
      throw error;
    }
  }

  private async parseCsvResponse(csvText: string): Promise<SheetRow[]> {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];

    const headers = this.parseCsvLine(lines[0]);
    const rows = lines.slice(1);

    return rows.map(line => {
      const values = this.parseCsvLine(line);
      const rowData: any = {};
      headers.forEach((header, index) => {
        const normalizedHeader = this.normalizeHeader(header);
        rowData[normalizedHeader] = values[index] || '';
      });
      return rowData as SheetRow;
    });
  }

  private parseCsvLine(line: string): string[] {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  private async parseApiResponse(data: any): Promise<SheetRow[]> {
      
      if (!data.values || data.values.length === 0) {
        return [];
      }

      // Asumimos que la primera fila son los headers
      const headers = data.values[0];
      const rows = data.values.slice(1);

      return rows.map((row: string[]) => {
        const rowData: any = {};
        headers.forEach((header: string, index: number) => {
          const normalizedHeader = this.normalizeHeader(header);
          rowData[normalizedHeader] = row[index] || '';
        });
        return rowData as SheetRow;
      });
  }

  private normalizeHeader(header: string): string {
    const headerMap: Record<string, string> = {
      'Nombre': 'nombre',
      'Email': 'email',
      'Tel (Si aplica)': 'tel',
      'Tablero': 'tablero',
      'estado': 'estado',
      'Tiempo': 'tiempo',
      'Finaliza Dia': 'finalizaDia',
      'vendedor': 'vendedor'
    };
    
    return headerMap[header] || header.toLowerCase();
  }
}

// Configuración para tu Google Sheet
export const createGoogleSheetsService = (apiKey?: string) => {
  return new GoogleSheetsService({
    spreadsheetId: '1D4ToRyWCogs1K4_YY7qdWi89uABzw3RJ4_LTaCDGz1A',
    range: 'Sheet1!A:H', // Ajusta según tu hoja
    apiKey: apiKey
  });
};