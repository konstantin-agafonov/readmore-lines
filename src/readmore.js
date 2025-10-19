/**
 * @fileoverview ReadMore.js - A utility library for creating "read more/read less" functionality
 * that truncates long text content and provides expandable sections.
 * 
 * @author [Konstantin Agafonov]
 * @version 1.0.0
 * @since 2025
 */

// Global cache to track added CSS styles
const CSS_CACHE = new Set();

// Global cache to store computed line heights for elements
const LINE_HEIGHT_CACHE = new WeakMap();

/**
 * Clears the CSS cache and removes all readmore styles from the document.
 * This function can be used to reset the library state.
 * 
 * @returns {void}
 */
function clearReadMoreCache() {
    // Remove all readmore style elements from the document
    const readmoreStyles = document.head.querySelectorAll('[data-readmore-cache]');
    readmoreStyles.forEach(style => style.remove());
    
    // Clear the CSS cache
    CSS_CACHE.clear();
    
    // Note: Line height cache uses WeakMap which is automatically garbage collected
    // when elements are removed from the DOM, so no manual clearing is needed
}

/**
 * Checks if CSS styles for a specific configuration are already cached.
 * 
 * @param {string} cacheKey - The cache key to check
 * @returns {boolean} True if styles are cached, false otherwise
 */
function isStyleCached(cacheKey) {
    return CSS_CACHE.has(cacheKey);
}

/**
 * Checks if line height is cached for a specific element.
 * 
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} True if line height is cached, false otherwise
 */
function isLineHeightCached(element) {
    return LINE_HEIGHT_CACHE.has(element);
}

/**
 * Invalidates the line height cache for an element.
 * This should be called when an element's styles change and line height needs recalculation.
 * 
 * @param {HTMLElement} element - The element to invalidate cache for
 * @returns {void}
 */
function invalidateLineHeightCache(element) {
    if (element) {
        LINE_HEIGHT_CACHE.delete(element);
    }
}

/**
 * Utility function to add CSS styles to the document head with caching.
 * This function creates a new style element and appends it to the document head,
 * but only if the styles haven't been added before.
 * 
 * @param {string} styleString - The CSS string to be added to the document
 * @param {string} cacheKey - Unique identifier for the CSS to prevent duplicates
 * @returns {void}
 */
function addStyle(styleString, cacheKey) {
    // Check if styles with this cache key already exist in our global cache
    if (CSS_CACHE.has(cacheKey)) {
        return; // Styles already added, skip
    }
    
    // Check if styles with this cache key already exist in the DOM
    const existingStyle = document.head.querySelector(`[data-readmore-cache="${cacheKey}"]`);
    if (existingStyle) {
        CSS_CACHE.add(cacheKey); // Add to cache for future reference
        return; // Styles already added, skip
    }
    
    const style = document.createElement('style');
    style.textContent = styleString;
    style.setAttribute('data-readmore-cache', cacheKey);
    document.head.append(style);
    
    // Add to cache to prevent future duplicates
    CSS_CACHE.add(cacheKey);
}

/**
 * Gets the computed line height of an element in pixels with caching.
 * This function caches the computed line height to avoid repeated calculations.
 * 
 * @param {HTMLElement} element - The DOM element to get the line height from
 * @returns {number} The line height in pixels, or NaN if unable to determine
 */
function getLineHeight(element) {
    // Check if line height is already cached for this element
    if (LINE_HEIGHT_CACHE.has(element)) {
        return LINE_HEIGHT_CACHE.get(element);
    }
    
    // Calculate line height and cache it
    const lineHeight = parseInt(window.getComputedStyle(element).lineHeight, 10);
    LINE_HEIGHT_CACHE.set(element, lineHeight);
    
    return lineHeight;
}

/**
 * Calculates the number of lines of text in an element.
 * This is used to determine if the content exceeds the specified line limit.
 * 
 * @param {HTMLElement} element - The DOM element to count lines in
 * @returns {number} The number of lines, or NaN if unable to calculate
 */
