import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameLogic } from '../hooks/useGameLogic';

const mockQuestions = [
  { id: 1, category: 'communication', text: 'Question 1' },
  { id: 2, category: 'communication', text: 'Question 2' },
  { id: 3, category: 'scaling', text: 'Question 3' },
];

describe('useGameLogic', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useGameLogic([]));
    
    expect(result.current.selectedCategory).toBe(null);
    expect(result.current.flippedCards).toEqual([]);
    expect(result.current.expandedCard).toBe(null);
    expect(result.current.gameQuestions).toEqual([]);
  });

  it('should filter questions by category', () => {
    const { result } = renderHook(() => useGameLogic(mockQuestions));
    
    act(() => {
      result.current.handleCategorySelect('communication');
    });
    
    expect(result.current.selectedCategory).toBe('communication');
    expect(result.current.gameQuestions.length).toBe(2);
    expect(result.current.gameQuestions.every(q => q.category === 'communication')).toBe(true);
  });

  it('should handle random category selection', () => {
    const { result } = renderHook(() => useGameLogic(mockQuestions));
    
    act(() => {
      result.current.handleRandomCard();
    });
    
    expect(result.current.selectedCategory).toBe('random');
    expect(result.current.gameQuestions.length).toBe(1);
  });

  it('should handle card flip', () => {
    const { result } = renderHook(() => useGameLogic(mockQuestions));
    
    act(() => {
      result.current.handleCategorySelect('communication');
    });
    
    const questionId = result.current.gameQuestions[0]?.id;
    
    act(() => {
      result.current.handleFlip(questionId, result.current.gameQuestions[0]);
    });
    
    expect(result.current.flippedCards).toContain(questionId);
    expect(result.current.expandedCard).toBe(result.current.gameQuestions[0]);
  });

  it('should close expanded card and reset state', () => {
    const { result } = renderHook(() => useGameLogic(mockQuestions));
    
    act(() => {
      result.current.handleCategorySelect('communication');
      result.current.handleFlip(1, mockQuestions[0]);
    });
    
    expect(result.current.expandedCard).toBeTruthy();
    
    act(() => {
      result.current.handleCloseExpanded();
    });
    
    expect(result.current.expandedCard).toBe(null);
    expect(result.current.selectedCategory).toBe(null);
    expect(result.current.flippedCards).toEqual([]);
  });

  it('should calculate progress correctly', () => {
    const { result } = renderHook(() => useGameLogic(mockQuestions));
    
    act(() => {
      result.current.handleCategorySelect('communication');
    });
    
    expect(result.current.progress).toBe(0);
    
    const questionId = result.current.gameQuestions[0]?.id;
    act(() => {
      result.current.handleFlip(questionId);
    });
    
    expect(result.current.progress).toBe(50); // 1 out of 2
  });

  it('should detect when all cards are flipped', () => {
    const { result } = renderHook(() => useGameLogic(mockQuestions));
    
    act(() => {
      result.current.handleCategorySelect('communication');
    });
    
    expect(result.current.allFlipped).toBe(false);
    
    act(() => {
      result.current.gameQuestions.forEach(q => {
        result.current.handleFlip(q.id);
      });
    });
    
    expect(result.current.allFlipped).toBe(true);
  });

  it('should reset flipped cards', () => {
    const { result } = renderHook(() => useGameLogic(mockQuestions));
    
    act(() => {
      result.current.handleCategorySelect('communication');
      result.current.handleFlip(1);
      result.current.handleFlip(2);
    });
    
    expect(result.current.flippedCards.length).toBe(2);
    
    act(() => {
      result.current.handleReset();
    });
    
    expect(result.current.flippedCards).toEqual([]);
  });
});
