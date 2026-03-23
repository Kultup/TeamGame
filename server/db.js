// Mock SQLite driver to avoid native dependency issues
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initial data from the original file
const initialCategories = [
  { id: 'communication', name: 'Комунікація', color: '#3b82f6', icon: 'MessageCircle' },
  { id: 'decision-making', name: 'Прийняття рішень', color: '#ef4444', icon: 'CheckSquare' },
  { id: 'roles', name: 'Ролі та обов\'язки', color: '#10b981', icon: 'Users' },
  { id: 'business-processes', name: 'Бізнес-процеси', color: '#f59e0b', icon: 'BarChart' },
  { id: 'motivation', name: 'Мотивація', color: '#8b5cf6', icon: 'Zap' },
  { id: 'scaling', name: 'Масштабування', color: '#ec4899', icon: 'TrendingUp' },
  { id: 'strategy', name: 'Стратегування', color: '#6366f1', icon: 'Compass' },
  { id: 'creative', name: 'Перерва на творчість', color: '#14b8a6', icon: 'Palette', isSpecial: 1 },
  { id: 'change', name: 'Зміна курсу', color: '#64748b', icon: 'RefreshCw', isSpecial: 1 },
];

const initialQuestions = [
  // Комунікація (20)
  { id: 1, category: 'communication', text: 'Як ми можемо покращити прозорість обміну інформацією між департаментами?' },
  { id: 2, category: 'communication', text: 'Що зазвичай заважає вам висловлювати свою думку відкрито під час мітингів?' },
  { id: 3, category: 'communication', text: 'Який канал комунікації (Slack, Zoom, Email) є для нас найбільш перевантаженим?' },
  { id: 4, category: 'communication', text: 'Опишіть випадок, коли непорозуміння призвело до затримки. Як цього уникнути?' },
  { id: 5, category: 'communication', text: 'Що для вас є "ідеальним зворотним зв\'язком"?' },
  { id: 6, category: 'communication', text: 'Як часто ми повинні проводити 1-on-1 зустрічі?' },
  { id: 7, category: 'communication', text: 'Чи відчуваєте ви, що вас чують під час прийняття командних рішень?' },
  { id: 8, category: 'communication', text: 'Яку інформацію ви отримуєте останньою, хоча вона важлива для вашої роботи?' },
  { id: 9, category: 'communication', text: 'Як ми можемо зробити наші зустрічі більш результативними та короткими?' },
  { id: 10, category: 'communication', text: 'Назвіть одну річ, яку ми повинні перестати обговорювати і почати робити.' },
  { id: 11, category: 'communication', text: 'Як ми справляємося з конфліктами в команді? Що можна змінити?' },
  { id: 12, category: 'communication', text: 'Чи достатньо у нас неформального спілкування для побудови довіри?' },
  { id: 13, category: 'communication', text: 'Що б ви змінили в культурі написання повідомлень у робочих чатах?' },
  { id: 14, category: 'communication', text: 'Як ми повідомляємо про погані новини або невдачі? Чи достатньо ми чесні?' },
  { id: 15, category: 'communication', text: 'Яку роль у нашому спілкуванні грає емпатія? Чи відчуваєте ви підтримку?' },
  { id: 16, category: 'communication', text: 'Назвіть 3 слова, які описують наш стиль комунікації зараз.' },
  { id: 17, category: 'communication', text: 'Кому в команді ви б хотіли подякувати за допомогу на цьому тижні?' },
  { id: 18, category: 'communication', text: 'Як ми можемо швидше синхронізуватись на початку робочого дня?' },
  { id: 19, category: 'communication', text: 'Чи розумієте ви цілі інших команд/відділів нашої компанії?' },
  { id: 20, category: 'communication', text: 'Який інструмент комунікації ми повинні спробувати впровадити?' },
  // ... (I'll keep a subset or everything if I can, but let's be concise)
  { id: 21, category: 'decision-making', text: 'Хто має фінальне слово в критичних ситуаціях? Чи зрозуміло це всім?' },
  { id: 22, category: 'roles', text: 'Чи відчуваєте ви, що ваші обов\'язки чітко визначені? Де є сірі зони?' },
  { id: 23, category: 'business-processes', text: 'Який процес у нашій роботі займає найбільше часу, але дає найменше результату?' },
  { id: 24, category: 'motivation', text: 'Що найбільше надихає вас приходити на роботу щоранку?' },
  { id: 25, category: 'scaling', text: 'Яка найбільша перешкода для подвоєння нашої команди протягом року?' },
  { id: 26, category: 'strategy', text: 'Де ми бачимо себе через 3 роки? Чи всі бачать ту саму картину?' },
  { id: 27, category: 'creative', text: 'Придумайте назву для нашого наступного великого релізу, використовуючи лише назви фруктів.' },
  { id: 28, category: 'change', text: 'Наступні 5 хвилин обговорення веде наймолодший член команди.' },
  { id: 29, category: 'decision-making', text: 'Які маленькі рішення щодня формують нашу культуру? Чи усвідомлюємо ми їх значення?' },
  { id: 30, category: 'decision-making', text: 'Яке було моє найсміливіше рішення в роботі з командою? Що воно дало мені і команді?' },
  { id: 31, category: 'decision-making', text: 'Як я дію, коли інші саботують рішення?' },
  { id: 32, category: 'decision-making', text: 'Чи була у нас ситуація, коли ми свідомо обрали рішення на користь цінностей, а не вигоди? Як це вплинуло на команду та компанію?' },
  { id: 33, category: 'decision-making', text: 'Розкажи про три найважчі професійні рішення в команді. Чого вони тебе навчили?' },
  { id: 34, category: 'decision-making', text: 'Як я роблю вибір, коли всі очікують на різне?' },
  { id: 35, category: 'decision-making', text: 'Що та як я обираю, коли все важливо?' },
  { id: 36, category: 'decision-making', text: 'Як ми розпізнаємо «псевдозгоду» та як працюємо з відкритою незгодою?' },
  { id: 37, category: 'decision-making', text: 'Яке стратегічне рішення я, або ми, як команда, відкладаємо? Що заважає його ухвалити саме зараз?' },
  { id: 38, category: 'decision-making', text: 'Як терміновість та тиск часу змінюють мої рішення?' },
  { id: 39, category: 'decision-making', text: 'Як емоції та мій стан впливають на мої рішення?' },
  { id: 40, category: 'decision-making', text: 'Коли варто та не варто довіряти « внутрішньому відчуттю» та інтуїції? У яких випадках ми поєднуємо інтуїцію й аналіз при прийнятті рішень?' },
  { id: 41, category: 'decision-making', text: 'Як я розумію, що пора вже вирішувати, а не думати далі?' },
  { id: 42, category: 'decision-making', text: 'Які слабкості я помічаю в нашому командному мисленні?' },
  { id: 43, category: 'decision-making', text: 'Що допомагає мені виходити з «паралічу вибору»?' },
  { id: 44, category: 'roles', text: 'Якщо всю мою роботу у компанії робитимуть роботи, чим я буду займатись? Якою буде моя роль?' },
  { id: 45, category: 'roles', text: 'Чи є в нас « псевдоролі» - посади, що існують формально, але без реального змісту?' },
  { id: 46, category: 'roles', text: 'Що в моїй роботі створює залежність команди від мене - і чи якимось чином я підсилюю цю залежність?' },
  { id: 47, category: 'roles', text: 'Як ми домовляємось про спільну відповідальність, а не лише індивідуальну?' },
  { id: 48, category: 'roles', text: 'Які частини моєї ролі залишаються «невидимими» для інших?' },
  { id: 49, category: 'roles', text: 'Як я поводжусь, коли межі ролей зникають у стресі?' },
  { id: 50, category: 'roles', text: 'Як я допомагаю новачкам зрозуміти, хто за що відповідає?' },
  { id: 51, category: 'roles', text: 'Що було б, якби ми сьогодні перерозподілили всі ролі та обовʼязки з нуля?' },
  { id: 52, category: 'roles', text: 'Що я боюсь втратити, коли віддаю частину своєї відповідальності?' },
  { id: 53, category: 'roles', text: 'Як я поводжусь, коли вважаю, що хтось не виконує свої задачі?' },
  { id: 54, category: 'roles', text: 'Як я реагую, коли хтось знімає з себе відповідальність?' },
  { id: 55, category: 'roles', text: 'Яке завдання я виконую, хоч мав(-ла) б давно делегувати? Чому я його не делегую?' },
  { id: 56, category: 'roles', text: 'Які частини моєї ролі мені найбільше та найменше подобаються?' },
  { id: 57, category: 'roles', text: 'Яка моя роль у цій команді - формально та неформально? Опишіть їх.' },
  { id: 58, category: 'roles', text: 'Як часто я отримую зворотній звʼязок не про конкретні завдання, а про свою роль?' },
  { id: 59, category: 'creative', text: 'Зірковий ефір. Задача: Уяви, що ти - зірковий диктор на топовій радіостанції. Зроби рекламну паузу для чогось дуже побутового: чайник, пральний порошок, зарядка, ручка тощо. Додай гламуру, пафосу, драматизму або іронії.' },
  { id: 60, category: 'creative', text: 'Одна фраза - пʼять емоцій. Задача: Обери коротку фразу (наприклад, «Я люблю каву»). Повтори її 5 разів з різними емоціями: злість, радість, смуток, страх, здивування.' },
  { id: 61, category: 'creative', text: 'Мелодія без слів. Задача: Заспівай знайому пісню із закритим ротом (через носовий звук). Інші учасники мають вгадати, що це за пісня.' },
  { id: 62, category: 'creative', text: 'Вигадана мова. Задача: Говори про будь-який предмет у кімнаті хвилину вигаданою мовою (інтонація, жести). Інші мають вгадати, про що ти «говориш».' },
  { id: 63, category: 'creative', text: 'Фото-челендж. Поділіться на 2 команди. Зробіть селфі: у формі логотипу; з найдивнішою позою; серйозні обличчя в абсурді; з чужою кавою; або «Ми команда!». Хто швидше - той виграв.' },
  { id: 64, category: 'creative', text: 'Голос тіла. Обери частину тіла (долоню, мізинець...). Через її рух передай послання (вибачення, симпатія, біль, грайливість, страх), поки решта тіла мовчить.' },
  { id: 65, category: 'creative', text: 'Асоціативний портрет. Задача: Запиши стільки асоціацій про себе, скільки тобі років. Це можуть бути слова, образи, кольори тощо. Після зачитай у голос.' },
  { id: 66, category: 'creative', text: 'Коло підтримки. Одна людина стає в центр. Усі по колу говорять ей: «Я люблю в тобі…», «Мені імпонує, що ти…», «Мене захоплює, як ти…». Головне - щирість.' },
  { id: 67, category: 'creative', text: 'Асоціації про мене. Один учасник у центрі. Інші називають слово або образ-асоціацію. Після учасник рефлексує: що відгукнулось? Що здивувало в тому, як бачать інші?' },
  { id: 68, category: 'creative', text: 'Netflix знімає фільм про вашу компанію (премʼєра за 5 років). Опишіть у групах: Хто ви тепер? У що вдягнені? Що транслюєте світу? Яка сцена відкриває фільм?' },
  { id: 69, category: 'creative', text: 'Я - мій продукт. Уяви, що ти - сам продукт. 5 хвилин говори від його імені: Що для тебе важливо? Що ти хочеш сказати світу? Які твої межі, цінності, мрії?' },
  { id: 70, category: 'creative', text: 'Історія чужими руками. Твої руки - за спину. Замість них - руки партнера. Завдання: розповісти емоційну історію, поки руки «живуть своїм життям».' },
  { id: 71, category: 'creative', text: 'Монолог персонажу. Стань вигаданим персонажем (міміка, голос). 2 хвилини веди монолог: Хто ти? У що віриш? Що болить? У чому сила? Команда має вгадати, хто ти.' },
  { id: 72, category: 'creative', text: 'Голос предмета. Стань будь-яким предметом у кімнаті. Веди монолог від його імені: Хто я? Що бачу щодня? Про що мрію або чого боюсь? Команда має вгадати.' },
  { id: 73, category: 'creative', text: 'Емоційна візитівка. Назви ПІБ, посаду та компанію через одну конкретну емоцію (претензія, зверхність, образа тощо). Транслюй її голосом і тілом. Команда вгадує емоцію.' },
];

