// src/entities/user/ui/UserProfile.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../shared/api/api';

export const UserProfile = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('Загрузка...');

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await api.get('/users/me');
        setUsername(response.data.username);
      } catch (err) {
        console.error('Не удалось загрузить профиль', err);
      }
    };
    fetchMe();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-3 pl-4 border-l border-gh-border ml-2">
      <div className="hidden sm:flex items-center gap-2 text-sm font-mono text-gh-muted">
        <i className="fa-solid fa-user-circle text-gh-blue text-lg"></i>
        {/* ВОТ ЗДЕСЬ ИСПОЛЬЗУЕТСЯ ПЕРЕМЕННАЯ */}
        <span className="max-w-[100px] truncate" title={username}>
          {username}
        </span>
      </div>
      <button 
        onClick={handleLogout}
        className="text-gh-muted hover:text-gh-red transition-colors p-1"
        title="Выйти из аккаунта"
      >
        <i className="fa-solid fa-sign-out-alt text-lg"></i>
      </button>
    </div>
  );
};