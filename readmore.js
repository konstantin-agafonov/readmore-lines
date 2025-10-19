/**
 * Utility function to add CSS in multiple passes.
 * @param {string} styleString
 */
function addStyle(styleString) {
    const style = document.createElement('style')
    style.textContent = styleString
    document.head.append(style)
}

function getLineHeight(element) {
    return parseInt(window.getComputedStyle(element).lineHeight, 10)
}

function countLines(element) {
    const divHeight = element.offsetHeight
    const lineHeight = getLineHeight(element)
    if (isNaN(lineHeight) || isNaN(divHeight)) {
        return NaN
    }
    return divHeight / lineHeight
}

function readmore({targetElement, readMoreLabel, readLessLabel, targetClass, linkClass, linesLimit}) {
    const LINES_LIMIT = linesLimit || 8
    const READ_MORE_LINK_CLASS = linkClass || 'read-more-link'
    const READ_MORE_TARGET_CLASS = targetClass || 'read-more-target'
    const READ_MORE_LABEL = readMoreLabel || 'Read more...'
    const READ_LESS_LABEL = readLessLabel || 'Read less'

    if (countLines(targetElement) < LINES_LIMIT) {
        return
    }

    if (targetElement.classList.contains(READ_MORE_TARGET_CLASS) || targetElement.dataset.readmeEnabled === '1') {
        return
    }

    addStyle(`
        .${READ_MORE_TARGET_CLASS} {
            display: -webkit-box;
            overflow : hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: ${LINES_LIMIT};
            -webkit-box-orient: vertical;
        }
    `);

    const readMoreLink = document.createElement('a')
    readMoreLink.href = '#'
    readMoreLink.innerText = READ_MORE_LABEL
    readMoreLink.classList.add(READ_MORE_LINK_CLASS)

    targetElement.parentNode.insertBefore(readMoreLink, targetElement.nextSibling)

    targetElement.classList.add(READ_MORE_TARGET_CLASS);
    readMoreLink.addEventListener('click', function (event) {
        event.preventDefault()
        targetElement.classList.toggle(READ_MORE_TARGET_CLASS);
        if (targetElement.classList.contains(READ_MORE_TARGET_CLASS)){
            readMoreLink.innerText = READ_MORE_LABEL;
        } else {
            readMoreLink.innerText = READ_LESS_LABEL;
        }
    }.bind(this))

    targetElement.dataset.readmeEnabled = '1'
}
