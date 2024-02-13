# ETH SSR

## Development

```bash
# Install deps
npm i

# Watch source, compiling and running the call, printing the result.
npm run dev

# Build source bundle. Output in dist/bundle.js
npm run build

# Manually push and call the bundled source from a local fleek network node
curl localhost:4220/services/1/blake3/$(lightning-node dev store $(realpath dist/bundle.js) | awk '{print $1}')
```
