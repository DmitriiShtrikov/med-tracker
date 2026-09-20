// src/shared/ui/Layout.tsx
import { Outlet, Link, useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Обзор', icon: '' },
    { path: '/cabinet', label: 'Аптечка', icon: '' },
    { path: '/symptoms', label: 'Подбор', icon: 'fa-stethoscope' },
    { path: '/emergency', label: 'Экстренный набор', icon: 'fa-kit-medical' },
    { path: '/shelters', label: 'Приюты', icon: '' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gh-bg text-gh-text font-sans">
      <header className="bg-gh-surface border-b border-gh-border sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <span className="text-2xl text-gh-blue"><i className="fa-solid fa-pills"></i></span>
            <h1 className="text-lg font-semibold text-white">Моя Аптечка</h1>
          </Link>
          
          <nav className="hidden md:flex gap-1 text-sm font-medium h-full items-end pb-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-1 border-b-2 transition-colors ${
                    isActive
                      ? 'border-gh-blue text-white'
                      : 'border-transparent text-gh-muted hover:text-gh-text hover:border-gh-border'
                  }`}
                >
                  {item.icon && <i className={`fa-solid ${item.icon} mr-1`}></i>}
                  {item.label}
                </Link>
              );
            })}
          </nav>
          
          <Link to="/form" className="bg-gh-green hover:bg-gh-green-hover text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors border border-[rgba(240,246,252,0.1)] shadow-sm flex items-center gap-2">
            <i className="fa-solid fa-plus"></i> <span className="hidden sm:inline">Добавить</span>
          </Link>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Outlet /> {/* Сюда будут вставляться страницы */}
      </main>

      <footer className="bg-gh-surface border-t border-gh-border py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-gh-muted font-mono">
          &copy; 2026 Домашняя аптечка онлайн. Учебный проект.
        </div>
      </footer>
    </div>
  );
};

export default Layout;