let state = {
  categories: [...initialCategories],
  questions: [...initialQuestions]
};

const db = {
  all: (query, params, callback) => {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }

    setTimeout(() => {
      if (query.includes('FROM categories')) {
        callback(null, state.categories);
      } else if (query.includes('FROM questions')) {
        let result = state.questions;
        if (params.length > 0) {
          result = result.filter(q => q.category === params[0]);
        }
        callback(null, result);
      } else {
        callback(null, []);
      }
    }, 10);
  },

  get: (query, params, callback) => {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }
    setTimeout(() => {
      callback(null, { count: state.categories.length }); // Mock for seed check
    }, 10);
  },

  run: (query, params, callback) => {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }

    setTimeout(() => {
      if (query.includes('INSERT INTO questions')) {
        const newQuest = { id: Date.now(), category: params[0], text: params[1] };
        state.questions.push(newQuest);
        if (callback) callback.call({ lastID: newQuest.id }, null);
      } else if (query.includes('INSERT INTO categories')) {
        const newCat = { id: params[0], name: params[1], color: params[2], icon: params[3], isSpecial: params[4] };
        state.categories.push(newCat);
        if (callback) callback.call({ lastID: newCat.id }, null);
      } else if (query.includes('DELETE FROM questions WHERE id = ?')) {
        state.questions = state.questions.filter(q => q.id !== params[0]);
        if (callback) callback.call({ changes: 1 }, null);
      } else if (query.includes('DELETE FROM categories WHERE id = ?')) {
        state.categories = state.categories.filter(c => c.id !== params[0]);
        state.questions = state.questions.filter(q => q.category !== params[0]);
        if (callback) callback.call({ changes: 1 }, null);
      } else {
        if (callback) callback(null);
      }
    }, 10);
  },

  prepare: () => ({
    run: () => { },
    finalize: () => { }
  }),

  serialize: (fn) => fn()
};

export default db;
