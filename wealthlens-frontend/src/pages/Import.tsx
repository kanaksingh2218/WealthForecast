import React from 'react';
import { FileDropzone } from '../components/ui/FileDropzone';
import { CSVColumnMapper } from '../components/forms/CSVColumnMapper';
import { ImportPreviewTable } from '../components/ui/ImportPreviewTable';
import { uploadFile, confirmTransactions } from '../api/import.api';
import { CheckCircle2, Loader2 } from 'lucide-react';

type State = 'IDLE' | 'MAPPING' | 'PREVIEW' | 'CONFIRMING' | 'DONE';

export const Import: React.FC = () => {
  const [state, setState] = React.useState<State>('IDLE');
  const [file, setFile] = React.useState<File | null>(null);
  const [headers, setHeaders] = React.useState<string[]>([]);
  const [mapping, setMapping] = React.useState<any>(null);
  const [transactions, setTransactions] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setLoading(true);
    setError(null);

    try {
      const response = await uploadFile(selectedFile);
      if (response.data.needsMapping) {
        setHeaders(response.data.headers);
        setState('MAPPING');
      } else {
        setTransactions(response.data.transactions);
        setState('PREVIEW');
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  const handleMap = async (newMapping: any) => {
    setMapping(newMapping);
  };

  const handleProcessCSV = async () => {
    if (!file || !mapping) return;
    setLoading(true);
    try {
      const response = await uploadFile(file, mapping);
      setTransactions(response.data.transactions);
      setState('PREVIEW');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to process mapping');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await confirmTransactions(transactions);
      setState('DONE');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to confirm import');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-8">Import Transactions</h2>

      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {state === 'IDLE' && (
        <FileDropzone onFileSelect={handleFileSelect} />
      )}

      {state === 'MAPPING' && (
        <div className="space-y-6">
          <CSVColumnMapper headers={headers} onMap={handleMap} />
          <div className="flex justify-end">
            <button
              onClick={handleProcessCSV}
              disabled={!mapping || loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={20} />}
              Generate Preview
            </button>
          </div>
        </div>
      )}

      {state === 'PREVIEW' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Preview Transactions</h3>
            <div className="flex gap-4">
              <button
                onClick={() => setState('IDLE')}
                className="px-6 py-2 border border-gray-600 hover:bg-gray-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {loading && <Loader2 className="animate-spin" size={20} />}
                Confirm Import
              </button>
            </div>
          </div>
          <ImportPreviewTable transactions={transactions} />
        </div>
      )}

      {state === 'DONE' && (
        <div className="text-center py-12 space-y-4">
          <CheckCircle2 size={64} className="text-green-500 mx-auto" />
          <h3 className="text-2xl font-bold">Import Complete</h3>
          <p className="text-gray-400">Your transactions have been successfully imported and processed.</p>
          <button
            onClick={() => setState('IDLE')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium"
          >
            Import More
          </button>
        </div>
      )}

      {loading && state === 'IDLE' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-xl flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-blue-500" size={48} />
            <p className="text-lg font-medium">Processing your file...</p>
          </div>
        </div>
      )}
    </div>
  );
};
