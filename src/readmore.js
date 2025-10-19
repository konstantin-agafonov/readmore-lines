/**
 * @fileoverview ReadMore.js - A utility library for creating "read more/read less" functionality
 * that truncates long text content and provides expandable sections.
 * 
 * @author [Konstantin Agafonov]
 * @version 1.0.0
 * @since 2025
 */

/**
 * Utility function to add CSS styles to the document head.
 * This function creates a new style element and appends it to the document head.
 * 
 * @param {string} styleString - The CSS string to be added to the document
 * @returns {void}
 */
function addStyle(styleString) {
    const style = document.createElement('style')
    style.textContent = styleString
    document.head.append(style)
}

/**
 * Gets the computed line height of an element in pixels.
 * 
 * @param {HTMLElement} element - The DOM element to get the line height from
 * @returns {number} The line height in pixels, or NaN if unable to determine
 */
function getLineHeight(element) {
    return parseInt(window.getComputedStyle(element).lineHeight, 10)
}

/**
 * Calculates the number of lines of text in an element.
 * This is used to determine if the content exceeds the specified line limit.
 * 
 * @param {HTMLElement} element - The DOM element to count lines in
 * @returns {number} The number of lines, or NaN if unable to calculate
 */
function countLines(element) {
    const divHeight = element.offsetHeight
    const lineHeight = getLineHeight(element)
    // Return NaN if either height or line height cannot be determined
    if (isNaN(lineHeight) || isNaN(divHeight)) {
        return NaN
    }
    return divHeight / lineHeight
}

/**
 * Main function that implements the "read more/read less" functionality.
 * This function truncates long text content and adds a toggle link to expand/collapse the content.
 * 
 * @param {Object} options - Configuration object for the readmore functionality
 * @param {HTMLElement} options.targetElement - The DOM element to apply readmore functionality to
 * @param {string} [options.readMoreLabel='Read more...'] - Text for the "read more" link
 * @param {string} [options.readLessLabel='Read less'] - Text for the "read less" link
 * @param {string} [options.targetClass='read-more-target'] - CSS class to apply to the target element
 * @param {string} [options.linkClass='read-more-link'] - CSS class to apply to the toggle link
 * @param {number} [options.linesLimit=8] - Maximum number of lines to show before truncating
 * @returns {void}
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

    // Add CSS styles for text truncation using webkit-line-clamp
    addStyle(`
        .${READ_MORE_TARGET_CLASS} {
            display: -webkit-box;
            overflow : hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: ${LINES_LIMIT};
            -webkit-box-orient: vertical;
        }
    `);

    // Create the toggle link element
    const readMoreLink = document.createElement('a')
    readMoreLink.href = '#'
    readMoreLink.innerText = READ_MORE_LABEL
    readMoreLink.classList.add(READ_MORE_LINK_CLASS)

    // Insert the link after the target element
    targetElement.parentNode.insertBefore(readMoreLink, targetElement.nextSibling)

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
