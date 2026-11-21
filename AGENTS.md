# Agent Notes

## Dependencies

`@babel/core` and `@babel/preset-env` are intentionally pinned to 7.x because
`@rollup/plugin-babel@7.1.0` does not yet support Babel 8. Revisit this pin when the
plugin adds Babel 8 support.
