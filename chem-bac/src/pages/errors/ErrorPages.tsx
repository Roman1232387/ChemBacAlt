import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface ErrorProps {
  code: string; icon: string; title: string; description: string;
  actions: React.ReactNode;
}

function ErrorLayout({ code, icon, title, description, actions }: ErrorProps) {
  return (
    <div style={{ minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{ fontSize: '4rem', marginBottom: 8 }}>{icon}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '5rem', fontWeight: 700, color: 'var(--teal)', opacity: 0.15, lineHeight: 1, marginBottom: -8, letterSpacing: -4 }}>
          {code}
        </div>
        <h1 style={{ fontSize: '1.8rem', marginBottom: 14 }}>{title}</h1>
        <p className="text-muted" style={{ lineHeight: 1.7, marginBottom: 32 }}>{description}</p>
        <div className="flex justify-center gap-4 flex-wrap">{actions}</div>
      </div>
    </div>
  );
}

export function Page401() {
  return (
    <ErrorLayout code="401" icon="🔐" title="Autentificare necesara"
      description="Trebuie sa fii autentificat pentru a accesa aceasta pagina."
      actions={<Link to="/login" className="btn btn-primary btn-lg">Autentifica-te →</Link>}
    />
  );
}

export function Page403() {
  const navigate = useNavigate();
  return (
    <ErrorLayout code="403" icon="🚫" title="Acces interzis"
      description="Nu ai permisiunea de a accesa aceasta resursa. Contacteaza un administrator daca crezi ca este o eroare."
      actions={<>
        <button className="btn btn-secondary btn-lg" onClick={() => navigate(-1)}>← Inapoi</button>
        <Link to="/dashboard" className="btn btn-primary btn-lg">Acasa</Link>
      </>}
    />
  );
}

export function Page404() {
  return (
    <ErrorLayout code="404" icon="⚗" title="Pagina nu a fost gasita"
      description="Aceasta pagina s-a volatilizat precum un gaz nobil. Verifica adresa sau intoarce-te la lectii."
      actions={<>
        <Link to="/lectii"    className="btn btn-secondary btn-lg">◈ Lectii</Link>
        <Link to="/dashboard" className="btn btn-primary btn-lg">Tablou de bord</Link>
      </>}
    />
  );
}

export function Page500() {
  const navigate = useNavigate();
  return (
    <ErrorLayout code="500" icon="⚠" title="Eroare interna de server"
      description="A aparut o eroare neasteptata. Incearca din nou mai tarziu sau reincarca pagina."
      actions={<>
        <button className="btn btn-secondary btn-lg" onClick={() => navigate(0)}>↻ Reincarcare</button>
        <Link to="/dashboard" className="btn btn-primary btn-lg">Acasa</Link>
      </>}
    />
  );
}
