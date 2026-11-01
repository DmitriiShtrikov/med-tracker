// src/pages/SymptomsPage.tsx
import { useState, useEffect } from 'react';
import { api } from '../shared/api/api';
import type { Medicine } from '../shared/api/types';
import { getDaysUntilExpiry } from '../shared/utils/dateUtils';

const ailmentMap: Record<string, { title: string; icon: string; categories: string[] }> = {
  'headache':    { title: 'Головная боль',         icon: 'fa-head-side-virus',     categories: ['Обезболивающее', 'Спазмолитик'] },
  'fever':       { title: 'Жар / Температура',     icon: 'fa-temperature-high',    categories: ['Жаропонижающее', 'Противовоспалительное'] },
  'sorethroat':  { title: 'Боль в горле',          icon: 'fa-head-side-cough',     categories: ['Жаропонижающее', 'Противовоспалительное', 'Антибиотик'] },
  'cold':        { title: 'Простуда / Насморк',    icon: 'fa-head-side-cough-slash', categories: ['Противовирусное', 'Жаропонижающее', 'Антиаллергическое', 'Витамины'] },
  'cough':       { title: 'Кашель',                icon: 'fa-lungs',               categories: ['Отхаркивающее', 'Противовоспалительное'] },
  'allergy':     { title: 'Аллергия',              icon: 'fa-allergies',           categories: ['Антиаллергическое'] },
  'poisoning':   { title: 'Отравление / Тошнота',  icon: 'fa-biohazard',           categories: ['Сорбенты'] },
  'stomach':     { title: 'Боль в животе / Спазмы', icon: 'fa-stomach',            categories: ['Спазмолитик', 'Сорбенты', 'Обезболивающее'] },
  'muscle':      { title: 'Мышечная боль / Ушиб',  icon: 'fa-dumbbell',            categories: ['Обезболивающее', 'Противовоспалительное'] },
  'tooth':       { title: 'Зубная боль',           icon: 'fa-tooth',               categories: ['Обезболивающее', 'Противовоспалительное'] },
  'infection':   { title: 'Инфекция / Воспаление', icon: 'fa-bacteria',            categories: ['Антибиотик', 'Противовоспалительное'] },
  'fatigue':     { title: 'Усталость / Авитаминоз', icon: 'fa-battery-quarter',    categories: ['Витамины'] },
  'stress':      { title: 'Стресс / Бессонница',   icon: 'fa-brain',               categories: ['Витамины', 'Антиаллергическое'] }
};

const SymptomsPage = () => {
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setIsLoading(true);
        const response = await api.get<Medicine[]>('/medicines/');
        setMedicines(response.data);
      } catch (err) {
        setError('Не удалось загрузить данные.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  const matchingMedicines = selectedSymptom
    ? medicines.filter((med) => {
        const days = getDaysUntilExpiry(med.expiry);
        if (days < 0) return false; // Не показываем просроченные
        const ailment = ailmentMap[selectedSymptom];
        return ailment.categories.includes(med.category);
      }).sort((a, b) => getDaysUntilExpiry(a.expiry) - getDaysUntilExpiry(b.expiry))
    : [];

  if (isLoading) return <div className="text-center py-10 text-gh-muted">Загрузка...</div>;
  if (error) return <div className="text-center py-10 text-gh-red">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="border-b border-gh-border pb-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <i className="fa-solid fa-stethoscope text-gh-purple"></i> Подбор лекарства
        </h2>
        <p className="text-gh-muted text-sm mt-2">Укажите ваш недуг — приложение подберёт подходящие лекарства из вашей аптечки.</p>
      </div>

      <div className="bg-gh-surface rounded-md border border-gh-border p-6">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-end">
          <div className="flex-grow">
            <label className="block text-sm font-semibold text-gh-text mb-2">
              <i className="fa-solid fa-user-injured text-gh-muted mr-1"></i> Что вас беспокоит?
            </label>
            <select
              value={selectedSymptom}
              onChange={(e) => setSelectedSymptom(e.target.value)}
              className="w-full bg-gh-bg border border-gh-border rounded-md px-3 py-2 text-sm text-gh-text focus:border-gh-purple focus:ring-1 focus:ring-gh-purple outline-none cursor-pointer"
            >
              <option value="">— Выберите недуг —</option>
              {Object.entries(ailmentMap).map(([key, ailment]) => (
                <option key={key} value={key}>{ailment.title}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setSelectedSymptom(selectedSymptom)}
            className="bg-gh-purple hover:opacity-90 text-white px-5 py-2 rounded-md text-sm font-medium transition-all border border-[rgba(240,246,252,0.1)] shadow-sm flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <i className="fa-solid fa-magnifying-glass"></i> Подобрать
          </button>
        </div>
      </div>

      {selectedSymptom && (
        <div className="space-y-4 fade-in">
          <div className="bg-gh-surface rounded-md border border-gh-border p-5 flex items-center gap-4">
            <div className="bg-gh-purple/10 border border-gh-purple/20 text-gh-purple p-3 rounded-md text-2xl">
              <i className={`fa-solid ${ailmentMap[selectedSymptom].icon}`}></i>
            </div>
            <div>
              <h3 className="text-white font-semibold">{ailmentMap[selectedSymptom].title}</h3>
              <p className="text-xs text-gh-muted font-mono mt-1">Подходящие категории: {ailmentMap[selectedSymptom].categories.join(', ')}</p>
            </div>
          </div>

          {matchingMedicines.length === 0 ? (
            <div className="bg-gh-surface rounded-md border border-gh-border p-8 text-center">
              <i className="fa-solid fa-circle-exclamation text-3xl text-gh-red mb-3"></i>
              <p className="text-white font-medium">К сожалению, в аптечке нет подходящих лекарств</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchingMedicines.map((med) => {
                const days = getDaysUntilExpiry(med.expiry);
                const totalPills = med.packs * med.blisters_per_pack * med.pills_per_blister;

                let statusColor = days <= 30 ? 'text-gh-yellow bg-gh-yellow/10 border-gh-yellow/20' : 'text-gh-green bg-gh-green/10 border-gh-green/20';
                let statusText = days <= 30 ? `⚠️ Истекает через ${days} дн.` : `✓ Годен (осталось ${days} дн.)`;

                return (
                  <div key={med.id} className="bg-gh-surface rounded-md border border-gh-border p-5 hover:border-gh-purple transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-white font-semibold text-lg">{med.name}</h4>
                        <p className="text-xs text-gh-muted font-mono mt-0.5">{med.category}</p>
                      </div>
                      <span className={`text-xs font-mono px-2 py-1 rounded border ${statusColor} whitespace-nowrap`}>{statusText}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center mt-4 pt-4 border-t border-gh-border">
                      <div><div className="text-[10px] text-gh-muted uppercase font-mono">Упаковок</div><div className="text-white font-bold text-lg font-mono">{med.packs}</div></div>
                      <div><div className="text-[10px] text-gh-muted uppercase font-mono">Блистеров</div><div className="text-white font-bold text-lg font-mono">{med.blisters_per_pack}</div></div>
                      <div><div className="text-[10px] text-gh-muted uppercase font-mono">Таблеток</div><div className="text-white font-bold text-lg font-mono">{totalPills}</div></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SymptomsPage;