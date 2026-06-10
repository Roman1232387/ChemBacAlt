import React, { useRef, useState } from 'react';
import { FileService, type UploadedFile } from '../services/FileService';

import { CustomFileInput } from './ui/CustomFileInput';
import { CustomSelect } from './ui/CustomSelect';

const MAX_SIZE = 10 * 1024 * 1024;
const ACCEPTED = ['.pdf', '.docx', '.png', '.jpg', '.jpeg'];

interface FileUploaderProps {
  files: UploadedFile[];
  onChanged: () => Promise<void>;
}

export function FileUploader({ files, onChanged }: FileUploaderProps) {
  const [category, setCategory] = useState('test_bac');
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = async (file?: File) => {
    if (!file) return;
    setError(null);
    const extension = `.${file.name.split('.').pop()?.toLowerCase() ?? ''}`;
    if (!ACCEPTED.includes(extension)) {
      setError('Sunt acceptate doar PDF, DOCX, PNG, JPG și JPEG.');
      return;
    }
    if (file.size > MAX_SIZE) {
      setError('Fișierul depășește limita de 10MB.');
      return;
    }

    setProgress(0);
    try {
      await FileService.upload(file, category, setProgress);
      await onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Încărcarea a eșuat.');
    } finally {
      setProgress(null);
    }
  };

  const deleteFile = async (id: number) => {
    await FileService.delete(id);
    await onChanged();
  };

  return (
    <div className="card" style={{ marginBottom: 24 }}>
      <div className="grid-form-2" style={{ marginBottom: 14, alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <CustomSelect 
            label="Categorie Fișier"
            value={category} 
            onChange={(val) => setCategory(val)}
            options={[
              { value: 'test_bac', label: 'Teste BAC' },
              { value: 'anexa', label: 'Anexe' },
              { value: 'lectie', label: 'Lecții' },
              { value: 'general', label: 'General' }
            ]}
          />
        </div>
        <CustomFileInput
          accept=".pdf,.docx,.png,.jpg,.jpeg"
          onChange={handleFile}
          label="Încarcă fișier"
        />
      </div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        style={{
          border: `1px dashed ${dragging ? 'var(--teal)' : 'var(--border)'}`,
          background: dragging ? 'var(--teal-dim)' : 'var(--bg-elevated)',
          borderRadius: 'var(--r-md)',
          padding: 18,
          textAlign: 'center',
          color: 'var(--text-secondary)',
        }}
      >
        Trage aici un fișier sau selectează manual. Max 10MB.
      </div>
      {progress !== null && <div className="progress-bar" style={{ marginTop: 12 }}><div className="progress-bar__fill progress-bar__fill--teal" style={{ width: `${progress}%` }} /></div>}
      {error && <div className="alert alert-error" style={{ marginTop: 12 }}>{error}</div>}

      {files.length > 0 && (
        <div className="table-wrap" style={{ marginTop: 18 }}>
          <table>
            <thead>
              <tr>
                <th>Fișier</th>
                <th>Categorie</th>
                <th>Tip</th>
                <th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.id}>
                  <td>{file.originalName}</td>
                  <td>{file.category}</td>
                  <td>{file.fileType}</td>
                  <td>
                    <div className="flex gap-2">
                      <a className="btn btn-secondary btn-sm" href={FileService.getDownloadUrl(file.url)} target="_blank" rel="noreferrer">Descarcă</a>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteFile(file.id)}>Șterge</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
