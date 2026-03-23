import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Card from '../components/Card';

const mockQuestion = { id: 1, category: 'communication', text: 'Test question' };
const mockCategory = { id: 'communication', name: 'Комунікація', color: '#3b82f6', icon: 'MessageCircle' };

describe('Card', () => {
  it('should render card with category info', () => {
    render(
      <Card
        question={mockQuestion}
        category={mockCategory}
        isFlipped={false}
        onFlip={vi.fn()}
        index={0}
      />
    );
    
    expect(screen.getByText('Комунікація')).toBeInTheDocument();
    expect(screen.getByText('#1')).toBeInTheDocument();
  });

  it('should call onFlip when clicked and not flipped', () => {
    const onFlipMock = vi.fn();

    const { container } = render(
      <Card
        question={mockQuestion}
        category={mockCategory}
        isFlipped={false}
        onFlip={onFlipMock}
        index={0}
      />
    );

    const cardContainer = container.querySelector('.card-container');
    fireEvent.click(cardContainer);
    expect(onFlipMock).toHaveBeenCalledWith(1);
  });

  it('should not call onFlip when already flipped', () => {
    const onFlipMock = vi.fn();
    
    render(
      <Card
        question={mockQuestion}
        category={mockCategory}
        isFlipped={true}
        onFlip={onFlipMock}
        index={0}
      />
    );
    
    fireEvent.click(screen.getByText('Натисніть, щоб переглянути').parentElement);
    expect(onFlipMock).not.toHaveBeenCalled();
  });

  it('should show "Натисніть, щоб переглянути" when flipped', () => {
    render(
      <Card
        question={mockQuestion}
        category={mockCategory}
        isFlipped={true}
        onFlip={vi.fn()}
        index={0}
      />
    );
    
    expect(screen.getByText('Натисніть, щоб переглянути')).toBeInTheDocument();
  });

  it('should apply correct background color from category', () => {
    const { container } = render(
      <Card
        question={mockQuestion}
        category={mockCategory}
        isFlipped={false}
        onFlip={vi.fn()}
        index={0}
      />
    );
    
    const cardFace = container.querySelector('.card-front');
    expect(cardFace).toHaveStyle('background: linear-gradient(135deg, #3b82f633, #3b82f611)');
  });
});