function countLines(element) {
    // Validate input
    if (!element || !(element instanceof HTMLElement)) {
        return NaN;
    }
    
    const divHeight = element.offsetHeight
    const lineHeight = getLineHeight(element)
    
    // Return NaN if either height or line height cannot be determined
    if (isNaN(lineHeight) || isNaN(divHeight) || lineHeight <= 0 || divHeight <= 0) {
        return NaN
    }
    
    return Math.round(divHeight / lineHeight)
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
 * @param {Object} options - Configuration object for the readmore functionality
 * @param {HTMLElement} options.targetElement - The DOM element to apply readmore functionality to (required, must have a parent node)
 * @param {string} [options.readMoreLabel='Read more...'] - Text for the "read more" link (must be a string if provided)
 * @param {string} [options.readLessLabel='Read less'] - Text for the "read less" link (must be a string if provided)
 * @param {string} [options.targetClass='read-more-target'] - CSS class to apply to the target element (must be a string if provided)
 * @param {string} [options.linkClass='read-more-link'] - CSS class to apply to the toggle link (must be a string if provided)
 * @param {number} [options.linesLimit=8] - Maximum number of lines to show before truncating (must be a positive integer if provided)
 * @returns {void} Returns early with error logging if validation fails
 * @throws {Error} Logs errors to console for invalid inputs
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
function readmore({targetElement, readMoreLabel, readLessLabel, targetClass, linkClass, linesLimit}) {
    // Input validation for targetElement
    if (!targetElement) {
        console.error('ReadMore: targetElement is required and cannot be null or undefined');
        return;
    }
    
    if (!(targetElement instanceof HTMLElement)) {
        console.error('ReadMore: targetElement must be a valid HTMLElement');
        return;
    }
    
    if (!targetElement.parentNode) {
        console.error('ReadMore: targetElement must have a parent node to insert the toggle link');
        return;
    }
    
    // Validate linesLimit if provided
    if (linesLimit !== undefined && (typeof linesLimit !== 'number' || linesLimit < 1 || !Number.isInteger(linesLimit))) {
        console.error('ReadMore: linesLimit must be a positive integer');
        return;
    }
    
    // Validate string parameters
    if (readMoreLabel !== undefined && typeof readMoreLabel !== 'string') {
        console.error('ReadMore: readMoreLabel must be a string');
        return;
    }
    
    if (readLessLabel !== undefined && typeof readLessLabel !== 'string') {
        console.error('ReadMore: readLessLabel must be a string');
        return;
    }
    
    if (targetClass !== undefined && typeof targetClass !== 'string') {
        console.error('ReadMore: targetClass must be a string');
        return;
    }
    
    if (linkClass !== undefined && typeof linkClass !== 'string') {
        console.error('ReadMore: linkClass must be a string');
        return;
    }
    
    // Set default values for configuration options
    const LINES_LIMIT = linesLimit || 8
    const READ_MORE_LINK_CLASS = linkClass || 'read-more-link'
    const READ_MORE_TARGET_CLASS = targetClass || 'read-more-target'
    const READ_MORE_LABEL = readMoreLabel || 'Read more...'
    const READ_LESS_LABEL = readLessLabel || 'Read less'

    // Early return if content doesn't exceed the line limit
    if (countLines(targetElement) < LINES_LIMIT) {
        return
    }

    // Prevent duplicate initialization
    if (targetElement.classList.contains(READ_MORE_TARGET_CLASS) || targetElement.dataset.readmeEnabled === '1') {
        return
    }

    // Add CSS styles for text truncation using webkit-line-clamp with caching
    // Create a unique cache key based on target class and line limit
    const cssCacheKey = `readmore-styles-${READ_MORE_TARGET_CLASS}-${LINES_LIMIT}`;
    addStyle(`
        .${READ_MORE_TARGET_CLASS} {
            display: -webkit-box;
            overflow : hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: ${LINES_LIMIT};
            -webkit-box-orient: vertical;
        }
    `, cssCacheKey);

    // Create the toggle link element
    const readMoreLink = document.createElement('a')
    readMoreLink.href = '#'
    readMoreLink.innerText = READ_MORE_LABEL
    readMoreLink.classList.add(READ_MORE_LINK_CLASS)

    // Insert the link after the target element with error handling
    try {
        targetElement.parentNode.insertBefore(readMoreLink, targetElement.nextSibling)
    } catch (error) {
        console.error('ReadMore: Failed to insert toggle link', error);
        return;
    }

    // Apply the truncation class to the target element
    targetElement.classList.add(READ_MORE_TARGET_CLASS);
    
    // Add click event listener for toggle functionality
    readMoreLink.addEventListener('click', function (event) {
        event.preventDefault()
        
        // Toggle the truncation class
        targetElement.classList.toggle(READ_MORE_TARGET_CLASS);
        
        // Update link text based on current state
        if (targetElement.classList.contains(READ_MORE_TARGET_CLASS)){
            readMoreLink.innerText = READ_MORE_LABEL;
        } else {
            readMoreLink.innerText = READ_LESS_LABEL;
        }
    }.bind(this))

    // Mark element as having readmore functionality enabled
    targetElement.dataset.readmeEnabled = '1'
}
