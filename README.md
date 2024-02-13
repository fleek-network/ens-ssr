# ETH SSR

## Development

```bash
# Install deps
npm i

# Watch and compile source
npm run dev

# Push and call the bundled source from a local fleek network node
curl localhost:4220/services/1/blake3/$(lightning-node dev store $(realpath dist/bundle.js) | awk '{print $1}')
```
