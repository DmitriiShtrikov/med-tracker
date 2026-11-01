// src/pages/DashboardPage.tsx
import { useState, useEffect } from 'react';
import { api } from '../shared/api/api';
import type { Medicine } from '../shared/api/types';
import { getDaysUntilExpiry } from '../shared/utils/dateUtils';

const DashboardPage = () => {
  // Состояния (State)
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setIsLoading(true);
        // Делаем GET-запрос к нашему API
        const response = await api.get<Medicine[]>('/medicines/');
        setMedicines(response.data);
        setError(null);
      } catch (err) {
        console.error('Ошибка при загрузке:', err);
        setError('Не удалось загрузить данные. Проверьте, запущен ли сервер (FastAPI).');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedicines();
  }, []); // Пустой массив означает, что запрос выполнится 1 раз при загрузке

  // Если идет загрузка — показываем спиннер (анимация из Tailwind)
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gh-blue"></div>
      </div>
    );
  }

  // Если произошла ошибка — показываем сообщение
  if (error) {
    return (
      <div className="bg-gh-red/10 border border-gh-red text-gh-red p-4 rounded-md">
        <p className="font-semibold">Ошибка!</p>
        <p>{error}</p>
      </div>
    );
  }

  // Подсчет статистики (теперь на основе реальных данных из БД)
  let totalPacks = 0;
  let expiringCount = 0;
  let expiredCount = 0;

  medicines.forEach((med) => {
    totalPacks += med.packs;
    const days = getDaysUntilExpiry(med.expiry);
    if (days < 0) expiredCount++;
    else if (days <= 30) expiringCount++;
  });

  const attentionMeds = medicines.filter((med) => {
    const days = getDaysUntilExpiry(med.expiry);
    return days >= 0 && days <= 30;
  });

  const todayStr = new Date().toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6 fade-in"> {/* Класс fade-in добавит анимацию появления */}
      <div className="flex justify-between items-center border-b border-gh-border pb-4">
        <h2 className="text-xl font-semibold text-white">Обзор аптечки</h2>
        <span className="text-sm font-mono text-gh-muted bg-gh-surface px-3 py-1 rounded-md border border-gh-border">
          {todayStr}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gh-surface p-5 rounded-md border border-gh-border flex items-center justify-between hover:border-gh-muted transition-colors">
          <div>
            <p className="text-xs text-gh-muted font-medium uppercase tracking-wider">Всего упаковок</p>
            <p className="text-3xl font-bold text-white mt-1 font-mono">{totalPacks}</p>
          </div>
          <div className="text-2xl bg-gh-bg text-gh-blue p-3 rounded-md border border-gh-border">
            <i className="fa-solid fa-box"></i>
          </div>
        </div>

        <div className="bg-gh-surface p-5 rounded-md border border-gh-border flex items-center justify-between hover:border-gh-muted transition-colors">
          <div>
            <p className="text-xs text-gh-muted font-medium uppercase tracking-wider">Истекает &lt; 30 дн.</p>
            <p className="text-3xl font-bold text-gh-yellow mt-1 font-mono">{expiringCount}</p>
          </div>
          <div className="text-2xl bg-gh-bg text-gh-yellow p-3 rounded-md border border-gh-border">
            <i className="fa-solid fa-hourglass-half"></i>
          </div>
        </div>

        <div className="bg-gh-surface p-5 rounded-md border border-gh-border flex items-center justify-between hover:border-gh-muted transition-colors">
          <div>
            <p className="text-xs text-gh-muted font-medium uppercase tracking-wider">Просрочено</p>
            <p className="text-3xl font-bold text-gh-red mt-1 font-mono">{expiredCount}</p>
          </div>
          <div className="text-2xl bg-gh-bg text-gh-red p-3 rounded-md border border-gh-border">
            <i className="fa-solid fa-triangle-exclamation"></i>
          </div>
        </div>
      </div>

      <div className="bg-gh-surface rounded-md border border-gh-border overflow-hidden">
        <div className="bg-gh-subtle px-5 py-3 border-b border-gh-border flex justify-between items-center">
          <h3 className="text-sm font-semibold text-white">Требует внимания</h3>
          <span className="text-xs text-gh-muted font-mono">Срок годности &lt; 30 дней</span>
        </div>
        <div className="divide-y divide-gh-border">
          {attentionMeds.length === 0 ? (
            <p className="text-gh-muted py-6 text-center text-sm font-mono">Все лекарства в порядке!</p>
          ) : (
            attentionMeds.map((med) => {
              const days = getDaysUntilExpiry(med.expiry);
              return (
                <div key={med.id} className="px-5 py-3 flex justify-between items-center hover:bg-gh-subtle transition-colors">
                  <div>
                    <p className="font-medium text-white text-sm">{med.name}</p>
                    <p className="text-xs text-gh-muted font-mono mt-0.5">{med.category}</p>
                  </div>
                  <span className="text-gh-yellow bg-gh-yellow/10 border border-gh-yellow/20 px-2.5 py-1 rounded-full text-xs font-mono">
                    Осталось {days} дн.
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;