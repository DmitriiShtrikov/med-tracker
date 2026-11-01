// src/pages/AddMedicinePage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../shared/api/api';

const AddMedicinePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    packs: 1,
    blisters_per_pack: 1,
    pills_per_blister: 1,
    expiry: '',
    note: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Обработчик изменения полей
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'packs' || name === 'blisters_per_pack' || name === 'pills_per_blister' ? Number(value) : value,
    }));
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.category || !formData.expiry) {
      setError('Пожалуйста, заполните все обязательные поля.');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post('/medicines/', formData);
      navigate('/cabinet');
    } catch (err) {
      console.error(err);
      setError('Ошибка при сохранении. Проверьте данные.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-gh-surface rounded-md border border-gh-border p-6 fade-in">
      <h2 className="text-xl font-semibold text-white mb-6 border-b border-gh-border pb-4">Добавить лекарство</h2>
      
      {error && (
        <div className="bg-gh-red/10 border border-gh-red text-gh-red p-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gh-text mb-1">Название <span className="text-gh-red">*</span></label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-gh-bg border border-gh-border rounded-md px-3 py-2 text-sm text-gh-text focus:border-gh-blue focus:ring-1 focus:ring-gh-blue outline-none" placeholder="Например: Цитрамон" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gh-text mb-1">Категория <span className="text-gh-red">*</span></label>
          {/* Выпадающий список категорий */}
          <select 
            name="category" 
            value={formData.category} 
            onChange={handleChange} 
            required 
            className="w-full bg-gh-bg border border-gh-border rounded-md px-3 py-2 text-sm text-gh-text focus:border-gh-blue focus:ring-1 focus:ring-gh-blue outline-none cursor-pointer"
          >
            <option value="">— Выберите категорию —</option>
            <option value="Обезболивающее">Обезболивающее</option>
            <option value="Жаропонижающее">Жаропонижающее</option>
            <option value="Противовоспалительное">Противовоспалительное</option>
            <option value="Антибиотик">Антибиотик</option>
            <option value="Противовирусное">Противовирусное</option>
            <option value="Антиаллергическое">Антиаллергическое</option>
            <option value="Отхаркивающее">Отхаркивающее</option>
            <option value="Спазмолитик">Спазмолитик</option>
            <option value="Сорбенты">Сорбенты</option>
            <option value="Антисептик">Антисептик</option>
            <option value="Перевязочный материал">Перевязочный материал</option>
            <option value="Витамины">Витамины</option>
          </select>
        </div>

        <div className="grid grid-cols-3 gap-3 p-3 bg-gh-bg rounded-md border border-gh-border">
          <div>
            <label className="block text-xs font-semibold text-gh-muted mb-1">Упаковок *</label>
            <input type="number" name="packs" min="1" value={formData.packs} onChange={handleChange} required className="w-full bg-gh-surface border border-gh-border rounded-md px-2 py-1.5 text-sm text-gh-text focus:border-gh-blue outline-none font-mono" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gh-muted mb-1">Блистеров *</label>
            <input type="number" name="blisters_per_pack" min="1" value={formData.blisters_per_pack} onChange={handleChange} required className="w-full bg-gh-surface border border-gh-border rounded-md px-2 py-1.5 text-sm text-gh-text focus:border-gh-blue outline-none font-mono" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gh-muted mb-1">Таблеток *</label>
            <input type="number" name="pills_per_blister" min="1" value={formData.pills_per_blister} onChange={handleChange} required className="w-full bg-gh-surface border border-gh-border rounded-md px-2 py-1.5 text-sm text-gh-text focus:border-gh-blue outline-none font-mono" />
          </div>
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
          <button type="button" onClick={() => navigate('/cabinet')} className="px-4 py-1.5 text-sm font-medium text-gh-text bg-gh-subtle hover:bg-[#30363d] border border-gh-border rounded-md transition-colors">
            Отмена
          </button>
          <button type="submit" disabled={isSubmitting} className="px-4 py-1.5 text-sm font-medium text-white bg-gh-green hover:bg-gh-green-hover disabled:opacity-50 border border-[rgba(240,246,252,0.1)] rounded-md transition-colors shadow-sm">
            {isSubmitting ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMedicinePage;