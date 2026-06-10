import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FileUploader } from '../components/FileUploader';
import { FileService, type UploadedFile } from '../services/FileService';
import { useAuth } from '../hooks/useAuth';

const CATEGORY_LABELS: Record<string, string> = {
  test_bac: 'Teste BAC',
  anexa: 'Anexe',
  lectie: 'Lecții',
  general: 'General',
};

export function ResourcesPage() {
  const { isAdmin } = useAuth();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setFiles(await FileService.getAll());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Eroare la încărcarea resurselor.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const grouped = useMemo(() => files.reduce<Record<string, UploadedFile[]>>((acc, file) => {
    const key = file.category || 'general';
    acc[key] = [...(acc[key] ?? []), file];
    return acc;
  }, {}), [files]);

  if (loading) return <div className="state-center"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Teme BAC / Resurse</h2>
          <p className="page-header__sub">{files.length} fișiere disponibile</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {isAdmin && <FileUploader files={files} onChanged={load} />}

      {files.length === 0 ? (
        <div className="state-center">
          <p className="state-label">Nu există resurse încărcate.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([category, items]) => (
          <section key={category} style={{ marginBottom: 28 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 12 }}>{CATEGORY_LABELS[category] ?? category}</h3>
            <div className="grid-auto">
              {items.map((file) => (
                <div key={file.id} className="card card--link">
                  <div className="flex justify-between items-center gap-3">
                    <div>
                      <div className="font-bold" style={{ marginBottom: 6 }}>{file.originalName}</div>
                      <div className="text-sm text-muted">{file.fileType} &middot; {(file.sizeBytes / 1024 / 1024).toFixed(2)} MB</div>
                    </div>
                    <a className="btn btn-primary btn-sm" href={FileService.getDownloadUrl(file.url)} target="_blank" rel="noreferrer">Descarcă</a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
