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

/**
 * Clears the CSS cache and removes all readmore styles from the document.
 * This function can be used to reset the library state.
 * 
 * @returns void
 */
export function clearReadMoreCache(): void;

/**
 * Checks if CSS styles for a specific configuration are already cached.
 * 
 * @param cacheKey - The cache key to check
 * @returns True if styles are cached, false otherwise
 */
export function isStyleCached(cacheKey: string): boolean;

/**
 * Checks if line height is cached for a specific element.
 * 
 * @param element - The element to check
 * @returns True if line height is cached, false otherwise
 */
export function isLineHeightCached(element: HTMLElement): boolean;

/**
 * Invalidates the line height cache for an element.
 * This should be called when an element's styles change and line height needs recalculation.
 * 
 * @param element - The element to invalidate cache for
 * @returns void
 */
export function invalidateLineHeightCache(element: HTMLElement): void;

// Default export
export default readmore;
