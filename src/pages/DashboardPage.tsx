// src/pages/DashboardPage.tsx
import { mockMedicines } from '../shared/api/mockData';

const DashboardPage = () => {
  // Функция для расчета дней до истечения срока годности
  const getDaysUntilExpiry = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(dateStr);
    expiry.setHours(0, 0, 0, 0);
    return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  // Подсчет статистики
  let totalPacks = 0;
  let expiringCount = 0;
  let expiredCount = 0;

  mockMedicines.forEach((med) => {
    totalPacks += med.packs;
    const days = getDaysUntilExpiry(med.expiry);
    if (days < 0) expiredCount++;
    else if (days <= 30) expiringCount++;
  });

  // Фильтрация лекарств, требующих внимания (истекают в ближайшие 30 дней)
  const attentionMeds = mockMedicines.filter((med) => {
    const days = getDaysUntilExpiry(med.expiry);
    return days >= 0 && days <= 30;
  });

  // Форматирование текущей даты
  const todayStr = new Date().toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex justify-between items-center border-b border-gh-border pb-4">
        <h2 className="text-xl font-semibold text-white">Обзор аптечки</h2>
        <span className="text-sm font-mono text-gh-muted bg-gh-surface px-3 py-1 rounded-md border border-gh-border">
          {todayStr}
        </span>
      </div>

      {/* Карточки статистики */}
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

      {/* Список требующих внимания */}
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