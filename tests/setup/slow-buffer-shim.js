'use strict';
/**
 * Node 21+ removed `SlowBuffer`. Legacy deps (e.g. jwa → buffer-equal-constant-time)
 * still touch SlowBuffer.prototype at load time; Jest loads them when akeyless is required.
 */
const buffer = require('buffer');
if (buffer.SlowBuffer == null && buffer.Buffer != null) {
  Object.defineProperty(buffer, 'SlowBuffer', {
    value: buffer.Buffer,
    writable: true,
    configurable: true,
    enumerable: true,
  });
}
