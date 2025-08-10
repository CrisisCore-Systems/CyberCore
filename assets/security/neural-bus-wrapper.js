/**
 * @crisiscore-hardened: Neural bus wrapper with collapse prevention
 */
export const SecureNeuralBus = (() => {
  const bus = window.NeuralBus;
  const eventCounts = new Map();
  const EVENT_LIMIT = 10;

  return Object.freeze({
    publish: (event, payload) => {
      const currentEpoch = window.voidBloom?.epoch?.current();
      if (!currentEpoch) {
        console.error('Neural bus publish failed: No valid epoch');
        return false;
      }
      const key = `${event}-${currentEpoch}`;
      const count = (eventCounts.get(key) || 0) + 1;
      eventCounts.set(key, count);
      if (count > EVENT_LIMIT) {
        console.error(`Neural bus cascade prevented: ${event} exceeded epoch limit`);
        return false;
      }
      const frozenPayload = payload ? Object.freeze(JSON.parse(JSON.stringify(payload))) : undefined;
      return bus.publish(event, frozenPayload);
    },
    subscribe: (event, callback) => {
      const safeCallback = (data) => {
        const isolatedData = data ? JSON.parse(JSON.stringify(data)) : undefined;
        return callback(isolatedData);
      };
      return bus.subscribe(event, safeCallback);
    }
  });
})();
