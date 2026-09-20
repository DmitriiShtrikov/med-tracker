// src/pages/EmergencyPage.tsx
import { emergencyKit, mockMedicines } from '../shared/api/mockData';
import { getDaysUntilExpiry } from '../shared/utils/dateUtils';

// Проверяем, есть ли препарат в аптечке (игнорируя просроченные)
const hasMedicineInCabinet = (itemName: string, itemCategory: string) => {
  return mockMedicines.some((m) => {
    const days = getDaysUntilExpiry(m.expiry);
    if (days < 0) return false;

    const mName = m.name.toLowerCase();
    const checkName = itemName.toLowerCase();
    const mCat = m.category.toLowerCase();
    const checkCat = itemCategory.toLowerCase();

    const nameMatch = mName.includes(checkName.split(' ')[0].toLowerCase()) || checkName.includes(mName);
    const categoryMatch = mCat === checkCat && ['антисептик', 'перевязочный материал', 'сорбенты', 'спазмолитик'].includes(checkCat);

    return nameMatch || categoryMatch;
  });
};

const EmergencyPage = () => {
  let totalItems = 0;
  let presentItems = 0;

  // Первый проход для подсчета статистики
  emergencyKit.forEach((group) => {
    group.items.forEach((item) => {
      totalItems++;
      if (hasMedicineInCabinet(item.name, item.category)) {
        presentItems++;
      }
    });
  });

  const percent = totalItems > 0 ? Math.round((presentItems / totalItems) * 100) : 0;

  // Определяем цвет и текст подсказки
  let hintText = '';
  let hintColor = '';
  if (percent === 100) {
    hintText = '🎉 Отлично! Ваша аптечка полностью укомплектована для экстренных случаев.';
    hintColor = 'text-gh-green';
  } else if (percent >= 70) {
    hintText = `⚠️ Аптечка почти укомплектована. Не хватает ${totalItems - presentItems} позиций.`;
    hintColor = 'text-gh-yellow';
  } else if (percent >= 40) {
    hintText = `⚠️ Рекомендуется пополнить аптечку — не хватает ${totalItems - presentItems} позиций.`;
    hintColor = 'text-gh-yellow';
  } else {
    hintText = `❗ Критически мало препаратов. Не хватает ${totalItems - presentItems} позиций из экстренного набора!`;
    hintColor = 'text-gh-red';
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gh-border pb-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <i className="fa-solid fa-kit-medical text-gh-red"></i> Экстренный набор
        </h2>
        <p className="text-gh-muted text-sm mt-2">Минимальный набор препаратов и средств, которые должны быть в каждой домашней аптечке на случай ЧС.</p>
      </div>

      {/* Прогресс-бар */}
      <div className="bg-gh-surface rounded-md border border-gh-border p-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-white">Комплектность аптечки</span>
          <span className="text-sm font-mono text-gh-blue">{presentItems} / {totalItems} ({percent}%)</span>
        </div>
        <div className="w-full bg-gh-bg rounded-full h-3 overflow-hidden border border-gh-border">
          <div 
            className="h-full bg-gradient-to-r from-gh-green to-gh-blue transition-all duration-500" 
            style={{ width: `${percent}%` }}
          ></div>
        </div>
        <p className={`text-xs font-mono mt-2 ${hintColor}`}>{hintText}</p>
      </div>

      {/* Список категорий */}
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
                        {has ? (
                          <i className="fa-solid fa-circle-check text-gh-green"></i>
                        ) : (
                          <i className="fa-solid fa-circle-xmark text-gh-red"></i>
                        )}
                      </span>
                      <div className="min-w-0 flex-grow">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={`text-sm font-medium ${has ? 'text-white' : 'text-gh-text'}`}>{item.name}</p>
                          <span className={`font-mono text-xs ${has ? 'text-gh-green' : 'text-gh-red'}`}>
                            {has ? 'Есть' : 'Отсутствует'}
                          </span>
                        </div>
                        <p className="text-xs text-gh-muted font-mono mt-0.5 truncate">
                          <span className="text-gh-blue">Рекомендуется:</span> {item.recommend} · {item.purpose}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gh-bg border border-gh-border rounded-md p-4 flex items-start gap-3">
        <i className="fa-solid fa-circle-info text-gh-blue mt-0.5"></i>
        <div className="text-xs text-gh-muted font-mono">
          <strong className="text-gh-blue">Совет:</strong> Регулярно проверяйте сроки годности экстренного набора (не реже 2 раз в год). Просроченные препараты нужно утилизировать и заменять новыми. Храните аптечку в недоступном для детей месте.
        </div>
      </div>
    </div>
  );
};

export default EmergencyPage;