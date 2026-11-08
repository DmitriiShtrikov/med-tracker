// src/entities/symptom/ui/SymptomSelect.tsx
import type { Symptom } from '../../../shared/api/types';

interface Props {
  symptoms: Symptom[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const SymptomSelect = ({ symptoms, value, onChange }: Props) => (
  <select name="symptom_id" value={value} onChange={onChange} className="w-full bg-gh-bg border border-gh-border rounded-md px-3 py-2 text-sm text-gh-text focus:border-gh-blue outline-none cursor-pointer">
    <option value="">— Не указан —</option>
    {symptoms.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
  </select>
);