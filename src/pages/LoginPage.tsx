// src/pages/LoginPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../shared/api/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await api.post('/login', formData, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        
        navigate('/');
        window.location.reload();
      } else {
        await api.post('/register', { username, password });
        // При успешной регистрации НЕ перекидываем автоматически, а показываем сообщение
        setIsLogin(true); 
        setSuccessMsg('Аккаунт успешно создан! Теперь войдите.');
        setPassword(''); // Очищаем пароль для безопасности
      }
    } catch (err: any) {
      // Если пароль неверный при входе — даем более четкий ответ
      if (isLogin && err.response?.status === 401) {
        setError('Неверное имя пользователя или пароль.');
      } else {
        setError(err.response?.data?.detail || 'Ошибка. Проверьте данные.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gh-bg p-4">
      <div className="bg-gh-surface p-8 rounded-md border border-gh-border w-full max-w-md fade-in shadow-xl">
        <div className="text-center mb-6">
          <i className="fa-solid fa-pills text-4xl text-gh-blue mb-3"></i>
          <h1 className="text-2xl font-bold text-white">Моя Аптечка</h1>
          <p className="text-gh-muted text-sm mt-1">
            {isLogin ? 'Вход в систему' : 'Создание нового аккаунта'}
          </p>
        </div>

        {error && (
          <div className="bg-gh-red/10 border border-gh-red text-gh-red p-3 rounded-md mb-4 text-sm flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation"></i>
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-gh-green/10 border border-gh-green text-gh-green p-3 rounded-md mb-4 text-sm flex items-center gap-2">
            <i className="fa-solid fa-circle-check"></i>
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gh-text mb-1">Имя пользователя</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              className="w-full bg-gh-bg border border-gh-border rounded-md px-3 py-2 text-sm text-gh-text focus:border-gh-blue outline-none" 
              placeholder="Введите имя..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gh-text mb-1">Пароль</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full bg-gh-bg border border-gh-border rounded-md px-3 py-2 text-sm text-gh-text focus:border-gh-blue outline-none" 
              placeholder="Введите пароль..."
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full text-white py-2 rounded-md font-medium transition-colors disabled:opacity-50 ${
              isLogin ? 'bg-gh-green hover:bg-gh-green-hover' : 'bg-gh-blue hover:bg-blue-600'
            }`}
          >
            {isLoading ? 'Загрузка...' : (isLogin ? 'Войти в аккаунт' : 'Зарегистрироваться')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => { 
              setIsLogin(!isLogin); 
              setError(null); 
              setSuccessMsg(null); 
            }} 
            className="text-sm text-gh-blue hover:underline"
          >
            {isLogin ? 'Нет аккаунта? Создать новый' : 'Уже есть аккаунт? Войти'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;