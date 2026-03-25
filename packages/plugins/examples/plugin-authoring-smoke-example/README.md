# Plugin Authoring Smoke Example

A Sprint plugin

## Development

```bash
pnpm install
pnpm dev            # watch builds
pnpm dev:ui         # local dev server with hot-reload events
pnpm test
```

## Install Into Sprint

```bash
pnpm sprintai plugin install ./
```

## Build Options

- `pnpm build` uses esbuild presets from `@sprintai/plugin-sdk/bundlers`.
- `pnpm build:rollup` uses rollup presets from the same SDK.
