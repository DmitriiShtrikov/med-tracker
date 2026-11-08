// src/pages/DashboardPage.tsx
import { useState, useEffect } from 'react';
import { api } from '../shared/api/api';
import type { Medicine } from '../shared/api/types';
import { getDaysUntilExpiry } from '../shared/utils/dateUtils';
// ЧИСТЫЙ ИМПОРТ ИЗ ENTITIES
import { MedicineAttentionItem } from '../entities/medicine';

const DashboardPage = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setIsLoading(true);
        const response = await api.get<Medicine[]>('/medicines/');
        setMedicines(response.data);
        setError(null);
      } catch (err) {
        setError('Не удалось загрузить данные.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  if (isLoading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gh-blue"></div></div>;
  if (error) return <div className="bg-gh-red/10 border border-gh-red text-gh-red p-4 rounded-md">{error}</div>;

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
    <div className="space-y-6 fade-in">
      <div className="flex justify-between items-center border-b border-gh-border pb-4">
        <h2 className="text-xl font-semibold text-white">Обзор аптечки</h2>
        <span className="text-sm font-mono text-gh-muted bg-gh-surface px-3 py-1 rounded-md border border-gh-border">{todayStr}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gh-surface p-5 rounded-md border border-gh-border flex items-center justify-between">
          <div>
            <p className="text-xs text-gh-muted font-medium uppercase">Всего упаковок</p>
            <p className="text-3xl font-bold text-white mt-1 font-mono">{totalPacks}</p>
          </div>
          <div className="text-2xl bg-gh-bg text-gh-blue p-3 rounded-md border border-gh-border"><i className="fa-solid fa-box"></i></div>
        </div>
        <div className="bg-gh-surface p-5 rounded-md border border-gh-border flex items-center justify-between">
          <div>
            <p className="text-xs text-gh-muted font-medium uppercase">Истекает &lt; 30 дн.</p>
            <p className="text-3xl font-bold text-gh-yellow mt-1 font-mono">{expiringCount}</p>
          </div>
          <div className="text-2xl bg-gh-bg text-gh-yellow p-3 rounded-md border border-gh-border"><i className="fa-solid fa-hourglass-half"></i></div>
        </div>
        <div className="bg-gh-surface p-5 rounded-md border border-gh-border flex items-center justify-between">
          <div>
            <p className="text-xs text-gh-muted font-medium uppercase">Просрочено</p>
            <p className="text-3xl font-bold text-gh-red mt-1 font-mono">{expiredCount}</p>
          </div>
          <div className="text-2xl bg-gh-bg text-gh-red p-3 rounded-md border border-gh-border"><i className="fa-solid fa-triangle-exclamation"></i></div>
        </div>
      </div>

      <div className="bg-gh-surface rounded-md border border-gh-border overflow-hidden">
        <div className="bg-gh-subtle px-5 py-3 border-b border-gh-border flex justify-between items-center">
          <h3 className="text-sm font-semibold text-white">Требует внимания</h3>
        </div>
        <div className="divide-y divide-gh-border">
          {attentionMeds.length === 0 ? (
            <p className="text-gh-muted py-6 text-center text-sm font-mono">Все лекарства в порядке!</p>
          ) : (
            attentionMeds.map((med) => (
              <MedicineAttentionItem key={med.id} med={med} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;