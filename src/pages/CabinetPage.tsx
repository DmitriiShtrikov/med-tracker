// src/pages/CabinetPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../shared/api/api';
import type { Medicine } from '../shared/api/types';
import { getDaysUntilExpiry } from '../shared/utils/dateUtils';
// ЧИСТЫЙ ИМПОРТ ИЗ ENTITIES
import { MedicineRow } from '../entities/medicine';

const CabinetPage = () => {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'expiring' | 'expired'>('all');

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await api.get<Medicine[]>('/medicines/');
        setMedicines(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Удалить "${name}"?`)) return;
    try {
      await api.delete(`/medicines/${id}/`);
      setMedicines((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      alert('Ошибка удаления');
    }
  };

  const filteredMedicines = medicines
    .filter((med) => {
      const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (med.category_rel?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
      const days = getDaysUntilExpiry(med.expiry);
      let matchesFilter = true;
      if (filter === 'expiring') matchesFilter = days >= 0 && days <= 30;
      if (filter === 'expired') matchesFilter = days < 0;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime());

  if (isLoading) return <div className="text-center py-10 text-gh-muted">Загрузка...</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gh-border pb-4">
        <h2 className="text-xl font-semibold text-white">Все лекарства</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск..."
            className="w-full sm:w-64 bg-gh-bg border border-gh-border rounded-md px-3 py-1.5 text-sm text-gh-text focus:border-gh-blue outline-none"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-gh-bg border border-gh-border rounded-md px-3 py-1.5 text-sm text-gh-text focus:border-gh-blue outline-none cursor-pointer"
          >
            <option value="all">Все</option>
            <option value="expiring">Истекающие</option>
            <option value="expired">Просроченные</option>
          </select>
        </div>
      </div>

      <div className="bg-gh-surface rounded-md border border-gh-border overflow-hidden">
        <table className="min-w-full divide-y divide-gh-border">
          <thead className="bg-gh-subtle">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gh-muted uppercase">Название</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gh-muted uppercase">Категория</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gh-muted uppercase">Наличие</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gh-muted uppercase">Срок</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-gh-muted uppercase">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gh-border">
            {filteredMedicines.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gh-muted">Лекарства не найдены</td></tr>
            ) : (
              filteredMedicines.map((med) => (
                <MedicineRow 
                  key={med.id} 
                  med={med} 
                  onEdit={(id) => navigate(`/edit/${id}`)} 
                  onDelete={handleDelete} 
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default CabinetPage;