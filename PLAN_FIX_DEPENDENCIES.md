# План: исправление конфликта dev-зависимостей в package.json

## Проблема

`npm install` падал с ошибкой `ERESOLVE`:

```text
Found: @babel/core@8.1.3
peer @babel/core@"^7.0.0" from @rollup/plugin-babel@7.1.0
```

Причина — не «несуществующие» версии, а несовместимость peer-зависимостей:

- `@rollup/plugin-babel@7.1.0` (последняя версия плагина) поддерживает только `@babel/core@^7.0.0`.
- `@babel/core@8` — ESM-only, и плагин пока официально его не поддерживает.
- `@babel/preset-env@8` требует `@babel/core@^8.0.0`, поэтому пару Babel нужно менять согласованно.

Остальные версии из `dev` реальны и актуальны:

| Пакет | Версия |
|---|---|
| `jest` | `30.5.2` |
| `jest-environment-jsdom` | `30.5.2` |
| `babel-jest` | `30.5.2` |
| `eslint` | `10.14.0` |
| `typescript` | `7.0.2` |
| `@babel/core` | `8.1.3` |
| `@babel/preset-env` | `8.0.7` |

`package-lock.json` не был причиной ошибки: конфликт возникает из-за peer-диапазона `@rollup/plugin-babel`, а не из-за зафиксированных версий.

## Решение

Понижены только Babel-пакеты:

```json
"@babel/core": "^7.29.0",
"@babel/preset-env": "^7.29.0"
```

Остальные dev-зависимости оставлены актуальными:

```json
"babel-jest": "^30.5.2",
"eslint": "^10.14.0",
"jest": "^30.5.2",
"jest-environment-jsdom": "^30.5.2",
"typescript": "^7.0.2"
```

`package-lock.json` восстановлен из `dev` и обновлён обычным `npm install` — без удаления `node_modules` и lock-файла. Флаг `--legacy-peer-deps` не используется.

## Проверка

- `npm install` — успешно, без `--legacy-peer-deps`.
- `npm test` — PASS, 28/28 тестов, 1 набор.
- `npm run lint` — без ошибок.
- `npm run build` — оба бандла собраны.
- `npx jest --coverage` — PASS, coverage строится.
- Установленные версии: `@babel/core 7.29.13`, `@babel/preset-env 7.29.14`, `jest 30.5.2`, `eslint 10.14.0`, `typescript 7.0.2`.

## Примечания

- Babel 8 можно будет вернуть после выпуска `@rollup/plugin-babel` с поддержкой Babel 8. Сейчас такой версии нет.
- `overrides.test-exclude: ^8.0.0` к этому конфликту отношения не имеет; coverage с ним работает.
- Ветка: `branch04` (отпочкована от `dev`).

## Файлы, изменённые

- `package.json` — только версии `@babel/core` и `@babel/preset-env`.
- `package-lock.json` — обновлённое Babel-поддерево.
- `PLAN_FIX_DEPENDENCIES.md` — актуализированное описание.
