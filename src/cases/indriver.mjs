const screen = (name, alt) => ({ name: `in-drive-${name}-ru`, alt, caption: alt, type: 'mobile' });
const routeLoading = screen('route-loading', 'Ввод московского адреса: загрузка результатов');
const routeResults = screen('route-results', 'Результаты поиска адреса в Москве');
const options = screen('delivery-options', 'Выбор транспорта и параметров доставки');
const ready = screen('delivery-ready', 'Заказ с адресами, условиями и ценой');
const search = screen('delivery-search', 'Поиск курьера на карте');
const expanded = screen('delivery-search-expanded', 'Цена, маршрут и детали во время поиска курьера');
const offers = screen('courier-offers', 'Сравнение предложений курьеров');
const arrival = screen('courier-arrival', 'Время прибытия курьера и связь с ним');

export const indriverProject = {
  slug: 'indriver', brand: 'inDrive', theme: 'mobility', category: 'Mobile app',
  title: 'Заказ курьерской доставки', cardCaption: 'Выбор курьера',
  role: 'Product Designer', focus: 'Заказ → предложение → выбор курьера', platforms: 'Mobile App', mobileOnly: true,
  cover: ready.name, coverAlt: ready.alt, previewScreens: [ready, offers],
  problemTitle: 'Больше заказов с выбранным курьером',
  problem: 'После создания заказа пользователь ждёт отклики и сравнивает цену, рейтинг и время подачи. Неясные условия и ожидание могут привести к отмене.',
  goal: 'Задача — повысить долю заказов, в которых пользователь выбирает курьера, и сократить отказы во время поиска.',
  collaboration: 'Разобрал путь от маршрута до выбора курьера. Сопоставил состояния заказа, выделил условия сравнения предложений и адаптировал восемь экранов.',
  constraint: 'Карта и заказ делят один экран. Маршрут, цена и время подачи должны оставаться доступны на каждом этапе.',
  decisions: [
    { title: 'Маршрут', text: 'Показал ввод адреса, загрузку и найденные места. Сохранил возможность выбрать точку на карте.', layout: 'phones', images: [routeLoading, routeResults] },
    { title: 'Транспорт и условия', text: 'Собрал выбор транспорта, условий и цены. Выделил заполненные параметры перед поиском курьера.', layout: 'phones', images: [options, ready] },
    { title: 'Поиск курьера', text: 'Сопоставил короткую и раскрытую карточки заказа. Цена доступна сразу, адреса и условия — в деталях.', layout: 'phones', images: [search, expanded] },
    { title: 'Выбор и ожидание', text: 'Показал сравнение цены, рейтинга и времени подачи. После выбора — прибытие и связь с курьером.', layout: 'phones', images: [offers, arrival] }
  ],
  fullScreens: [ready, arrival],
  fullScreenGroups: [{ title: 'До поиска и после выбора курьера', images: [ready, arrival] }],
  fullScreensIntro: 'Заполненный заказ и ожидание курьера — два основных состояния доставки.',
  conclusion: 'Выбор курьера с понятными условиями',
  result: 'Пользователь может сравнить предложения, изменить свою цену и выбрать подходящего курьера. После выбора видит время прибытия и способы связи — заказ остаётся понятным до встречи.',
};
