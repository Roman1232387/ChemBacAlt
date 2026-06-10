import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserDropdown } from './UserDropdown';
import { LessonService } from '../../services/LessonService';
import { TestService } from '../../services/TestService';
import type { Lesson } from '../../models/Lesson';
import type { Test } from '../../models/Test';

const ChemLogo = () => (
  <svg width="32" height="32" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="19" cy="19" rx="17" ry="7" stroke="#00d4aa" strokeWidth="1.8" opacity="0.9"/>
    <ellipse cx="19" cy="19" rx="17" ry="7" stroke="#00d4aa" strokeWidth="1.8" opacity="0.9" transform="rotate(60 19 19)"/>
    <ellipse cx="19" cy="19" rx="17" ry="7" stroke="#00d4aa" strokeWidth="1.8" opacity="0.9" transform="rotate(120 19 19)"/>
    <circle cx="19" cy="19" r="3.5" fill="#00d4aa"/>
    <circle cx="19" cy="2" r="2" fill="white" opacity="0.95"/>
    <circle cx="32.7" cy="10.5" r="2" fill="white" opacity="0.95"/>
    <circle cx="5.3" cy="10.5" r="2" fill="white" opacity="0.95"/>
  </svg>
);


export function Header() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ lessons: Lesson[], tests: Test[] }>({ lessons: [], tests: [] });
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowSearchDropdown(false);
        setSearchQuery('');
        setSearchResults({ lessons: [], tests: [] });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults({ lessons: [], tests: [] });
      return;
    }

    const performSearch = async () => {
      try {
        const [allLessons, allTests] = await Promise.all([
          LessonService.getAll(),
          TestService.getAll()
        ]);

        const filteredLessons = allLessons.filter(l => 
          l.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          l.description.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 3);

        const filteredTests = allTests.filter(t => 
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          t.description.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 3);

        setSearchResults({ lessons: filteredLessons, tests: filteredTests });
      } catch (err) {
        console.error('Search error:', err);
      }
    };

    const timer = setTimeout(performSearch, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleHelpClick = () => {
    navigate('/resurse');
  };

  return (
    <header className="topbar">
      <div className="topbar__left">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ChemLogo />
            <div className="topbar__logo-text">
              <span style={{ color: 'var(--text-primary)' }}>Chem</span>
              <span style={{ color: 'var(--teal)' }}>BAC</span>
            </div>
          </div>
        </Link>
      </div>

      <div className="topbar__center">
        <div className="topbar__search" ref={searchRef}>
          <input 
            type="text" 
            autoComplete="off"
            className="topbar__search-input" 
            placeholder="Caută în lecții, teste sau teme..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
          />
          {showSearchDropdown && searchQuery.length >= 2 && (
            <div className="search-dropdown shadow-2xl">
              {searchResults.lessons.length === 0 && searchResults.tests.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Nu am găsit rezultate pentru <strong style={{ color: 'var(--text-primary)' }}>"{searchQuery}"</strong>
                </div>
              ) : (
                <div className="search-results-scroll">
                  {searchResults.lessons.length > 0 && (
                    <div className="search-group">
                      <div className="search-group-title">Lecții Dispunibile</div>
                      {searchResults.lessons.map(lesson => (
                        <Link 
                          key={lesson.id} 
                          to={`/lectii/${lesson.id}`} 
                          className="search-result-item"
                          onClick={() => { setShowSearchDropdown(false); setSearchQuery(''); }}
                        >
                          <div className="search-result-icon bg-blue">📚</div>
                          <div className="search-result-info">
                            <div className="title">{lesson.title}</div>
                            <div className="subtitle">{lesson.category}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                  {searchResults.tests.length > 0 && (
                    <div className="search-group">
                      <div className="search-group-title">Teste de Antrenament</div>
                      {searchResults.tests.map(test => (
                        <Link 
                          key={test.id} 
                          to={`/teste/${test.id}`} 
                          className="search-result-item"
                          onClick={() => { setShowSearchDropdown(false); setSearchQuery(''); }}
                        >
                          <div className="search-result-icon bg-amber">📝</div>
                          <div className="search-result-info">
                            <div className="title">{test.title}</div>
                            <div className="subtitle">{test.duration} minute • {test.questions?.length || 0} întrebări</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div className="search-dropdown-footer">
                Apasă <kbd>ESC</kbd> pentru a închide
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="topbar__right">
        <button 
          className="topbar__icon-btn" 
          title="Notificări"
          onClick={() => alert('Momentan nu ai notificări noi.')}
        >
          🔔
        </button>
        <div style={{ width: 1, height: 24, background: 'var(--border)', margin: '0 4px' }} />
        <UserDropdown />
      </div>
      <style>{`
        .search-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          left: 0;
          right: 0;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          z-index: 10000;
          overflow: hidden;
          animation: slide-down-search 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 20px 50px rgba(0,0,0,0.6), 0 0 0 1px var(--border);
        }
        .search-results-scroll {
          max-height: 450px;
          overflow-y: auto;
          padding: 8px;
        }
        .search-group-title {
          padding: 12px 12px 6px;
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--teal);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .search-result-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          text-decoration: none;
          color: var(--text-primary);
          border-radius: var(--r-md);
          transition: all 0.2s;
        }
        .search-result-item:hover {
          background: var(--bg-elevated);
          transform: translateX(4px);
        }
        .search-result-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          flex-shrink: 0;
        }
        .search-result-icon.bg-blue { background: rgba(59, 130, 246, 0.15); color: #60a5fa; }
        .search-result-icon.bg-amber { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
        
        .search-result-info { display: flex; flex-direction: column; overflow: hidden; }
        .search-result-info .title { font-weight: 600; font-size: 0.85rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .search-result-info .subtitle { font-size: 0.7rem; color: var(--text-muted); }
        
        .search-dropdown-footer {
          padding: 8px 16px;
          background: var(--bg-elevated);
          border-top: 1px solid var(--border);
          font-size: 0.65rem;
          color: var(--text-muted);
          text-align: right;
        }
        kbd {
          background: var(--bg-card);
          border: 1px solid var(--border);
          padding: 2px 4px;
          border-radius: 4px;
          font-family: monospace;
        }
        @keyframes slide-down-search {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
}

export function PublicHeader() {
  return (
    <header style={{
      padding: '20px 40px', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', opacity: 1 }}>
        <svg width="32" height="32" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="19" cy="19" rx="17" ry="7" stroke="#00d4aa" strokeWidth="1.8" opacity="0.9"/>
          <ellipse cx="19" cy="19" rx="17" ry="7" stroke="#00d4aa" strokeWidth="1.8" opacity="0.9" transform="rotate(60 19 19)"/>
          <ellipse cx="19" cy="19" rx="17" ry="7" stroke="#00d4aa" strokeWidth="1.8" opacity="0.9" transform="rotate(120 19 19)"/>
          <circle cx="19" cy="19" r="3.5" fill="#00d4aa"/>
          <circle cx="19" cy="2" r="2" fill="white" opacity="0.95"/>
          <circle cx="32.7" cy="10.5" r="2" fill="white" opacity="0.95"/>
          <circle cx="5.3" cy="10.5" r="2" fill="white" opacity="0.95"/>
        </svg>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)' }}>
          ChemBAC
        </span>
      </Link>
      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
        Bacalaureat 2026
      </span>
    </header>
  );
}
