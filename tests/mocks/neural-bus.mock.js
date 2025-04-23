// VoidBloom Neural Bus Mock Implementation

const NeuralBusMock = {
  channels: new Map(),
  components: new Map(),

  register: jest.fn(function (componentName, info) {
    const nonce = Math.random().toString(36).substring(2, 15);
    this.components.set(`${componentName}:${nonce}`, info);
    return { nonce };
  }),

  unregister: jest.fn(function (componentName, nonce) {
    this.components.delete(`${componentName}:${nonce}`);
  }),

  deregister: jest.fn(function (componentName, nonce) {
    this.unregister(componentName, nonce);
  }),

  subscribe: jest.fn(function (channel, callback) {
    if (!this.channels.has(channel)) {
      this.channels.set(channel, new Set());
    }
    this.channels.get(channel).add(callback);
    return () => {
      this.channels.get(channel).delete(callback);
    };
  }),

  publish: jest.fn(function (channel, data) {
    if (this.channels.has(channel)) {
      this.channels.get(channel).forEach((callback) => callback(data));
    }
  }),
};

module.exports = NeuralBusMock;
