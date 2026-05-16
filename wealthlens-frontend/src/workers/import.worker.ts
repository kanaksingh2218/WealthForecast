import Papa from 'papaparse';

self.onmessage = (e: MessageEvent) => {
  const { file, mapping } = e.data;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    chunk: (results, parser) => {
      self.postMessage({ type: 'CHUNK', data: results.data });
    },
    complete: (results) => {
      self.postMessage({ type: 'DONE', data: results.data });
    },
    error: (err) => {
      self.postMessage({ type: 'ERROR', error: err.message });
    }
  });
};
