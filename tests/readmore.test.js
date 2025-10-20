/**
 * @jest-environment jsdom
 */

import readmore, { destroyReadMore, hasReadMoreInstance, getReadMoreInstance } from '../src/readmore.js';

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
            expect(targetElement.dataset.readmoreLinesEnabled).toBe('1');
        });

        test('should create toggle button with accessibility attributes', () => {
            readmore({ targetElement });
            
            const button = targetElement.nextElementSibling;
            expect(button).toBeTruthy();
            expect(button.tagName).toBe('BUTTON');
            expect(button.type).toBe('button');
            expect(button.classList.contains('read-more-link')).toBe(true);
            expect(button.innerText).toBe('Read more...');
            expect(button.getAttribute('aria-expanded')).toBe('false');
            expect(button.getAttribute('role')).toBe('button');
            expect(button.getAttribute('aria-controls')).toBe(targetElement.id);
        });

        test('should use custom labels', () => {
            readmore({
                targetElement,
                readMoreLabel: 'Show more',
                readLessLabel: 'Show less'
            });
            
            const button = targetElement.nextElementSibling;
            expect(button.innerText).toBe('Show more');
        });

        test('should use custom CSS classes', () => {
            readmore({
                targetElement,
                targetClass: 'custom-target',
                linkClass: 'custom-link'
            });
            
            expect(targetElement.classList.contains('custom-target')).toBe(true);
            
            const button = targetElement.nextElementSibling;
            expect(button.classList.contains('custom-link')).toBe(true);
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
            
            const button = targetElement.nextElementSibling;
            
            // Initial state should be truncated (read more)
            expect(targetElement.classList.contains('read-more-target')).toBe(true);
            expect(button.innerText).toBe('Show more');
            
            // Click to expand
            button.click();
            
            // Should be expanded (read less)
            expect(targetElement.classList.contains('read-more-target')).toBe(false);
            expect(button.innerText).toBe('Show less');
            
            // Click to collapse
            button.click();
            
            // Should be truncated again (read more)
            expect(targetElement.classList.contains('read-more-target')).toBe(true);
            expect(button.innerText).toBe('Show more');
        });

        test('should prevent default button behavior', () => {
            readmore({ targetElement });
            
            const button = targetElement.nextElementSibling;
            const clickEvent = new MouseEvent('click', { bubbles: true });
            const preventDefaultSpy = jest.spyOn(clickEvent, 'preventDefault');
            
            button.dispatchEvent(clickEvent);
            
            expect(preventDefaultSpy).toHaveBeenCalled();
        });

        test('should support keyboard navigation with Enter key', () => {
            readmore({ targetElement });
            
            const button = targetElement.nextElementSibling;
            
            // Initial state
            expect(button.getAttribute('aria-expanded')).toBe('false');
            expect(targetElement.classList.contains('read-more-target')).toBe(true);
            
            // Simulate Enter key press
            const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
            const preventDefaultSpy = jest.spyOn(enterEvent, 'preventDefault');
            
            button.dispatchEvent(enterEvent);
            
            expect(preventDefaultSpy).toHaveBeenCalled();
            expect(button.getAttribute('aria-expanded')).toBe('true');
            expect(targetElement.classList.contains('read-more-target')).toBe(false);
        });

        test('should support keyboard navigation with Space key', () => {
            readmore({ targetElement });
            
            const button = targetElement.nextElementSibling;
            
            // Initial state
            expect(button.getAttribute('aria-expanded')).toBe('false');
            
            // Simulate Space key press
            const spaceEvent = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
            const preventDefaultSpy = jest.spyOn(spaceEvent, 'preventDefault');
            
            button.dispatchEvent(spaceEvent);
            
            expect(preventDefaultSpy).toHaveBeenCalled();
            expect(button.getAttribute('aria-expanded')).toBe('true');
        });

        test('should update aria-expanded attribute on toggle', () => {
            readmore({ targetElement });
            
            const button = targetElement.nextElementSibling;
            
            // Initial state
            expect(button.getAttribute('aria-expanded')).toBe('false');
            
            // Click to expand
            button.click();
            expect(button.getAttribute('aria-expanded')).toBe('true');
            
            // Click to collapse
            button.click();
            expect(button.getAttribute('aria-expanded')).toBe('false');
        });

        test('should assign unique ID to target element if not present', () => {
            // Remove any existing ID
            targetElement.removeAttribute('id');
            
            readmore({ targetElement });
            
            const button = targetElement.nextElementSibling;
            const targetId = targetElement.id;
            const ariaControls = button.getAttribute('aria-controls');
            
            expect(targetId).toBeTruthy();
            expect(ariaControls).toBe(targetId);
        });
    });

    describe('Prevention of duplicate initialization', () => {
        test('should not initialize twice on same element', () => {
            readmore({ targetElement });
            const initialButton = targetElement.nextElementSibling;
            
            // Try to initialize again
            readmore({ targetElement });
            
            // Should still have only one button
            expect(targetElement.nextElementSibling).toBe(initialButton);
        });
    });

    describe('Cleanup and instance management', () => {
        test('should track readmore instances', () => {
            readmore({ targetElement });
            
            expect(hasReadMoreInstance(targetElement)).toBe(true);
            expect(getReadMoreInstance(targetElement)).toBeTruthy();
        });

        test('should destroy readmore instance and clean up resources', () => {
            readmore({ targetElement });
            
            const button = targetElement.nextElementSibling;
            const instance = getReadMoreInstance(targetElement);
            
            expect(hasReadMoreInstance(targetElement)).toBe(true);
            expect(targetElement.classList.contains('read-more-target')).toBe(true);
            expect(targetElement.dataset.readmoreLinesEnabled).toBe('1');
            
            // Destroy the instance
            const destroyed = destroyReadMore(targetElement);
            
            expect(destroyed).toBe(true);
            expect(hasReadMoreInstance(targetElement)).toBe(false);
            expect(getReadMoreInstance(targetElement)).toBe(null);
            expect(targetElement.classList.contains('read-more-target')).toBe(false);
            expect(targetElement.dataset.readmoreLinesEnabled).toBeUndefined();
            expect(button.parentNode).toBeNull(); // Button should be removed from DOM
        });

        test('should handle destroying non-existent instance', () => {
            const destroyed = destroyReadMore(targetElement);
            expect(destroyed).toBe(false);
        });

        test('should prevent duplicate initialization after destruction', () => {
            readmore({ targetElement });
            destroyReadMore(targetElement);
            
            // Should be able to initialize again
            readmore({ targetElement });
            expect(hasReadMoreInstance(targetElement)).toBe(true);
        });

        test('should clean up event listeners on destroy', () => {
            readmore({ targetElement });
            const instance = getReadMoreInstance(targetElement);
            
            // Mock the removeEventListener method
            const removeEventListenerSpy = jest.spyOn(instance.button, 'removeEventListener');
            
            destroyReadMore(targetElement);
            
            // Should have called removeEventListener for each event type
            expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
            expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
            
            removeEventListenerSpy.mockRestore();
        });

        test('should handle destroying with invalid element', () => {
            const consoleSpy = jest.spyOn(console, 'error');
            
            destroyReadMore(null);
            expect(consoleSpy).toHaveBeenCalledWith('ReadMore: destroyReadMore requires a valid HTMLElement');
            
            destroyReadMore('invalid');
            expect(consoleSpy).toHaveBeenCalledWith('ReadMore: destroyReadMore requires a valid HTMLElement');
            
            consoleSpy.mockRestore();
        });
    });
});