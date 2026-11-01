// src/pages/CabinetPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Добавили для перехода на страницу редактирования
import { api } from '../shared/api/api';
import type { Medicine } from '../shared/api/types';
import { getDaysUntilExpiry, formatDate } from '../shared/utils/dateUtils';

const CabinetPage = () => {
  const navigate = useNavigate(); // Инициализируем navigate
  
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'expiring' | 'expired'>('all');

  // Загрузка данных с сервера
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

  useEffect(() => {
    fetchMedicines();
  }, []);

  // Функция удаления
  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Вы уверены, что хотите удалить "${name}"?`)) {
      return;
    }
    try {
      await api.delete(`/medicines/${id}/`);
      setMedicines((prev) => prev.filter((med) => med.id !== id));
    } catch (err) {
      console.error(err);
      alert('Ошибка при удалении лекарства');
    }
  };

  // Фильтрация
  const filteredMedicines = medicines
    .filter((med) => {
      const matchesSearch =
        med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.category.toLowerCase().includes(searchQuery.toLowerCase());

      const days = getDaysUntilExpiry(med.expiry);
      let matchesFilter = true;
      if (filter === 'expiring') matchesFilter = days >= 0 && days <= 30;
      if (filter === 'expired') matchesFilter = days < 0;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime());

  if (isLoading) return <div className="text-center py-10 text-gh-muted">Загрузка...</div>;
  if (error) return <div className="text-center py-10 text-gh-red">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gh-border pb-4">
        <h2 className="text-xl font-semibold text-white">Все лекарства</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gh-muted"></i>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск..."
              className="w-full bg-gh-bg border border-gh-border rounded-md pl-9 pr-3 py-1.5 text-sm text-gh-text focus:border-gh-blue focus:ring-1 focus:ring-gh-blue outline-none transition-all placeholder-gh-muted font-mono"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-gh-bg border border-gh-border rounded-md px-3 py-1.5 text-sm text-gh-text focus:border-gh-blue focus:ring-1 focus:ring-gh-blue outline-none font-mono cursor-pointer"
          >
            <option value="all">Все</option>
            <option value="expiring">Истекающие</option>
            <option value="expired">Просроченные</option>
          </select>
        </div>
      </div>

      <div className="bg-gh-surface rounded-md border border-gh-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gh-border">
            <thead className="bg-gh-subtle">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gh-muted uppercase tracking-wider">Название</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gh-muted uppercase tracking-wider">Категория</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gh-muted uppercase tracking-wider">Наличие</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gh-muted uppercase tracking-wider">Срок годности</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gh-muted uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gh-border">
              {filteredMedicines.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gh-muted">
                    <i className="fa-solid fa-box-open text-4xl mb-3 opacity-50"></i>
                    <p className="font-mono text-sm">Лекарства не найдены</p>
                  </td>
                </tr>
              ) : (
                filteredMedicines.map((med) => {
                  const days = getDaysUntilExpiry(med.expiry);
                  
                  let rowClass = 'hover:bg-gh-subtle cursor-pointer';
                  let dateClass = 'text-gh-green font-mono';
                  let dateText = formatDate(med.expiry);
                  let expiryBadge = null;

                  if (days < 0) {
                    rowClass = 'bg-gh-red/5 hover:bg-gh-red/10 border-l-2 border-gh-red cursor-pointer';
                    dateClass = 'text-gh-red font-mono font-bold';
                    expiryBadge = <span className="ml-2 text-[10px] bg-gh-red/10 text-gh-red px-1.5 py-0.5 rounded border border-gh-red/20">Просрочено</span>;
                  } else if (days <= 30) {
                    rowClass = 'bg-gh-yellow/10 hover:bg-gh-yellow/20 border-l-2 border-gh-yellow cursor-pointer';
                    dateClass = 'text-gh-yellow font-mono font-bold';
                    expiryBadge = <span className="ml-2 text-[10px] bg-gh-yellow/20 text-gh-yellow px-1.5 py-0.5 rounded border border-gh-yellow/40">Осталось {days} дн.</span>;
                  }

                  return (
                    <tr key={med.id} className={`${rowClass} transition-colors`}>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <div className="font-medium text-white text-sm">{med.name}</div>
                        {med.note && (
                          <div className="text-xs text-gh-muted mt-0.5 font-mono max-w-[200px] truncate">{med.note}</div>
                        )}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-gh-muted text-sm font-mono">{med.category}</td>
                      <td className="px-5 py-3 whitespace-nowrap text-gh-text text-sm font-mono">
                        <div className="text-white font-medium">{med.packs} уп.</div>
                        <div className="text-xs text-gh-muted mt-0.5">{med.blisters_per_pack} бл. × {med.pills_per_blister} таб.</div>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-sm">
                        <span className={dateClass}>{dateText}</span>
                        {expiryBadge}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        {/* Кнопка редактирования: переход на /edit/:id */}
                        <button 
                          onClick={() => navigate(`/edit/${med.id}`)} 
                          className="text-gh-muted hover:text-gh-blue transition-colors p-1" 
                          title="Редактировать"
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        
                        {/* Кнопка удаления */}
                        <button 
                          onClick={() => handleDelete(med.id, med.name)} 
                          className="text-gh-muted hover:text-gh-red transition-colors p-1" 
                          title="Удалить"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CabinetPage;