// src/entities/category/ui/CategorySelect.tsx
import type { Category } from '../../../shared/api/types';

interface Props {
  categories: Category[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const CategorySelect = ({ categories, value, onChange }: Props) => (
  <select name="category_id" value={value} onChange={onChange} required className="w-full bg-gh-bg border border-gh-border rounded-md px-3 py-2 text-sm text-gh-text focus:border-gh-blue outline-none cursor-pointer">
    <option value="">— Выберите категорию —</option>
    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
  </select>
);