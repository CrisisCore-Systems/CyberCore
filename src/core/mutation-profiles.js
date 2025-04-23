/**
 * Mutation Profiles
 * Centralized definition of all mutation profiles used across the codebase
 */

export const MUTATION_PROFILES = {
  CyberLotus: {
    priority: 4,
    mutationTypes: ['illuminate', 'transcend', 'neural_matrix'],
    coherenceRange: [0.5, 1.0],
    visualEffects: ['glow', 'brightness-pulse'],
    audioEffects: ['harmonic-tones'],
    intensity: 0.7,
    color: '#00ffff', // Cyan
    cssClass: 'profile-cyberlotus',
  },
  ObsidianBloom: {
    priority: 4,
    mutationTypes: ['shadow', 'crystallize', 'depth_shift'],
    coherenceRange: [0.4, 0.8],
    visualEffects: ['shadow-pulse', 'crystalline-overlay'],
    audioEffects: ['deep-resonance'],
    intensity: 0.4,
    color: '#7d26cd', // Purple
    cssClass: 'profile-obsidianbloom',
  },
  NeonVortex: {
    priority: 4,
    mutationTypes: ['energy_surge', 'spiral', 'amplify'],
    coherenceRange: [0.3, 0.9],
    visualEffects: ['neon-glow', 'spiral-motion'],
    audioEffects: ['rising-tone'],
    intensity: 0.6,
    color: '#39ff14', // Neon green
    cssClass: 'profile-neonvortex',
  },
  VoidBloom: {
    priority: 5,
    mutationTypes: ['void_pulse', 'recursive_descent', 'echo_chamber'],
    coherenceRange: [0.2, 0.6],
    visualEffects: ['void-ripple', 'fractal-recursion'],
    audioEffects: ['void-whispers'],
    intensity: 0.85,
    color: '#9966cc', // Amethyst
    cssClass: 'profile-voidbloom',
  },
};

/**
 * Get profile by name
 * @param {string} profileName - Name of the profile
 * @returns {Object} Profile configuration or default profile if not found
 */
export function getProfile(profileName) {
  return MUTATION_PROFILES[profileName] || MUTATION_PROFILES.CyberLotus;
}

/**
 * Get profile color by name
 * @param {string} profileName - Name of the profile
 * @returns {string} Color for the profile
 */
export function getProfileColor(profileName) {
  const profile = getProfile(profileName);
  return profile.color;
}
