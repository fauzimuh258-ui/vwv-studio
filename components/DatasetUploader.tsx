'use client';

import { useState, useCallback, type ChangeEvent } from 'react';
import type { DatasetValidationResult } from '@/lib/types';

const ACCEPTED_EXTENSIONS = ['.csv', '.json'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

type UploadState = 'idle' | 'uploading' | 'success' | 'error';

export default function DatasetUploader(): JSX.Element {
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<UploadState>('idle');
  const [message, setMessage] = useState<string>('');

  const validateFile = useCallback((candidate: File): string | null => {
    const hasValidExtension = ACCEPTED_EXTENSIONS.some((ext) =>
      candidate.name.toLowerCase().endsWith(ext)
    );
    if (!hasValidExtension) return 'Only .csv or .json files are supported.';
    if (candidate.size === 0) return 'The selected file is empty.';
    if (candidate.size > MAX_FILE_SIZE_BYTES) return 'File exceeds the 10MB limit.';
    return null;
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const selected = event.target.files?.[0];
    if (!selected) {
      setFile(null);
      return;
    }
    const validationError = validateFile(selected);
    if (validationError) {
      setFile(null);
      setState('error');
      setMessage(validationError);
      return;
    }
    setFile(selected);
    setState('idle');
    setMessage('');
  };

  const handleUpload = async (): Promise<void> => {
    if (!file) {
      setState('error');
      setMessage('Please choose a CSV or JSON file first.');
      return;
    }

    setState('uploading');
    setMessage('Processing & validating dataset...');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/dataset', {
        method: 'POST',
        body: formData,
      });

      let payload: DatasetValidationResult;
      try {
        payload = (await response.json()) as DatasetValidationResult;
      } catch {
        setState('error');
        setMessage('Server returned an unexpected response.');
        return;
      }

      if (!response.ok || !payload.success) {
        setState('error');
        setMessage(payload.message || `Upload failed (status ${response.status}).`);
        return;
      }

      setState('success');
      setMessage(`Success: ${payload.message}`);
    } catch (networkError) {
      setState('error');
      setMessage(
        networkError instanceof Error
          ? `Network error: ${networkError.message}`
          : 'Unexpected network error.'
      );
    }
  };

  return (
    <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 text-white max-w-xl">
      <h3 className="text-lg font-semibold mb-2">Dataset Creator & Cleaner</h3>
      <p className="text-sm text-zinc-400 mb-4">
        Upload a CSV or JSON file for training or synthetic data augmentation.
      </p>

      <input
        type="file"
        accept=".csv,.json"
        onChange={handleFileChange}
        disabled={state === 'uploading'}
        className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 mb-4 cursor-pointer disabled:opacity-50"
      />

      <button
        type="button"
        onClick={handleUpload}
        disabled={state === 'uploading' || !file}
        className="w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-medium transition"
      >
        {state === 'uploading' ? 'Uploading...' : 'Upload & Auto-Clean'}
      </button>

      {message && (
        <p
          className={`mt-4 text-sm p-3 rounded border ${
            state === 'error'
              ? 'text-red-300 bg-red-950/40 border-red-900'
              : 'text-zinc-300 bg-zinc-950 border-zinc-800'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
