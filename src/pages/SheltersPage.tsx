// src/pages/SheltersPage.tsx
import { useState } from 'react';

type ModalType = 'none' | 'rab_dom' | 'vyberi';

const SheltersPage = () => {
  const [activeModal, setActiveModal] = useState<ModalType>('none');

  const closeModal = () => setActiveModal('none');

  return (
    <div className="space-y-6">
      <div className="bg-gh-surface border border-gh-border rounded-md p-6">
        <h2 className="text-xl font-semibold text-white mb-2">Передача нуждающимся</h2>
        <p className="text-gh-muted text-sm">Вы можете передать лекарства с не истекшим сроком годности в центры социальной адаптации и благотворительные фонды для бездомных людей.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Рабочий Дом */}
        <div className="bg-gh-surface p-5 rounded-md border border-gh-border flex flex-col justify-between hover:border-gh-blue transition-colors">
          <div>
            <h3 className="text-md font-semibold text-white flex items-center gap-2">
              <i className="fa-solid fa-house-chimney-user text-gh-blue"></i> Рабочий Дом
            </h3>
            <p className="text-xs text-gh-muted font-mono mt-1">Помощь людям в трудной жизненной ситуации</p>
            <div className="mt-3 space-y-2 text-sm text-gh-muted font-mono">
              <p><i className="fa-solid fa-phone w-4 text-center"></i> 8 (918) 995-75-38</p>
              <p><i className="fa-solid fa-envelope w-4 text-center"></i> mak.mutin@yandex.ru</p>
              <p><i className="fa-solid fa-location-dot w-4 text-center"></i> г. Домодедово, Железнодорожная станция "Домодедово" Павелецкое направление, Московской железной дороги</p>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <button className="text-gh-blue text-sm font-medium hover:underline flex items-center gap-2 transition-colors">
              Показать список <i className="fa-solid fa-arrow-right text-xs"></i>
            </button>
            <button onClick={() => setActiveModal('rab_dom')} className="text-gh-muted text-xs font-mono hover:text-gh-text transition-colors underline decoration-dotted">
              Реквизиты
            </button>
          </div>
        </div>
        
        {/* Ночлежка */}
        <div className="bg-gh-surface p-5 rounded-md border border-gh-border flex flex-col justify-between hover:border-gh-blue transition-colors">
          <div>
            <h3 className="text-md font-semibold text-white flex items-center gap-2">
              <i className="fa-solid fa-hand-holding-heart text-gh-blue"></i> Ночлежка
            </h3>
            <p className="text-xs text-gh-muted font-mono mt-1">Благотворительная организация помощи бездомным</p>
            <div className="mt-3 space-y-2 text-sm text-gh-muted font-mono">
              <p><i className="fa-solid fa-phone w-4 text-center"></i> +7 (499) 322-04-29 (офис)</p>
              <p><i className="fa-solid fa-phone w-4 text-center"></i> +7 (499) 322-04-27 (консультация)</p>
              <p><i className="fa-solid fa-envelope w-4 text-center"></i> info@homeless.ru</p>
              <p><i className="fa-solid fa-location-dot w-4 text-center"></i> г. Москва, Бумажный проезд, 2/2, стр. 6</p>
            </div>
          </div>
          <div className="mt-5">
            <button className="text-gh-blue text-sm font-medium hover:underline flex items-center gap-2 transition-colors">
              Показать список <i className="fa-solid fa-arrow-right text-xs"></i>
            </button>
          </div>
        </div>

        {/* Выбери жизнь */}
        <div className="bg-gh-surface p-5 rounded-md border border-gh-border flex flex-col justify-between hover:border-gh-blue transition-colors lg:col-span-2">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-md font-semibold text-white flex items-center gap-2">
                <i className="fa-solid fa-heart-pulse text-gh-blue"></i> Восстановительный центр "Выбери жизнь"
              </h3>
              <span className="text-[10px] font-mono uppercase bg-gh-green/10 text-gh-green border border-gh-green/20 px-2 py-0.5 rounded">Круглосуточно</span>
            </div>
            <p className="text-xs text-gh-muted font-mono mt-1">Помощь алко- и наркозависимым, людям в трудной жизненной ситуации</p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2 text-sm text-gh-muted font-mono">
                <p><i className="fa-solid fa-phone w-4 text-center"></i> +7 925 889-10-10</p>
                <p><i className="fa-solid fa-location-dot w-4 text-center"></i> г. Москва, пер. Гороховский, д. 5</p>
                <p><i className="fa-solid fa-globe w-4 text-center"></i> vyberi-zhizn.ru</p>
              </div>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <button className="text-gh-blue text-sm font-medium hover:underline flex items-center gap-2 transition-colors">
              Показать список <i className="fa-solid fa-arrow-right text-xs"></i>
            </button>
            <button onClick={() => setActiveModal('vyberi')} className="text-gh-muted text-xs font-mono hover:text-gh-text transition-colors underline decoration-dotted">
              Реквизиты
            </button>
          </div>
        </div>
      </div>

      {/* Модальное окно: Рабочий Дом */}
      {activeModal === 'rab_dom' && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-gh-surface border border-gh-border rounded-md shadow-xl max-w-lg w-full overflow-hidden fade-in">
            <div className="bg-gh-subtle px-5 py-3 border-b border-gh-border flex justify-between items-center">
              <h3 className="text-md font-semibold text-white">Юридическая информация — Рабочий Дом</h3>
              <button onClick={closeModal} className="text-gh-muted hover:text-white transition-colors"><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="p-6 space-y-3 font-mono text-sm text-gh-text">
              <p><span className="text-gh-muted">ИНН/КПП:</span> 9723135944/772301001</p>
              <p><span className="text-gh-muted">ОГРН:</span> 1227700031020</p>
              <p><span className="text-gh-muted">Юридический адрес:</span> 109129, Москва, б-р Волжский, д. 38, пом. II, ком. 7, цоколь</p>
              <p><span className="text-gh-muted">Фактический адрес:</span> 142000, микрорайон Центральный, Домодедово, Московская область, ул. Привокзальная площадь д. 2</p>
              <p><span className="text-gh-muted">Директор:</span> Понаморенко А.П.</p>
            </div>
            <div className="bg-gh-surface px-6 py-4 border-t border-gh-border flex justify-end">
              <button onClick={closeModal} className="px-4 py-1.5 text-sm font-medium text-gh-text bg-gh-subtle hover:bg-[#30363d] border border-gh-border rounded-md transition-colors">Закрыть</button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно: Выбери жизнь */}
      {activeModal === 'vyberi' && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-gh-surface border border-gh-border rounded-md shadow-xl max-w-lg w-full overflow-hidden fade-in">
            <div className="bg-gh-subtle px-5 py-3 border-b border-gh-border flex justify-between items-center">
              <h3 className="text-md font-semibold text-white">Юридическая информация — Выбери жизнь</h3>
              <button onClick={closeModal} className="text-gh-muted hover:text-white transition-colors"><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="p-6 space-y-3 font-mono text-sm text-gh-text">
              <p><span className="text-gh-muted">Полное наименование:</span> ООО «Медикал Детокс»</p>
              <p><span className="text-gh-muted">ИНН/КПП:</span> 9701214455 / 770101001</p>
              <p><span className="text-gh-muted">ОГРН:</span> 1227700462879</p>
              <p><span className="text-gh-muted">Юридический адрес:</span> г. Москва, пер. Гороховский, д. 5, ком. 1</p>
              <p><span className="text-gh-muted">Генеральный директор:</span> Шведов Роман Александрович</p>
            </div>
            <div className="bg-gh-surface px-6 py-4 border-t border-gh-border flex justify-end">
              <button onClick={closeModal} className="px-4 py-1.5 text-sm font-medium text-gh-text bg-gh-subtle hover:bg-[#30363d] border border-gh-border rounded-md transition-colors">Закрыть</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SheltersPage;