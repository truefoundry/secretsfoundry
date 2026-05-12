/**
 * Node 21+ removed `SlowBuffer`. Legacy deps (e.g. `jwa` via `akeyless`) read
 * `SlowBuffer.prototype` at load time. Import this module before any code that
 * may transitively `require('jwa')` (CLI, tests, or `Loaders`).
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const buffer = require('buffer') as {
  Buffer: typeof Buffer;
  SlowBuffer?: typeof Buffer;
};
if (buffer.SlowBuffer == null && buffer.Buffer != null) {
  Object.defineProperty(buffer, 'SlowBuffer', {
    value: buffer.Buffer,
    writable: true,
    configurable: true,
    enumerable: true,
  });
}

export {};
