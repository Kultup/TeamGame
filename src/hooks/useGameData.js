import { useState, useEffect, useCallback, useMemo } from 'react';
import { useApi } from './useApi';

export function useGameData() {
  const { error, request, clearError } = useApi();
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      clearError();
      const [catRes, questRes] = await Promise.all([
        request('/api/categories'),
        request('/api/questions')
      ]);
      setCategories(catRes || []);
      setQuestions(questRes || []);
    } catch (err) {
      // Error already set by useApi
    } finally {
      setLoading(false);
    }
  }, [request, clearError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const questionCounts = useMemo(() => {
    const counts = {};
    questions.forEach(q => {
      counts[q.category] = (counts[q.category] || 0) + 1;
    });
    return counts;
  }, [questions]);

  const addCategory = useCallback(async (category) => {
    const result = await request('/api/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
    if (result) {
      await fetchData();
    }
    return result;
  }, [request, fetchData]);

  const updateCategory = useCallback(async (id, category) => {
    const result = await request(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
    if (result) {
      await fetchData();
    }
    return result;
  }, [request, fetchData]);

  const deleteCategory = useCallback(async (id) => {
    const result = await request(`/api/categories/${id}`, {
      method: 'DELETE',
    });
    if (result) {
      await fetchData();
    }
    return result;
  }, [request, fetchData]);

  const addQuestion = useCallback(async (question) => {
    const result = await request('/api/questions', {
      method: 'POST',
      body: JSON.stringify(question),
    });
    if (result) {
      await fetchData();
    }
    return result;
  }, [request, fetchData]);

  const updateQuestion = useCallback(async (id, question) => {
    const result = await request(`/api/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(question),
    });
    if (result) {
      await fetchData();
    }
    return result;
  }, [request, fetchData]);

  const deleteQuestion = useCallback(async (id) => {
    const result = await request(`/api/questions/${id}`, {
      method: 'DELETE',
    });
    if (result) {
      await fetchData();
    }
    return result;
  }, [request, fetchData]);

  return {
    loading,
    error,
    categories,
    questions,
    questionCounts,
    addCategory,
    updateCategory,
    deleteCategory,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    refetch: fetchData,
  };
}
