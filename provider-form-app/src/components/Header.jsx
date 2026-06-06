import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Shield } from 'lucide-react';

export default function Header({ title, showBack = false, onBack }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  return (
    <header className="bg-cchp-blue text-white shadow-lg sticky top-0 z-50">
      <div className="flex items-center h-16 px-4 max-w-3xl mx-auto gap-3">
        {showBack && (
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/20 active:bg-white/30 transition-colors shrink-0"
            aria-label="Go back"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <div className="flex-1 min-w-0">
          <div className="font-bold text-base leading-tight truncate">
            {title || 'Provider Forms'}
          </div>
        </div>

        {location.pathname === '/' && (
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-1.5 text-xs font-semibold bg-white/15 hover:bg-white/25 px-3 py-2 rounded-lg transition-colors shrink-0"
          >
            <Shield size={14} />
            Admin
          </button>
        )}
      </div>
    </header>
  );
}
