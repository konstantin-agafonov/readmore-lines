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
 * Destroys a readmore instance and cleans up all associated resources.
 * 
 * @param targetElement - The target element that had readmore functionality
 * @returns True if instance was found and destroyed, false otherwise
 */
export function destroyReadMore(targetElement: HTMLElement): boolean;

/**
 * Checks if an element has an active readmore instance.
 * 
 * @param targetElement - The element to check
 * @returns True if element has an active readmore instance
 */
export function hasReadMoreInstance(targetElement: HTMLElement): boolean;

/**
 * Gets the readmore instance for an element.
 * 
 * @param targetElement - The element to get instance for
 * @returns The instance or null if not found
 */
export function getReadMoreInstance(targetElement: HTMLElement): ReadMoreInstance | null;

/**
 * ReadMore instance class for managing individual readmore functionality
 */
export class ReadMoreInstance {
  constructor(targetElement: HTMLElement, button: HTMLButtonElement, config: any);
  addEventListener(type: string, listener: EventListener): void;
  removeAllEventListeners(): void;
  destroy(): void;
  readonly targetElement: HTMLElement;
  readonly button: HTMLButtonElement;
  readonly config: any;
  readonly isDestroyed: boolean;
}

// Default export
export default readmore;
