import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FileDropzone } from '../components/ui/FileDropzone';
import { CSVColumnMapper } from '../components/forms/CSVColumnMapper';
import { ImportPreviewTable } from '../components/ui/ImportPreviewTable';
import { uploadFile, confirmTransactions } from '../api/import.api';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type State = 'IDLE' | 'MAPPING' | 'PREVIEW' | 'CONFIRMING' | 'DONE';
const STEPS = ['Upload', 'Map Columns', 'Preview', 'Done'];
const STATE_IDX: Record<State, number> = { IDLE: 0, MAPPING: 1, PREVIEW: 2, CONFIRMING: 2, DONE: 3 };

export const Import: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [state, setState] = React.useState<State>('IDLE');
  const [importMode, setImportMode] = React.useState<'file' | 'paste'>('file');
  const [pastedText, setPastedText] = React.useState('');
  const [file, setFile] = React.useState<File | null>(null);
  const [headers, setHeaders] = React.useState<string[]>([]);
  const [mapping, setMapping] = React.useState<any>(null);
  const [transactions, setTransactions] = React.useState<any[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const handlePasteSubmit = () => {
    const blob = new Blob([pastedText], { type: 'text/csv' });
    const dummyFile = new File([blob], 'pasted.csv', { type: 'text/csv' });
    setFile(dummyFile);
    uploadMutation.mutate(dummyFile);
  };


  const uploadMutation = useMutation({
    mutationFn: (selectedFile: File) => uploadFile(selectedFile),
    onSuccess: (response) => {
      if (response.data.needsMapping) {
        setHeaders(response.data.headers);
        setState('MAPPING');
      } else {
        setTransactions(response.data.transactions);
        setState('PREVIEW');
      }
    },
    onError: (err: any) => setError(err.response?.data?.error?.message || 'Failed to upload file'),
  });

  const processCSVMutation = useMutation({
    mutationFn: () => uploadFile(file!, mapping),
    onSuccess: (response) => {
      setTransactions(response.data.transactions);
      setState('PREVIEW');
    },
    onError: (err: any) => setError(err.response?.data?.error?.message || 'Failed to process mapping'),
  });

  const confirmMutation = useMutation({
    mutationFn: () => confirmTransactions(transactions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });

      setState('DONE');
      setTimeout(() => navigate('/'), 3000);
    },
    onError: (err: any) => {
      setError(err.response?.data?.error?.message || 'Failed to confirm import');
      setState('PREVIEW');
    },
  });

  const stepIdx = STATE_IDX[state];
  const isLoading = uploadMutation.isPending || processCSVMutation.isPending || confirmMutation.isPending;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }} className="animate-fadeUp">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Import Transactions</h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Upload CSV, OFX, or QIF files from your bank.</p>
      </div>

      { }
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
        {STEPS.map((step, i) => (
          <React.Fragment key={step}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: i < stepIdx ? '#10B981' : i === stepIdx ? 'linear-gradient(135deg, #3B82F6, #6366F1)' : 'rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: i <= stepIdx ? '#fff' : '#64748b', flexShrink: 0
              }}>
                {i < stepIdx ? <CheckCircle2 size={16} /> : i + 1}
              </div>
              <span style={{ fontSize: 12, fontWeight: i === stepIdx ? 500 : 400, color: i <= stepIdx ? '#fff' : '#64748b', whiteSpace: 'nowrap' }}>{step}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, background: i < stepIdx ? '#10B981' : 'rgba(255,255,255,0.1)', margin: '0 10px', minWidth: 20 }} />}
          </React.Fragment>
        ))}
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', padding: '12px 16px', borderRadius: 10, marginBottom: 16, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertCircle size={16} />
          {error}
          <button onClick={() => setError(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>×</button>
        </div>
      )}

      {state === 'IDLE' && (
        <div className="space-y-6">
          <div className="flex p-1 bg-gray-900/50 rounded-xl border border-gray-700/50 w-fit">
            <button onClick={() => setImportMode('file')} className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${importMode === 'file' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'}`}>File Upload</button>
            <button onClick={() => setImportMode('paste')} className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${importMode === 'paste' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'}`}>Paste CSV Data</button>
          </div>

          <div className="wl-card" style={{ padding: 28 }}>
            {importMode === 'file' ? (
              <FileDropzone onFileSelect={(f) => {
                if (f.name.endsWith('.pdf')) {
                  setError("PDFs are often encrypted or password-protected by banks. For better accuracy and privacy, please download the 'CSV' or 'Excel' version of your statement from your bank portal.");
                  return;
                }
                setFile(f);
                uploadMutation.mutate(f);
              }} />
            ) : (
              <div className="space-y-4">
                <textarea
                  placeholder="Date,Description,Amount&#10;2025-01-01,Grocery,-500&#10;2025-01-02,Salary,5000"
                  className="w-full h-48 bg-gray-900/50 border border-gray-700 rounded-xl p-4 text-sm font-mono text-gray-300 focus:border-blue-500 outline-none transition-all"
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                />
                <button
                  disabled={!pastedText.trim() || isLoading}
                  onClick={handlePasteSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : 'Process Pasted Data'}
                </button>
              </div>
            )}
            {isLoading && <div className="mt-4 text-center text-blue-400 animate-pulse">Processing data...</div>}
          </div>

          <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-xl flex gap-4">
            <div className="text-blue-400 shrink-0">
              <AlertCircle size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-blue-300 mb-1">Pro Tip: Why CSV over PDF?</h4>
              <p className="text-xs text-gray-400 leading-relaxed">Bank PDFs are designed for printing, not for data. They are often password-protected and hard to read accurately. CSV files are smaller, more secure, and allow WealthLens to calculate your trends with 100% accuracy.</p>
            </div>
          </div>
        </div>
      )}



      {state === 'MAPPING' && (
        <div className="wl-card" style={{ padding: 28 }}>
          <h3 className="text-white mb-4">Map CSV Columns</h3>
          <CSVColumnMapper headers={headers} onMap={setMapping} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20, gap: 10 }}>
            <button onClick={() => setState('IDLE')} className="px-4 py-2 text-gray-400">Back</button>
            <button
              onClick={() => processCSVMutation.mutate()}
              disabled={!mapping || isLoading}
              className="bg-blue-600 px-6 py-2 rounded-lg text-white"
            >
              {isLoading ? 'Processing...' : 'Generate Preview'}
            </button>
          </div>
        </div>
      )}

      {state === 'PREVIEW' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 className="text-white">Preview Import ({transactions.length} rows)</h3>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setState('IDLE')} className="px-4 py-2 text-gray-400">Cancel</button>
              <button
                onClick={() => confirmMutation.mutate()}
                disabled={isLoading}
                className="bg-green-600 px-6 py-2 rounded-lg text-white font-bold"
              >
                {isLoading ? 'Confirming...' : 'Confirm Import'}
              </button>
            </div>
          </div>
          <div className="wl-card"><ImportPreviewTable transactions={transactions} /></div>
        </div>
      )}

      {state === 'DONE' && (
        <div className="wl-card" style={{ padding: 48, textAlign: 'center' }}>
          <div className="bg-green-500/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <CheckCircle2 size={32} className="text-green-500" />
          </div>
          <h3 className="text-white text-2xl mb-2">Import Complete</h3>
          <p className="text-gray-400 mb-6">Redirecting to dashboard to show your new data...</p>
        </div>
      )}
    </div>
  );
};