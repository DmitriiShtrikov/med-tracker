// src/entities/medicine/ui/MedicineRow.tsx
import type { Medicine } from '../../../shared/api/types';
import { getDaysUntilExpiry, formatDate } from '../../../shared/utils/dateUtils';

interface MedicineRowProps {
  med: Medicine;
  onEdit: (id: number) => void;
  onDelete: (id: number, name: string) => void;
}

export const MedicineRow = ({ med, onEdit, onDelete }: MedicineRowProps) => {
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
    <tr className={`${rowClass} transition-colors`}>
      <td className="px-5 py-3 whitespace-nowrap">
        <div className="font-medium text-white text-sm">{med.name}</div>
        {med.note && (
          <div className="text-xs text-gh-muted mt-0.5 font-mono max-w-[200px] truncate">{med.note}</div>
        )}
      </td>
      {/* ТЕПЕРЬ БЕРЕМ КАТЕГОРИЮ ИЗ ВЛОЖЕННОГО ОБЪЕКТА! */}
      <td className="px-5 py-3 whitespace-nowrap text-gh-muted text-sm font-mono">
        {med.category_rel?.name || 'Без категории'}
      </td>
      <td className="px-5 py-3 whitespace-nowrap text-gh-text text-sm font-mono">
        <div className="text-white font-medium">{med.packs} уп.</div>
        <div className="text-xs text-gh-muted mt-0.5">{med.blisters_per_pack} бл. × {med.pills_per_blister} таб.</div>
      </td>
      <td className="px-5 py-3 whitespace-nowrap text-sm">
        <span className={dateClass}>{dateText}</span>
        {expiryBadge}
      </td>
      <td className="px-5 py-3 whitespace-nowrap text-right text-sm font-medium space-x-2">
        <button onClick={() => onEdit(med.id)} className="text-gh-muted hover:text-gh-blue transition-colors p-1" title="Редактировать">
          <i className="fa-solid fa-pen-to-square"></i>
        </button>
        <button onClick={() => onDelete(med.id, med.name)} className="text-gh-muted hover:text-gh-red transition-colors p-1" title="Удалить">
          <i className="fa-solid fa-trash"></i>
        </button>
      </td>
    </tr>
  );
};