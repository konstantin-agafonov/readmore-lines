# ReadMore.js

A lightweight, high-performance JavaScript library for creating "read more/read less" functionality with text truncation. Features automatic caching, smooth animations, and comprehensive browser support.

## Features

- 🚀 **High Performance**: Cached line height calculations and CSS styles
- 🎯 **Smooth Animations**: Uses `requestAnimationFrame` for optimal DOM updates
- 🧠 **Smart Caching**: Automatic memory management with WeakMap
- 📱 **Responsive**: Works with any text content and container size
- ♿ **Accessible**: Proper ARIA attributes and keyboard support
- 🎨 **Customizable**: Flexible styling and configuration options
- 📦 **Lightweight**: No external dependencies, ~3KB minified

## Installation

### npm
```bash
npm install readmore-js
```

### yarn
```bash
yarn add readmore-js
```

### CDN
```html
<script src="https://unpkg.com/readmore-js@latest/dist/readmore.js"></script>
```

## Quick Start

### Basic Usage

```javascript
import readmore from 'readmore-js';

// Simple implementation
readmore({
    targetElement: document.getElementById('my-text')
});
```

### Advanced Configuration

```javascript
readmore({
    targetElement: document.querySelector('.content'),
    readMoreLabel: 'Show more...',
    readLessLabel: 'Show less',
    linesLimit: 3,
    targetClass: 'custom-truncate',
    linkClass: 'custom-link'
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

### Utility Functions

#### `clearReadMoreCache()`

Clears all cached CSS styles and resets the library state.

```javascript
import { clearReadMoreCache } from 'readmore-js';

clearReadMoreCache();
```

#### `isStyleCached(cacheKey)`

Checks if CSS styles for a specific configuration are already cached.

```javascript
import { isStyleCached } from 'readmore-js';

if (isStyleCached('readmore-styles-read-more-target-5')) {
    console.log('Styles already cached');
}
```

#### `invalidateLineHeightCache(element)`

Invalidates the line height cache for a specific element. Useful when element styles change.

```javascript
import { invalidateLineHeightCache } from 'readmore-js';

// When element styles change
element.style.fontSize = '20px';
invalidateLineHeightCache(element);
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

## Browser Support

- Chrome 6+
- Firefox 3.6+
- Safari 5+
- Edge 12+
- IE 9+ (with polyfills for `WeakMap`)

## Performance

### Caching System

- **CSS Caching**: Prevents duplicate style additions
- **Line Height Caching**: Caches computed line heights per element
- **Memory Management**: Uses WeakMap for automatic garbage collection

### Optimization Features

- `requestAnimationFrame` for smooth DOM updates
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

### Dynamic Content

```javascript
// Handle dynamic content updates
function updateContent(element, newContent) {
    element.innerHTML = newContent;
    
    // Invalidate cache and reapply
    invalidateLineHeightCache(element);
    readmore({
        targetElement: element,
        linesLimit: 4
    });
}
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

## Development

### Building

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

### Project Structure

```
readmore-js/
├── src/
│   ├── readmore.js      # Main library file
│   └── readmore.d.ts    # TypeScript declarations
├── dist/                # Built files
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
- Performance optimizations with requestAnimationFrame
- TypeScript support
- Comprehensive documentation

## Support

If you encounter any issues or have questions, please file an issue on [GitHub](https://github.com/konstantin-agafonov/readmore-js/issues).

---

Made with ❤️ by [Konstantin Agafonov](https://github.com/konstantin-agafonov)