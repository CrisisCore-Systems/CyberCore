/**
 * @crisiscore-hardened: Safe NeuralBus wrapper with per-epoch cascade protection
 * Usage: import { SafeNeuralBus as Bus } from 'assets/security/neural-bus-safe';
 */
export const SafeNeuralBus = (() => {
  const eventCounts = new Map();
  const MAX_EVENTS_PER_EPOCH = 20;

  const epoch = () => {
    try { return window?.voidBloom?.epoch?.current?.() ?? 'unknown'; }
    catch { return 'unknown'; }
  };

  const deepFreeze = (obj) => {
    if (!obj || typeof obj !== 'object' || Object.isFrozen(obj)) return obj;
    Object.freeze(obj);
    for (const k of Object.keys(obj)) deepFreeze(obj[k]);
    return obj;
  };

  return Object.freeze({
    publish: (name, payload) => {
      const e = epoch();
      if (e !== eventCounts.get('__lastEpoch')) {
        eventCounts.clear();
        eventCounts.set('__lastEpoch', e);
      }
      const key = `${name}:${e}`;
      const count = (eventCounts.get(key) || 0) + 1;
      eventCounts.set(key, count);
      if (count > MAX_EVENTS_PER_EPOCH) {
        console.error(`NeuralBus cascade prevented: ${name} exceeded limit in epoch ${e}`);
        return false;
      }
      const frozen = payload && typeof payload === 'object'
        ? deepFreeze(JSON.parse(JSON.stringify(payload)))
        : payload;
      return (window.NeuralBus?.publish?.(name, frozen));
    },
    subscribe: (name, cb) => {
      const safeCb = (data) => cb(data ? JSON.parse(JSON.stringify(data)) : data);
      return window.NeuralBus?.subscribe?.(name, safeCb);
    },
    getEventCounts: () => Object.freeze(Object.fromEntries(eventCounts))
  });
})();
