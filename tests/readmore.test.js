/**
 * @jest-environment jsdom
 */

import readmore from '../src/readmore.js';

describe('ReadMore', () => {
  let container;
  let targetElement;

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <div id="container">
        <div id="target">This is a long text that should be truncated when it exceeds the specified line limit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
      </div>
    `;
    
    container = document.getElementById('container');
    targetElement = document.getElementById('target');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Basic functionality', () => {
    test('should apply readmore functionality to target element', () => {
      readmore({ targetElement });
      
      expect(targetElement.classList.contains('read-more-target')).toBe(true);
      expect(targetElement.dataset.readmeEnabled).toBe('1');
    });

    test('should create toggle link', () => {
      readmore({ targetElement });
      
      const link = targetElement.nextElementSibling;
      expect(link).toBeTruthy();
      expect(link.tagName).toBe('A');
      expect(link.classList.contains('read-more-link')).toBe(true);
      expect(link.innerText).toBe('Read more...');
    });

    test('should use custom labels', () => {
      readmore({
        targetElement,
        readMoreLabel: 'Show more',
        readLessLabel: 'Show less'
      });
      
      const link = targetElement.nextElementSibling;
      expect(link.innerText).toBe('Show more');
    });

    test('should use custom CSS classes', () => {
      readmore({
        targetElement,
        targetClass: 'custom-target',
        linkClass: 'custom-link'
      });
      
      expect(targetElement.classList.contains('custom-target')).toBe(true);
      
      const link = targetElement.nextElementSibling;
      expect(link.classList.contains('custom-link')).toBe(true);
    });
  });

  describe('Validation', () => {
    test('should return early for null targetElement', () => {
      const consoleSpy = jest.spyOn(console, 'error');
      readmore({ targetElement: null });
      
      expect(consoleSpy).toHaveBeenCalledWith('ReadMore: targetElement is required and cannot be null or undefined');
      consoleSpy.mockRestore();
    });

    test('should return early for invalid targetElement type', () => {
      const consoleSpy = jest.spyOn(console, 'error');
      readmore({ targetElement: 'invalid' });
      
      expect(consoleSpy).toHaveBeenCalledWith('ReadMore: targetElement must be a valid HTMLElement');
      consoleSpy.mockRestore();
    });

    test('should return early for element without parent', () => {
      const orphanElement = document.createElement('div');
      const consoleSpy = jest.spyOn(console, 'error');
      
      readmore({ targetElement: orphanElement });
      
      expect(consoleSpy).toHaveBeenCalledWith('ReadMore: targetElement must have a parent node to insert the toggle link');
      consoleSpy.mockRestore();
    });

    test('should validate linesLimit parameter', () => {
      const consoleSpy = jest.spyOn(console, 'error');
      
      readmore({ targetElement, linesLimit: -1 });
      expect(consoleSpy).toHaveBeenCalledWith('ReadMore: linesLimit must be a positive integer');
      
      readmore({ targetElement, linesLimit: 'invalid' });
      expect(consoleSpy).toHaveBeenCalledWith('ReadMore: linesLimit must be a positive integer');
      
      consoleSpy.mockRestore();
    });
  });

  describe('Toggle functionality', () => {
    test('should toggle between read more and read less', () => {
      readmore({
        targetElement,
        readMoreLabel: 'Show more',
        readLessLabel: 'Show less'
      });
      
      const link = targetElement.nextElementSibling;
      
      // Initial state should be truncated (read more)
      expect(targetElement.classList.contains('read-more-target')).toBe(true);
      expect(link.innerText).toBe('Show more');
      
      // Click to expand
      link.click();
      
      // Should be expanded (read less)
      expect(targetElement.classList.contains('read-more-target')).toBe(false);
      expect(link.innerText).toBe('Show less');
      
      // Click to collapse
      link.click();
      
      // Should be truncated again (read more)
      expect(targetElement.classList.contains('read-more-target')).toBe(true);
      expect(link.innerText).toBe('Show more');
    });

    test('should prevent default link behavior', () => {
      readmore({ targetElement });
      
      const link = targetElement.nextElementSibling;
      const clickEvent = new MouseEvent('click', { bubbles: true });
      const preventDefaultSpy = jest.spyOn(clickEvent, 'preventDefault');
      
      link.dispatchEvent(clickEvent);
      
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Prevention of duplicate initialization', () => {
    test('should not initialize twice on same element', () => {
      readmore({ targetElement });
      const initialLink = targetElement.nextElementSibling;
      
      // Try to initialize again
      readmore({ targetElement });
      
      // Should still have only one link
      expect(targetElement.nextElementSibling).toBe(initialLink);
    });
  });
});
