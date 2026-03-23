import { useState, useCallback, useMemo, useEffect } from 'react';

export function useGameLogic(questions) {
  const [selectedCategory, setSelectedCategory] = useState(() => localStorage.getItem('team_game_selectedCategory'));
  const [flippedCards, setFlippedCards] = useState(() => {
    const saved = localStorage.getItem('team_game_flippedCards');
    return saved ? JSON.parse(saved) : [];
  });
  const [expandedCard, setExpandedCard] = useState(null);
  const [activeModifiers, setActiveModifiers] = useState(() => {
    const saved = localStorage.getItem('team_game_modifiers');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (selectedCategory) {
      localStorage.setItem('team_game_selectedCategory', selectedCategory);
    }
    else {
      localStorage.removeItem('team_game_selectedCategory');
    }
    
    localStorage.setItem('team_game_flippedCards', JSON.stringify(flippedCards));
    localStorage.setItem('team_game_modifiers', JSON.stringify(activeModifiers));
  }, [selectedCategory, flippedCards, activeModifiers]);

  const gameQuestions = useMemo(() => {
    if (!selectedCategory) return [];
    
    if (selectedCategory === 'random') {
      const shuffled = [...questions].sort(() => Math.random() - 0.5);
      return shuffled[0] ? [shuffled[0]] : [];
    }
    
    return questions
      .filter(q => q.category === selectedCategory)
      .sort(() => Math.random() - 0.5);
  }, [selectedCategory, questions]);

  const allFlipped = useMemo(() => {
    if (!selectedCategory || gameQuestions.length === 0) return false;
    
    // Create a set of IDs for all questions in the current category
    const categoryQuestionIds = new Set(gameQuestions.map(q => String(q.id)));
    // Count how many of those IDs are actually flipped
    const flippedInCategoryCount = flippedCards.filter(fid => 
      categoryQuestionIds.has(String(fid))
    ).length;
    
    // We are finished if we've flipped all questions currently in the game pool
    return flippedInCategoryCount >= gameQuestions.length;
  }, [flippedCards, gameQuestions, selectedCategory]);

  const handleCategorySelect = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
    setExpandedCard(null);
  }, []);

  const handleCloseExpanded = useCallback(() => {
    setExpandedCard(null);
  }, []);

  const handleFlip = useCallback((id, question) => {
    setFlippedCards(prev => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
    if (question) {
      setExpandedCard(question);
      
      // If the question is from 'change' category, add to active modifiers
      if (question.category === 'change') {
        setActiveModifiers(prev => {
          if (prev.find(m => m.text === question.text)) return prev;
          
          let durationMs = null;
          // Пряма перевірка на популярні часові інтервали
          if (question.text.includes('5 хвилин')) durationMs = 5 * 60 * 1000;
          else if (question.text.includes('1 хвилину')) durationMs = 1 * 60 * 1000;
          else if (question.text.includes('30 секунд')) durationMs = 30 * 1000;

          return [...prev, {
            id: Date.now(),
            text: question.text,
            expiresAt: durationMs ? Date.now() + durationMs : null
          }];
        });
      }
    }
  }, []);

  const handleReset = useCallback(() => {
    setFlippedCards([]);
    setActiveModifiers([]);
    localStorage.removeItem('team_game_flippedCards');
    localStorage.removeItem('team_game_modifiers');
  }, []);

  const progress = useMemo(() => {
    if (gameQuestions.length === 0) return 0;
    return (flippedCards.length / gameQuestions.length) * 100;
  }, [flippedCards.length, gameQuestions.length]);

  const isCardFlipped = useCallback((id) => {
    return flippedCards.includes(id);
  }, [flippedCards]);

  return {
    selectedCategory,
    flippedCards,
    expandedCard,
    gameQuestions,
    handleFlip,
    handleCloseExpanded,
    handleReset,
    handleCategorySelect,
    handleRandomCard: () => handleCategorySelect('random'),
    progress,
    allFlipped,
    activeModifiers,
    isCardFlipped,
    clearModifiers: () => setActiveModifiers([]),
    removeModifier: (id) => setActiveModifiers(prev => prev.filter(m => m.id !== id))
  };
}
