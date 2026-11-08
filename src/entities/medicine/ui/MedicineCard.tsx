// src/entities/medicine/ui/MedicineCard.tsx
import type { Medicine } from '../../../shared/api/types';
import { getDaysUntilExpiry } from '../../../shared/utils/dateUtils';

export const MedicineCard = ({ med }: { med: Medicine }) => {
  const days = getDaysUntilExpiry(med.expiry);
  const totalPills = med.packs * med.blisters_per_pack * med.pills_per_blister;
  const statusColor = days <= 30 ? 'text-gh-yellow' : 'text-gh-green';

  return (
    <div className="bg-gh-surface rounded-md border border-gh-border p-5">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="text-white font-semibold text-lg">{med.name}</h4>
          <p className="text-xs text-gh-muted font-mono">{med.category_rel?.name || 'Без категории'}</p>
        </div>
        <span className={`text-xs font-mono ${statusColor}`}>
          {days <= 30 ? `⚠️ Истекает через ${days} дн.` : `✓ Годен (${days} дн.)`}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center mt-4 pt-4 border-t border-gh-border">
        <div><div className="text-[10px] text-gh-muted">УПАКОВОК</div><div className="text-white font-bold">{med.packs}</div></div>
        <div><div className="text-[10px] text-gh-muted">БЛИСТЕРОВ</div><div className="text-white font-bold">{med.blisters_per_pack}</div></div>
        <div><div className="text-[10px] text-gh-muted">ТАБЛЕТОК</div><div className="text-white font-bold">{totalPills}</div></div>
      </div>
    </div>
  );
};