// src/pages/AddMedicinePage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../shared/api/api';
import type { Category, Symptom } from '../shared/api/types';
// ЧИСТЫЕ ИМПОРТЫ ИЗ ENTITIES
import { CategorySelect } from '../entities/category';
import { SymptomSelect } from '../entities/symptom';

const AddMedicinePage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    symptom_id: '',
    packs: 1,
    blisters_per_pack: 1,
    pills_per_blister: 1,
    expiry: '',
    note: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Загружаем справочники для выпадающих списков
    Promise.all([api.get('/categories/'), api.get('/symptoms/')])
      .then(([catRes, symRes]) => {
        setCategories(catRes.data);
        setSymptoms(symRes.data);
      })
      .catch(() => setError('Ошибка загрузки справочников'));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isNumericField = name === 'packs' || name === 'blisters_per_pack' || name === 'pills_per_blister';

    setFormData((prev) => ({
      ...prev,
      // Если поле числовое и пользователь стер всё - оставляем пустую строку
      [name]: isNumericField ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.category_id || !formData.expiry || formData.packs === '' as any) {
      setError('Пожалуйста, заполните все обязательные поля.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      // Отправляем данные. user_id: 1 - временная заглушка до Лабы №4
      await api.post('/medicines/', {
        ...formData,
        category_id: Number(formData.category_id),
        symptom_id: formData.symptom_id ? Number(formData.symptom_id) : null
      });
      navigate('/cabinet');
    } catch (err) {
      setError('Ошибка при сохранении.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-gh-surface rounded-md border border-gh-border p-6 fade-in">
      <h2 className="text-xl font-semibold text-white mb-6 border-b border-gh-border pb-4">Добавить лекарство</h2>
      
      {error && <div className="bg-gh-red/10 border border-gh-red text-gh-red p-3 rounded-md mb-4 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gh-text mb-1">Название <span className="text-gh-red">*</span></label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-gh-bg border border-gh-border rounded-md px-3 py-2 text-sm text-gh-text focus:border-gh-blue outline-none" placeholder="Например: Цитрамон" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gh-text mb-1">Категория <span className="text-gh-red">*</span></label>
          {/* ИСПОЛЬЗУЕМ СЕЛЕКТ ИЗ ENTITIES */}
          <CategorySelect categories={categories} value={formData.category_id} onChange={handleChange} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gh-text mb-1">От какого симптома помогает?</label>
          {/* ИСПОЛЬЗУЕМ СЕЛЕКТ ИЗ ENTITIES */}
          <SymptomSelect symptoms={symptoms} value={formData.symptom_id} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-3 gap-3 p-3 bg-gh-bg rounded-md border border-gh-border">
          <div><label className="block text-xs font-semibold text-gh-muted mb-1">Упаковок *</label><input type="number" name="packs" min="1" value={formData.packs} onChange={handleChange} required className="w-full bg-gh-surface border border-gh-border rounded-md px-2 py-1.5 text-sm text-gh-text focus:border-gh-blue outline-none font-mono" /></div>
          <div><label className="block text-xs font-semibold text-gh-muted mb-1">Блистеров *</label><input type="number" name="blisters_per_pack" min="1" value={formData.blisters_per_pack} onChange={handleChange} required className="w-full bg-gh-surface border border-gh-border rounded-md px-2 py-1.5 text-sm text-gh-text focus:border-gh-blue outline-none font-mono" /></div>
          <div><label className="block text-xs font-semibold text-gh-muted mb-1">Таблеток *</label><input type="number" name="pills_per_blister" min="1" value={formData.pills_per_blister} onChange={handleChange} required className="w-full bg-gh-surface border border-gh-border rounded-md px-2 py-1.5 text-sm text-gh-text focus:border-gh-blue outline-none font-mono" /></div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gh-text mb-1">Срок годности <span className="text-gh-red">*</span></label>
          <input type="date" name="expiry" value={formData.expiry} onChange={handleChange} required className="w-full bg-gh-bg border border-gh-border rounded-md px-3 py-2 text-sm text-gh-text focus:border-gh-blue outline-none font-mono [color-scheme:dark]" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gh-text mb-1">Заметка</label>
          <textarea name="note" value={formData.note} onChange={handleChange} rows={2} className="w-full bg-gh-bg border border-gh-border rounded-md px-3 py-2 text-sm text-gh-text focus:border-gh-blue outline-none" placeholder="Например: Хранить в холодильнике"></textarea>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gh-border">
          <button type="button" onClick={() => navigate('/cabinet')} className="px-4 py-1.5 text-sm font-medium text-gh-text bg-gh-subtle hover:bg-[#30363d] border border-gh-border rounded-md transition-colors">Отмена</button>
          <button type="submit" disabled={isSubmitting} className="px-4 py-1.5 text-sm font-medium text-white bg-gh-green hover:bg-gh-green-hover disabled:opacity-50 border border-[rgba(240,246,252,0.1)] rounded-md transition-colors shadow-sm">
            {isSubmitting ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </form>
    </div>
  );
};
export default AddMedicinePage;