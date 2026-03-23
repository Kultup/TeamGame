import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, Palette, ChevronLeft, Trash2, Plus, Edit2, Save, X, Download, FileText, FilePlus, AlertTriangle
} from 'lucide-react';
import { COLOR_PALETTE } from '../constants/categories';
import { iconMap } from '../constants/icons';

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="confirm-modal-overlay">
        <motion.div 
          className="confirm-modal-box glass card-glass"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
        >
          <div className="confirm-modal-icon">
            <AlertTriangle size={32} color="#ef4444" />
          </div>
          <h3>{title}</h3>
          <p>{message}</p>
          <div className="confirm-modal-actions">
            <button className="confirm-btn-cancel glass" onClick={onClose}>Скасувати</button>
            <button className="confirm-btn-delete glass" onClick={onConfirm}>Видалити</button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const AdminPanel = React.memo(({ 
  categories, 
  questions, 
  questionCounts, 
  onAddCategory, 
  onUpdateCategory,
  onDeleteCategory, 
  onAddQuestion, 
  onUpdateQuestion,
  onDeleteQuestion,
  onBack,
  notify 
}) => {
  const [editorTab, setEditorTab] = useState('question');
  const [newQuestion, setNewQuestion] = useState({ text: '', category: '' });
  const [newCategory, setNewCategory] = useState({ id: '', name: '', color: '#3b82f6', icon: 'MessageCircle' });
  const [editingItem, setEditingItem] = useState(null); // { type: 'question'|'category', id, data }
  const [editorError, setEditorError] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  const handleAddCategory = async () => {
    let { id } = newCategory;
    const { name } = newCategory;
    if (!name) {
      setEditorError('Будь ласка, введіть назву');
      return;
    }
    if (!id) {
      id = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      if (!id || id === '-') {
        id = 'cat-' + Date.now().toString(36);
      }
    }

    try {
      const result = await onAddCategory({ ...newCategory, id });
      if (result) {
        setNewCategory({ id: '', name: '', color: '#3b82f6', icon: 'MessageCircle' });
        setEditorError(null);
        notify.success('Категорію додано');
      }
    } catch (err) {
      setEditorError('Помилка при збереженні');
      notify.error('Не вдалося зберегти категорію');
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingItem || editingItem.type !== 'category') return;
    try {
      const result = await onUpdateCategory(editingItem.id, editingItem.data);
      if (result) {
        setEditingItem(null);
        notify.success('Категорію оновлено');
      }
    } catch (err) {
      notify.error('Не вдалося оновити категорію');
    }
  };

  const handleAddQuestion = async () => {
    if (!newQuestion.text || !newQuestion.category) {
      setEditorError('Заповніть всі поля');
      return;
    }
    if (newQuestion.text.length < 5) {
      setEditorError('Питання має бути довшим');
      return;
    }

    try {
      const result = await onAddQuestion(newQuestion);
      if (result) {
        setNewQuestion({ text: '', category: '' });
        setEditorError(null);
        notify.success('Питання додано');
      }
    } catch (err) {
      notify.error('Не вдалося зберегти питання');
    }
  };

  const handleUpdateQuestion = async () => {
    if (!editingItem || editingItem.type !== 'question') return;
    try {
      const result = await onUpdateQuestion(editingItem.id, editingItem.data);
      if (result) {
        setEditingItem(null);
        notify.success('Питання оновлено');
      }
    } catch (err) {
      notify.error('Не вдалося оновити питання');
    }
  };

  const handleExport = () => {
    const data = {
      categories,
      questions,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `team_game_export_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    notify.success('Експорт завершено');
  };

  const handleExportWord = () => {
    let content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Експорт питань - Командна гра</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.5; color: #333; }
        h1 { color: #1e293b; border-bottom: 2px solid #3b82f6; padding-bottom: 5px; }
        h2 { margin-top: 25px; border-left: 4px solid #3b82f6; padding-left: 10px; }
        ul { list-style-type: square; }
        li { margin-bottom: 8px; }
        .meta { font-size: 0.9em; color: #64748b; }
      </style>
      </head>
      <body>
        <h1>Питання для командної гри</h1>
        <p class="meta">Дата експорту: ${new Date().toLocaleDateString('uk-UA')}</p>
        <hr>
    `;

    categories.forEach(cat => {
      const catQuestions = questions.filter(q => q.category === cat.id);
      if (catQuestions.length > 0) {
        content += `<h2 style="color: ${cat.color}">${cat.name}</h2><ul>`;
        catQuestions.forEach(q => {
          content += `<li>${q.text}</li>`;
        });
        content += `</ul>`;
      }
    });

    content += `</body></html>`;

    const blob = new Blob(['\ufeff', content], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `team_game_questions_${new Date().toISOString().split('T')[0]}.doc`;
    link.click();
    URL.revokeObjectURL(url);
    notify.success('Експорт у Word завершено');
  };

  const handleDownloadTemplate = () => {
    let content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Шаблон наповнення питань</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.5; color: #333; }
        h1 { font-size: 24pt; color: #1e293b; border-bottom: 2px solid #10b981; padding-bottom: 10px; margin-bottom: 20px; }
        h2 { font-size: 18pt; margin-top: 30px; border-left: 6px solid #10b981; padding-left: 15px; background: #f0fdf4; padding-top: 5px; padding-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 20px; }
        th, td { border: 1px solid #cbd5e1; padding: 12px; text-align: left; }
        th { background-color: #f8fafc; font-weight: bold; color: #475569; font-size: 11pt; }
        td { font-size: 11pt; height: 30pt; }
        .hint { font-size: 10pt; color: #64748b; font-style: italic; margin-bottom: 30px; background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; }
        .footer { font-size: 9pt; color: #94a3b8; text-align: center; margin-top: 50px; }
      </style>
      </head>
      <body>
        <h1>Шаблон наповнення питань (Team Game)</h1>
        <div class="hint">
          <strong>Інструкція:</strong> Будь ласка, введіть ваші питання у відповідні таблиці нижче. Кожен рядок — це окреме питання. 
          Ви можете додавати нові рядки (Enter в останній клітинці таблиці), якщо вам потрібно більше питань.
        </div>
    `;

    categories.forEach(cat => {
      content += `
        <h2 style="color: ${cat.color}; border-left-color: ${cat.color}; background: ${cat.color}10;">${cat.name}</h2>
        <table>
          <thead>
            <tr>
              <th style="width: 40pt; text-align: center;">№</th>
              <th>Текст вашого питання (напишіть тут)</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style="text-align: center;">1</td><td></td></tr>
            <tr><td style="text-align: center;">2</td><td></td></tr>
            <tr><td style="text-align: center;">3</td><td></td></tr>
            <tr><td style="text-align: center;">4</td><td></td></tr>
            <tr><td style="text-align: center;">5</td><td></td></tr>
          </tbody>
        </table>
      `;
    });

    content += `
        <div class="footer">Документ створено автоматично для Team Game • ${new Date().toLocaleDateString('uk-UA')}</div>
      </body></html>
    `;

    const blob = new Blob(['\ufeff', content], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `template_questions_${new Date().toLocaleDateString('uk-UA').replace(/\./g, '-')}.doc`;
    link.click();
    URL.revokeObjectURL(url);
    notify.success('Шаблон завантажено');
  };

  const startEditing = (type, item) => {
    setEditingItem({
      type,
      id: type === 'category' ? item.id : item.id,
      data: { ...item }
    });
  };

  const handleDeleteCategoryConfirm = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Видалити категорію?',
      message: 'Ви впевнені? Усі питання в цій категорії також будуть видалені. цю дію неможливо скасувати.',
      onConfirm: () => {
        onDeleteCategory(id);
        setConfirmModal({ ...confirmModal, isOpen: false });
      }
    });
  };

  const handleDeleteQuestionConfirm = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Видалити питання?',
      message: 'Ви впевнені, що хочете видалити це питання? цю дію неможливо скасувати.',
      onConfirm: () => {
        onDeleteQuestion(id);
        setConfirmModal({ ...confirmModal, isOpen: false });
      }
    });
  };

  return (
    <motion.div
      key="admin"
      className="admin-page"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
    >
      <div className="admin-container glass">
        <div className="admin-header">
          <button className="back-btn" onClick={onBack}>
            <ChevronLeft size={20} /> Повернутися до гри
          </button>
          <h2>Керування контентом</h2>
          <button className="glass export-btn json-btn" onClick={handleExport} title="Завантажити всі дані у файл (JSON)">
            <Download size={20} /> JSON
          </button>
          <button className="glass export-btn word-btn" onClick={handleExportWord} title="Завантажити всі дані у форматі Word (.doc)">
            <FileText size={20} /> Word
          </button>
          <button className="glass export-btn template-btn" onClick={handleDownloadTemplate} title="Завантажити пустий шаблон Word для наповнення">
            <FilePlus size={20} /> Шаблон
          </button>
        </div>

        {editorError && (
          <div className="editor-error-msg" onClick={() => setEditorError(null)}>
            {editorError} (натисніть, щоб закрити)
          </div>
        )}

        <div className="admin-tabs">
          <button
            className={`admin-tab ${editorTab === 'question' ? 'active' : ''}`}
            onClick={() => { setEditorTab('question'); setEditingItem(null); }}
          >
            <MessageCircle size={18} /> Питання
          </button>
          <button
            className={`admin-tab ${editorTab === 'category' ? 'active' : ''}`}
            onClick={() => { setEditorTab('category'); setEditingItem(null); }}
          >
            <Palette size={18} /> Категорії
          </button>
        </div>

        <div className="admin-content">
          {editorTab === 'question' ? (
            <div className="admin-section card-glass">
              <div className="admin-section-grid">
                <div>
                  <h3>{editingItem ? 'Редагувати питання' : 'Додати нове питання'}</h3>
                  <div className="admin-form">
                    <label>Категорія</label>
                    <select
                      value={editingItem ? editingItem.data.category : newQuestion.category}
                      onChange={e => editingItem 
                        ? setEditingItem({...editingItem, data: {...editingItem.data, category: e.target.value}})
                        : setNewQuestion({...newQuestion, category: e.target.value})}
                      className="glass"
                    >
                      <option value="">Оберіть категорію</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <label>Текст питання</label>
                    <textarea
                      value={editingItem ? editingItem.data.text : newQuestion.text}
                      onChange={e => editingItem
                        ? setEditingItem({...editingItem, data: {...editingItem.data, text: e.target.value}})
                        : setNewQuestion({...newQuestion, text: e.target.value})}
                      placeholder="Введіть питання..."
                      className="glass"
                      minLength={5}
                      maxLength={1000}
                    />
                    {editingItem ? (
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="glass submit-btn" style={{ flex: 1 }} onClick={handleUpdateQuestion}>
                          <Save size={18} style={{ marginRight: 8 }} /> Зберегти
                        </button>
                        <button className="glass submit-btn" style={{ flex: 1, background: 'rgba(255,255,255,0.1) !important' }} onClick={() => setEditingItem(null)}>
                          Скасувати
                        </button>
                      </div>
                    ) : (
                      <button className="glass submit-btn" onClick={handleAddQuestion}>Додати питання</button>
                    )}
                  </div>
                </div>

                <div className="editor-list">
                  { (editingItem ? editingItem.data.category : newQuestion.category) ? (
                    <>
                      <h4>Питання в цій категорії ({questionCounts[editingItem ? editingItem.data.category : newQuestion.category] || 0}):</h4>
                      <div className="list-container">
                        {questions.filter(q => q.category === (editingItem ? editingItem.data.category : newQuestion.category)).map(q => (
                          <div key={q.id} className={`editor-list-item glass ${editingItem?.id === q.id ? 'active-edit' : ''}`}>
                            <span>{q.text}</span>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button onClick={() => startEditing('question', q)} title="Редагувати" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                                <Edit2 size={16} />
                              </button>
                              <button onClick={() => handleDeleteQuestionConfirm(q.id)} title="Видалити">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div style={{ opacity: 0.5, textAlign: 'center', marginTop: '4rem' }}>
                      <p>Оберіть категорію зліва, щоб переглянути існуючі питання.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="admin-section card-glass">
              <div className="admin-section-grid">
                <div>
                  <h3>{editingItem ? 'Редагувати категорію' : 'Створити нову категорію'}</h3>
                  <div className="admin-form">
                    <label>Назва</label>
                    <input
                      type="text"
                      value={editingItem ? editingItem.data.name : newCategory.name}
                      onChange={e => editingItem
                        ? setEditingItem({...editingItem, data: {...editingItem.data, name: e.target.value}})
                        : setNewCategory({...newCategory, name: e.target.value})}
                      placeholder="Наприклад: Командна робота"
                      className="glass"
                      maxLength={100}
                    />
                    <label>Колір</label>
                    <div className="color-grid">
                      {COLOR_PALETTE.map(c => (
                        <div
                          key={c}
                          className={`color-box ${(editingItem ? editingItem.data.color : newCategory.color) === c ? 'active' : ''}`}
                          style={{ backgroundColor: c }}
                          onClick={() => editingItem
                            ? setEditingItem({...editingItem, data: {...editingItem.data, color: c}})
                            : setNewCategory({...newCategory, color: c})}
                        />
                      ))}
                    </div>
                    <label>Іконка</label>
                    <div className="icon-grid">
                      {Object.keys(iconMap).map(icon => {
                        const Icon = iconMap[icon];
                        return (
                          <div
                            key={icon}
                            className={`icon-box glass ${(editingItem ? editingItem.data.icon : newCategory.icon) === icon ? 'active' : ''}`}
                            onClick={() => editingItem
                              ? setEditingItem({...editingItem, data: {...editingItem.data, icon: icon}})
                              : setNewCategory({...newCategory, icon: icon})}
                          >
                            <Icon size={20} color={(editingItem ? editingItem.data.icon : newCategory.icon) === icon ? '#000' : (editingItem ? editingItem.data.color : newCategory.color)} />
                          </div>
                        );
                      })}
                    </div>
                    {editingItem ? (
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="glass submit-btn" style={{ flex: 1 }} onClick={handleUpdateCategory}>
                          <Save size={18} style={{ marginRight: 8 }} /> Зберегти
                        </button>
                        <button className="glass submit-btn" style={{ flex: 1, background: 'rgba(255,255,255,0.1) !important' }} onClick={() => setEditingItem(null)}>
                          Скасувати
                        </button>
                      </div>
                    ) : (
                      <button className="glass submit-btn" onClick={handleAddCategory}>Створити категорію</button>
                    )}
                  </div>
                </div>

                <div className="editor-list">
                  <h4>Усі категорії ({categories.length}):</h4>
                  <div className="list-container">
                    {categories.map(c => (
                      <div key={c.id} className={`editor-list-item glass ${editingItem?.id === c.id ? 'active-edit' : ''}`}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: c.color }} />
                          <span>{c.name}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => startEditing('category', c)} title="Редагувати" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDeleteCategoryConfirm(c.id)} title="Видалити">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <ConfirmationModal 
          isOpen={confirmModal.isOpen}
          title={confirmModal.title}
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        />
      </div>
    </motion.div>
  );
});

AdminPanel.displayName = 'AdminPanel';

export default AdminPanel;
