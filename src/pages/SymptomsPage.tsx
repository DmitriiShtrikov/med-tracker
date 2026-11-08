// src/pages/SymptomsPage.tsx
import { useState, useEffect } from 'react';
import { api } from '../shared/api/api';
import type { Medicine, Symptom } from '../shared/api/types';
import { getDaysUntilExpiry } from '../shared/utils/dateUtils';
// ЧИСТЫЕ ИМПОРТЫ ИЗ ENTITIES
import { MedicineCard } from '../entities/medicine';
import { SymptomSelect } from '../entities/symptom';

const SymptomsPage = () => {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [symptomsRes, medicinesRes] = await Promise.all([
          api.get<Symptom[]>('/symptoms/'),
          api.get<Medicine[]>('/medicines/')
        ]);
        setSymptoms(symptomsRes.data);
        setMedicines(medicinesRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const matchingMedicines = selectedSymptom
    ? medicines.filter((med) => {
        const days = getDaysUntilExpiry(med.expiry);
        return med.symptom_id === Number(selectedSymptom) && days >= 0; 
      })
    : [];

  if (isLoading) return <div className="text-center py-10 text-gh-muted">Загрузка...</div>;

  return (
    <div className="space-y-6 fade-in">
      <div className="border-b border-gh-border pb-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <i className="fa-solid fa-stethoscope text-gh-purple"></i> Подбор лекарства
        </h2>
        <p className="text-gh-muted text-sm mt-2">Выберите недуг из базы — мы найдем подходящие лекарства в вашей аптечке.</p>
      </div>

      <div className="bg-gh-surface rounded-md border border-gh-border p-6">
        <label className="block text-sm font-semibold text-gh-text mb-2">
          <i className="fa-solid fa-user-injured text-gh-muted mr-1"></i> Что вас беспокоит?
        </label>
        {/* ИСПОЛЬЗУЕМ СЕЛЕКТ ИЗ ENTITIES */}
        <SymptomSelect 
          symptoms={symptoms} 
          value={selectedSymptom} 
          onChange={(e) => setSelectedSymptom(e.target.value)} 
        />
      </div>

      {selectedSymptom && (
        <div className="space-y-4">
          {matchingMedicines.length === 0 ? (
            <div className="bg-gh-surface rounded-md border border-gh-border p-8 text-center">
              <i className="fa-solid fa-circle-exclamation text-3xl text-gh-red mb-3"></i>
              <p className="text-white font-medium">В аптечке нет подходящих лекарств от этого недуга</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ИСПОЛЬЗУЕМ КАРТОЧКУ ИЗ ENTITIES */}
              {matchingMedicines.map((med) => (
                <MedicineCard key={med.id} med={med} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default SymptomsPage;