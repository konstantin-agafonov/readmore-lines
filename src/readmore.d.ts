/**
 * Configuration options for the readmore functionality
 */
export interface ReadMoreOptions {
  /** The DOM element to apply readmore functionality to (required, must have a parent node) */
  targetElement: HTMLElement;
  /** Text for the "read more" link (must be a string if provided) */
  readMoreLabel?: string;
  /** Text for the "read less" link (must be a string if provided) */
  readLessLabel?: string;
  /** CSS class to apply to the target element (must be a string if provided) */
  targetClass?: string;
  /** CSS class to apply to the toggle link (must be a string if provided) */
  linkClass?: string;
  /** Maximum number of lines to show before truncating (must be a positive integer if provided) */
  linesLimit?: number;
}

/**
 * Main function that implements the "read more/read less" functionality.
 * This function truncates long text content and adds a toggle link to expand/collapse the content.
 * 
 * Performance optimizations:
 * - CSS styles are cached to prevent duplicate additions
 * - Line height calculations are cached per element
 * - Uses WeakMap for automatic garbage collection of cached values
 * 
 * @param options - Configuration object for the readmore functionality
 * @returns void Returns early with error logging if validation fails
 * @throws Error Logs errors to console for invalid inputs
 * 
 * @example
 * // Basic usage
 * readmore({
 *     targetElement: document.getElementById('my-text'),
 *     linesLimit: 5
 * });
 * 
 * @example
 * // Custom configuration
 * readmore({
 *     targetElement: document.querySelector('.content'),
 *     readMoreLabel: 'Show more...',
 *     readLessLabel: 'Show less',
 *     linesLimit: 3
 * });
 */
export function readmore(options: ReadMoreOptions): void;

// Default export
export default readmore;
