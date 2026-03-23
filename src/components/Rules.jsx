import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, MessageCircle, CheckSquare, Users, BarChart, Zap, TrendingUp, Compass, Palette, RefreshCw } from 'lucide-react';

const ruleCategories = [
  { id: 'communication', name: 'Комунікація', icon: MessageCircle, description: 'Питання про обмін інформацією та зворотний зв’язок у команді.' },
  { id: 'decision-making', name: 'Прийняття рішень', icon: CheckSquare, description: 'Обговорення процесів прийняття рішень та відповідальності.' },
  { id: 'roles', name: 'Ролі та обовʼязки', icon: Users, description: 'Хто за що відповідає та як розподіляються ролі.' },
  { id: 'business-processes', name: 'Бізнес-процеси', icon: BarChart, description: 'Оптимізація та ефективність внутрішніх процесів.' },
  { id: 'motivation', name: 'Мотивація', icon: Zap, description: 'Внутрішні та зовнішні стимули для команди.' },
  { id: 'scaling', name: 'Масштабування', icon: TrendingUp, description: 'Ріст команди та розвиток бізнесу.' },
  { id: 'strategy', name: 'Стратегування', icon: Compass, description: 'Цілі, візія та стратегічне планування.' },
];

const specialCards = [
  { id: 'creative', name: 'Перерва на творчість', icon: Palette, description: 'Творчі завдання для "перемикання" уваги та емоційної розрядки.' },
  { id: 'change', name: 'Зміна курсу', icon: RefreshCw, description: 'Несподівані повороти та нові правила в ході гри.' },
];

export default function Rules({ onBack }) {
  return (
    <motion.div
      className="view-container rules-view"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <header className="rules-header">
        <button className="back-link" onClick={onBack}>
          <ChevronLeft size={20} /> Назад
        </button>
        <h2 className="dashboard-title">Правила гри</h2>
      </header>

      <div className="rules-content glass card-glass">
        <section className="rules-section">
          <h3>Що це за гра?</h3>
          <p>
            <strong>Командна гра: Масштабування</strong> — це інтерактивний інструмент для командних обговорень, рефлексії та зміцнення взаємодії. Гра допомагає проговорити важливі аспекти спільної роботи через систему випадкових або тематичних питань.
          </p>
        </section>

        <section className="rules-section">
          <h3>Як грати?</h3>
          <ol className="rules-list">
            <li>
              <strong>Налаштування:</strong> Оберіть кількість гравців та введіть їхні імена для зручного відстеження черговості.
            </li>
            <li>
              <strong>Вибір картки:</strong> Гравці по черзі обирають категорію або натискають &quot;Випадкове питання&quot;.
            </li>
            <li>
              <strong>Відкриття:</strong> Натисніть на картку, щоб перевернути її та побачити питання.
            </li>
            <li>
              <strong>Обговорення:</strong> Після відкриття картка розгорнеться на весь екран. Використовуйте таймер (1, 2 або 3 хвилини), щоб структурувати обговорення.
            </li>
            <li>
              <strong>Наступний хід:</strong> Після завершення обговорення натисніть на хрестик, і черга перейде до наступного гравця.
            </li>
          </ol>
        </section>

        <section className="rules-section">
          <h3>Категорії питань</h3>
          <div className="rules-categories-grid">
            {ruleCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.id} className="rule-cat-item">
                  <div className="rule-cat-icon">
                    <Icon size={20} />
                  </div>
                  <div className="rule-cat-text">
                    <h4>{cat.name}</h4>
                    <p>{cat.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rules-section">
          <h3>Спеціальні картки</h3>
          <div className="rules-categories-grid">
            <div className="rule-cat-item special">
              <div className="rule-cat-icon">
                <Palette size={20} />
              </div>
              <div className="rule-cat-text">
                <h4>Перерва на творчість</h4>
                <p>Творчі завдання для &quot;перемикання&quot; уваги та емоційної розрядки.</p>
              </div>
            </div>
            <div className="rule-cat-item special">
              <div className="rule-cat-icon">
                <RefreshCw size={20} />
              </div>
              <div className="rule-cat-text">
                <h4>Зміна курсу</h4>
                <p>Несподівані повороти та додаткові правила, які стають активними після відкриття картки та відображаються у верхній частині екрана. Ці правила діють до тих пір, поки ви їх не скасуєте.</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .rules-view {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding-bottom: 3rem;
        }
        .rules-header {
          display: flex;
          align-items: center;
          width: 100%;
          position: relative;
        }
        .rules-header .back-link {
          position: absolute;
          left: 0;
        }
        .rules-header .dashboard-title {
          flex: 1;
          margin: 0;
        }
        .rules-content {
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          text-align: left;
        }
        .rules-section h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #3b82f6;
          font-weight: 700;
        }
        .rules-section p {
          line-height: 1.6;
          opacity: 0.9;
          font-size: 1.1rem;
        }
        .rules-list {
          padding-left: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .rules-list li {
          line-height: 1.5;
          font-size: 1.05rem;
        }
        .rules-list li strong {
          color: #ec4899;
        }
        .rules-categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-top: 1rem;
        }
        .rule-cat-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .rule-cat-icon {
          width: 40px;
          height: 40px;
          min-width: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 10px;
          color: #3b82f6;
        }
        .rule-cat-item.special .rule-cat-icon {
          background: rgba(236, 72, 153, 0.1);
          color: #ec4899;
        }
        .rule-cat-text h4 {
          margin-bottom: 0.25rem;
          font-size: 1rem;
          font-weight: 600;
        }
        .rule-cat-text p {
          font-size: 0.85rem;
          opacity: 0.7;
          line-height: 1.4;
        }
        @media (max-width: 640px) {
          .rules-content { padding: 1.5rem; }
          .rules-header .back-link { position: static; margin-bottom: 1rem; }
          .rules-header { flex-direction: column; align-items: flex-start; }
          .rules-categories-grid { grid-template-columns: 1fr; }
        }
      `}} />
    </motion.div>
  );
}
