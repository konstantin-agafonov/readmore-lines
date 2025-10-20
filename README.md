# ReadMore.js

A lightweight, high-performance JavaScript library for creating "read more/read less" functionality with text truncation. Features automatic caching, smooth animations, and comprehensive browser support.

## Features

- 🚀 **High Performance**: Cached line height calculations and CSS styles
- 🧠 **Smart Caching**: Automatic memory management with WeakMap
- 📱 **Responsive**: Works with any text content and container size
- ♿ **Accessible**: ARIA attributes, keyboard navigation, and semantic HTML
- 🎨 **Customizable**: Flexible styling and configuration options
- 📦 **Lightweight**: No external dependencies, ~3KB minified

## Installation

### npm
```bash
npm install readmore-lines
```

### yarn
```bash
yarn add readmore-lines
```

### CDN
```html
<!-- Development version (unminified) -->
<script src="https://unpkg.com/readmore-lines@latest/dist/readmore.js"></script>

<!-- Production version (minified) -->
<script src="https://unpkg.com/readmore-lines@latest/dist/readmore.min.js"></script>
```

## Quick Start

### Basic Usage

```javascript
import readmore from 'readmore-lines';

// Simple implementation
readmore({
    targetElement: document.getElementById('my-text')
});
```

## API Reference

### `readmore(options)`

The main function that implements the read more/less functionality.

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `targetElement` | `HTMLElement` | ✅ | - | The DOM element to apply readmore functionality to |
| `readMoreLabel` | `string` | ❌ | `'Read more...'` | Text for the "read more" link |
| `readLessLabel` | `string` | ❌ | `'Read less'` | Text for the "read less" link |
| `targetClass` | `string` | ❌ | `'read-more-target'` | CSS class applied to the target element |
| `linkClass` | `string` | ❌ | `'read-more-link'` | CSS class applied to the toggle link |
| `linesLimit` | `number` | ❌ | `8` | Maximum number of lines before truncating |

#### Example

```javascript
readmore({
    targetElement: document.getElementById('article-content'),
    readMoreLabel: 'Continue reading...',
    readLessLabel: 'Show less',
    linesLimit: 5,
    targetClass: 'article-truncate',
    linkClass: 'read-more-button'
});
```

## Styling

### Default Styles

The library automatically adds CSS for text truncation:

```css
.read-more-target {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 8; /* or your specified linesLimit */
    -webkit-box-orient: vertical;
}
```

### Custom Styling

You can customize the appearance by targeting the generated classes:

```css
.read-more-target {
    /* Your custom truncation styles */
}

.read-more-link {
    color: #007bff;
    text-decoration: none;
    font-weight: bold;
}

.read-more-link:hover {
    text-decoration: underline;
}
```

## Accessibility Features

### ARIA Support
- **aria-expanded**: Automatically updates to reflect content state
- **aria-controls**: Links button to controlled content
- **role="button"**: Proper semantic role for screen readers

### Keyboard Navigation
- **Enter key**: Activates the toggle functionality
- **Space key**: Activates the toggle functionality
- **Tab navigation**: Button is focusable and follows tab order

### Semantic HTML
- Uses `<button>` element instead of `<a>` for better semantics
- Automatically assigns unique IDs for proper ARIA relationships
- Maintains focus management during interactions

## Browser Support

- Chrome 6+
- Firefox 3.6+
- Safari 5+
- Edge 12+
- IE 9+ (with polyfills for `WeakMap`)

## Build Outputs

The library provides multiple build formats for different use cases:

| File | Size | Description |
|------|------|-------------|
| `readmore.js` | ~11KB | Development version (unminified, with sourcemap) |
| `readmore.min.js` | ~2.5KB | Production version (minified, optimized) |
| `readmore.esm.js` | ~10KB | ES Module version |

### File Size Comparison
- **Unminified**: ~11KB (readable, with comments)
- **Minified**: ~2.5KB (77% size reduction)
- **Gzipped**: ~1.2KB (estimated)

## Performance

### Caching System

- **CSS Caching**: Prevents duplicate style additions
- **Line Height Caching**: Caches computed line heights per element
- **Memory Management**: Uses WeakMap for automatic garbage collection

### Optimization Features

- Efficient line height calculations
- Minimal DOM queries
- Automatic cache invalidation

## Examples

### Multiple Elements

```javascript
// Apply to multiple elements efficiently
document.querySelectorAll('.truncate').forEach(element => {
    readmore({
        targetElement: element,
        linesLimit: 3
    });
});
```

### Custom Styling

```html
<style>
.my-custom-truncate {
    background: linear-gradient(to bottom, transparent 0%, white 100%);
}

.my-custom-link {
    background: #007bff;
    color: white;
    padding: 5px 10px;
    border-radius: 3px;
    text-decoration: none;
}
</style>

<script>
readmore({
    targetElement: document.getElementById('content'),
    targetClass: 'my-custom-truncate',
    linkClass: 'my-custom-link',
    readMoreLabel: 'Read Full Article',
    readLessLabel: 'Collapse'
});
</script>
```

### Cleanup and Instance Management

```javascript
import readmore, { destroyReadMore, hasReadMoreInstance, getReadMoreInstance } from 'readmore-lines';

// Check if element has readmore functionality
if (hasReadMoreInstance(element)) {
    console.log('Element has readmore functionality');
}

// Get the instance for advanced control
const instance = getReadMoreInstance(element);
if (instance) {
    console.log('Instance configuration:', instance.config);
}

// Destroy readmore functionality and clean up resources
destroyReadMore(element);
```

### Dynamic Content Management

```javascript
// Handle dynamic content updates
function updateContent(element, newContent) {
    // Destroy existing readmore if present
    if (hasReadMoreInstance(element)) {
        destroyReadMore(element);
    }
    
    // Update content
    element.innerHTML = newContent;
    
    // Reapply readmore functionality
    readmore({
        targetElement: element,
        linesLimit: 4
    });
}
```

## Development

### Building

```bash
# Install dependencies
npm install

# Build all versions (development + production)
npm run build

# Build development version only (unminified)
npm run build:dev

# Build production version only (minified)
npm run build:prod

# Run tests
npm test

# Lint code
npm run lint
```

### Project Structure

```
readmore-lines/
├── src/
│   ├── readmore.js      # Main library file
│   └── readmore.d.ts    # TypeScript declarations
├── dist/                # Built files
│   ├── readmore.js      # Development build (unminified)
│   ├── readmore.min.js  # Production build (minified)
│   ├── readmore.esm.js  # ES Module build
│   └── *.map            # Source maps
├── tests/               # Test files
├── package.json
├── rollup.config.js
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

### v1.0.0
- Initial release
- Core readmore functionality
- CSS and line height caching
- TypeScript support
- Comprehensive documentation

## Support

If you encounter any issues or have questions, please file an issue on [GitHub](https://github.com/konstantin-agafonov/readmore-lines/issues).

---

Made with ❤️ by [Konstantin Agafonov](https://github.com/konstantin-agafonov)
