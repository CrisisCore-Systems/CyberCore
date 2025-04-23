const ResonanceSystem = require('./ResonanceSystem');

/**
 * Creates a new ResonanceSystem instance with the specified configuration
 *
 * @param {object} config - Configuration for the resonance system
 * @returns {ResonanceSystem} Configured resonance system
 */
function createResonanceSystem(config = {}) {
  return new ResonanceSystem(config);
}

module.exports = {
  ResonanceSystem,
  createResonanceSystem,
};
