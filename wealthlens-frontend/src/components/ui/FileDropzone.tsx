import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface Props {
  onFileSelect: (file: File) => void;
}

export const FileDropzone: React.FC<Props> = ({ onFileSelect }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => files[0] && onFileSelect(files[0]),
    multiple: false,
    accept: {
      'text/csv': ['.csv'],
      'application/x-ofx': ['.ofx', '.qfx'],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`p-12 border-2 border-dashed rounded-xl cursor-pointer transition-all
        ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-500 bg-gray-800/50'}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4 text-gray-400">
        <Upload size={48} className={isDragActive ? 'text-blue-500' : ''} />
        <p className="text-lg font-medium">
          {isDragActive ? 'Drop the file here' : 'Drag & drop a CSV or OFX file, or click to select'}
        </p>
        <span className="text-sm">Maximum file size: 10MB</span>
      </div>
    </div>
  );
};
