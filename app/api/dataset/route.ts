import { NextResponse } from 'next/server';
import type { DatasetValidationResult } from '@/lib/types';

export const runtime = 'nodejs';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

function countCsvRows(text: string): number {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  return Math.max(lines.length - 1, 0); // exclude header row
}

export async function POST(request: Request): Promise<NextResponse<DatasetValidationResult>> {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ success: false, message: 'Expected multipart/form-data with a "file" field.' }, { status: 400 });
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ success: false, message: 'No file was provided.' }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ success: false, message: 'The uploaded file is empty.' }, { status: 400 });
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json({ success: false, message: 'File exceeds the 10MB limit.' }, { status: 400 });
  }

  const isCsv = file.name.toLowerCase().endsWith('.csv');
  const isJson = file.name.toLowerCase().endsWith('.json');
  if (!isCsv && !isJson) {
    return NextResponse.json({ success: false, message: 'Only .csv or .json files are supported.' }, { status: 400 });
  }

  try {
    const text = await file.text();

    if (isJson) {
      let parsed: unknown;
      try {
        parsed = JSON.parse(text);
      } catch {
        return NextResponse.json({ success: false, message: 'File is not valid JSON.' }, { status: 400 });
      }
      const rowCount = Array.isArray(parsed) ? parsed.length : 1;
      return NextResponse.json({ success: true, rowCount, message: `dataset validated (${rowCount} record(s) found).` });
    }

    const rowCount = countCsvRows(text);
    if (rowCount === 0) {
      return NextResponse.json({ success: false, message: 'CSV file has no data rows.' }, { status: 400 });
    }
    const [headerLine] = text.split(/\r?\n/);
    const columns = headerLine ? headerLine.split(',').map((col) => col.trim()) : [];

    return NextResponse.json({
      success: true,
      rowCount,
      columns,
      message: `dataset validated (${rowCount} row(s) across ${columns.length} column(s)).`,
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Unknown error.';
    return NextResponse.json({ success: false, message: `Failed to read file: ${detail}` }, { status: 500 });
  }
}
