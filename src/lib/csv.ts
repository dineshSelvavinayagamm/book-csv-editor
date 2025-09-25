/* eslint-disable @typescript-eslint/no-explicit-any */
import Papa from 'papaparse';

export type RowObj = { [k: string]: any };

export async function parseCSVFile(
  file: File,
  onChunk?: (rows: RowObj[]) => void,
): Promise<{ columns: string[]; rows: RowObj[] }> {
  return new Promise((resolve, reject) => {
    const rowsAccum: RowObj[] = [];
    let columns: string[] = [];
    let nextAutoId = 0;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      chunk: (results) => {
        if (!columns.length) columns = results.meta.fields ?? [];
        const parsed = results.data.map((r: any) => {
          const obj = { ...r };
          if (!('_id' in obj)) obj._id = `row_${nextAutoId++}`;
          return obj;
        });
        rowsAccum.push(...parsed);
        if (onChunk) onChunk(parsed);
      },
      complete: () => {
        if (!columns.includes('_id')) columns = ['_id', ...columns];
        resolve({ columns, rows: rowsAccum });
      },
      error: reject,
    });
  });
}

export function exportToCSV(columns: string[], rows: RowObj[]): Blob {
  const csv = Papa.unparse({
    fields: columns,
    data: rows.map((r) => columns.map((c) => r[c] ?? '')),
  });
  return new Blob([csv], { type: 'text/csv;charset=utf-8;' });
}
