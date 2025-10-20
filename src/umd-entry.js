// UMD entry to expose a callable global readmore() while preserving utilities on it.
// Import default and named exports from the main module
import readmore, {
    destroyReadMore,
    hasReadMoreInstance,
    getReadMoreInstance,
    clearReadMoreCache,
    isStyleCached,
    isLineHeightCached,
    invalidateLineHeightCache,
    invalidateStyleCache
} from './readmore.js';

// Attach utilities as properties on the default function for UMD consumers
readmore.destroyReadMore = destroyReadMore;
readmore.hasReadMoreInstance = hasReadMoreInstance;
readmore.getReadMoreInstance = getReadMoreInstance;
readmore.clearReadMoreCache = clearReadMoreCache;
readmore.isStyleCached = isStyleCached;
readmore.isLineHeightCached = isLineHeightCached;
readmore.invalidateLineHeightCache = invalidateLineHeightCache;
readmore.invalidateStyleCache = invalidateStyleCache;

// Export only the default for UMD so global is callable: readmore()
export default readmore;

