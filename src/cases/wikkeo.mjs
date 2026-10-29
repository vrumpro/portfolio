import { wikkeoStoreCase } from './wikkeo-store.mjs';
import { wikkeoProductCase } from './wikkeo-product.mjs';
const decisionCopy=[
 ['Магазин','Собрал условия продавца рядом с каталогом, чтобы покупатель быстрее переходил к товарам.'],
 ['Показатели','Вынес скорость ответа, сделки и повторные покупки в отдельный экран.'],
 ['Поиск','Объединил поиск, категории и сортировку внутри магазина.'],
 ['Карточка товара','Показал цену, варианты и условия до добавления в корзину.'],
 ['Скидка от суммы','Показал текущую цену и сумму до следующей скидки.'],
 ['Выбор вариантов','Собрал модели, цвета и количество в один заказ с общим итогом.'],
 ['Покупка','Закрепил цену и действия, чтобы продолжить заказ из любой части карточки.']
];
export const wikkeoProject={
 ...wikkeoStoreCase,
 slug:'wikkeo',brand:'Wikkeo',number:'02',theme:'marketplace',
 title:'От магазина к заказу',category:'Marketplace',cardCaption:'Магазин и карточка товара',
 summary:'Выбор поставщика, товара и состава заказа.',
 platforms:'Web & Mobile App', role:'Senior Product Designer',domain:'Маркетплейс · B2B / B2C',focus:'Магазин → товар → корзина',
 cover:'onshop-store-mobile',coverAlt:'Мобильная страница магазина OnShop на Wikkeo',
 previewScreens:[{name:'onshop-store-desktop',alt:'Магазин OnShop для компьютера'},{name:'onshop-store-mobile',alt:'Магазин OnShop для телефона'}],
 intro:'',
 problemTitle:'Больше заказов из магазина',
 problem:'Перед закупкой покупателю нужно оценить продавца, разобраться в скидках и выбрать несколько моделей и цветов.',
 goal:'Задача — увеличить переходы из магазина в товар и добавления в корзину.',
 collaboration:'Перестроил страницы магазина и товара. Проработал цены, выбор вариантов и сборку заказа, согласовал решения с разработкой.',
 constraint:'У продавцов разные условия, а у товара — много моделей и цветов. На телефоне нужно оставить место для выбора и итоговой суммы.',
 research:{title:'Обратная связь',text:'На встречах с пользователями и поставщиками Wikkeo выступал, задавал вопросы и отвечал на них. Собирал сложности выбора и закупки для работы над интерфейсом.'},
 decisions:[...wikkeoStoreCase.decisions,...wikkeoProductCase.decisions].map((decision,index)=>({...decision,title:decisionCopy[index][0],text:decisionCopy[index][1],creative:['store-comparison','metrics','search','product-comparison','discounts','variants','purchase'][index]})),
 fullScreensIntro:'Магазин и товар на компьютере и телефоне.',
 fullScreens:[...wikkeoStoreCase.fullScreens,...wikkeoProductCase.fullScreens],
 fullScreenGroups:[{title:'Магазин',images:wikkeoStoreCase.fullScreens},{title:'Карточка товара',images:wikkeoProductCase.fullScreens}],
 conclusion:'Условия понятны до покупки',
 result:'Покупатель видит условия продавца, сравнивает цены и собирает разные варианты с общим итогом. Основной показатель — переход в корзину.',
 checks:[...wikkeoStoreCase.checks.slice(0,2),...wikkeoProductCase.checks]
};
