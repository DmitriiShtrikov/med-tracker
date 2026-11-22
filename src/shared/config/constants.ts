export interface EmergencyItem {
  name: string;
  category: string;
  recommend: string;
  purpose: string;
}

export interface EmergencyGroup {
  group: string;
  icon: string;
  items: EmergencyItem[];
}
export const emergencyKit: EmergencyGroup[] = [
    {
        group: 'Обезболивающие и жаропонижающие',
        icon: 'fa-temperature-high',
        items: [
            { name: 'Парацетамол', category: 'Жаропонижающее', recommend: '1 уп.', purpose: 'Жар, головная боль' },
            { name: 'Ибупрофен', category: 'Обезболивающее', recommend: '1 уп.', purpose: 'Боль, воспаление, жар' },
            { name: 'Анальгин (или Цитрамон)', category: 'Обезболивающее', recommend: '1 уп.', purpose: 'Сильная головная боль' }
        ]
    },
    {
        group: 'Сердечно-сосудистые средства',
        icon: 'fa-heart-pulse',
        items: [
            { name: 'Валидол', category: 'Другое', recommend: '1 уп.', purpose: 'Боль в сердце, стресс' },
            { name: 'Нитроглицерин', category: 'Другое', recommend: '1 уп.', purpose: 'Приступ стенокардии' },
            { name: 'Аспирин', category: 'Противовоспалительное', recommend: '1 уп.', purpose: 'Разжижение крови, жар' }
        ]
    },
    {
        group: 'Сорбенты и пищеварительные',
        icon: 'fa-stomach',
        items: [
            { name: 'Активированный уголь', category: 'Сорбенты', recommend: '2 уп.', purpose: 'Отравление' },
            { name: 'Смекта (или Энтеросгель)', category: 'Сорбенты', recommend: '1 уп.', purpose: 'Диарея, отравление' },
            { name: 'Но-шпа', category: 'Спазмолитик', recommend: '1 уп.', purpose: 'Спазмы в животе' },
            { name: 'Регидрон', category: 'Другое', recommend: '2 пак.', purpose: 'Восстановление водного баланса' }
        ]
    },
    {
        group: 'Противоаллергические',
        icon: 'fa-allergies',
        items: [
            { name: 'Супрастин (или Лоратадин)', category: 'Антиаллергическое', recommend: '1 уп.', purpose: 'Аллергия, отёк' }
        ]
    },
    {
        group: 'Антисептики и обработка ран',
        icon: 'fa-band-aid',
        items: [
            { name: 'Хлоргексидин', category: 'Антисептик', recommend: '1 фл.', purpose: 'Обработка ран' },
            { name: 'Перекись водорода', category: 'Антисептик', recommend: '1 фл.', purpose: 'Промывание ран' },
            { name: 'Йод (или зелёнка)', category: 'Антисептик', recommend: '1 фл.', purpose: 'Обработка краёв ран' }
        ]
    },
    {
        group: 'Перевязочные материалы',
        icon: 'fa-bandage',
        items: [
            { name: 'Бинт стерильный', category: 'Перевязочный материал', recommend: '3 шт.', purpose: 'Перевязка ран' },
            { name: 'Бинт эластичный', category: 'Перевязочный материал', recommend: '1 шт.', purpose: 'Растяжения, ушибы' },
            { name: 'Пластырь бактерицидный', category: 'Перевязочный материал', recommend: '1 уп.', purpose: 'Мелкие порезы' },
            { name: 'Пластырь рулонный', category: 'Перевязочный материал', recommend: '1 шт.', purpose: 'Фиксация бинтов' },
            { name: 'Вата стерильная', category: 'Перевязочный материал', recommend: '1 уп.', purpose: 'Обработка ран' }
        ]
    },
    {
        group: 'Инструменты и вспомогательные средства',
        icon: 'fa-toolbox',
        items: [
            { name: 'Термометр', category: 'Другое', recommend: '1 шт.', purpose: 'Измерение температуры' },
            { name: 'Тонометр', category: 'Другое', recommend: '1 шт.', purpose: 'Измерение давления' },
            { name: 'Жгут медицинский', category: 'Другое', recommend: '1 шт.', purpose: 'Остановка кровотечения' },
            { name: 'Ножницы', category: 'Другое', recommend: '1 шт.', purpose: 'Разрезание бинтов' },
            { name: 'Перчатки медицинские', category: 'Другое', recommend: '2 пары', purpose: 'Защита при оказании помощи' }
        ]
    }
];