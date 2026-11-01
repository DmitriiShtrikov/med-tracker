// src/pages/EmergencyPage.tsx
import { useState, useEffect } from 'react';
import { api } from '../shared/api/api';
import type { Medicine } from '../shared/api/types';
import { emergencyKit } from '../shared/api/mockData'; // Оставляем только статический справочник
import { getDaysUntilExpiry } from '../shared/utils/dateUtils';

const EmergencyPage = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setIsLoading(true);
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

  const hasMedicineInCabinet = (itemName: string, itemCategory: string) => {
    return medicines.some((m) => {
      const days = getDaysUntilExpiry(m.expiry);
      if (days < 0) return false; // Игнорируем просроченные

      const nameMatch = m.name.toLowerCase().includes(itemName.split(' ')[0].toLowerCase()) || itemName.toLowerCase().includes(m.name.toLowerCase());
      const categoryMatch = m.category.toLowerCase() === itemCategory.toLowerCase() && ['антисептик', 'перевязочный материал', 'сорбенты', 'спазмолитик'].includes(itemCategory.toLowerCase());

      return nameMatch || categoryMatch;
    });
  };

  let totalItems = 0;
  let presentItems = 0;

  emergencyKit.forEach((group) => {
    group.items.forEach((item) => {
      totalItems++;
      if (hasMedicineInCabinet(item.name, item.category)) {
        presentItems++;
      }
    });
  });

  const percent = totalItems > 0 ? Math.round((presentItems / totalItems) * 100) : 0;

  let hintText = '';
  let hintColor = '';
  if (percent === 100) { hintText = '🎉 Отлично! Ваша аптечка полностью укомплектована.'; hintColor = 'text-gh-green'; }
  else if (percent >= 40) { hintText = `⚠️ Рекомендуется пополнить аптечку — не хватает ${totalItems - presentItems} позиций.`; hintColor = 'text-gh-yellow'; }
  else { hintText = `❗ Критически мало препаратов. Не хватает ${totalItems - presentItems} позиций!`; hintColor = 'text-gh-red'; }

  if (isLoading) return <div className="text-center py-10 text-gh-muted">Загрузка...</div>;

  return (
    <div className="space-y-6">
      <div className="border-b border-gh-border pb-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <i className="fa-solid fa-kit-medical text-gh-red"></i> Экстренный набор
        </h2>
        <p className="text-gh-muted text-sm mt-2">Минимальный набор препаратов, которые должны быть в каждой аптечке.</p>
      </div>

      <div className="bg-gh-surface rounded-md border border-gh-border p-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-white">Комплектность аптечки</span>
          <span className="text-sm font-mono text-gh-blue">{presentItems} / {totalItems} ({percent}%)</span>
        </div>
        <div className="w-full bg-gh-bg rounded-full h-3 overflow-hidden border border-gh-border">
          <div className="h-full bg-gradient-to-r from-gh-green to-gh-blue transition-all duration-500" style={{ width: `${percent}%` }}></div>
        </div>
        <p className={`text-xs font-mono mt-2 ${hintColor}`}>{hintText}</p>
      </div>

      <div className="space-y-4">
        {emergencyKit.map((group) => (
          <div key={group.group} className="bg-gh-surface rounded-md border border-gh-border overflow-hidden">
            <div className="bg-gh-subtle px-5 py-3 border-b border-gh-border flex items-center gap-2">
              <i className={`fa-solid ${group.icon} text-gh-blue`}></i>
              <h3 className="text-sm font-semibold text-white">{group.group}</h3>
            </div>
            <div className="divide-y divide-gh-border">
              {group.items.map((item) => {
                const has = hasMedicineInCabinet(item.name, item.category);
                return (
                  <div key={item.name} className="px-5 py-3 flex items-center justify-between hover:bg-gh-subtle transition-colors">
                    <div className="flex items-center gap-3 flex-grow min-w-0">
                      <span className="text-lg">
                        {has ? <i className="fa-solid fa-circle-check text-gh-green"></i> : <i className="fa-solid fa-circle-xmark text-gh-red"></i>}
                      </span>
                      <div className="min-w-0 flex-grow">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={`text-sm font-medium ${has ? 'text-white' : 'text-gh-text'}`}>{item.name}</p>
                          <span className={`font-mono text-xs ${has ? 'text-gh-green' : 'text-gh-red'}`}>{has ? 'Есть' : 'Отсутствует'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmergencyPage;