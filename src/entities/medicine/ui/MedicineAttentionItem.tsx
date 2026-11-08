// src/entities/medicine/ui/MedicineAttentionItem.tsx
import type { Medicine } from '../../../shared/api/types';
import { getDaysUntilExpiry } from '../../../shared/utils/dateUtils';

interface Props {
  med: Medicine;
}

export const MedicineAttentionItem = ({ med }: Props) => {
  const days = getDaysUntilExpiry(med.expiry);

  return (
    <div className="px-5 py-3 flex justify-between items-center hover:bg-gh-subtle transition-colors">
      <div>
        <p className="font-medium text-white text-sm">{med.name}</p>
        {/* Берем категорию из связи, которую мы настроили */}
        <p className="text-xs text-gh-muted font-mono mt-0.5">
          {med.category_rel?.name || 'Без категории'}
        </p>
      </div>
      <span className="text-gh-yellow bg-gh-yellow/10 border border-gh-yellow/20 px-2.5 py-1 rounded-full text-xs font-mono whitespace-nowrap">
        Осталось {days} дн.
      </span>
    </div>
  );
};