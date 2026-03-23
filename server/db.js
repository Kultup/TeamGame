// Mock SQLite driver to avoid native dependency issues
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initial data from the original file
import { initialCategories, allQuestions } from './data.js';

const initialQuestions = allQuestions.map((q, index) => ({
  id: index + 1,
  ...q
}));

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
