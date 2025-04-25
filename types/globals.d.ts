/**
 * Global type declarations for the CyberCore system
 *
 * This file contains all global interface declarations to ensure
 * type consistency across the project.
 */

// Import interfaces from components
import { GlitchEngine } from '../assets/core/glitch-engine';
import { HologramRenderer } from '../assets/core/hologram-renderer';
import { NeuralBusInterface } from '../assets/neural-bus';

// Extend the Window interface with all global objects
declare global {
  interface Window {
    // Neural Bus global instance
    NeuralBus: NeuralBusInterface;

    // Glitch Engine global instance
    GlitchEngine: GlitchEngine;

    // Hologram Renderer global instance
    HologramRenderer: HologramRenderer;

    // Quantum Visualizer global instance
    QuantumVisualizer: any; // TODO: Define proper interface

    // Any other global components should be defined here
  }
}

// This file is a module, so we need an export
export {};
