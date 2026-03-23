export const categories = [
  { id: 'communication', name: 'Комунікація', color: '#3b82f6', icon: 'MessageCircle' },
  { id: 'decision-making', name: 'Прийняття рішень', color: '#ef4444', icon: 'CheckSquare' },
  { id: 'roles', name: 'Ролі та обов\'язки', color: '#10b981', icon: 'Users' },
  { id: 'business-processes', name: 'Бізнес-процеси', color: '#f59e0b', icon: 'BarChart' },
  { id: 'motivation', name: 'Мотивація', color: '#8b5cf6', icon: 'Zap' },
  { id: 'scaling', name: 'Масштабування', color: '#ec4899', icon: 'TrendingUp' },
  { id: 'strategy', name: 'Стратегування', color: '#6366f1', icon: 'Compass' },
  { id: 'creative', name: 'Перерва на творчість', color: '#14b8a6', icon: 'Palette', isSpecial: true },
  { id: 'change', name: 'Зміна курсу', color: '#64748b', icon: 'RefreshCw', isSpecial: true },
];

export const questions = [
  // Комунікація
  { id: 1, category: 'communication', text: 'Як ми можемо покращити прозорість обміну інформацією між департаментами?' },
  { id: 2, category: 'communication', text: 'Опишіть випадок, коли непорозуміння призвело до затримки. Як цього уникнути в майбутньому?' },
  { id: 3, category: 'communication', text: 'Що для вас є ідеальним зворотним зв\'язком?' },
  
  // Прийняття рішень
  { id: 4, category: 'decision-making', text: 'Хто має фінальне слово в критичних ситуаціях? Чи зрозуміло це всім?' },
  { id: 5, category: 'decision-making', text: 'Якої інформації нам зазвичай бракує для прийняття швидких рішень?' },
  { id: 6, category: 'decision-making', text: 'Як ми реагуємо на помилкові рішення? Чи є у нас право на помилку?' },
  
  // Ролі та обов'язки
  { id: 7, category: 'roles', text: 'Чи відчуваєте ви, що ваші обов\'язки чітко визначені? Де є сірі зони?' },
  { id: 8, category: 'roles', text: 'Якби ви могли змінити одну свою функцію, що б це було?' },
  { id: 9, category: 'roles', text: 'Яка роль у команді зараз найбільш перевантажена?' },
  
  // Бізнес-процеси
  { id: 10, category: 'business-processes', text: 'Який процес у нашій роботі займає найбільше часу, але дає найменше результату?' },
  { id: 11, category: 'business-processes', text: 'Якби ми мали все автоматизувати, з чого б ви почали?' },
  { id: 12, category: 'business-processes', text: 'Де ми втрачаємо темп при масштабуванні процесів?' },
  
  // Мотивація
  { id: 13, category: 'motivation', text: 'Що найбільше надихає вас приходити на роботу щоранку?' },
  { id: 14, category: 'motivation', text: 'Яке нематеріальне заохочення є для вас найціннішим?' },
  { id: 15, category: 'motivation', text: 'Коли ви востаннє відчували гордість за спільний результат?' },
  
  // Масштабування
  { id: 16, category: 'scaling', text: 'Яка найбільша перешкода для подвоєння нашої команди протягом року?' },
  { id: 17, category: 'scaling', text: 'Чи готові наші поточні інструменти до х10 навантаження?' },
  { id: 18, category: 'scaling', text: 'Як зберегти культуру компанії при швидкому рості?' },
  
  // Стратегування
  { id: 19, category: 'strategy', text: 'Де ми бачимо себе через 3 роки? Чи всі бачать ту саму картину?' },
  { id: 20, category: 'strategy', text: 'Який наш головний пріоритет на цей квартал?' },
  { id: 21, category: 'strategy', text: 'Якби ми були стартапом, що б ми зробили інакше сьогодні?' },
  
  // Перерва на творчість
  { id: 22, category: 'creative', text: 'Придумайте назву для нашого наступного великого релізу, використовуючи лише назви фруктів.' },
  { id: 23, category: 'creative', text: 'Встаньте і зробіть 1-хвилинну "випадкову" розминку разом.' },
  
  // Зміна курсу
  { id: 24, category: 'change', text: 'Наступні 5 хвилин обговорення веде наймолодший член команди.' },
  { id: 25, category: 'change', text: 'Заборонено використовувати слово "проблема". Замінюйте його на "можливість".' },
];
