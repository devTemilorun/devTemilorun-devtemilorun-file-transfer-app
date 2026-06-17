import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';
import { Sun, Moon, ArrowLeft } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const showBack = location.pathname !== '/';

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
      style={{
        backgroundColor: 'var(--bg-header)',
        borderColor: 'var(--border-light)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg transition-colors"
              style={{
                color: 'var(--text-secondary)',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">📁</span>
            </div>
            <span 
              className="font-semibold hidden sm:inline"
              style={{ color: 'var(--text-primary)' }}
            >
              FileTransfer
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{
              color: 'var(--text-secondary)'
            }}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5" style={{ color: '#fbbf24' }} />
            ) : (
              <Moon className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}